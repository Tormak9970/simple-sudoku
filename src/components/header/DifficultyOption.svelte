<script lang="ts">
  import { selectedDifficulty } from "../../stores";
  
  export let difficulty: string;

  let difficultyElem: HTMLDivElement;

  export const getButtonBoundingBox = (): DOMRect => {
    return difficultyElem.getBoundingClientRect();
  }

  function setDifficulty(): void {
    $selectedDifficulty = difficulty.toLowerCase();
  }
</script>

<div class="difficulty-option">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class:rendered={$selectedDifficulty === difficulty.toLowerCase()} class="difficulty-btn" on:click={setDifficulty} bind:this={difficultyElem}>
    <div class="label">{difficulty}</div>
  </div>
</div>

<style>
  .difficulty-option {
		height: 100%;
		padding: 0px 9px;

		display: flex;
		flex-direction: column;
		justify-content: center;
    align-items: center;

    cursor: pointer;
	}

	.difficulty-btn {
		color: var(--font-color);
		text-decoration: none;

    height: 24px;
    padding: 2px 10px;
    border-radius: 50px;

    
		display: flex;
		flex-direction: column;
		justify-content: center;
    align-items: center;
    
    cursor: pointer;
	}
</style>
