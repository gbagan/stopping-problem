<script lang="ts">
  import Button from "./Button.svelte";
  type Props = {
    closeDialog: () => void;
  }

  let {closeDialog}: Props = $props();
</script>

<div class="title"> La stratégie des 37%</div>
<div class="body">
  <p><strong>L'idée:</strong> tu ne peux pas choisir intelligemment sans d'abord savoir ce qui est "bien".
  Il faut explorer avant de décider.</p>
  <p><strong>La règle:</strong> avec 8 cadeaux, rejette systématiquement les 3 premiers — ils servent d'étalon.
  Ensuite, prends le premier cadeau qui dépasse le meilleur de ces 3 là.</p>
  <p><strong>Pourquoi 3 ?</strong>
    Les maths montrent que le point d'équilibre idéal entre "explorer assez" et
    "ne pas attendre trop longtemps" tombe à 37% du total. 37% de 8 ≈ 3.</p>
   <p><strong>Le résultat:</strong> sans stratégie tu as 1 chance sur 8 (12,5%) de trouver le meilleur cadeau.
    Avec cette règle, tu passes à environ 37% — trois fois mieux !</p>
</div>
<div class="buttons">
  <Button onclick={closeDialog}>Ok</Button>
</div>

<style>
  .title {
    font-size: 2.5rem;
    font-weight: 500;
    color: var(--slate-100);
    font-family: var(--handwritten);
    padding: 1rem;
  }

  .body {
    width: 45rem;
    padding: 0 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: var(--slate-100);
    font-family: var(--handwritten);
    font-size: 1.5rem;
  }

  strong {
    color: var(--amber-300);
  }

  .buttons {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
</style>