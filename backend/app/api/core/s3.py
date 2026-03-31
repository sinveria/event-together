import boto3
from botocore.client import Config
from app.api.core.config import settings
from datetime import timedelta

s3_client = boto3.client(
    's3',
    endpoint_url=settings.S3_ENDPOINT,
    aws_access_key_id=settings.S3_ACCESS_KEY,
    aws_secret_access_key=settings.S3_SECRET_KEY,
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'
)

def upload_avatar(file_bytes: bytes, user_id: int, filename: str, content_type: str) -> str:
    key = f"avatars/{user_id}/{filename}"
    
    s3_client.upload_fileobj(
        file_bytes, 
        settings.S3_BUCKET_NAME, 
        key,
        ExtraArgs={'ContentType': content_type}
    )
    
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': settings.S3_BUCKET_NAME, 'Key': key},
        ExpiresIn=7 * 24 * 60 * 60
    )
    
    return url

def delete_avatar(file_url: str) -> bool:
    try:
        key = file_url.split('?')[0].split(f'{settings.S3_ENDPOINT}/')[-1]
        
        s3_client.delete_object(
            Bucket=settings.S3_BUCKET_NAME, 
            Key=key
        )
        return True
    except Exception as e:
        print(f"Error deleting avatar: {e}")
        return False