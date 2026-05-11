import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Navigation, Clock, Compass } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLoadingOverlay } from '../components/ui/Skeleton';
import EmptyState from '../components/common/EmptyState';

const MapPage = () => {
    const [pois, setPois] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPoi, setSelectedPoi] = useState(null);

    useEffect(() => {
        const fetchPois = async () => {
            try {
                const data = await api.map.getPOIs();
                setPois(data);
            } catch (error) {
                console.error("Failed to fetch POIs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPois();
    }, []);

    const filteredPois = pois.filter(poi =>
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Custom icon generator
    const getCustomIcon = (poi, selectedPoiId) => {
        const isSelected = selectedPoiId === poi.id;
        const color = isSelected ? '#3b82f6' : '#1a237e'; // accent vs primary
        const scale = isSelected ? 'scale(1.2)' : 'scale(1)';
        const fill = isSelected ? color : 'none';

        const svgMarkup = `
            <div style="color: ${color}; transform: ${scale}; transition: transform 0.2s; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
            </div>
        `;

        return L.divIcon({
            html: svgMarkup,
            className: 'custom-map-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 36], // Point anchor to bottom center
        });
    };

    // Component to handle dynamic map centering when a POI is selected
    const MapController = ({ selectedPoi }) => {
        const map = useMap();
        useEffect(() => {
            if (selectedPoi) {
                map.flyTo([selectedPoi.location.lat, selectedPoi.location.lng], 18, {
                    duration: 1.5
                });
            }
        }, [selectedPoi, map]);
        return null;
    };

    return (
        <div className="map-page animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>Campus Map</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Navigate campus facilities and buildings.</p>
            </div>

            <div className="glass card-base" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Search size={20} color="var(--text-secondary)" />
                <input
                    type="text"
                    placeholder="Search for a building or facility..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)'
                    }}
                />
            </div>

            {/* Leaflet Map Area */}
            <div className="glass card-base" style={{ 
                height: '400px', 
                marginBottom: '1.5rem', 
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)'
            }}>
                {loading ? (
                    <MapLoadingOverlay />
                ) : (
                    <MapContainer 
                        center={[12.8767, 77.6846]} 
                        zoom={17} 
                        style={{ height: '100%', width: '100%', zIndex: 1 }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <MapController selectedPoi={selectedPoi} />
                        {filteredPois.map(poi => (
                            <Marker
                                key={poi.id}
                                position={[poi.location.lat, poi.location.lng]}
                                icon={getCustomIcon(poi, selectedPoi?.id)}
                                eventHandlers={{
                                    click: () => setSelectedPoi(poi),
                                }}
                            />
                        ))}
                    </MapContainer>
                )}
            </div>

            {/* Selected POI Details */}
            {selectedPoi && (
                <div className="glass animate-fade-in card-base" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>{selectedPoi.name}</h3>
                            <span style={{ 
                                backgroundColor: 'rgba(26, 35, 126, 0.1)', 
                                color: 'var(--primary)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {selectedPoi.type}
                            </span>
                        </div>
                        <button className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Navigation size={16} /> <span>Navigate</span>
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <Clock size={16} /> <span>Open: {selectedPoi.open}</span>
                    </div>
                </div>
            )}

            {!selectedPoi && !loading && (
                <div className="glass card-base">
                    <EmptyState
                        icon={Compass}
                        title="No location selected"
                        message="Tap any pin on the map above to view building details, hours, and navigation."
                        compact
                    />
                </div>
            )}
        </div>
    );
};

export default MapPage;
