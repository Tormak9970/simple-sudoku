<script lang="ts">
  import { spring } from "svelte/motion";

  export let stiffness = 0.2;
  export let damping = 0.1;
  export let min = 95;
  export let max = 100;
  export let shouldAnimate = true;
  export let onClick: () => void;

  //? This is used because stores don't update instantly, so setting size would allow size and selection to get out of sync.
  let backupSize = min;
  let size = spring(min, { stiffness: stiffness, damping: damping });

  function click() {
    onClick();

    if (shouldAnimate) {
      backupSize = backupSize === min ? max : min;
      size.set(backupSize);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="bounding-box" on:click={click}>
  <div class="positioner" style="width: {$size}%; height: {$size}%;">
    <slot />
  </div>
</div>

<style>
  .bounding-box {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .positioner {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>