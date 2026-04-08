from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from app.api.services.maps import yandex_maps_service
from typing import Optional

router = APIRouter()

class GeocodeResponse(BaseModel):
    latitude: float
    longitude: float
    address: str

class AddressResponse(BaseModel):
    address: str

@router.get("/geocode", response_model=GeocodeResponse)
async def geocode_address(
    address: str = Query(..., description="Адрес для геокодирования")
):
    result = await yandex_maps_service.geocode_address(address)
    
    if not result:
        raise HTTPException(
            status_code=404, 
            detail="Адрес не найден или ошибка геокодирования"
        )
    
    return result

@router.get("/reverse-geocode", response_model=AddressResponse)
async def reverse_geocode(
    lat: float = Query(..., description="Широта"),
    lon: float = Query(..., description="Долгота")
):
    address = await yandex_maps_service.get_address_by_coords(lat, lon)
    
    if not address:
        raise HTTPException(
            status_code=404, 
            detail="Адрес по координатам не найден"
        )
    
    return {"address": address}