<script lang="ts">
  import { count, range, times, sleep } from "@gbagan/utils";
  import { COLORS } from "./lib/constants";

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

  let phase: "start" | "0" | "1" | "choice" | "accept" = $state("start");
  let rejectedGifts = $state(0);
  let choice = $state<number | null>(null);

  let gifts = [40, 25, 31, 2, 70, 1, 60, 50];

  const giftPosition = $derived(times(rejectedGifts, i =>
    0.5 * (8 - rejectedGifts) + count(gifts, (star, j) => j < rejectedGifts && star > gifts[i])
  ));

  async function start() {
    phase = "0";
    await sleep(500);
    phase = "1";
    await sleep(2000);
    phase = "choice";
  }

  async function reject() {
    rejectedGifts += 1;
    start();
  }

  async function accept() {
    const c = rejectedGifts;
    rejectedGifts = 8;
    phase = "accept";
    await sleep(1000);
    choice = c;
  }

  function restart() {
    choice = null;
    rejectedGifts = 0;
    start();
  }

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
*/
</script>

<div class="app-container">
</div>

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

{#snippet svg()}
  <svg viewBox="0 0 1000 750">
    <defs>
      <clipPath id="topClip">
        <rect x="0" y="600" width="600" height="100" />
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
      {#each gifts as gift, i}
          <g
            style:transform={
              i < rejectedGifts
              ? `translate(780px, ${120 + 70 * giftPosition[i]}px`
              : i === rejectedGifts && (phase === "1" || phase === "choice") 
              ? "translate(300px, 550px) scale(1.5)"
              : "translate(-100px, 550px) scale(1.5)"
            }
            style:transition={
              i < rejectedGifts ? "transform 600ms linear"
              : phase === "1" ? "transform 2s linear"
              : "none"
            }
          >
            {@render giftView(COLORS[i].box, COLORS[i].ribbon)}
            {#if i < rejectedGifts}
              <text
                x="100"
                y="42"
                class="rejected-score"
              >
                {gift}
              </text>
            {/if}
            {#if i === choice}
              <image
                x="-50"
                href="./src/images/check.svg"
                width="50"
                height="50"
              />
            {/if}
          </g>
      {/each}
    </g>
  </svg>
{/snippet}

<div class="app">
  <div class="container">
    {@render svg()}
    <div class="overlay">
      {#if phase === "start"}
        <button class="ui-button start" onclick={start}>Commencer</button>
      {:else if phase === "choice"}
        <div class="choice-text">
          <p>Le cadeau contient {gifts[rejectedGifts]}</p>
          <img
            class="gift-star"
            src="./src/images/star.avif"
            alt="Etoile"
          />
        </div>
        <button class="ui-button accept" onclick={accept}>Accepter</button>
        <button class="ui-button reject" onclick={reject}>Rejeter</button>
      {:else if choice !== null}
        {@const position = giftPosition[choice]}
        {@const msg =
          position === 0
          ? "Bravo"
          : position <= 3
          ? "Pas mal"
          : "Dommage"
        }
        <div class="choice-text">
          <p>{msg}! Tu as fait le {NTH_BEST[position]} choix</p>
        </div>
        <button class="ui-button restart" onclick={restart}>Recommencer</button>
        <button class="ui-button tips">Astuces</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .app {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    width: 100vw;
    min-height: 100vh;
  }

  .container {
    position: relative;
    aspect-ratio: 4 / 3;
  }

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  svg {
    display: block;
    width: 100%;
    height: 100vh;
    max-width: 100%;
    object-fit: contain; /* ou utiliser viewBox */
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
  
    &:hover, &:active {
      background-color: var(--violet-600);
      box-shadow: var(--shadow-lg);
    }

    &.start {
      position: absolute;
      left: 30%;
      top: 50%;
    }

    &.accept {
      position: absolute;
      left: 5%;
      top: 50%;
    }

    &.reject {
      position: absolute;
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
    font-family: "Shantell Sans";
  }

  .choice-text {
    position: absolute;
    left: 5%;
    top: 30%;
    width: 50%;
    height: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-family: "Shantell Sans";
  }

  .gift-star {
    display: inline;
    width: 6rem;
    height: 6rem;
  }
</style>