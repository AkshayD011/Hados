import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Users, ChevronRight, Activity } from 'lucide-react';

const ClubsPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const data = await api.clubs.getClubs();
                setClubs(data);
            } catch (error) {
                console.error("Failed to fetch clubs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    return (
        <div className="clubs-page animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>Clubs & NGOs</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Discover and join student bodies on campus.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Loading clubs...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {clubs.map(club => (
                        <div key={club.id} className="glass card-base animate-fade-in" style={{ padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '1rem',
                                    backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)'
                                }}>
                                    <Activity size={24} />
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    backgroundColor: 'var(--background)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border)'
                                }}>
                                    {club.type}
                                </span>
                            </div>
                            
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{club.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {club.description}
                            </p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <Users size={16} /> <span>{club.memberCount} Members</span>
                                </div>
                                <ChevronRight size={18} color="var(--primary)" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClubsPage;
