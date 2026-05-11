import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Plus, Filter, MapPin, Clock, Tag, X, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LostItemSkeleton } from '../components/ui/Skeleton';

const LostFoundPage = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All'); // All, Lost, Found
    const [showReportModal, setShowReportModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [reportData, setReportData] = useState({
        title: '',
        category: 'Electronics',
        status: 'Lost',
        location: '',
        description: ''
    });

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await api.lostFound.getItems();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch lost/found items", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await api.lostFound.migrateEmails();
            fetchItems();
        };
        initialize();
    }, []);

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!reportData.title || !reportData.location) return;

        try {
            setSubmitting(true);
            const itemToReport = {
                ...reportData,
                user: user?.name || 'Anonymous Student',
                uid: user?.uid,
                userEmail: user?.email || null
            };
            await api.lostFound.reportItem(itemToReport, imageFile);
            setShowReportModal(false);
            setReportData({
                title: '',
                category: 'Electronics',
                status: 'Lost',
                location: '',
                description: ''
            });
            setImageFile(null);
            fetchItems(); // Refresh feed
        } catch (error) {
            console.error("Error reporting item", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.lostFound.deleteItem(itemId);
            setItems(items.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || item.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="lost-found-page animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>Lost & Found</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Report or claim lost items on campus.</p>
                </div>
                <button 
                    className="btn-primary" 
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setShowReportModal(true)}
                >
                    <Plus size={18} /> <span className="hide-mobile">Report Item</span>
                </button>
            </div>

            <div className="glass card-base" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Search size={20} color="var(--text-secondary)" />
                <input
                    type="text"
                    placeholder="Search items or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button 
                    onClick={() => setFilter('All')}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '2rem',
                        border: 'none',
                        backgroundColor: filter === 'All' ? 'var(--primary)' : 'rgba(26, 35, 126, 0.05)',
                        color: filter === 'All' ? 'white' : 'var(--text-secondary)',
                        fontWeight: filter === 'All' ? '600' : '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All Items
                </button>
                <button 
                    onClick={() => setFilter('Lost')}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '2rem',
                        border: 'none',
                        backgroundColor: filter === 'Lost' ? '#f44336' : 'rgba(26, 35, 126, 0.05)',
                        color: filter === 'Lost' ? 'white' : 'var(--text-secondary)',
                        fontWeight: filter === 'Lost' ? '600' : '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Lost
                </button>
                <button 
                    onClick={() => setFilter('Found')}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '2rem',
                        border: 'none',
                        backgroundColor: filter === 'Found' ? 'var(--success)' : 'rgba(26, 35, 126, 0.05)',
                        color: filter === 'Found' ? 'white' : 'var(--text-secondary)',
                        fontWeight: filter === 'Found' ? '600' : '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Found
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map((i) => <LostItemSkeleton key={i} />)}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredItems.length === 0 ? (
                        <div className="glass card-base" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>No items found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className="glass card-base animate-fade-in" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.title}</h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        backgroundColor: item.status === 'Found' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                        color: item.status === 'Found' ? 'var(--success)' : '#f44336'
                                    }}>
                                        {item.status}
                                    </span>
                                </div>
                                {item.imageUrl && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={16} /> <span>{item.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Tag size={16} /> <span>{item.category}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <Clock size={16} color="var(--accent)" /> <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reported {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.date} by {item.user}</span>
                                    </div>
                                    {(!item.uid || item.uid === user?.uid) && (
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            style={{ 
                                                marginTop: '0.5rem', 
                                                padding: '0.4rem 0.75rem', 
                                                borderRadius: '0.5rem', 
                                                border: `1px solid ${item.status === 'Lost' ? 'var(--success)' : '#f44336'}`, 
                                                backgroundColor: 'transparent', 
                                                color: item.status === 'Lost' ? 'var(--success)' : '#f44336', 
                                                fontWeight: '600', 
                                                cursor: 'pointer', 
                                                alignSelf: 'flex-start',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {item.status === 'Lost' ? 'I found it !' : 'Delete Post'}
                                        </button>
                                    )}
                                    {item.uid && item.uid !== user?.uid && item.userEmail && (
                                        <a 
                                            href={`mailto:${item.userEmail}?subject=Regarding your ${item.status} item on Hados: ${item.title}`}
                                            style={{ 
                                                marginTop: '0.5rem', 
                                                padding: '0.4rem 0.75rem', 
                                                borderRadius: '0.5rem', 
                                                backgroundColor: 'var(--primary)', 
                                                color: 'white', 
                                                fontWeight: '600', 
                                                textDecoration: 'none',
                                                alignSelf: 'flex-start',
                                                fontSize: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            <Mail size={14} /> Contact Poster
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <form onSubmit={handleReportSubmit} className="glass card-base animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Report Item</h2>
                            <button type="button" onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <input 
                                type="text" 
                                placeholder="Item Title (e.g. Lost Black Wallet)" 
                                value={reportData.title}
                                onChange={(e) => setReportData({...reportData, title: e.target.value})}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                            />
                            <div className="flex-col-sm" style={{ display: 'flex', gap: '1rem' }}>
                                <select 
                                    value={reportData.status}
                                    onChange={(e) => setReportData({...reportData, status: e.target.value})}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white' }}
                                >
                                    <option value="Lost">I Lost This</option>
                                    <option value="Found">I Found This</option>
                                </select>
                                <select 
                                    value={reportData.category}
                                    onChange={(e) => setReportData({...reportData, category: e.target.value})}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white' }}
                                >
                                    <option value="Electronics">Electronics</option>
                                    <option value="ID Card">ID Card</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Books/Notes">Books/Notes</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Last seen / Found Location" 
                                value={reportData.location}
                                onChange={(e) => setReportData({...reportData, location: e.target.value})}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                            />
                            <textarea 
                                placeholder="Description (Color, brand, identifying marks...)" 
                                value={reportData.description}
                                onChange={(e) => setReportData({...reportData, description: e.target.value})}
                                rows={3}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontFamily: 'inherit', resize: 'vertical' }} 
                            />
                            {reportData.status === 'Found' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Upload Image (Optional)</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white' }} 
                                    />
                                    {imageFile && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.875rem', fontWeight: '500', marginTop: '0.25rem' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Image attached: {imageFile.name}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn-secondary" style={{ flex: 1, backgroundColor: '#f1f3f5', border: 'none' }} onClick={() => setShowReportModal(false)}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Post Report'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LostFoundPage;
