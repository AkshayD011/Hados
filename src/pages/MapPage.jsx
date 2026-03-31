import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Search, MapPin, Navigation, Clock } from 'lucide-react';

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

            {/* Mock Map Area */}
            <div className="glass card-base" style={{ 
                height: '300px', 
                marginBottom: '1.5rem', 
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#e9ecef',
                backgroundImage: 'radial-gradient(#ced4da 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {loading ? (
                    <div style={{ color: 'var(--text-secondary)' }}>Loading Map...</div>
                ) : (
                    <>
                        {filteredPois.map(poi => (
                            <div 
                                key={poi.id}
                                onClick={() => setSelectedPoi(poi)}
                                style={{
                                    position: 'absolute',
                                    left: `${poi.location.x}%`,
                                    top: `${poi.location.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    color: selectedPoi?.id === poi.id ? 'var(--accent)' : 'var(--primary)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                            >
                                <MapPin size={32} weight={selectedPoi?.id === poi.id ? "fill" : "regular"} />
                            </div>
                        ))}
                    </>
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
                 <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0', fontSize: '0.9rem' }}>
                    Select a pin on the map to view details.
                 </div>
            )}
        </div>
    );
};

export default MapPage;
