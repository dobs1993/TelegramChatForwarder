from flask import Blueprint, request, jsonify
from flask_cors import CORS
from telethon import TelegramClient, events
from telethon.tl.types import PeerUser, PeerChat, PeerChannel
from dotenv import load_dotenv
import os, asyncio, traceback, json
import threading

load_dotenv()

session_locks = {}


auth_api = Blueprint('auth_api', __name__)
CORS(auth_api)

API_ID = os.getenv("TG_API_ID") or "YOUR_API_ID"
API_HASH = os.getenv("TG_API_HASH") or "YOUR_API_HASH"
SESSION_PATH = "sessions"
os.makedirs(SESSION_PATH, exist_ok=True)

# ✅ Store phone_code_hash temporarily
phone_code_hashes = {}

# ✅ Load saved redirections
REDIRECTION_FILE = "active_redirections.json"
if os.path.exists(REDIRECTION_FILE):
    with open(REDIRECTION_FILE, "r") as f:
        active_redirections = json.load(f)
else:
    active_redirections = {}

def save_redirections():
    with open(REDIRECTION_FILE, "w") as f:
        json.dump(active_redirections, f)

@auth_api.route('/send-code', methods=['POST'])
def send_code():
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
                sent = await client.send_code_request(phone)
                phone_code_hashes[phone] = sent.phone_code_hash
                await client.disconnect()
                return {"status": "Code sent"}
            else:
                await client.disconnect()
                return {"status": "Already authorized"}
        except Exception as e:
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

    phone_code_hash = phone_code_hashes.get(phone)
    if not phone_code_hash:
        return jsonify({"error": "No phone_code_hash found. Request code again."}), 400

    async def run():
        try:
            client = TelegramClient(f"{SESSION_PATH}/{phone}", API_ID, API_HASH)
            await client.connect()
            if await client.is_user_authorized():
                return {"status": "Already authorized"}

            await client.sign_in(phone=phone, code=code, phone_code_hash=phone_code_hash)
            return {"status": "✅ Login successful"}
        except Exception as e:
            traceback.print_exc()
            return {"error": str(e)}

    result = asyncio.run(run())
    return jsonify(result), 200 if "status" in result else 500

@auth_api.route('/get-chats', methods=['POST'])
def get_chats():
    phone = request.get_json().get("phone")
    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    lock = get_lock(phone)

    with lock:
        async def fetch():
            try:
                client = TelegramClient(f"{SESSION_PATH}/{phone}", API_ID, API_HASH)
                await client.connect()
                try:
                    if not await client.is_user_authorized():
                        return {"error": "Unauthorized"}
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
                    return sorted(result, key=lambda x: x["name"].lower())
                finally:
                    await client.disconnect()
            except Exception as e:
                traceback.print_exc()
                return {"error": str(e)}

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(fetch())
        loop.close()

        return jsonify(result), 200 if isinstance(result, list) else 500


@auth_api.route('/set-link', methods=['POST'])
def set_link():
    data = request.get_json()
    phone = data.get("phone")
    source_id = str(data.get("source_id"))
    destination_id = str(data.get("destination_id"))

    if not all([phone, source_id, destination_id]):
        return jsonify({"error": "Missing required fields"}), 400

    lock = get_lock(phone)

    with lock:
        async def apply():
            try:
                client = TelegramClient(f"{SESSION_PATH}/{phone}", API_ID, API_HASH)
                await client.connect()

                if source_id not in active_redirections:
                    active_redirections[source_id] = []
                if destination_id not in active_redirections[source_id]:
                    active_redirections[source_id].append(destination_id)
                    save_redirections()

                await client.disconnect()
                return {"status": "Link applied successfully"}
            except Exception as e:
                return {"error": str(e)}

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(apply())
        loop.close()

        return jsonify(result), 200 if "status" in result else 500


@auth_api.route('/get-links', methods=['POST'])
def get_links():
    phone = request.get_json().get("phone")
    if not phone:
        return jsonify({"error": "Phone required"}), 400

    async def fetch():
        try:
            client = TelegramClient(f"{SESSION_PATH}/{phone}", API_ID, API_HASH)
            await client.connect()

            if not await client.is_user_authorized():
                return {"error": "Unauthorized"}

            results = []
            for sid, dests in active_redirections.items():
                for did in dests:
                    try:
                        s_entity = await client.get_entity(int(sid))
                        d_entity = await client.get_entity(int(did))
                        results.append({
                            "source_id": sid,
                            "destination_id": did,
                            "source_name": getattr(s_entity, 'title', getattr(s_entity, 'first_name', 'Unknown')),
                            "destination_name": getattr(d_entity, 'title', getattr(d_entity, 'first_name', 'Unknown')),
                        })
                    except Exception as e:
                        print(f"❌ Could not resolve names for {sid} ➜ {did}: {e}")
            await client.disconnect()
            return results
        except Exception as e:
            return {"error": str(e)}

    result = asyncio.run(fetch())
    return jsonify(result), 200 if isinstance(result, list) else 500



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
        save_redirections()
        return jsonify({"status": "Link removed"}), 200
    return jsonify({"error": "Link not found"}), 404

def get_lock(phone):
    if phone not in session_locks:
        session_locks[phone] = threading.Lock()
    return session_locks[phone]
