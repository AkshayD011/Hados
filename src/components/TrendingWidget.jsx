import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { TrendingUp } from 'lucide-react';

const TrendingWidget = () => {
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await api.hashtags.getTrending();
                setHashtags(data.slice(0, 5)); // Just top 5 for widget
            } catch (error) {
                console.error("Failed to fetch hashtags", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return (
        <div className="glass card-base animate-fade-in" style={{ padding: '1.25rem', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                <TrendingUp size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>Trending Now</h2>
            </div>
            
            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>Loading...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {hashtags.map((item, index) => (
                        <div key={item.tag} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '0.75rem',
                                borderBottom: index < hashtags.length - 1 ? '1px solid var(--border)' : 'none',
                                cursor: 'pointer',
                                borderRadius: '0.5rem',
                                transition: 'background-color 0.2s',
                                marginTop: '0.25rem'
                            }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 35, 126, 0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trending in Campus</span>
                                <div style={{ display: 'flex', alignItems: 'center', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.2rem', fontSize: '1rem' }}>
                                    #{item.tag}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>{item.count} posts</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrendingWidget;
