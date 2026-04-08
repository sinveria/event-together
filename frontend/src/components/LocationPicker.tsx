import { useState, useEffect, useRef } from 'react';

interface LocationPickerProps {
    address: string;
    onLocationSelect: (latitude: number, longitude: number) => void;
}

declare global {
    interface Window {
        ymaps: any;
    }
}

const LocationPicker = ({ address, onLocationSelect }: LocationPickerProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const placemark = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!address || !mapRef.current || !window.ymaps) return;

        const geocodeAddress = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=b0b595a7-d680-47a3-a444-d9fb5dc9cdc0&geocode=${encodeURIComponent(address)}&format=json&lang=ru_RU`
                );
                const data = await response.json();

                const featureMember = data.response?.GeoObjectCollection?.featureMember || [];

                if (featureMember.length > 0) {
                    const pos = featureMember[0].GeoObject.Point.pos.split(' ');
                    const longitude = parseFloat(pos[0]);
                    const latitude = parseFloat(pos[1]);

                    onLocationSelect(latitude, longitude);

                    if (!mapInstance.current) {
                        window.ymaps.ready(() => {
                            mapInstance.current = new window.ymaps.Map(mapRef.current, {
                                center: [latitude, longitude],
                                zoom: 15,
                                controls: ['zoomControl']
                            });

                            placemark.current = new window.ymaps.Placemark(
                                [latitude, longitude],
                                {
                                    hintContent: address,
                                    balloonContent: address
                                },
                                {
                                    preset: 'islands#blueCircleIcon',
                                    draggable: true
                                }
                            );

                            placemark.current.events.add('dragend', () => {
                                const coords = placemark.current.geometry.getCoordinates();
                                onLocationSelect(coords[0], coords[1]);
                            });

                            mapInstance.current.geoObjects.add(placemark.current);
                        });
                    } else {
                        placemark.current.geometry.setCoordinates([latitude, longitude]);
                        placemark.current.properties.set('hintContent', address);
                        placemark.current.properties.set('balloonContent', address);
                        mapInstance.current.setCenter([latitude, longitude], 15);
                    }
                } else {
                    setError('Адрес не найден. Уточните местоположение.');
                }
            } catch (err) {
                setError('Ошибка геокодирования');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(geocodeAddress, 1000);
        return () => clearTimeout(timeoutId);
    }, [address]);

    useEffect(() => {
        return () => {
            if (mapInstance.current) {
                mapInstance.current.destroy();
                mapInstance.current = null;
                placemark.current = null;
            }
        };
    }, []);

    return (
        <div className="mt-4">
            {loading && <p className="text-sm text-gray-500">Определяем координаты...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    display: address ? 'block' : 'none'
                }}
            />
        </div>
    );
};

export default LocationPicker;