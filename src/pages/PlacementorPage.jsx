import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Briefcase, Building, Calendar as CalendarIcon, DollarSign, ChevronRight } from 'lucide-react';

const PlacementorPage = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const data = await api.placement.getUpdates();
                setUpdates(data);
            } catch (error) {
                console.error("Failed to fetch placement updates", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpdates();
    }, []);

    return (
        <div className="placementor-page animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'rgba(26, 35, 126, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--primary)' }}>
                    <Briefcase size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>Placementor</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track upcoming company visits and deadlines.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Loading updates...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {updates.map(update => (
                        <div key={update.id} className="glass card-base animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{update.company}</h3>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                                        <Building size={16} /> {update.role}
                                    </p>
                                </div>
                                <button className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    Apply <ChevronRight size={16} />
                                </button>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <CalendarIcon size={16} /> <span>Deadline: {update.deadline}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <DollarSign size={16} color="var(--success)" /> <span>{update.ctc}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlacementorPage;
