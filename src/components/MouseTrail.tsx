
import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
}

interface MouseTrailProps {
  colors: string[];
  size?: number;
  decay?: number;
  limit?: number;
  trail?: number;
}

const MouseTrail: React.FC<MouseTrailProps> = ({
  colors,
  size = 15,
  decay = 0.95,
  limit = 35,
  trail = 4
}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const requestRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const initiatedRef = useRef(false);

  // Set up mouse move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (!initiatedRef.current) {
        initiatedRef.current = true;
        requestRef.current = requestAnimationFrame(updatePoints);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Set up canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation function
  const updatePoints = () => {
    setPoints(prevPoints => {
      // Add new points based on current mouse position
      const newPoints = [...prevPoints];
      
      // Add trail points
      for (let i = 0; i < trail; i++) {
        if (newPoints.length < limit) {
          const randomOffset = {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5
          };
          
          newPoints.push({
            x: positionRef.current.x + randomOffset.x,
            y: positionRef.current.y + randomOffset.y,
            size: size * (0.5 + Math.random() * 0.5),
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1
          });
        }
      }
      
      // Update existing points (fade out)
      const updatedPoints = newPoints
        .map(point => ({
          ...point,
          life: point.life * decay
        }))
        .filter(point => point.life > 0.01);
      
      return updatedPoints;
    });
    
    // Draw the points
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        points.forEach(point => {
          ctx.beginPath();
          ctx.arc(
            point.x, 
            point.y, 
            point.size * point.life, 
            0, 
            2 * Math.PI
          );
          ctx.fillStyle = point.color + Math.floor(point.life * 255).toString(16).padStart(2, '0');
          ctx.fill();
        });
      }
    }
    
    requestRef.current = requestAnimationFrame(updatePoints);
  };

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ opacity: 0.7 }}
    />
  );
};

export default MouseTrail;
