import React, { useState, useEffect } from 'react';
import PostCard from '../components/common/PostCard';
import TrendingWidget from '../components/common/TrendingWidget';
import { api } from '../services/api';
import { FileText, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PostSkeleton } from '../components/ui/Skeleton';

const HomePage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [postData, setPostData] = useState({
        title: '',
        description: '',
        hashtags: ''
    });

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

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!postData.title || !postData.description) return;

        try {
            setSubmitting(true);
            const parsedTags = postData.hashtags
                .split(',')
                .map(t => t.trim().replace(/^#/, ''))
                .filter(t => t.length > 0);

            await api.feed.createPost({
                title: postData.title,
                description: postData.description,
                hashtags: parsedTags
            }, imageFile);

            setShowCreateModal(false);
            setPostData({ title: '', description: '', hashtags: '' });
            setImageFile(null);
            fetchPosts(); // Refresh feed
            toast.success('Announcement published successfully!');
            setTimeout(() => window.location.reload(), 1000); // Quick way to force TrendingWidget to refresh
        } catch (error) {
            console.error("Failed to create post", error);
            toast.error("Failed to publish announcement. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-col-lg" style={{ display: 'flex', gap: '2rem', width: '100%', alignItems: 'flex-start' }}>
            <div className="home-page animate-fade-in w-full-lg" style={{ flex: '0 0 68.75%', minWidth: 0 }}>
                <div style={{ marginBottom: '2.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="text-md-mobile" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Welcome to Mailer Daemon</h2>
                        <p className="text-sm-mobile" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Official campus announcements and essential updates</p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="glass"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '0.75rem',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)'
                        }}
                    >
                        <Plus size={20} />
                        <span className="hide-sm">Create Post</span>
                    </button>
                </div>

                <div className="feed" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <PostSkeleton key={i} />
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

            <div className="w-full-lg" style={{ flex: '0 0 31.25%', minWidth: 0 }}>
                <TrendingWidget />
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass card-base animate-fade-in" style={{
                        width: '90%',
                        maxWidth: '500px',
                        padding: '2rem',
                        position: 'relative',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <button 
                            onClick={() => setShowCreateModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                            Create Announcement
                        </h2>

                        <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Title</label>
                                <input 
                                    type="text" 
                                    value={postData.title}
                                    onChange={(e) => setPostData({...postData, title: e.target.value})}
                                    placeholder="Brief and descriptive title"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Description</label>
                                <textarea 
                                    value={postData.description}
                                    onChange={(e) => setPostData({...postData, description: e.target.value})}
                                    placeholder="Provide detailed information..."
                                    required
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--text-primary)',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Hashtags</label>
                                <input 
                                    type="text" 
                                    value={postData.hashtags}
                                    onChange={(e) => setPostData({...postData, hashtags: e.target.value})}
                                    placeholder="e.g. Exams, Events, Urgent (comma separated)"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Attachment (Optional)</label>
                                <div style={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: '0.5rem',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    backgroundColor: 'var(--background)',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        style={{
                                            position: 'absolute',
                                            top: 0, left: 0, width: '100%', height: '100%',
                                            opacity: 0, cursor: 'pointer'
                                        }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                        <ImageIcon size={24} color={imageFile ? 'var(--primary)' : 'var(--text-secondary)'} />
                                        <span>{imageFile ? `Attached: ${imageFile.name}` : 'Click or drag to upload an image flyer'}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: '0.875rem',
                                    backgroundColor: submitting ? 'var(--text-secondary)' : 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    marginTop: '1rem'
                                }}
                            >
                                {submitting ? 'Publishing...' : 'Publish Announcement'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
