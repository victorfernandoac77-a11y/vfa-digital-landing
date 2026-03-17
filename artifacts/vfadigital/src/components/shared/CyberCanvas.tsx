import { useEffect, useRef, useCallback } from "react";

/* VFADigital Engine - CyberCanvas 3D v1.0
   Implementación Canvas 2D optimizada para Samsung A12 (gama media).
   Evita WebGL para maximizar compatibilidad y rendimiento mobile.
*/

const NEON_COLORS = ["#00FFFF", "#FF00FF", "#CCFF00", "#FF6600", "#AA00FF", "#00FF88"];

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; maxLife: number;
  size: number; color: string;
  type: "dot" | "square";
}

interface Node {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number; pulsePhase: number;
  color: string;
}

interface Burst {
  x: number; y: number;
  color: string;
  particles: Particle[];
  age: number;
}

export function CyberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const burstRef = useRef<Burst[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const timeRef = useRef(0);
  const isMobile = window.innerWidth < 768;

  const NODE_COUNT = isMobile ? 28 : 55;
  const MAX_DIST = isMobile ? 160 : 220;

  const project = (x: number, y: number, z: number, w: number, h: number) => {
    const fov = 600;
    const scale = fov / (fov + z);
    return {
      sx: x * scale + w / 2,
      sy: y * scale + h / 2,
      scale,
    };
  };

  const initNodes = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * w * 1.4,
        y: (Math.random() - 0.5) * h * 1.4,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 5 + 2,
        pulsePhase: Math.random() * Math.PI * 2,
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      });
    }
    nodesRef.current = nodes;
  }, [NODE_COUNT]);

  const spawnBurst = useCallback((clientX: number, clientY: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    const particles: Particle[] = [];
    const count = isMobile ? 20 : 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 2 + Math.random() * 5;
      const life = 40 + Math.random() * 40;
      particles.push({
        x: cx, y: cy, z: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * 3,
        life, maxLife: life,
        size: Math.random() * 6 + 2,
        color,
        type: Math.random() > 0.5 ? "square" : "dot",
      });
    }
    burstRef.current.push({ x: cx, y: cy, color, particles, age: 0 });
    if (burstRef.current.length > 5) burstRef.current.shift();
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = document.documentElement.scrollHeight;
      canvas.width = w;
      canvas.height = h;
      initNodes(w, h);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      /* Actualizar posición de nodos */
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;
        if (node.x > w * 0.7) node.vx *= -1;
        if (node.x < -w * 0.7) node.vx *= -1;
        if (node.y > h * 0.7) node.vy *= -1;
        if (node.y < -h * 0.7) node.vy *= -1;
        if (node.z > 300) node.vz *= -1;
        if (node.z < -300) node.vz *= -1;
      }

      /* Dibujar conexiones */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < MAX_DIST) {
            const pa = project(a.x, a.y, a.z, w, h);
            const pb = project(b.x, b.y, b.z, w, h);
            const alpha = (1 - dist / MAX_DIST) * 0.35 * Math.min(pa.scale, pb.scale);
            ctx.beginPath();
            ctx.moveTo(pa.sx, pa.sy);
            ctx.lineTo(pb.sx, pb.sy);
            ctx.strokeStyle = `rgba(204,255,0,${alpha})`;
            ctx.lineWidth = 0.7 * Math.min(pa.scale, pb.scale);
            ctx.stroke();
          }
        }
      }

      /* Dibujar nodos (cuadrados de tamaño variable) */
      for (const node of nodes) {
        const p = project(node.x, node.y, node.z, w, h);
        const pulse = Math.sin(t * 0.04 + node.pulsePhase) * 0.4 + 0.6;
        const size = node.size * p.scale * pulse;
        const alpha = 0.5 * p.scale * pulse;

        const hex = node.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b2 = parseInt(hex.slice(5, 7), 16);

        /* Glow */
        ctx.shadowBlur = 10 * p.scale;
        ctx.shadowColor = node.color;

        ctx.fillStyle = `rgba(${r},${g},${b2},${alpha})`;
        ctx.fillRect(p.sx - size / 2, p.sy - size / 2, size, size);

        ctx.strokeStyle = `rgba(${r},${g},${b2},${alpha * 1.6})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(p.sx - size / 2, p.sy - size / 2, size, size);

        ctx.shadowBlur = 0;
      }

      /* Dibujar bursts de partículas */
      burstRef.current = burstRef.current.filter(burst => burst.particles.some(p => p.life > 0));

      for (const burst of burstRef.current) {
        burst.age++;
        for (const p of burst.particles) {
          if (p.life <= 0) continue;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.93;
          p.vy *= 0.93;
          p.life--;

          const lifeRatio = p.life / p.maxLife;
          const hex = p.color;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b2 = parseInt(hex.slice(5, 7), 16);
          const alpha = lifeRatio * 0.9;

          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fillStyle = `rgba(${r},${g},${b2},${alpha})`;

          if (p.type === "square") {
            const sz = p.size * lifeRatio;
            ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.1, p.size * lifeRatio * 0.6), 0, Math.PI * 2);
            ctx.fill();
          }

          /* Líneas de circuito que brotan del burst */
          if (p.life > p.maxLife * 0.5 && burst.age < 20) {
            ctx.strokeStyle = `rgba(${r},${g},${b2},${alpha * 0.5})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(burst.x, burst.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }

          ctx.shadowBlur = 0;
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    /* Escuchar evento de explosión de partículas */
    const handleBurst = (e: Event) => {
      const { x, y, color } = (e as CustomEvent).detail;
      spawnBurst(x, y, color ?? NEON_COLORS[2]);
    };
    window.addEventListener("vfa:particle-burst", handleBurst);

    /* Explotar en cualquier click/tap de botón */
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) {
        const isTouch = e instanceof TouchEvent;
        const cx = isTouch ? (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
        const cy = isTouch ? (e as TouchEvent).changedTouches[0].clientY : (e as MouseEvent).clientY;
        const colors = NEON_COLORS;
        const color = colors[Math.floor(Math.random() * colors.length)];
        spawnBurst(cx, cy, color);
      }
    };
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("touchend", handleClick as EventListener, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("vfa:particle-burst", handleBurst);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchend", handleClick as EventListener);
    };
  }, [initNodes, spawnBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full pointer-events-none"
      style={{
        zIndex: 0,
        top: 0,
        left: 0,
        height: "100vh",
        opacity: 0.75,
      }}
      aria-hidden="true"
    />
  );
}
