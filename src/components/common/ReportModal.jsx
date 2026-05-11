/**
 * ReportModal — user-facing dialog to report a post or comment.
 *
 * Props:
 *   isOpen         {boolean}
 *   onClose        {() => void}
 *   target         {{ id, title, content, authorId, type: 'post'|'comment' }}
 */
import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { REPORT_REASONS, REPORT_REASON_LABELS } from '../../services/api/moderation.api';
import toast from 'react-hot-toast';

const ReportModal = ({ isOpen, onClose, target }) => {
    const { user } = useAuth();
    const [reason, setReason]   = useState('');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted]   = useState(false);

    const reset = () => { setReason(''); setDetails(''); setSubmitting(false); setSubmitted(false); };

    const handleClose = () => { reset(); onClose(); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) { toast.error('Please select a reason.'); return; }
        if (!user)   { toast.error('You must be logged in to report content.'); return; }
        setSubmitting(true);
        try {
            await api.moderation.submitReport({
                type:           target.type || 'post',
                targetId:       target.id,
                targetTitle:    target.title,
                targetContent:  target.content,
                targetAuthorId: target.authorId,
                reason,
                details,
                reportedBy:    user.uid,
                reporterEmail: user.email,
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Report failed:', err);
            toast.error('Failed to submit report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Report content"
            style={{
                position: 'fixed', inset: 0, zIndex: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
            }}
            onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div
                className="glass card-base"
                style={{ width: '100%', maxWidth: '440px', overflow: 'hidden', animation: 'slideInRight 0.22s ease' }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.125rem 1.375rem',
                    borderBottom: '1px solid var(--border)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Flag size={16} color="var(--error)" />
                        <h2 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: '700', color: 'var(--text-primary)' }}>
                            Report {target?.type === 'comment' ? 'Comment' : 'Post'}
                        </h2>
                    </div>
                    <button className="icon-btn" onClick={handleClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                {submitted ? (
                    /* ── Thank you state ─────────────────── */
                    <div style={{ padding: '2.5rem 1.375rem', textAlign: 'center' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            backgroundColor: 'rgba(16,185,129,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem',
                        }}>
                            <Flag size={24} color="var(--success)" />
                        </div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                            Report Submitted
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 1.5rem' }}>
                            Thank you for helping keep Hados safe. Our moderators will review this shortly.
                        </p>
                        <button className="btn-primary" onClick={handleClose} style={{ width: '100%' }}>
                            Done
                        </button>
                    </div>
                ) : (
                    /* ── Form ────────────────────────────── */
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ padding: '1.25rem 1.375rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Context snippet */}
                            {target?.title && (
                                <div style={{
                                    padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--surface-hover)',
                                    border: '1px solid var(--border)',
                                }}>
                                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>
                                        Reporting
                                    </p>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {target.title}
                                    </p>
                                </div>
                            )}

                            {/* Reason */}
                            <div>
                                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    Reason <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
                                        <label
                                            key={value}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.625rem',
                                                padding: '0.625rem 0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                border: `1.5px solid ${reason === value ? 'var(--primary)' : 'var(--border)'}`,
                                                backgroundColor: reason === value ? 'var(--primary-alpha-10)' : 'transparent',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="reason"
                                                value={value}
                                                checked={reason === value}
                                                onChange={() => setReason(value)}
                                                style={{ accentColor: 'var(--primary)', flexShrink: 0 }}
                                            />
                                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: reason === value ? '600' : '500', color: reason === value ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                                {label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div>
                                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    Additional details <span style={{ color: 'var(--text-tertiary)', fontWeight: '500' }}>(optional)</span>
                                </label>
                                <textarea
                                    value={details}
                                    onChange={e => setDetails(e.target.value)}
                                    placeholder="Provide more context to help moderators…"
                                    rows={3}
                                    maxLength={500}
                                    style={{ width: '100%', resize: 'vertical', minHeight: '80px', fontSize: 'var(--text-sm)' }}
                                />
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0.25rem 0 0', textAlign: 'right' }}>
                                    {details.length}/500
                                </p>
                            </div>

                            {/* Warning */}
                            <div style={{
                                display: 'flex', gap: '0.5rem', padding: '0.625rem 0.75rem',
                                backgroundColor: 'rgba(245,158,11,0.08)',
                                border: '1px solid rgba(245,158,11,0.25)',
                                borderRadius: 'var(--radius-sm)',
                            }}>
                                <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                    False reports may result in account penalties. Only report genuinely harmful content.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
                            padding: '0.875rem 1.375rem',
                            borderTop: '1px solid var(--border)',
                        }}>
                            <button type="button" className="btn-secondary" onClick={handleClose} disabled={submitting}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !reason}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.55rem 1.25rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '700', fontSize: 'var(--text-sm)',
                                    backgroundColor: submitting || !reason ? 'var(--border)' : 'var(--error)',
                                    color: submitting || !reason ? 'var(--text-tertiary)' : 'white',
                                    border: 'none', cursor: submitting || !reason ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.18s',
                                }}
                            >
                                {submitting ? <><Loader size={14} className="animate-spin" /> Submitting…</> : <><Flag size={14} /> Submit Report</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
