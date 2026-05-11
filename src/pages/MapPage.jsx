import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, MapPin, Navigation, Clock, Compass } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
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

            {/* Google Map Area */}
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
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
                        <Map
                            defaultZoom={17}
                            defaultCenter={{ lat: 12.8767, lng: 77.6846 }}
                            mapId="HADOS_CAMPUS_MAP"
                            disableDefaultUI={true}
                            style={{ width: '100%', height: '100%' }}
                        >
                            {filteredPois.map(poi => (
                                <AdvancedMarker 
                                    key={poi.id}
                                    position={{ lat: poi.location.lat, lng: poi.location.lng }}
                                    onClick={() => setSelectedPoi(poi)}
                                >
                                    <div style={{
                                        color: selectedPoi?.id === poi.id ? 'var(--accent)' : 'var(--primary)',
                                        cursor: 'pointer',
                                        transform: selectedPoi?.id === poi.id ? 'scale(1.2)' : 'scale(1)',
                                        transition: 'transform 0.2s',
                                        filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))'
                                    }}>
                                        <MapPin size={36} weight={selectedPoi?.id === poi.id ? "fill" : "regular"} />
                                    </div>
                                </AdvancedMarker>
                            ))}
                        </Map>
                    </APIProvider>
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
