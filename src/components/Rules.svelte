<script lang="ts">
    import Button from "./Button.svelte";

  type Props = {
    startGame: () => void;
  }
 
  let { startGame }: Props = $props();
</script>

<div class="wrapper">
  <div class="container">
    <h1>Les Cadeaux Mystère</h1>

    <p>Tu reçois 8 cadeaux un par un. Chaque cadeau contient un certain nombre d'étoiles ⭐, mais tu ne sais pas ce qui t'attend !</p>
    <p><strong>À chaque cadeau, tu choisis :</strong></p>
    <ul>
      <li>🎁 <strong>Je le prends</strong> → la partie s'arrête, c'est ton score</li>
      <li>❌ <strong>Je le rejette</strong> → il disparaît, tu passes au suivant</li>
    </ul>

    <p><strong>Attention:</strong> un cadeau rejeté est <strong>perdu pour toujours</strong>.
      Et si tu arrives au 8ème, tu es obligé de le prendre.
    </p>
    <p><strong>Objectif : repartir avec le cadeau qui a le plus d'étoiles !</strong></p>


    <p>🧮 Il existe une vraie stratégie mathématique pour maximiser tes chances… sauras-tu la trouver ?</p>

    <Button onclick={startGame}>Commencer</Button>
  </div>
</div>

<style>
  .wrapper {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    aspect-ratio: 4 / 3;
    height: 100vh;
    background: var(--slate-700);
    color: var(--slate-100);
    font-family: var(--handwritten);
    padding: 1rem;
  }

  h1 {
    text-align: center;
    font-size: 3rem;
    font-weight: bold;
    padding: 1rem;
  }

  p, li {
    font-size: 1.5rem;
    margin: 1rem;
  }

  strong {
    color: var(--amber-300);
  }

  ul {
    padding-left: 1rem;
  }
</style>