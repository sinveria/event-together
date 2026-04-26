import boto3
from botocore.client import Config
from app.api.core.config import settings
from io import BytesIO

def get_s3_client():
    if not settings.S3_ENDPOINT:
        raise ValueError("S3_ENDPOINT is not set!")
        
    return boto3.client(
        's3',
        endpoint_url=settings.S3_ENDPOINT,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        config=Config(signature_version='s3v4'),
        region_name='us-east-1'
    )

def upload_avatar(file_bytes, user_id: int, filename: str, content_type: str) -> str:
    client = get_s3_client()
    
    import re
    clean_filename = re.sub(r'[^\w\.-]', '_', filename)
    key = f"avatars/{user_id}/{clean_filename}"
    
    if isinstance(file_bytes, BytesIO):
        file_obj = file_bytes
        file_obj.seek(0)
    elif isinstance(file_bytes, bytes):
        file_obj = BytesIO(file_bytes)
    else:
        raise TypeError(f"Expected bytes or BytesIO, got {type(file_bytes)}")

    try:
        client.upload_fileobj(
            file_obj, 
            settings.S3_BUCKET,
            key,
            ExtraArgs={'ContentType': content_type}
        )
        print(f"File uploaded to: {settings.S3_BUCKET}/{key}")
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        raise
    
    public_url = f"http://localhost:9000/{settings.S3_BUCKET}/{key}"
    print(f"📷 Public URL: {public_url}")
    
    return public_url

def delete_avatar(file_url: str) -> bool:
    client = get_s3_client()
    try:
        prefix = f"{settings.S3_ENDPOINT}/{settings.S3_BUCKET}/"
        if prefix in file_url:
            key = file_url.split('?')[0].replace(prefix, "")
        else:
            key = file_url.split('?')[0].split('/')[-1]
            
        client.delete_object(
            Bucket=settings.S3_BUCKET, 
            Key=key
        )
        return True
    except Exception as e:
        print(f"Error deleting avatar: {e}")
        return False