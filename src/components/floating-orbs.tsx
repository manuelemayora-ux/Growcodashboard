"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FloatingOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const orbs = containerRef.current?.querySelectorAll(".orb");
    if (!orbs) return;

    // Save individual initial positions or let gsap handle relative drift
    orbs.forEach((orb, index) => {
      gsap.to(orb, {
        x: () => (Math.random() - 0.5) * 150,
        y: () => (Math.random() - 0.5) * 150,
        scale: () => 0.9 + Math.random() * 0.3,
        duration: () => 12 + index * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 1.5,
      });
    });

    // Slight parallax on mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5);
      const yPercent = (clientY / window.innerHeight - 0.5);

      orbs.forEach((orb, i) => {
        const factor = (i === 0 ? 30 : i === 1 ? -45 : 20);
        gsap.to(orb, {
          xStrut: xPercent * factor,
          yStrut: yPercent * factor,
          x: `+=${xPercent * factor * 0.1}`,
          y: `+=${yPercent * factor * 0.1}`,
          duration: 1.5,
          ease: "power1.out",
          overwrite: "auto"
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >

      {/* Orb 2: Neon Lime Glow (Right Center-ish) */}
      <div
        className="orb absolute top-[35%] -right-20 h-[300px] w-[300px] rounded-full opacity-15 blur-[120px] sm:h-[450px] sm:w-[450px]"
        style={{
          background: "radial-gradient(circle, rgb(204, 255, 0) 0%, rgb(0, 209, 255) 100%)",
        }}
      />

      {/* Orb 3: Blue Deep Glow (Bottom Left) */}
      <div
        className="orb absolute bottom-10 -left-10 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px] sm:h-[600px] sm:w-[600px]"
        style={{
          background: "radial-gradient(circle, rgb(0, 51, 255) 0%, rgb(0, 209, 255) 100%)",
        }}
      />

      {/* Grid Overlay for technical spatial vibe */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 209, 255, 0.2) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 209, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
