import React, { useState } from "react";

const CameraData = {
    Speed: 10
}

function CameraZone({ children }) {
    const [position, setPosition] = useState([0,0])

    return (
        <div id="camera-zone">
            {children}
        </div>
    )
}

export default CameraZone;