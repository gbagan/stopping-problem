<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    onclick: () => void;
    children: Snippet;
  }

  let {onclick, children}: Props = $props();
</script>

<button {onclick}>{@render children?.()}</button>

<style>
  button {
    display: block;
    margin: 0 auto;
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
  }
</style>