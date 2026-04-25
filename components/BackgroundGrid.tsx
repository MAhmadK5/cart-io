"use client";

import { useMemo } from 'react';

export default function BackgroundGrid() {
  
  // This memoized function calculates an actual 3D twisted wireframe mesh
  const gridLines = useMemo(() => {
    const paths = [];
    const numU = 60; // Resolution of the curve (higher = smoother)
    const numV = 18; // Number of parallel lines in the ribbon

    // A mathematical function to project 3D space onto a 2D screen
    const getPoint = (u: number, v: number) => {
      // 1. Stretch across the screen horizontally
      const x = -200 + u * 1400; 
      
      // 2. Create the deep "S" swoop wave
      const ySwoop = Math.sin(u * Math.PI * 1.5) * 350 - Math.cos(u * Math.PI) * 100;
      
      // 3. Twist the ribbon in 3D space as it moves right
      const twist = u * Math.PI * 2.5; 
      const width = 500; // How wide the ribbon is

      const vCentered = v - 0.5;
      
      // 4. Calculate actual 3D Y and Z coordinates
      const y = 350 + ySwoop + vCentered * width * Math.cos(twist);
      const z = vCentered * width * Math.sin(twist);

      // 5. Apply camera perspective (things further away get smaller/closer together)
      const perspective = 800 / (800 + z);

      return {
        x: 500 + (x - 500) * perspective,
        y: y * perspective
      };
    };

    // Draw the longitudinal lines (sweeping left to right)
    for (let j = 0; j <= numV; j++) {
      const v = j / numV;
      let d = "";
      for (let i = 0; i <= numU; i++) {
        const u = i / numU;
        const pt = getPoint(u, v);
        d += i === 0 ? `M ${pt.x},${pt.y}` : ` L ${pt.x},${pt.y}`;
      }
      paths.push(
        <path key={`h-${j}`} d={d} stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" />
      );
    }

    // Draw the latitudinal cross-lines (the intersecting net)
    for (let i = 0; i <= numU; i++) {
      const u = i / numU;
      let d = "";
      for (let j = 0; j <= numV; j++) {
        const v = j / numV;
        const pt = getPoint(u, v);
        d += j === 0 ? `M ${pt.x},${pt.y}` : ` L ${pt.x},${pt.y}`;
      }
      paths.push(
        <path key={`v-${i}`} d={d} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
      );
    }

    return paths;
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999, /* ✨ FORCED TO THE VERY FRONT */
      backgroundColor: 'transparent', /* ✨ Removed the black background */
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      
      {/* Subtle Brand Glows (Faded into the deep background) */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: '40vw', height: '40vw', background: 'rgba(37, 99, 235, 0.1)', filter: 'blur(120px)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '40vw', height: '40vw', background: 'rgba(249, 115, 22, 0.08)', filter: 'blur(120px)', borderRadius: '50%' }}></div>

      {/* The Generative 3D Mesh */}
      <svg
        className="abstract-ribbon"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {gridLines}
      </svg>

      {/* A slow, breathing hover animation so it feels alive */}
      <style>{`
        .abstract-ribbon {
          animation: ribbon-breathe 20s ease-in-out infinite alternate;
          transform-origin: center;
        }

        @keyframes ribbon-breathe {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.6; }
          100% { transform: scale(1.05) translate(-10px, 10px); opacity: 0.9; }
        }
      `}</style>
      
    </div>
  );
}