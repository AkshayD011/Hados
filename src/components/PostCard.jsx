import React, { useState, useEffect } from 'react';
import { Bookmark, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const PostCard = ({ post }) => {
    const [isBookmarked, setIsBookmarked] = useState(post.bookmarked || false);
    const { user } = useAuth();
    
    useEffect(() => {
        setIsBookmarked(post.bookmarked || false);
    }, [post.bookmarked]);

    const handleBookmark = async () => {
        if (!user) return;
        const newStatus = !isBookmarked;
        setIsBookmarked(newStatus); // Optimistic UI update
        try {
            await api.feed.toggleBookmark(user.uid, post.id, newStatus);
        } catch (e) {
            console.error("Failed to toggle bookmark", e);
            setIsBookmarked(!newStatus); // Revert on failure
        }
    };

    return (
        <div className="glass animate-fade-in card-base" style={{
            padding: '1.25rem',
            marginBottom: '1.5rem',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                    }}>
                        MD
                    </div>
                    <div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: '700' }}>Mailer Daemon</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {new Date(post.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
                <button style={{ background: 'none', color: 'var(--text-secondary)' }}>
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>{post.title}</h2>
            <p style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9375rem' }}>{post.description}</p>

            {/* Mock Carousel */}
            <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f1f3f5',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: 'var(--text-secondary)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <ImageIcon size={48} opacity={0.3} />
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '4px'
                }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: i === 1 ? 'var(--primary)' : '#ced4da'
                        }} />
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {post.hashtags?.map((tag) => (
                    <span key={tag} style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(26, 35, 126, 0.1)',
                        color: 'var(--primary)',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '1rem',
                        fontWeight: '600'
                    }}>
                        #{tag}
                    </span>
                ))}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border)',
                paddingTop: '0.75rem'
            }}>
                <button
                    onClick={handleBookmark}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.875rem',
                        color: isBookmarked ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: isBookmarked ? '700' : '500'
                    }}
                >
                    <Bookmark size={18} fill={isBookmarked ? 'var(--primary)' : 'none'} color={isBookmarked ? 'var(--primary)' : 'currentColor'} />
                    {isBookmarked ? 'Saved' : 'Save'}
                </button>
                <button style={{
                    background: 'none',
                    display: 'flex',
                    border: 'none',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    <Share2 size={18} /> Share
                </button>
            </div>
        </div>
    );
};

export default PostCard;
