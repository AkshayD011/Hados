import React from 'react';

// ─── Base Skeleton Primitive ─────────────────────────────────────────────────

export const Skeleton = ({ width, height, borderRadius = '4px', className = '', style = {} }) => (
    <div 
        className={`animate-pulse ${className}`} 
        style={{ 
            width, 
            height, 
            borderRadius, 
            backgroundColor: 'var(--border)', 
            ...style 
        }} 
    />
);

// ─── Feed / Post ─────────────────────────────────────────────────────────────

export const PostSkeleton = () => (
    <div className="card-base glass" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <div style={{ flex: 1 }}>
                <Skeleton width="120px" height="14px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="80px" height="10px" />
            </div>
        </div>
        <Skeleton width="80%" height="20px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton width="100%" height="14px" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="60%" height="14px" style={{ marginBottom: '1rem' }} />
        <Skeleton width="100%" height="180px" borderRadius="0.75rem" />
    </div>
);

// ─── Clubs ───────────────────────────────────────────────────────────────────

export const ClubSkeleton = () => (
    <div className="card-base glass" style={{ padding: '1.5rem', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Skeleton width="48px" height="48px" borderRadius="50%" />
            <div style={{ flex: 1 }}>
                <Skeleton width="150px" height="20px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="100px" height="14px" />
            </div>
        </div>
        <Skeleton width="100%" height="16px" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="80%" height="16px" style={{ marginBottom: '1.5rem' }} />
        <Skeleton width="100%" height="36px" borderRadius="0.5rem" />
    </div>
);

// ─── Lost & Found ────────────────────────────────────────────────────────────

export const LostItemSkeleton = () => (
    <div className="card-base glass" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <Skeleton width="80px" height="80px" borderRadius="0.75rem" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="18px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="40%" height="14px" style={{ marginBottom: '0.75rem' }} />
                <Skeleton width="100%" height="12px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="80%" height="12px" />
            </div>
        </div>
    </div>
);

// ─── Placement ───────────────────────────────────────────────────────────────

export const PlacementorSkeleton = () => (
    <div className="card-base glass" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
                <Skeleton width="180px" height="22px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="120px" height="16px" />
            </div>
            <Skeleton width="80px" height="36px" borderRadius="0.5rem" style={{ flexShrink: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <Skeleton width="140px" height="14px" />
            <Skeleton width="100px" height="14px" />
        </div>
    </div>
);

// ─── Calendar ────────────────────────────────────────────────────────────────

export const CalendarSkeleton = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', minWidth: '48px' }}>
            <Skeleton width="36px" height="12px" style={{ margin: '0 auto 0.5rem' }} />
            <Skeleton width="44px" height="28px" style={{ margin: '0 auto' }} borderRadius="0.5rem" />
        </div>
        <div style={{ flex: 1 }}>
            <Skeleton width="55%" height="18px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="30%" height="12px" />
        </div>
        <Skeleton width="60px" height="22px" borderRadius="1rem" style={{ flexShrink: 0 }} />
    </div>
);

// ─── Trending Widget ─────────────────────────────────────────────────────────

export const TrendingWidgetSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[80, 100, 70, 90, 65].map((w, i) => (
            <div key={i} style={{ padding: '0.75rem', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <Skeleton width="72px" height="10px" style={{ marginBottom: '0.4rem' }} />
                <Skeleton width={`${w}px`} height="16px" style={{ marginBottom: '0.3rem' }} />
                <Skeleton width="48px" height="10px" />
            </div>
        ))}
    </div>
);

// ─── Map ─────────────────────────────────────────────────────────────────────

// Renders inside the existing map card container (no outer card wrapper)
export const MapLoadingOverlay = () => (
    <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        backgroundColor: 'rgba(244, 246, 249, 0.75)',
        backdropFilter: 'blur(4px)',
        borderRadius: 'inherit',
        zIndex: 1
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Loading campus map…</span>
    </div>
);

// Backward-compatible alias
export const MapSkeleton = MapLoadingOverlay;

// ─── Profile Uploading ───────────────────────────────────────────────────────

export const UploadingIndicator = ({ label = 'Uploading…' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', margin: 0 }}>{label}</p>
    </div>
);

// ─── App Boot ────────────────────────────────────────────────────────────────

export const AppLoadingSkeleton = () => (
    <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)'
    }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(155, 34, 66, 0.35)',
                animation: 'brandPulse 1.5s ease-in-out infinite'
            }}>
                <span style={{ color: 'white', fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.04em' }}>H</span>
            </div>
            <div>
                <p style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Hados</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Loading your campus…</p>
            </div>
        </div>
    </div>
);
