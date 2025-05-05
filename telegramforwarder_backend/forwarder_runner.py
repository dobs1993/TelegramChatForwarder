# forwarder_runner.py

import asyncio
import json
import os
from telethon import TelegramClient, events
from dotenv import load_dotenv

load_dotenv()

API_ID = int(os.getenv("TG_API_ID") or "YOUR_API_ID")
API_HASH = os.getenv("TG_API_HASH") or "YOUR_API_HASH"
SESSION_DIR = "sessions"
REDIRECT_FILE = "active_redirections.json"

os.makedirs(SESSION_DIR, exist_ok=True)

async def main():
    print("🚀 Forwarder started. Loading sessions...")

    if not os.path.exists(REDIRECT_FILE):
        print("⚠️ No redirection file found. Exiting.")
        return

    with open(REDIRECT_FILE, "r") as f:
        redirections = json.load(f)

    clients = []

    for session_file in os.listdir(SESSION_DIR):
        if not session_file.endswith(".session"):
            continue  # Skip non-session files like .journal

        session_path = os.path.join(SESSION_DIR, session_file)
        print(f"🔐 Starting client from session: {session_file}")
        client = TelegramClient(session_path, API_ID, API_HASH)
        await client.start()
        clients.append(client)

        # ⚠️ FIX: Wrap in a function to capture 'client' correctly
        def attach_handler(c):
            @c.on(events.NewMessage())
            async def handler(event):
                chat_id = str(event.chat_id)
                if chat_id in redirections:
                    for dest_id in redirections[chat_id]:
                        try:
                            await c.send_message(int(dest_id), event.message.message)
                            print(f"📨 {chat_id} ➜ {dest_id}: {event.message.message}")
                        except Exception as e:
                            print(f"⚠️ Failed to forward from {chat_id} to {dest_id}: {e}")

        attach_handler(client)

    print(f"✅ Loaded {len(clients)} Telegram clients. Listening for messages...")
    await asyncio.gather(*[c.run_until_disconnected() for c in clients])


if __name__ == "__main__":
    asyncio.run(main())
