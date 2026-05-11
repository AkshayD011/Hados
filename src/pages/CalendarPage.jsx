import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Clock, BookOpen, PartyPopper, GraduationCap, Users, AlertTriangle } from 'lucide-react';
import { CalendarSkeleton } from '../components/ui/Skeleton';

const typeConfig = {
    Holiday:  { color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.08)',  icon: PartyPopper },
    Exam:     { color: '#e67e22', bg: 'rgba(230, 126, 34, 0.08)', icon: AlertTriangle },
    Academic: { color: 'var(--primary)', bg: 'rgba(26, 35, 126, 0.06)', icon: GraduationCap },
    Event:    { color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.08)', icon: BookOpen },
    Meeting:  { color: '#3498db', bg: 'rgba(52, 152, 219, 0.08)', icon: Users },
};

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await api.calendar.getEvents();
                // Sort events chronologically by parsing the date string
                data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const types = ['All', ...Object.keys(typeConfig)];
    const filtered = filter === 'All' ? events : events.filter(e => e.type === filter);

    return (
        <div className="calendar-page animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>Academic Calendar</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Even Semester 2025–26 · Amrita Vishwa Vidyapeetham, Bengaluru</p>
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {types.map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '2rem',
                            border: filter === t ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: filter === t ? 'var(--primary)' : 'transparent',
                            color: filter === t ? '#fff' : 'var(--text-secondary)',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="glass card-base" style={{ padding: '0.5rem' }}>
                    {[1, 2, 3, 4].map((i) => <CalendarSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
                    <CalendarIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                    <h3 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>No events found</h3>
                    <p>No calendar events match this filter.</p>
                </div>
            ) : (
                <div className="glass card-base" style={{ padding: '0.5rem' }}>
                    {filtered.map((event, index) => {
                        const cfg = typeConfig[event.type] || typeConfig.Academic;
                        const Icon = cfg.icon;
                        return (
                            <div key={event.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                padding: '1.25rem 1.5rem',
                                borderBottom: index < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = cfg.bg}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    minWidth: '80px',
                                    padding: '0.75rem',
                                    backgroundColor: cfg.bg,
                                    borderRadius: '0.75rem',
                                    color: cfg.color,
                                }}>
                                    <Icon size={22} style={{ marginBottom: '0.3rem' }} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{event.type}</span>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{event.title}</h3>
                                    {event.description && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{event.description}</p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: cfg.color, fontSize: '0.8rem', fontWeight: '600' }}>
                                        <Clock size={13} /> <span>{event.date}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
