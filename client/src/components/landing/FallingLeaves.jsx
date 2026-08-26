import React, { useMemo } from 'react';
import leafImg from '../../assets/leaf.png';

const fallingAnimation = `
  @keyframes leafFall {
    0% {
      transform: translateY(-120px) translateX(0px) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.28;
    }
    33% {
      transform: translateY(28vh) translateX(40px) rotate(120deg);
    }
    66% {
      transform: translateY(65vh) translateX(-30px) rotate(240deg);
      opacity: 0.20;
    }
    90% {
      opacity: 0;
    }
    100% {
      transform: translateY(108vh) translateX(15px) rotate(360deg);
      opacity: 0;
    }
  }

  .falling-leaf-img {
    position: fixed;
    top: 0;
    pointer-events: none;
    animation: leafFall linear infinite;
    will-change: transform, opacity;
    z-index: 999;
  }

  /* Larger leaves on laptop/desktop screens */
  @media (min-width: 1024px) {
    .falling-leaf-img {
      transform-origin: center center;
      min-width: 70px;
      max-width: 120px;
    }
  }
`;

const FallingLeaves = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const leaves = useMemo(() => (
    Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${12 + Math.random() * 14}s`,
      animationDelay: `-${Math.random() * 18}s`,
      // Larger on desktop, smaller on mobile
      width: isMobile
        ? `${25 + Math.random() * 20}px`   // 25–45px on mobile
        : `${70 + Math.random() * 50}px`,  // 70–120px on laptop/desktop
      opacity: 0.15 + Math.random() * 0.10,  // 0.15–0.25
    }))
  ), [isMobile]);

  return (
    <>
      <style>{fallingAnimation}</style>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 999 }}>
        {leaves.map((leaf) => (
          <img
            key={leaf.id}
            src={leafImg}
            alt=""
            className="falling-leaf-img"
            style={{
              left: leaf.left,
              width: leaf.width,
              height: 'auto',
              animationDuration: leaf.animationDuration,
              animationDelay: leaf.animationDelay,
              opacity: leaf.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default FallingLeaves;
