"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt in degrees
  perspective?: number; // perspective value in px
  scale?: number; // scale on hover
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  perspective = 1000,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse x within card
      const y = e.clientY - rect.top;  // mouse y within card
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation based on center of card
      // xPercent range: -0.5 to 0.5
      // yPercent range: -0.5 to 0.5
      const xPercent = (x / width) - 0.5;
      const yPercent = (y / height) - 0.5;
      
      // rotateX is driven by yPercent (vertical mouse move rotates around horizontal X-axis)
      // rotateY is driven by xPercent (horizontal mouse move rotates around vertical Y-axis)
      const rotateX = -yPercent * maxTilt;
      const rotateY = xPercent * maxTilt;

      gsap.to(card, {
        rotateX,
        rotateY,
        scale,
        transformPerspective: perspective,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        transformPerspective: perspective,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxTilt, perspective, scale]);

  return (
    <div
      ref={cardRef}
      className={`will-change-transform preserve-3d transition-shadow duration-300 ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
