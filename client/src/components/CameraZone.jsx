import React, { useState } from "react";

const CameraData = {
    Speed: 10
}

function CameraZone({ children }) {
    const [position, setPosition] = useState([0,0])

    const transformStyle = {
        transform: `translate(${-position[0]}px, ${-position[1]}px)`
    };

    return (
        <div id="camera-zone">
            <div style={{ ...transformStyle, position: "absolute", top: 0, left: 0, width: '100%', height: '100%'}}>
                {children}
            </div>
        </div>
    )
}

export default CameraZone;