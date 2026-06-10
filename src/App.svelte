<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./components/Game.svelte";
  import Rules from "./components/Rules.svelte";
  import { fade } from "svelte/transition";

  let phase: "home" | "rules" | "game" = $state.raw("home");
  let tid: number;

  function startGame() {
    phase = "game";
  }

  function goRules() {
    phase = "rules";
  }

  onMount(() => {
    tid = setTimeout(() => {
      phase = "home";
    }, 60000)
  });

  function resetTimer() {
    clearTimeout(tid);
    tid = setTimeout(() => {
      phase = "home";
    }, 60000);
  }

</script>

<svelte:window onclick={resetTimer} />

{#if phase === "home"}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="home" onclick={goRules} transition:fade></div>
{:else if phase === "rules"}
  <div transition:fade>
    <Rules {startGame} />
  </div>
{:else}
  <div transition:fade>
    <Game />
  </div>
{/if}

<style>
  .home {
    height: 100vh;
    width: 100vw;
    background: url("./src/images/home.avif");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>