<script lang="ts">
  import { count, range, times, sleep } from "@gbagan/utils";
  import { COLORS } from "../lib/constants";
  import Gauge, { type GiftSlot } from "./Gauge.svelte";
  import Gift from "./Gift.svelte";
  import { onMount, tick } from "svelte";
  import AnimatedBackground from "./AnimatedBackgroundConfetti.svelte";
    import Strategy from "./Strategy.svelte";

  const NTH_BEST = [
    "meilleur",
    "second meilleur",
    "troisième meilleur",
    "quatrième meilleur",
    "cinquième meilleur",
    "sixième meilleur",
    "septième meilleur",
    "pire"
  ];

  let phase: "0" | "1" | "open" | "choice" | "take" | "accept" = $state("0");
  let partyId = $state(0);
  let rejectedGifts = $state(0);
  let choice = $state<number | null>(null);
  let gifts = [40, 25, 31, 2, 70, 1, 60, 50];
  let flashColor = $state('transparent');
  let flashing = $state(false);
  let dialog = $state.raw(false);
  let dialogEl: HTMLDialogElement;


  const giftPosition = $derived(times(rejectedGifts, i =>
    0.5 * (8 - rejectedGifts) + count(gifts, (star, j) => j < rejectedGifts && star > gifts[i])
  ));

  const giftSlots: GiftSlot[] = $derived(gifts.map((gift, i) => (
    i === rejectedGifts && ["choice", "take"].includes(phase) ? { state: 'current', value: gift }
    : i < rejectedGifts ? { state: 'rejected', value: gift }
    : i === choice ? { state: 'taken', value: gift }
    : { state: 'upcoming' }
  )));

  async function start() {
    phase = "0";
    await sleep(500);
    phase = "1";
    await sleep(2000);
    phase = "open";
  }

  async function reject() {
    flash('rgba(239, 68, 68, 0.2)');
    rejectedGifts += 1;
    start();
  }

  async function take() {
    flash('rgba(52, 211, 153, 0.25)');
    const c = rejectedGifts;
    phase = "take"
    await sleep(3000);
    rejectedGifts = 8;
    phase = "accept";
    await sleep(1000);
    choice = c;
  }

  function restart() {
    choice = null;
    partyId++;
    rejectedGifts = 0;
    start();
  }

  async function flash(color: string) {
    flashColor = color;
    flashing = true;
    await new Promise(r => setTimeout(r, 300));
    flashing = false;
  }

  async function openDialog() {
    dialog = true;
    await tick();
    dialogEl.showModal(); 
  }

  function closeDialog() {
    dialog = false;
    dialogEl.close();
  }

  onMount(() => {
    start();
  });

/*
{#snippet gift(color: number)}
  <rect x="0" y="8" width="52" height="54" rx="3" fill="#c1121f"/>
  <polygon points="52,8 66,0 66,54 52,62" fill="#8a0e16"/>
  <polygon points="0,8 52,8 66,0 14,0" fill="#e63946"/>
  <rect x="0" y="28" width="52" height="8" fill="#ffd60a"/>
  <rect x="22" y="8" width="8" height="54" fill="#ffd60a"/>
  <polygon points="52,28 66,20 66,36 52,36" fill="#ffd60a" opacity="0.7"/>
  <ellipse cx="26" cy="4" rx="9" ry="6" fill="#ffd60a"/>
  <ellipse cx="26" cy="4" rx="5" ry="3" fill="#e6b800"/>
  <ellipse cx="30" cy="64" rx="26" ry="4" fill="#000" opacity="0.3"/>
{/snippet}

{#snippet giftView(box: string, ribbon: string)}
  <rect x="0" y="8" width="52" height="54" rx="3" fill={box}/>
  <polygon points="52,8 66,0 66,54 52,62" fill="color-mix(in srgb, {box} 75%, black)"/>
  <polygon points="0,8 52,8 66,0 14,0" fill="color-mix(in srgb, {box} 80%, white)"/>
  <rect x="0" y="28" width="52" height="8" fill={ribbon}/>
  <rect x="22" y="8" width="8" height="54" fill={ribbon}/>
  <polygon points="52,28 66,20 66,36 52,36" fill={ribbon} opacity="0.7"/>
  <ellipse cx="26" cy="4" rx="9" ry="6" fill={ribbon} />
  <ellipse cx="26" cy="4" rx="5" ry="3" fill="color-mix(in srgb, {ribbon} 75%, black)"/>
  <ellipse cx="30" cy="64" rx="26" ry="4" fill="#000" opacity="0.3"/>
{/snippet}

*/
</script>

