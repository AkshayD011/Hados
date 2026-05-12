import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import PostCard from '../components/common/PostCard';
import { Bookmark, Home } from 'lucide-react';
import { PostSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

const SavedPostsPage = () => {
    const { user } = useAuth();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                // Fetch posts with bookmark state for the current user
                const data = await api.feed.getPosts(user.uid);
                setSavedPosts(data.filter(post => post.bookmarked));
            } catch (error) {
                console.error("Failed to fetch saved posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, [user]);

    return (
        <div className="saved-posts-page animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', color: '#ffc107' }}>
                    <Bookmark size={24} weight="fill" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>Saved Posts</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Access your bookmarked announcements and events.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {[1, 2].map((i) => <PostSkeleton key={i} />)}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {savedPosts.length === 0 ? (
                        <div className="glass card-base">
                            <EmptyState
                                icon={Bookmark}
                                title="No saved posts yet"
                                message="Tap the bookmark icon on any announcement to save it here for easy access."
                                action={{ label: 'Browse Feed', to: '/', icon: Home }}
                            />
                        </div>
                    ) : (
                        savedPosts.map(post => <PostCard key={post.id} post={post} />)
                    )}
                </div>
            )}
        </div>
    );
};

export default SavedPostsPage;
