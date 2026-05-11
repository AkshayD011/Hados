import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { TrendingUp } from 'lucide-react';
import { TrendingWidgetSkeleton } from '../ui/Skeleton';

const TrendingWidget = () => {
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await api.hashtags.getTrending();
                setHashtags(data.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch hashtags', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTags();
    }, []);

    return (
        <div
            className="glass card-base animate-fade-in"
            style={{ padding: '1.375rem', position: 'sticky', top: '80px' }}
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '0.875rem',
                borderBottom: '1px solid var(--border)'
            }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-alpha-10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <TrendingUp size={17} color="var(--primary)" />
                </div>
                <h2 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.015em',
                    margin: 0
                }}>
                    Trending Now
                </h2>
            </div>

            {loading ? (
                <TrendingWidgetSkeleton />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {hashtags.map((item, index) => (
                        <div
                            key={item.tag}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.625rem 0.5rem',
                                borderBottom: index < hashtags.length - 1 ? '1px solid var(--border)' : 'none',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'background-color 0.18s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-alpha-10)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                <span className="label-caps">Trending in Campus</span>
                                <span style={{
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    fontSize: 'var(--text-base)',
                                    letterSpacing: '-0.01em'
                                }}>
                                    #{item.tag}
                                </span>
                                <span style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-tertiary)'
                                }}>
                                    {item.count} post{item.count !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrendingWidget;
