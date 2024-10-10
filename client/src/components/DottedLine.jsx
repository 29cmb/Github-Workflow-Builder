import React, { useEffect, useState } from 'react';

const DottedLine = ({ start, end }) => {
  const [lineStyle, setLineStyle] = useState({});

  useEffect(() => {
    const x1 = start.x;
    const y1 = start.y;
    const x2 = end.x;
    const y2 = end.y;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const style = {
      position: 'absolute',
      top: y1,
      left: x1,
      width: `${length}px`,
      borderTop: '4px dotted white',
      transform: `rotate(${angle}deg)`,
      transformOrigin: '0 0',
    };

    setLineStyle(style);
  }, [start, end]);

  return <div style={lineStyle}></div>;
};

export default DottedLine;
