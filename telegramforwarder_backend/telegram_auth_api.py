from flask import Blueprint, request, jsonify
from flask_cors import CORS
from telethon import TelegramClient
from telethon.tl.types import PeerUser, PeerChat, PeerChannel
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

auth_api = Blueprint('auth_api', __name__)
CORS(auth_api)

API_ID = os.getenv("TG_API_ID") or "YOUR_API_ID"
API_HASH = os.getenv("TG_API_HASH") or "YOUR_API_HASH"
SESSION_PATH = "sessions"
os.makedirs(SESSION_PATH, exist_ok=True)


# -------------------- CONNECT --------------------
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
            return {"error": str(e)}

    result = asyncio.run(run())
    return jsonify(result), 200 if "status" in result else 500


# -------------------- VERIFY CODE --------------------
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
            return {"status": "✅ Login successful"}
        except Exception as e:
            return {"error": str(e)}

    result = asyncio.run(run())
    return jsonify(result), 200 if "status" in result else 500


# -------------------- GET CHATS --------------------
@auth_api.route('/get-chats', methods=['POST'])
def get_chats():
    data = request.get_json()
    phone = data.get("phone")
    print(f"📲 Received phone for chat fetch: {phone}")

    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    session_path = f"{SESSION_PATH}/{phone}"

    async def fetch_chats():
        client = TelegramClient(session_path, API_ID, API_HASH)
        await client.connect()

        if not await client.is_user_authorized():
            raise Exception("Session not authorized. Please verify phone again.")

        print("🚀 Telegram client started")

        result = []
        async for dialog in client.iter_dialogs():
            print(f"📨 Found dialog: {dialog.name}")
            result.append({
                "id": dialog.id,
                "name": dialog.name,
                "type": (
                    "User" if isinstance(dialog.entity, PeerUser)
                    else "Group" if isinstance(dialog.entity, PeerChat)
                    else "Channel" if isinstance(dialog.entity, PeerChannel)
                    else "Unknown"
                )
            })

        await client.disconnect()
        return result

    try:
        chats = asyncio.run(fetch_chats())
        return jsonify(chats), 200
    except Exception as e:
        print(f"❌ Chat fetch error: {e}")
        return jsonify({"error": str(e)}), 500
