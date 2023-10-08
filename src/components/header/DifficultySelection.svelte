<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import DifficultyOption from "./DifficultyOption.svelte";
  import { selectedDifficulty } from "../../stores";
  import type { Unsubscriber } from "svelte/store";

  export let difficulties: string[];

  let selectedDifficultyUnsub: Unsubscriber;

  let easyBoundingBox: () => DOMRect;
  let mediumBoundingBox: () => DOMRect;
  let hardBoundingBox: () => DOMRect;
  let expertBoundingBox: () => DOMRect;

  const difficultyBoundingBoxLUT = {
    "easy": easyBoundingBox,
    "medium": mediumBoundingBox,
    "hard": hardBoundingBox,
    "expert": expertBoundingBox
  }

  let diffSelectorContainer: HTMLDivElement;

  let selectionLeft = 9;
  let selectionTop = 9;
  let selectionWidth = 39;
  let readyToRender = false;

  /**
   * Handles setting the position of the difficulty indicator.
   * @param difficulty The current difficulty.
   */
  function handleDifficultyChange(difficulty: string): void {
    const startingBoundingBox = difficultyBoundingBoxLUT[difficulty]();

    const containerBoundingBox = diffSelectorContainer.getBoundingClientRect();
    selectionTop = startingBoundingBox.top - containerBoundingBox.top;
    selectionLeft = startingBoundingBox.left - containerBoundingBox.left;
    selectionWidth = startingBoundingBox.right - startingBoundingBox.left - 20;
  }

  onMount(() => {
    selectedDifficultyUnsub = selectedDifficulty.subscribe((difficulty: string) => {
      handleDifficultyChange(difficulty.toLowerCase());
    });
    setTimeout(() => {
      readyToRender = true;
    });
  });

  onDestroy(() => {
    if (selectedDifficultyUnsub) selectedDifficultyUnsub();
  })
</script>

<div class="difficulty-selector" bind:this={diffSelectorContainer}>
  <div class="difficulty-options">
    {#each difficulties as difficulty}
      <DifficultyOption difficulty={difficulty} bind:getButtonBoundingBox={difficultyBoundingBoxLUT[difficulty.toLowerCase()]} />
    {/each}
  </div>
  <div class="selection-indicator" style="top: {selectionTop}px; left: {selectionLeft}px; width: {selectionWidth}px" class:transition={readyToRender} />
</div>

<style>
  .difficulty-selector {
    width: 100%; /* may need this to be hardcoded like px or vw etc*/

    display: flex;
    flex-direction: row;
    align-items: center;

    margin-top: 2px;

    position: relative;
  }

  .difficulty-options {
    z-index: 2;
    position: absolute;
    height: 100%;
    
		display: flex;
		flex-direction: row;
		align-items: center;

    top: -2px;
  }

  .selection-indicator {
    z-index: 1;

    height: 20px;
    padding: 2px 10px;
    border-radius: 50px;

    position: absolute;

    background-color: var(--highlight);
  }

  .transition {
    transition: left 0.2s ease-in-out;
  }
</style>

