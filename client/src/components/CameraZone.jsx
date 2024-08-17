import { useState, useEffect, useRef, cloneElement, Children } from "react";
import { create } from 'zustand'

const CameraData = {
    Speed: 2
}

const directions = {
    w: [0,-1], a: [-1,0], s: [0,1], d: [1,0],
    ArrowUp: [0,-1], ArrowLeft: [-1,0], ArrowDown: [0,1], ArrowRight: [1,0]
}

const useCameraStore = create((set) => ({
    position: [0, 0],
    setPosition: (position) => set({ position: position || [0, 0] }),
}));

const offsetStore = create((set) => ({
    offset: [window.innerWidth / 2, window.innerHeight / 2],
    setOffset: (offset) => set({ offset: offset || [window.innerWidth / 2, window.innerHeight / 2] }),
}))

function CameraZone({ children }) {
    const [position, setPosition] = useCameraStore((state) => [state.position, state.setPosition]);
    const containerRef = useRef(null);
    const [viewportSize, setViewportSize] = offsetStore((state) => [state.offset, state.setOffset]);
    const [pressedKeys, setPressedKeys] = useState({});

    useEffect(() => {
        const handleResize = () => {
            setViewportSize([window.innerWidth / 2, window.innerHeight / 2]);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
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
            let deltaX = 0;
            let deltaY = 0;
    
            Object.keys(pressedKeys).forEach(key => {
                if (pressedKeys[key]) {
                    const direction = directions[key];
                    deltaX += direction[0] * CameraData.Speed;
                    deltaY += direction[1] * CameraData.Speed;
                }
            });
    
            if (deltaX !== 0 || deltaY !== 0) {
                setPosition([position[0] + deltaX, position[1] + deltaY]);
            }
        }, 1);
    
        return () => clearInterval(interval);
    }, [pressedKeys, position, setPosition]);

    const transformStyle = {
        transform: `translate(${viewportSize[0] - position[0]}px, ${viewportSize[1] - position[1]}px)`
    };

    return (
        <div id="camera-zone" ref={containerRef} style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}>
            <p id="posText">{`${Math.floor(position[0]/15)}, ${-Math.floor(position[1]/15)}`}</p>
            <div style={{ ...transformStyle, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {Children.map(children, child => {
                    const childPos = child.props.pos
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
const useCamPos = () => useCameraStore(state => state.position);
const useOffset = () => offsetStore(state => state.offset);

export { CameraZone, useCamPos, useOffset };