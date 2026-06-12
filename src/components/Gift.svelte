<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicOut, backOut } from 'svelte/easing';
  import { sleep, times } from '@gbagan/utils';

  interface Props {
    color: string;
    value: number;
    canOpen: boolean;
    showStars: boolean;
    onreveal?: () => void;
  }

  let { color, value, showStars, canOpen, onreveal }: Props = $props();

  // Phase : 'idle' | 'shaking' | 'opening' | 'revealed'
  let phase = $state<'idle' | 'shaking' | 'opening' | 'revealed'>('idle');

  // Couvercle : monte vers le haut
  const lidY      = new Tween(0,   { duration: 500, easing: cubicOut });
  const lidOpacity = new Tween(1,  { duration: 300, easing: cubicOut });

  // Score : apparaît depuis le centre
  const scoreScale   = new Tween(0, { duration: 400, easing: backOut });
  const scoreOpacity = new Tween(0, { duration: 300, easing: cubicOut });

  // Étoiles qui jaillissent
  let stars = $state<{ x: number; y: number; r: number; delay: number }[]>([]);

  // Shake via CSS class
  let shaking = $state(false);

  async function open() {
    if (!canOpen || phase !== 'idle') return;

    // 1. Shake
    phase = 'shaking';
    shaking = true;
    await sleep(600);
    shaking = false;

    // 2. Soulever le couvercle
    phase = 'opening';
    await Promise.all([
      lidY.set(-55),
      lidOpacity.set(0, { delay: 200 }),
    ]);

    // 3. Faire apparaître les étoiles
    stars = times(8, i => ({
      x: 33 + Math.cos((i / 8) * Math.PI * 2) * 38,
      y: 35 + Math.sin((i / 8) * Math.PI * 2) * 30,
      r: 3 + Math.random() * 3,
      delay: i * 40,
    }));

    // 4. Révéler le score
    phase = 'revealed';
    await Promise.all([
      scoreScale.set(1),
      scoreOpacity.set(1),
    ]);

    onreveal?.();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<g>
  <svg
    onclick={open}
    viewBox="-14 -12 100 90"
    width="80"
    height="80"
    x="0"
    y="0"
    class={{shaking}}
  >
    <image
      href="./gift-box-{color}.avif"
      width={48*1.5}
    />

    <!-- ── ÉTOILES qui jaillissent ── -->
    {#each stars as s}
      <circle cx={s.x} cy={s.y} r={s.r} fill="#fbbf24"
        style="animation: starPop 0.5s {s.delay}ms both"
      />
    {/each}

    <!-- ── SCORE -->
    {#if (phase === 'revealed' || phase === 'opening') && showStars}
      <g transform="translate(26, 38)" style="transform-origin: 26px 38px">
        <text
          x="80" y="0"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="24"
          font-weight="700"
          fill="#fbbf24"
          style="
            transform: scale({scoreScale.current});
            opacity: {scoreOpacity.current};
            transform-origin: 0 0;
            filter: drop-shadow(0 0 4px rgba(251,191,36,0.6));
          "
        >{value}⭐</text>
      </g>
    {/if}

    <!-- ── COUVERCLE (translate vers le haut) ── -->
    <g transform="translate(0, {lidY.current})" opacity={lidOpacity.current}>
      <image
        href="./gift-lid-{color}.avif"
        width={48*1.5}
        y="-13"
        x="-1"
        transform="scale(1.02 0.66)"
      />
    </g>
  </svg>
</g>

<style>
  svg {
    overflow: visible;
  }

  @keyframes -global-starPop {
    0%   { transform: scale(0) translate(0, 0); opacity: 1; }
    60%  { opacity: 1; }
    100% { transform: scale(1.2) translate(0, 0); opacity: 0; }
  }

  @keyframes shake {
    0%,100% { transform: rotate(0deg); }
    15%     { transform: rotate(-6deg) translateX(-3px); }
    30%     { transform: rotate(6deg)  translateX(3px); }
    45%     { transform: rotate(-5deg) translateX(-2px); }
    60%     { transform: rotate(5deg)  translateX(2px); }
    75%     { transform: rotate(-3deg); }
    90%     { transform: rotate(3deg); }
  }

  .shaking {
    animation: shake 0.6s ease-in-out;
    transform-origin: center bottom;
  }
</style>