{#snippet svg()}
  <svg viewBox="0 0 1000 750">
    <defs>
      <clipPath id="topClip">
        <rect x="-300" y="600" width="1000" height="100" />
      </clipPath>
      <clipPath id="giftClip">
        <rect x="0" y="0" width="1000" height="750" />
      </clipPath>
    </defs>
    <g clip-path="url(#topClip)">
      <g
        style:transform={
          phase === "1"
          ? "translate(400px, 600px)"
          : "translate(0px, 600px)"
          
        }
        style:transition={
          phase === "0" ? "none"
          : phase === "1" ? "transform 2s linear"
          : "none"
        }
      >
        {#each range(-10, 20) as i}
          <polygon
            points="{50*i},0 {50*(i+1)},0 {50*(i+1)-24},70 {50*i-24},70"
            fill={i % 2 === 0 ? "#3a2810" : "#4e3820"}
            opacity={i % 2 === 0 ? "1" : "0.9"}
          />
        {/each}
      </g>
    </g>
    <rect
      x="700"
      y="100"
      width="290"
      height="600"
      rx="10"
      ry="10"
      stroke-width="5"
      stroke="var(--amber-400)"
      fill="var(--slate-700)"
    />
    <g clip-path="url(#giftClip)">
      {#key partyId}
        {#each gifts as gift, i}
          <g
            style:transform={
              i < rejectedGifts
              ? `translate(780px, ${120 + 70 * giftPosition[i]}px`
              : i === rejectedGifts && phase === "take"
              ? "translate(300px, 200px) scale(3)" 
              : i === rejectedGifts && ["1", "open", "choice"].includes(phase) 
              ? "translate(300px, 550px) scale(1.5)"
              : "translate(-100px, 550px) scale(1.5)"
            }
            style:transition={
              i < rejectedGifts ? "transform 600ms linear"
              : phase === "1" ? "transform 2s linear"
              : phase === "take" ? "transform 800ms linear"
              : "none"
            }
          >
            <Gift
              box={COLORS[i].box}
              ribbon={COLORS[i].ribbon}
              value={gifts[i]}
              canOpen={i === rejectedGifts && phase === "open"}
              onreveal={() => phase = "choice"}
              showStars={i == rejectedGifts}
            />
            {#if i < rejectedGifts}
              <text
                x="80"
                y="50"
                class="rejected-score"
              >
                {gift}⭐
              </text>
            {/if}
            {#if i === choice}
              <image
                x="-50"
                href="./check.svg"
                width="50"
                height="50"
              />
            {/if}
          </g>
        {/each}
      {/key}
    </g>
  </svg>
{/snippet}

<div class="app">
  <AnimatedBackground />
  {#if flashing}
    <div class="flash" style="background: {flashColor}"></div>
  {/if}
  <div class="container">
    {@render svg()}
    <div class="overlay">
      <div class="gauge-container">
        <Gauge gifts={giftSlots} total={8} />
      </div>
      {#if phase === "choice"}
        <div class="choice-text">
          <p>Le cadeau contient {gifts[rejectedGifts]} <span class="choice-text-star">⭐</span></p>
        </div>
        <button class="ui-button accept" onclick={take}>🎁 Je le prends!</button>
        <button class="ui-button reject" onclick={reject} disabled={rejectedGifts >= 7}>❌ Je le rejette</button>
      {:else if phase === "open"}
        <div class="open-text">
          <p>Clique sur le cadeau pour l'ouvrir!</p>
        </div>
      {:else if choice !== null}
        {@const position = giftPosition[choice]}
        {@const msg =
          position === 0
          ? "Bravo"
          : position <= 3
          ? "Pas mal"
          : "Dommage"
        }
        <div class="endgame-text">
          <p>{msg}! Tu as fait le {NTH_BEST[position]} choix</p>
        </div>
        <button class="ui-button restart" onclick={restart}>Recommencer</button>
        <button class="ui-button tips" onclick={openDialog}>Astuces</button>
      {/if}
    </div>
  </div>
</div>
<dialog class="dialog" bind:this={dialogEl}>
  {#if dialog}
    <Strategy {closeDialog} />
  {/if}
</dialog>

<style>
  .app {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    min-height: 100vh;
  }

  .container {
    position: relative;
    aspect-ratio: 4 / 3;
  }

  .flash {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    animation: flashFade 0.3s ease-out forwards;
  }
 
  @keyframes flashFade {
    0%   { opacity: 1; }
    100% { opacity: 0; }
  }

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  svg {
    width: 100%;
    display: block;
    height: 100vh;
    max-width: 100%;
    object-fit: contain; /* ou utiliser viewBox */
  }

  .gauge-container {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .ui-button {
    width: 13rem;
    background-color: var(--violet-500);
    color: var(--slate-100);
    font-size: 1.5rem;
    font-weight: 600;
    font-family: var(--handwritten);
    padding: 1rem 2rem;
    border-radius: 1rem;
    border: none;
    box-shadow: var(--shadow-md);
    transition: all 200ms ease;
    cursor: pointer;
    pointer-events: auto;
  
    &:hover, &:active {
      background: var(--violet-600);
      box-shadow: var(--shadow-lg);
    }

    &:disabled {
      cursor: not-allowed;
      background: var(--violet-300);
      opacity: 0.3;
    }

    &.accept {
      position: absolute;
      width: fit-content;
      left: 5%;
      top: 50%;
    }

    &.reject {
      position: absolute;
      width: fit-content;
      left: 40%;
      top: 50%;
    }

    &.restart {
      position: absolute;
      left: 5%;
      top: 50%;
    }

    &.tips {
      position: absolute;
      left: 40%;
      top: 50%;
    }
  }

  .rejected-score {
    font-size: 32px;
    fill: var(--slate-100);
    font-family: var(--handwritten);
  }

  .open-text {
    position: absolute;
    left: 10%;
    top: 65%;
    width: 60%;
    font-size: 2rem;
    font-family: var(--handwritten);
  }

  .choice-text {
    position: absolute;
    left: 5%;
    top: 30%;
    width: 60%;
    height: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-family: var(--handwritten);
  }

  .choice-text-star {
    display: inline-block;
    animation: bounce 0.6s ease infinite;
  }

  .endgame-text {
    position: absolute;
    left: 10%;
    top: 20%;
    width: 60%;
    height: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-family: var(--handwritten);
  }

  .dialog {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: max-content;
    background: #0D0B28;
    border: 1.5px solid #534AB7;
    border-radius: 20px;
    padding: 0;
    overflow: hidden;
    animation: popIn .35s cubic-bezier(.34,1.56,.64,1);
  }

  .dialog::backdrop {
    background-color: rgb(107 114 128 / 0.7);
  }

  @keyframes popIn {
    from { transform: translate(-50%, -50%) scale(.8); opacity: 0; }
    to   { transform: translate(-50%, -50%) scale(1);  opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }

    30% {
      transform: translateY(-1.25rem);
    }

    60% {
      transform: translateY(0);
    }

    80% {
      transform: translateY(-0.5rem);
    }
  }
</style>