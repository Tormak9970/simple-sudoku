<script>
  import Game from "./lib/Game.svelte";
  import ThemeController from "./lib/header/ThemeController.svelte";
  import StartScreen from "./lib/StartScreen.svelte";
  import { newGame, renderIdx, selectedDiff } from "./stores";

</script>

<main>
  <div class="theme-cont">
    <ThemeController />
  </div>
  {#if $renderIdx == 0}
    <StartScreen />
  {:else}
    <Game difficulty={$selectedDiff} newGame={$newGame} />
  {/if}
</main>

<style>
  @import 'themes.css';

  main {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: var(--background);
  }

  .theme-cont {
    width: min(60vh, 90vw);
    height: 5vh;

    display: flex;
    justify-content: flex-end;
  }
</style>
