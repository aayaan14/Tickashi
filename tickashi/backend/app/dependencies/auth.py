import os
from fastapi import Request, HTTPException
from jose import jwt
import json
import base64
import logging

# Add logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET environment variable is required")

def verify_token(request: Request):
    """Verify Supabase JWT token using HS256"""
    
    auth_header = request.headers.get("Authorization", "").strip()
    
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = auth_header.split(" ")[1]
    
    try:
        # The key insight: try multiple variations of the secret
        possible_secrets = [
            SUPABASE_JWT_SECRET,  # As is
            base64.urlsafe_b64decode(SUPABASE_JWT_SECRET + '=' * (4 - len(SUPABASE_JWT_SECRET) % 4)),  # Base64 decode with padding
        ]
        
        for i, secret in enumerate(possible_secrets):
            try:
                print(f"🔍 Trying secret variation {i+1}...")
                payload = jwt.decode(
                    token,
                    secret,
                    algorithms=["HS256"],
                    options={"verify_aud": False},  
                )

                user_id = payload.get("sub")
                if not user_id:
                    raise HTTPException(status_code=401, detail="User ID not found in token")

                return user_id

            except Exception as e:
                continue

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")