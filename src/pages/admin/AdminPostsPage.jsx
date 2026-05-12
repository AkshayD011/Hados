import React, { useState, useEffect, useCallback } from 'react';
import { 
    FileText, Trash2, RefreshCcw, Search, 
    ChevronLeft, AlertCircle, Clock, User,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { feedApi } from '../../services/api/feed.api';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';
import { activityLogApi, ACTION_TYPE } from '../../services/api/activityLog.api';

const AdminPostsPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [acting, setActing] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Using existing feedApi.getFeed() which fetches all public posts
            const data = await feedApi.getFeed();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            setError('Could not load posts. Check Firestore permissions.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handleDelete = async (post) => {
        if (!window.confirm(`Permanently delete post "${post.title || 'Untitled'}"? This action cannot be undone.`)) return;
        
        setActing(post.id);
        try {
            await feedApi.deletePost(post.id);
            setPosts(prev => prev.filter(p => p.id !== post.id));
            toast.success('Post deleted successfully.');
            
            // Log activity
            activityLogApi.log(
                { uid: user.uid, email: user.email },
                ACTION_TYPE.POST_DELETED,
                { id: post.id, type: 'post', label: post.title || 'Untitled' },
                { author: post.authorName || post.authorEmail }
            );
        } catch (err) {
            console.error('Delete failed:', err);
            toast.error('Failed to delete post.');
        } finally {
            setActing(null);
        }
    };

    const filtered = posts.filter(p => 
        !search || 
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.content?.toLowerCase().includes(search.toLowerCase()) ||
        p.authorName?.toLowerCase().includes(search.toLowerCase()) ||
        p.authorEmail?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* ── Page Header ────────────────────────────────────────── */}
            <div style={{ marginBottom: '2rem' }}>
                <Link 
                    to={ROUTES.ADMIN_DASHBOARD} 
                    style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem', 
                        fontSize: 'var(--text-sm)', fontWeight: '600', 
                        color: 'var(--text-secondary)', marginBottom: '0.875rem', 
                        textDecoration: 'none', transition: 'color 0.18s' 
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <ChevronLeft size={15} /> Back to Dashboard
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} color="white" />
                    </div>
                    <div>
                        <h1 className="page-title" style={{ margin: 0 }}>Post Management</h1>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Review and moderate all campus activity feed posts</p>
                    </div>
                </div>
            </div>

            {/* ── Toolbar ────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '500px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input 
                        type="search" 
                        placeholder="Search posts by title, content, or author..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '2.5rem' }}
                    />
                </div>
                <button onClick={fetchPosts} disabled={loading} className="icon-btn" style={{ width: '40px', height: '40px' }}>
                    <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
                <div style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                    {loading ? '...' : `${filtered.length} posts shown`}
                </div>
            </div>

            {/* ── Posts Table ────────────────────────────────────────── */}
            <div className="glass card-base" style={{ overflow: 'hidden' }}>
                {error ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--error)' }}>
                        <AlertCircle size={32} style={{ marginBottom: '1rem' }} />
                        <p>{error}</p>
                    </div>
                ) : loading ? (
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="animate-pulse" style={{ height: '70px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--border)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                        <FileText size={40} color="var(--text-tertiary)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>No posts found matching your search.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                                    {['Post Details', 'Author', 'Posted On', 'Actions'].map(col => (
                                        <th key={col} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((post, i) => (
                                    <tr key={post.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}>
                                        <td style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <p style={{ fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{post.title || 'Untitled Post'}</p>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {post.content}
                                                </p>
                                                {post.hashtags?.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
                                                        {post.hashtags.slice(0, 3).map(h => (
                                                            <span key={h} style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '700' }}>#{h}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={14} color="var(--text-secondary)" />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0, fontSize: 'var(--text-xs)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.authorName || 'User'}</p>
                                                    <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', margin: 0 }}>{post.authorEmail || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                                                <Clock size={12} />
                                                {new Date(post.timestamp).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <a 
                                                    href={`/post/${post.id}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="icon-btn"
                                                    style={{ width: '32px', height: '32px' }}
                                                    title="View Original"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button 
                                                    onClick={() => handleDelete(post)}
                                                    disabled={acting === post.id}
                                                    className="icon-btn"
                                                    style={{ width: '32px', height: '32px', color: 'var(--error)' }}
                                                    title="Delete Post"
                                                >
                                                    {acting === post.id ? (
                                                        <RefreshCcw size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminPostsPage;
