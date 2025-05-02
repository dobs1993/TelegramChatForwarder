from flask import Blueprint, request, jsonify
from flask_cors import CORS
from telethon import TelegramClient, events
from telethon.tl.types import PeerUser, PeerChat, PeerChannel
from dotenv import load_dotenv
import os
import asyncio
import traceback

load_dotenv()

auth_api = Blueprint('auth_api', __name__)
CORS(auth_api)

API_ID = os.getenv("TG_API_ID") or "YOUR_API_ID"
API_HASH = os.getenv("TG_API_HASH") or "YOUR_API_HASH"
SESSION_PATH = "sessions"
os.makedirs(SESSION_PATH, exist_ok=True)

# 🔗 Store active redirections in memory
active_redirections = {}

@auth_api.route('/connect', methods=['POST'])
def connect():
    data = request.get_json()
    phone = data.get("phone")
    print(f"📞 Received phone for connect: {phone}")

    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    async def run():
        try:
            client = TelegramClient(f"{SESSION_PATH}/{phone}", API_ID, API_HASH)
            await client.connect()
            if not await client.is_user_authorized():
                await client.send_code_request(phone)
                return {"status": "Code sent"}
            else:
                return {"status": "Already authorized"}
        except Exception as e:
            print(f"❌ Connect error: {e}")
            return {"error": str(e)}

    result = asyncio.run(run())
    return jsonify(result), 200 if "status" in result else 500


@auth_api.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    phone = data.get("phone")
    code = data.get("code")
    print(f"🔐 Verifying code: {code} for {phone}")

    if not phone or not code:
        return jsonify({"error": "Phone and code required"}), 400

    async def run():
        try:
            client = TelegramClient(f"{SESSION_PATH}/{phone}", API_ID, API_HASH)
            await client.connect()
            if await client.is_user_authorized():
                return {"status": "Already authorized"}

            await client.sign_in(phone=phone, code=code)
            print("✅ Login successful")
            return {"status": "✅ Login successful"}
        except Exception as e:
            print(f"❌ Verification error: {e}")
            traceback.print_exc()
            return {"error": str(e)}

    result = asyncio.run(run())
    return jsonify(result), 200 if "status" in result else 500


@auth_api.route('/get-chats', methods=['POST'])
def get_chats():
    data = request.get_json()
    phone = data.get("phone")
    print(f"📲 Received phone for chat fetch: {phone}")

    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    session_path = f"{SESSION_PATH}/{phone}"

    if not os.path.exists(f"{session_path}.session"):
        print(f"❌ No session file found at {session_path}.session")
        return jsonify({"error": "Session file not found. Please reconnect."}), 401

    async def fetch_chats():
        try:
            client = TelegramClient(session_path, API_ID, API_HASH)
            await client.connect()

            if not await client.is_user_authorized():
                return {"error": "Session not authorized. Please verify phone again."}

            print("🚀 Telegram client started")

            result = []
            async for dialog in client.iter_dialogs():
                if dialog.name and dialog.name.strip():
                    result.append({
                        "id": dialog.id,
                        "name": dialog.name.strip(),
                        "type": (
                            "User" if isinstance(dialog.entity, PeerUser)
                            else "Group" if isinstance(dialog.entity, PeerChat)
                            else "Channel" if isinstance(dialog.entity, PeerChannel)
                            else "Unknown"
                        )
                    })

            await client.disconnect()
            return sorted(result, key=lambda x: x["name"].lower())

        except Exception as e:
            traceback.print_exc()
            print(f"❌ Chat fetch error: {e}")
            return {"error": str(e)}

    chats = asyncio.run(fetch_chats())
    if isinstance(chats, list):
        return jsonify(chats), 200
    else:
        return jsonify(chats), 500


@auth_api.route('/set-link', methods=['POST'])
def set_link():
    data = request.get_json()
    phone = data.get("phone")
    source_id = str(data.get("source_id"))
    destination_id = str(data.get("destination_id"))

    if not all([phone, source_id, destination_id]):
        return jsonify({"error": "Missing required fields"}), 400

    session_path = f"{SESSION_PATH}/{phone}"
    if not os.path.exists(f"{session_path}.session"):
        return jsonify({"error": "Session file not found. Please reconnect."}), 401

    async def apply_link():
        try:
            client = TelegramClient(session_path, API_ID, API_HASH)
            await client.start()

            if source_id not in active_redirections:
                active_redirections[source_id] = []
            if destination_id not in active_redirections[source_id]:
                active_redirections[source_id].append(destination_id)

            @client.on(events.NewMessage())
            async def forward_msg(event):
                sid = str(event.chat_id)
                if sid in active_redirections:
                    for did in active_redirections[sid]:
                        try:
                            await client.send_message(int(did), event.message.message)
                            print(f"📨 Forwarded from {sid} to {did}")
                        except Exception as e:
                            print(f"⚠️ Failed to forward from {sid} to {did}: {e}")

            print(f"🔗 Linked {source_id} ➜ {destination_id}")
            return {"status": "Link applied successfully"}

        except Exception as e:
            return {"error": str(e)}

    result = asyncio.run(apply_link())
    return jsonify(result), 200 if "status" in result else 500


# ✅ NEW: List All Redirections
@auth_api.route('/get-links', methods=['POST'])
def get_links():
    phone = request.json.get("phone")
    if not phone:
        return jsonify({"error": "Phone required"}), 400

    try:
        session_path = f"{SESSION_PATH}/{phone}"
        client = TelegramClient(session_path, API_ID, API_HASH)

        async def fetch():
            await client.connect()
            result = []
            for sid, dests in active_redirections.items():
                for did in dests:
                    s_entity = await client.get_entity(int(sid))
                    d_entity = await client.get_entity(int(did))
                    result.append({
                        "source_id": sid,
                        "destination_id": did,
                        "source_name": getattr(s_entity, 'title', getattr(s_entity, 'first_name', 'Unknown')),
                        "destination_name": getattr(d_entity, 'title', getattr(d_entity, 'first_name', 'Unknown')),
                    })
            return result

        links = asyncio.run(fetch())
        return jsonify(links), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ✅ NEW: Delete a Redirection
@auth_api.route('/delete-link', methods=['POST'])
def delete_link():
    data = request.get_json()
    source_id = str(data.get("source_id"))
    destination_id = str(data.get("destination_id"))

    if not source_id or not destination_id:
        return jsonify({"error": "Missing source or destination ID"}), 400

    if source_id in active_redirections and destination_id in active_redirections[source_id]:
        active_redirections[source_id].remove(destination_id)
        if not active_redirections[source_id]:
            del active_redirections[source_id]
        print(f"❌ Removed link {source_id} ➜ {destination_id}")
        return jsonify({"status": "Link removed"}), 200
    else:
        return jsonify({"error": "Link not found"}), 404
