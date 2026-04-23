import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from app.api.services.maps import YandexMapsService

@pytest.mark.asyncio
async def test_geocode_success():
    service = YandexMapsService()
    
    mock_response_data = {
        "response": {
            "GeoObjectCollection": {
                "featureMember": [
                    {
                        "GeoObject": {
                            "Point": {"pos": "37.6176 55.7558"},
                            "name": "Москва"
                        }
                    }
                ]
            }
        }
    }
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_response_data
    mock_response.raise_for_status.return_value = None
    
    mock_client = MagicMock()
    mock_client.get = AsyncMock(return_value=mock_response)
    
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)

    with patch('httpx.AsyncClient', return_value=mock_client):
        result = await service.geocode_address("Москва")
        
        assert result is not None
        assert result["latitude"] == 55.7558
        assert result["longitude"] == 37.6176

@pytest.mark.asyncio
async def test_geocode_not_found():
    service = YandexMapsService()
    
    mock_response_data = {
        "response": {
            "GeoObjectCollection": {
                "featureMember": []
            }
        }
    }
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_response_data
    mock_response.raise_for_status.return_value = None
    
    mock_client = MagicMock()
    mock_client.get = AsyncMock(return_value=mock_response)
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)

    with patch('httpx.AsyncClient', return_value=mock_client):
        result = await service.geocode_address("НеуществующийАдрес12345")
        
        assert result is None