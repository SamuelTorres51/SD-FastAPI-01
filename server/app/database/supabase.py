from supabase import create_client, Client

from app.core.config import SUPABASE_URL, SUPABASE_KEY


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


def get_supabase_client(token: str) -> Client:
    client = create_client(
        SUPABASE_URL,
        SUPABASE_KEY
    )

    client.postgrest.auth(token)

    return client