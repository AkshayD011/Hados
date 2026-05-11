import React from 'react';

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

export const PostSkeleton = () => (
    <div className="card-base glass" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <div style={{ flex: 1 }}>
                <Skeleton width="120px" height="14px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="80px" height="10px" />
            </div>
        </div>
        <Skeleton width="80%" height="24px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton width="100%" height="16px" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="60%" height="16px" style={{ marginBottom: '1rem' }} />
        <Skeleton width="100%" height="200px" borderRadius="0.75rem" />
    </div>
);

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

export const LostItemSkeleton = () => (
    <div className="card-base glass" style={{ overflow: 'hidden', height: '100%' }}>
        <Skeleton width="100%" height="200px" borderRadius="0" />
        <div style={{ padding: '1rem' }}>
            <Skeleton width="150px" height="20px" style={{ marginBottom: '0.75rem' }} />
            <Skeleton width="100%" height="14px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="60%" height="14px" style={{ marginBottom: '1rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="80px" height="24px" borderRadius="1rem" />
                <Skeleton width="40px" height="40px" borderRadius="50%" />
            </div>
        </div>
    </div>
);

export const PlacementorSkeleton = () => (
    <div className="card-base glass" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
        <Skeleton width="60px" height="60px" borderRadius="0.5rem" />
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Skeleton width="200px" height="24px" />
                <Skeleton width="100px" height="24px" borderRadius="1rem" />
            </div>
            <Skeleton width="150px" height="16px" style={{ marginBottom: '1rem' }} />
            <Skeleton width="100%" height="16px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="100%" height="16px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="80%" height="16px" />
        </div>
    </div>
);

export const CalendarSkeleton = () => (
    <div className="glass card-base" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center', minWidth: '60px' }}>
            <Skeleton width="40px" height="14px" style={{ margin: '0 auto 0.5rem' }} />
            <Skeleton width="50px" height="32px" style={{ margin: '0 auto' }} />
        </div>
        <div style={{ flex: 1 }}>
            <Skeleton width="200px" height="20px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="100px" height="14px" />
        </div>
    </div>
);

export const AppLoadingSkeleton = () => (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
        <div style={{ textAlign: 'center' }}>
            <Skeleton width="80px" height="80px" borderRadius="50%" style={{ margin: '0 auto 1.5rem' }} />
            <Skeleton width="200px" height="32px" style={{ margin: '0 auto 1rem' }} />
            <Skeleton width="150px" height="16px" style={{ margin: '0 auto' }} />
        </div>
    </div>
);

export const MapSkeleton = () => (
    <div className="card-base glass" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton width="100%" height="100%" borderRadius="1rem" />
    </div>
);
