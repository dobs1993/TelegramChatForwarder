# test_telegram.py

import asyncio
from telethon import TelegramClient
from dotenv import load_dotenv
import os

load_dotenv()

API_ID = os.getenv("TG_API_ID") or "YOUR_API_ID"
API_HASH = os.getenv("TG_API_HASH") or "YOUR_API_HASH"
SESSION_PATH = "sessions"

async def test_get_chats():
    phone = input("📱 Enter your phone number (with country code): ")
    session_file = f"{SESSION_PATH}/{phone}"

    client = TelegramClient(session_file, API_ID, API_HASH)
    await client.connect()

    if not await client.is_user_authorized():
        print("⚠️ Not authorized. Sending code...")
        await client.send_code_request(phone)
        code = input("📩 Enter the code you received: ")
        await client.sign_in(phone=phone, code=code)
        print("✅ Logged in successfully")

    print("🚀 Fetching chats...")
    async for dialog in client.iter_dialogs():
        print(f"📨 {dialog.name} — ID: {dialog.id}")

    await client.disconnect()

if __name__ == "__main__":
    asyncio.run(test_get_chats())
