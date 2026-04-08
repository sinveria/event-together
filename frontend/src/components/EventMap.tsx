import { useEffect, useRef } from 'react';

interface EventLocation {
  id: number;
  title: string;
  latitude: number | null;
  longitude: number | null;
  location?: string;
}

interface EventMapProps {
  events?: EventLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

const EventMap = ({ 
  events = [], 
  center = [55.751244, 37.618423],
  zoom = 10,
  height = '400px'
}: EventMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.ymaps) return;

    window.ymaps.ready(() => {
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        controls: ['zoomControl', 'fullscreenControl']
      });

      events.forEach((event) => {
        if (event.latitude && event.longitude) {
          const placemark = new window.ymaps.Placemark(
            [event.latitude, event.longitude],
            {
              hintContent: event.title,
              balloonContent: `
                <div style="padding: 10px;">
                  <h3 style="margin: 0 0 5px 0;">${event.title}</h3>
                  <p style="margin: 0; color: #666;">📍 ${event.location}</p>
                </div>
              `
            },
            {
              preset: 'islands#blueCircleIcon',
              draggable: false
            }
          );
          
          mapInstance.current.geoObjects.add(placemark);
        }
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [events, center, zoom]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height, 
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    />
  );
};

export default EventMap;