import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Search, Plus, Filter, MapPin, Clock, Tag } from 'lucide-react';

const LostFoundPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All'); // All, Lost, Found
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await api.lostFound.getItems();
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch lost/found items", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

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
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Loading items...</div>
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={16} /> <span>{item.location}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Tag size={16} /> <span>{item.category}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <Clock size={16} color="var(--accent)" /> <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reported {item.date} by {item.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Mock Report Modal */}
            {showReportModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div className="glass card-base animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Report Item</h2>
                        <input type="text" placeholder="Item Title (e.g. Lost Wallet)" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                        <select style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white' }}>
                            <option>Status: Lost</option>
                            <option>Status: Found</option>
                        </select>
                        <input type="text" placeholder="Location" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-secondary" style={{ flex: 1, backgroundColor: '#f1f3f5', border: 'none' }} onClick={() => setShowReportModal(false)}>Cancel</button>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setShowReportModal(false)}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LostFoundPage;
