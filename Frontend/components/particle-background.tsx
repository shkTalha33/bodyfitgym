"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setIsReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      particles: {
        number: { value: 64, density: { enable: true, width: 1200, height: 800 } },
        color: { value: ["#8b5cf6", "#38bdf8", "#a78bfa"] },
        opacity: { value: { min: 0.12, max: 0.5 } },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          distance: 120,
          color: "#6d67ff",
          opacity: 0.18,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.7,
          direction: "none" as const,
          outModes: { default: "out" as const },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" as const },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 90, duration: 0.4 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {isReady && <Particles id="tsparticles-premium" options={options} />}
    </div>
  );
}
