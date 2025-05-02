from telethon import TelegramClient, events
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

API_ID = os.getenv("TG_API_ID")
API_HASH = os.getenv("TG_API_HASH")
SESSION_PATH = "sessions"
REDIRECTIONS = {
    # example: '20003': ['mtschedule']
}
client = None

async def start_forwarding(phone):
    global client
    session_file = f"{SESSION_PATH}/{phone}"
    client = TelegramClient(session_file, API_ID, API_HASH)
    await client.start()

    @client.on(events.NewMessage())
    async def handler(event):
        sid = str(event.chat_id)
        if sid in REDIRECTIONS:
            for dest_id in REDIRECTIONS[sid]:
                try:
                    await client.send_message(int(dest_id), event.message.message)
                except Exception as e:
                    print(f"⚠️ Failed to forward from {sid} to {dest_id}: {e}")

    print("🚀 Forwarding bot is live.")
    await client.run_until_disconnected()

if __name__ == '__main__':
    phone = input("📞 Phone to forward for: ")
    REDIRECTIONS['20003'] = ['mtschedule']  # manual for now
    asyncio.run(start_forwarding(phone))
