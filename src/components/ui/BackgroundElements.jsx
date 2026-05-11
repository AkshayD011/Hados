import React from 'react';
import { motion } from 'framer-motion';

const BackgroundElements = () => {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none', backgroundColor: 'var(--background)' }}>
            <motion.div
                animate={{
                    x: [0, 150, 0],
                    y: [0, 80, -80, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: '-15%',
                    left: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(155, 34, 66, 0.12) 0%, rgba(155, 34, 66, 0) 65%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                }}
            />

            <motion.div
                animate={{
                    x: [0, -120, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(243, 156, 18, 0.1) 0%, rgba(243, 156, 18, 0) 65%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }}
            />

            <motion.div
                animate={{
                    x: [0, 80, -50, 0],
                    y: [0, 120, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    top: '30%',
                    right: '15%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(44, 62, 80, 0.08) 0%, rgba(44, 62, 80, 0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(50px)'
                }}
            />
        </div>
    );
};

export default BackgroundElements;
