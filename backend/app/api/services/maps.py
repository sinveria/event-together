import httpx
from app.api.core.config import settings
from typing import Optional, Dict, Any

class YandexMapsService:
    
    def __init__(self):
        self.api_key = settings.YANDEX_MAPS_API_KEY
        self.geocoder_url = "https://geocode-maps.yandex.ru/1.x/"
        self.timeout = 10.0
    
    async def geocode_address(self, address: str) -> Optional[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    self.geocoder_url,
                    params={
                        "apikey": self.api_key,
                        "geocode": address,
                        "format": "json",
                        "lang": "ru_RU"
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                feature_member = (
                    data.get("response", {})
                    .get("GeoObjectCollection", {})
                    .get("featureMember", [])
                )
                
                if feature_member:
                    geo_object = feature_member[0].get("GeoObject", {})
                    point = geo_object.get("Point", {})
                    pos = point.get("pos", "").split()
                    
                    if len(pos) == 2:
                        return {
                            "longitude": float(pos[0]),
                            "latitude": float(pos[1]),
                            "address": address
                        }
                
                return None
                
        except (httpx.HTTPError, httpx.ReadTimeout, ValueError, IndexError) as e:
            print(f"Yandex Geocoder error: {e}")
            return None
    
    async def get_address_by_coords(
        self, 
        latitude: float, 
        longitude: float
    ) -> Optional[str]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    self.geocoder_url,
                    params={
                        "apikey": self.api_key,
                        "geocode": f"{longitude},{latitude}",
                        "format": "json",
                        "lang": "ru_RU",
                        "kind": "house"
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                feature_member = (
                    data.get("response", {})
                    .get("GeoObjectCollection", {})
                    .get("featureMember", [])
                )
                
                if feature_member:
                    return (
                        feature_member[0]
                        .get("GeoObject", {})
                        .get("name", "")
                    )
                
                return None
                
        except Exception as e:
            print(f"Yandex Reverse Geocoder error: {e}")
            return None

yandex_maps_service = YandexMapsService()