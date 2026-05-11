import React, { useEffect } from 'react';

const InteractiveBackground = () => {
    // We update --mouse-x and --mouse-y on the html element
    // so CSS radial gradients can use them dynamically.
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // We render a fixed background div with the pattern/glow.
    // The visual rendering of the glow is entirely handled via extremely performant CSS.
    return (
        <div className="interactive-bg-wrapper">
            <div className="grid-pattern" />
            <div className="mouse-glow" />
        </div>
    );
};

export default InteractiveBackground;
