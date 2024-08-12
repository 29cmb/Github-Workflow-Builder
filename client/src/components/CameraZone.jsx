import React, { useState, useEffect, useRef, cloneElement, Children } from "react";

const CameraData = {
    Speed: 2
}

const directions = {
    w: [0,1], a: [1,0], s: [0,-1], d: [-1,0],
    ArrowUp: [0,1], ArrowLeft: [1,0], ArrowDown: [0,-1], ArrowRight: [-1,0]
}

function CameraZone({ children }) {
    const [position, setPosition] = useState([0, 0]);
    const containerRef = useRef(null);
    const [viewportSize, setViewportSize] = useState([window.innerWidth, window.innerHeight]);
    const [pressedKeys, setPressedKeys] = useState({});

    useEffect(() => {
        const handleResize = () => {
            setViewportSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            console.log(event.key)
            if (directions[event.key] && !pressedKeys[event.key]) {
                setPressedKeys(prev => ({ ...prev, [event.key]: true }));
            }
        };

        const handleKeyUp = (event) => {
            if (directions[event.key]) {
                setPressedKeys(prev => ({ ...prev, [event.key]: false }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [pressedKeys]);

    useEffect(() => {
        const interval = setInterval(() => {
            Object.keys(pressedKeys).forEach(key => {
                if (pressedKeys[key]) {
                    const direction = directions[key];
                    setPosition(prev => [prev[0] + direction[0] * CameraData.Speed, prev[1] + direction[1] * CameraData.Speed]);
                }
            });
        }, 1);

        return () => clearInterval(interval);
    }, [pressedKeys]);

    const transformStyle = {
        transform: `translate(${viewportSize[0] / 2 - position[0]}px, ${viewportSize[1] / 2 - position[1]}px)`
    };

    return (
        <div id="camera-zone" ref={containerRef} style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{ ...transformStyle, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {Children.map(children, child => {
                    const childPos = child.props.pos || [0, 0];
                    const childStyle = {
                        position: 'absolute',
                        left: `${childPos[0]}px`,
                        top: `${childPos[1]}px`,
                        zIndex: "inherit"
                    };
                    return cloneElement(child, { style: { ...child.props.style, ...childStyle } });
                })}
            </div>
        </div>
    );
}
const getCamPos = () => { /* TODO: Make this actually return the camPos */ };
export { CameraZone, getCamPos };