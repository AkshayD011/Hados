import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await api.calendar.getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="calendar-page animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>Academic Calendar</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Important dates for the current semester.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Loading calendar...</div>
            ) : (
                <div className="glass card-base" style={{ padding: '0.5rem' }}>
                    {events.map((event, index) => (
                        <div key={event.id} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1.5rem',
                            padding: '1.5rem',
                            borderBottom: index < events.length - 1 ? '1px solid var(--border)' : 'none'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                minWidth: '80px',
                                padding: '0.75rem',
                                backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                borderRadius: '0.5rem',
                                color: 'var(--primary)'
                            }}>
                                <CalendarIcon size={24} style={{ marginBottom: '0.25rem' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>{event.type}</span>
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{event.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <Clock size={14} /> <span>{event.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
