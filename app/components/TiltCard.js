"use client";

import { useRef, useState, useCallback } from "react";

export default function TiltCard({
  children,
  className = "",
  tiltAmount = 10,
  glareEnable = true,
  glareMaxOpacity = 0.15,
  scale = 1.02,
  perspective = 1000,
  transitionSpeed = 400,
  style = {},
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");
  const [glareStyle, setGlareStyle] = useState({});

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -tiltAmount;
      const rotateY = ((x - centerX) / centerX) * tiltAmount;

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      if (glareEnable) {
        const angle =
          Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        const maxDistance = Math.sqrt(
          Math.pow(centerX, 2) + Math.pow(centerY, 2)
        );
        const opacity = (distance / maxDistance) * glareMaxOpacity;

        setGlareStyle({
          background: `linear-gradient(${angle}deg, rgba(255,255,255,${opacity}) 0%, transparent 80%)`,
          opacity: 1,
        });
      }
    },
    [tiltAmount, perspective, scale, glareEnable, glareMaxOpacity]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setGlareStyle({ opacity: 0 });
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: `transform ${transitionSpeed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
      {glareEnable && (
        <div
          className="tilt-glare"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            transition: `opacity ${transitionSpeed}ms ease`,
            ...glareStyle,
          }}
        />
      )}
    </div>
  );
}
