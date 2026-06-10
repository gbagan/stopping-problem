<script lang="ts">
  import { times } from '@gbagan/utils';
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement;
  let animFrame: number;

  interface Star {
    x: number;
    y: number;
    size: number;
    points: number;       // 5 ou 6 branches
    vx: number;
    vy: number;
    rotation: number;
    vrot: number;
    opacity: number;
    wobble: number;       // phase d'ondulation horizontale
    wobbleSpeed: number;
    wobbleAmp: number;
    color: string;
  }

  const COLORS = [
    '#fbbf24', '#f59e0b', '#fde68a', // amber
    '#a78bfa', '#7c3aed',             // violet
    '#2dd4bf',                         // teal
    '#ffffff',
  ];

  function randomStar(w: number, h: number, anywhere = false): Star {
    const big = Math.random() < 0.2;
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -20 - Math.random() * 200,
      size: big ? 10 + Math.random() * 14 : 3 + Math.random() * 5,
      points: Math.random() < 0.7 ? 5 : 6,
      vx: (Math.random() - 0.5) * 0.6,
      vy: big ? 0.6 + Math.random() * 0.8 : 1.2 + Math.random() * 1.6,
      rotation: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.03,
      opacity: 0.4 + Math.random() * 0.55,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      wobbleAmp: big ? 0.4 + Math.random() * 0.8 : 0.15 + Math.random() * 0.4,
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

    if (size > 9) {
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 1.6;
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

    // 70 étoiles : ~14 grandes, ~56 petites
    const stars: Star[] = times(70, () => randomStar(w, h, true));

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
        // Chute
        s.y += s.vy;
        s.rotation += s.vrot;

        // Ondulation gauche/droite (mouvement de feuille qui tombe)
        s.wobble += s.wobbleSpeed;
        s.x += s.vx + Math.sin(s.wobble) * s.wobbleAmp;

        drawStar(ctx, s.x, s.y, s.size, s.points, s.rotation, s.opacity, s.color);

        // Recyclage
        if (s.y > h + 30) {
          Object.assign(s, randomStar(w, h, false));
        }
        if (s.x < -30)    s.x = w + 20;
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