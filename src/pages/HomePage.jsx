import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import TrendingWidget from '../components/TrendingWidget';
import { api } from '../utils/api';
import { FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) return;
            try {
                const data = await api.feed.getPosts(user.uid);
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    return (
        <div style={{ display: 'flex', gap: '2rem', width: '100%', alignItems: 'flex-start' }}>
            <div className="home-page animate-fade-in" style={{ flex: '0 0 68.75%', minWidth: 0 }}>
                <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Welcome to Mailer Daemon</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Official campus announcements and essential updates</p>
                </div>

                <div className="feed" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {loading ? (
                        // Skeleton Loading State
                        [1, 2, 3].map((i) => (
                            <div key={i} className="card-base glass" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border)' }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="animate-pulse" style={{ height: '14px', width: '120px', backgroundColor: 'var(--border)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                                        <div className="animate-pulse" style={{ height: '10px', width: '80px', backgroundColor: 'var(--border)', borderRadius: '4px' }} />
                                    </div>
                                </div>
                                <div className="animate-pulse" style={{ height: '24px', width: '80%', backgroundColor: 'var(--border)', borderRadius: '4px', marginBottom: '0.75rem' }} />
                                <div className="animate-pulse" style={{ height: '16px', width: '100%', backgroundColor: 'var(--border)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                                <div className="animate-pulse" style={{ height: '16px', width: '60%', backgroundColor: 'var(--border)', borderRadius: '4px', marginBottom: '1rem' }} />
                                <div className="animate-pulse" style={{ height: '200px', width: '100%', backgroundColor: 'var(--border)', borderRadius: '0.75rem' }} />
                            </div>
                        ))
                    ) : posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
                            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>No posts available</h3>
                            <p>Check back later for official campus updates.</p>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ flex: '0 0 31.25%', minWidth: 0 }}>
                <TrendingWidget />
            </div>
        </div>
    );
};

export default HomePage;
