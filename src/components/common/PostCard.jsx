import React, { useState } from 'react';
import { Bookmark, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
    const [isBookmarked, setIsBookmarked] = useState(post.bookmarked || false);
    const { user } = useAuth();

    const handleBookmark = async () => {
        if (!user) {
            toast.error('You must be logged in to save posts.');
            return;
        }
        const newStatus = !isBookmarked;
        setIsBookmarked(newStatus);
        try {
            await api.feed.toggleBookmark(user.uid, post.id, newStatus);
            toast.success(newStatus ? 'Post saved!' : 'Removed from saved posts.');
        } catch (e) {
            console.error('Failed to toggle bookmark', e);
            toast.error('Failed to save post. Please try again.');
            setIsBookmarked(!newStatus);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: post.title, text: post.description }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <div
            className="glass card-base card-hover animate-fade-in"
            style={{ padding: '1.375rem', marginBottom: '1.25rem' }}
        >
            {/* ── Author row ─────────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                gap: '0.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    {/* Avatar */}
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '0.8125rem',
                        flexShrink: 0,
                        letterSpacing: '0.025em',
                        boxShadow: '0 2px 8px rgba(155,34,66,0.25)'
                    }}>
                        MD
                    </div>
                    {/* Name + timestamp */}
                    <div style={{ minWidth: 0 }}>
                        <p style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'var(--text-primary)',
                            margin: 0
                        }}>
                            Mailer Daemon
                        </p>
                        <p style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                            margin: '0.1rem 0 0',
                            letterSpacing: '0.01em'
                        }}>
                            {new Date(post.timestamp).toLocaleString('en-IN', {
                                day: 'numeric', month: 'short',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>

                {/* More options */}
                <button className="icon-btn" aria-label="More options" style={{ flexShrink: 0 }}>
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* ── Title ──────────────────────────────────────────────── */}
            <h2 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '800',
                marginBottom: '0.5rem',
                color: 'var(--primary)',
                wordBreak: 'break-word',
                letterSpacing: '-0.01em',
                lineHeight: '1.3'
            }}>
                {post.title}
            </h2>

            {/* ── Description ────────────────────────────────────────── */}
            <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '1.125rem',
                fontSize: 'var(--text-base)',
                wordBreak: 'break-word',
                lineHeight: '1.65'
            }}>
                {post.description}
            </p>

            {/* ── Image placeholder ──────────────────────────────────── */}
            <div style={{
                width: '100%',
                height: '192px',
                backgroundColor: 'var(--surface-hover)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.125rem',
                color: 'var(--text-tertiary)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border)'
            }}>
                <ImageIcon size={40} style={{ opacity: 0.25 }} />
                {/* Carousel dots */}
                <div style={{
                    position: 'absolute', bottom: '10px', left: '50%',
                    transform: 'translateX(-50%)', display: 'flex', gap: '5px'
                }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: i === 1 ? 'var(--primary)' : 'var(--border)',
                            transition: 'background-color 0.2s'
                        }} />
                    ))}
                </div>
            </div>

            {/* ── Hashtags ───────────────────────────────────────────── */}
            {post.hashtags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.125rem' }}>
                    {post.hashtags.map((tag) => (
                        <span key={tag} style={{
                            fontSize: 'var(--text-xs)',
                            backgroundColor: 'var(--primary-alpha-10)',
                            color: 'var(--primary)',
                            padding: '0.25rem 0.625rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: '600',
                            letterSpacing: '0.01em'
                        }}>
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* ── Actions ────────────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border)',
                paddingTop: '0.875rem',
                gap: '0.5rem'
            }}>
                {/* Bookmark */}
                <button
                    onClick={handleBookmark}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.425rem',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '600',
                        color: isBookmarked ? 'var(--primary)' : 'var(--text-secondary)',
                        background: isBookmarked ? 'var(--primary-alpha-10)' : 'transparent',
                        border: 'none',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.18s',
                    }}
                    onMouseEnter={(e) => {
                        if (!isBookmarked) {
                            e.currentTarget.style.background = 'var(--primary-alpha-10)';
                            e.currentTarget.style.color = 'var(--primary)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isBookmarked) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                    }}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Save post'}
                >
                    <Bookmark
                        size={16}
                        fill={isBookmarked ? 'var(--primary)' : 'none'}
                        color={isBookmarked ? 'var(--primary)' : 'currentColor'}
                    />
                    {isBookmarked ? 'Saved' : 'Save'}
                </button>

                {/* Share */}
                <button
                    onClick={handleShare}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.425rem',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        background: 'transparent',
                        border: 'none',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.18s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-alpha-10)';
                        e.currentTarget.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    aria-label="Share post"
                >
                    <Share2 size={16} />
                    Share
                </button>
            </div>
        </div>
    );
};

export default PostCard;
