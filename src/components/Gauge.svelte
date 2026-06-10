<script lang="ts">
  type GiftState = 'upcoming' | 'current' | 'taken' | 'rejected';
 
  export interface GiftSlot {
    state: GiftState;
    value?: number;
  }
 
  interface Props {
    gifts: GiftSlot[];
    total?: number;
  }
 
  let { gifts, total = 8 }: Props = $props();
 
  const currentIndex = $derived(gifts.findIndex(g => g.state === 'current'));
  const bestRejected = $derived(
    Math.max(0, ...gifts.filter(g => g.state === 'rejected' && g.value !== undefined).map(g => g.value!))
  );
</script>
 
<div class="gauge">
  <div class="slots">
    {#each { length: total } as _, i}
      {@const gift = gifts[i] ?? { state: 'upcoming' }}
      {@const isCurrent = gift.state === 'current'}
      {@const isBest = gift.state === 'rejected' && gift.value === bestRejected && bestRejected > 0}
      <div
        class="slot"
        class:current={isCurrent}
        class:rejected={gift.state === 'rejected'}
        class:taken={gift.state === 'taken'}
        class:upcoming={gift.state === 'upcoming'}
        class:best={isBest}
      >
        <div class="gift-icon">
          {#if gift.state === 'upcoming'}
            <span class="icon faded">🎁</span>
          {:else if gift.state === 'current'}
            <span class="icon pulse">🎁</span>
          {:else if gift.state === 'taken'}
            <span class="icon">🎁</span>
          {:else}
            <span class="icon dim">🎁</span>
          {/if}
        </div>
 
        <div class="gift-value">
          {#if gift.state === 'upcoming'}
            <span class="unknown">?</span>
          {:else if gift.state === 'current'}
            <span class="value current-value">{gift.value} ⭐</span>
          {:else if gift.state === 'taken'}
            <span class="value taken-value">✓ {gift.value}</span>
          {:else}
            <span class="value rejected-value" class:best-value={isBest}>
              {isBest ? '★' : '✗'} {gift.value}
            </span>
          {/if}
        </div>
 
        <div class="gift-number">{i + 1}</div>
      </div>
    {/each}
  </div>
 
  {#if currentIndex >= 0 && bestRejected > 0}
    <div class="hint">
      Meilleur rejeté : <strong>{bestRejected} ⭐</strong>
    </div>
  {/if}
</div>
 
<style>
  .gauge {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 0;
  }
 
  .slots {
    display: flex;
    gap: 0.375rem;
    justify-content: center;
    flex-wrap: wrap;
  }
 
  .slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 8px 6px 6px;
    border-radius: 10px;
    width: 5rem;
    border: 1px solid transparent;
    transition: all 0.2s ease;
  }
 
  /* États */
  .slot.upcoming {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
    opacity: 0.5;
  }
 
  .slot.current {
    background: rgba(234, 179, 8, 0.15);
    border-color: rgba(234, 179, 8, 0.5);
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(234, 179, 8, 0.2);
  }
 
  .slot.rejected {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
 
  .slot.best {
    border-color: rgba(234, 179, 8, 0.4);
    background: rgba(234, 179, 8, 0.08);
  }
 
  .slot.taken {
    background: rgba(20, 184, 166, 0.15);
    border-color: rgba(20, 184, 166, 0.5);
  }
 
  /* Icône */
  .gift-icon {
    font-size: 1.75rem;
    line-height: 1;
  }
 
  .icon.faded { opacity: 0.3; font-size: 1.25rem; }
  .icon.dim   { opacity: 0.5; font-size: 1.5rem; }
 
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.12); }
  }
  .icon.pulse {
    display: inline-block;
    animation: pulse 1.6s ease-in-out infinite;
  }
 
  /* Valeurs */
  .gift-value {
    font-size: 0.8rem;
    font-weight: 500;
    min-height: 1rem;
    text-align: center;
    line-height: 1.2;
  }
 
  .unknown        { color: rgba(255, 255, 255, 0.2); }
  .current-value  { color: #fbbf24; }
  .taken-value    { color: #2dd4bf; }
  .rejected-value { color: rgba(255, 255, 255, 0.35); }
  .best-value     { color: #fbbf24 !important; }
 
  /* Numéro */
  .gift-number {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.2);
    font-variant-numeric: tabular-nums;
  }
 
  .slot.current .gift-number {
    color: rgba(251, 191, 36, 0.6);
  }
 
  /* Hint meilleur rejeté */
  .hint {
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
    padding-top: 0.25rem;
  }
  .hint strong {
    color: #fbbf24;
  }
</style>