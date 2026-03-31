import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import PostCard from '../components/PostCard';
import { Bookmark } from 'lucide-react';

const SavedPostsPage = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                // To keep it simple, we just fetch all posts and filter bookmarked ones from the mock API
                const data = await api.feed.getPosts();
                setSavedPosts(data.filter(post => post.bookmarked));
            } catch (error) {
                console.error("Failed to fetch saved posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, []);

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
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Loading saved posts...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {savedPosts.length === 0 ? (
                        <div className="glass card-base" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                            <Bookmark size={48} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No saved posts yet</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Click the bookmark icon on any post to save it for later.</p>
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
