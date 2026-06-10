<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement;
  let animFrame: number;

  interface Star {
    x: number;
    y: number;
    size: number;       // rayon de base
    points: number;     // branches (5 ou 6)
    vx: number;
    vy: number;
    rotation: number;
    vrot: number;
    opacity: number;
    opacityDir: number; // scintillement lent
    opacitySpeed: number;
    color: string;
  }

  const COLORS = [
    '#fbbf24', // amber — étoile classique
    '#f59e0b',
    '#fde68a',
    '#a78bfa', // violet
    '#7c3aed',
    '#2dd4bf', // teal
    '#ffffff',
  ];

  function randomStar(w: number, h: number, anywhere = false): Star {
    const big = Math.random() < 0.2;
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -20 - Math.random() * 100,
      size: big ? 10 + Math.random() * 14 : 3 + Math.random() * 5,
      points: Math.random() < 0.7 ? 5 : 6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: 0.08 + Math.random() * 0.18,
      rotation: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.004,
      opacity: 0.3 + Math.random() * 0.6,
      opacityDir: Math.random() < 0.5 ? 1 : -1,
      opacitySpeed: 0.002 + Math.random() * 0.004,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function drawStar(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    size: number, points: number,
    rotation: number, opacity: number, color: string
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? size : size * 0.42;
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();

    // Glow subtil sur les grandes étoiles
    if (size > 9) {
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 1.4;
    }

    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  }

  onMount(() => {
    const ctx = canvas.getContext('2d')!;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener('resize', resize);

    // ~60 étoiles : 12 grandes + 48 petites
    const stars: Star[] = Array.from({ length: 60 }, () => randomStar(w, h, true));

    function tick() {
      ctx.clearRect(0, 0, w, h);

      // Fond dégradé
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0,   '#0f2027');
      grad.addColorStop(0.5, '#203a43');
      grad.addColorStop(1,   '#2c5364');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        // Dérive
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.vrot;

        // Scintillement
        s.opacity += s.opacityDir * s.opacitySpeed;
        if (s.opacity > 0.85 || s.opacity < 0.15) s.opacityDir *= -1;

        // Légère ondulation horizontale
        s.x += Math.sin(s.y * 0.012) * 0.08;

        drawStar(ctx, s.x, s.y, s.size, s.points, s.rotation, s.opacity, s.color);

        // Recyclage en haut quand sortie par le bas
        if (s.y > h + 30) {
          Object.assign(s, randomStar(w, h, false));
          s.x = Math.random() * w;
        }
        // Rebond horizontal
        if (s.x < -30) s.x = w + 20;
        if (s.x > w + 30) s.x = -20;
      }

      animFrame = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      window.removeEventListener('resize', resize);
    };
  });

  onDestroy(() => {
    cancelAnimationFrame(animFrame);
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    display: block;
  }
</style>