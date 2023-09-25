<script>
  import Game from "./components/Game.svelte";
  import Header from "./components/header/Header.svelte";
  // import StartScreen from "./components/StartScreen.svelte";
  import { newGame, showMenu, selectedDifficulty } from "./stores";


  //? From package.json
  // "rollup-plugin-workbox": "^6.2.2",
  // "svelte-carousel": "^1.0.25"
</script>

<main>
  <Header />
  {#if showMenu}
    <!-- <StartScreen /> -->
    <Game newGame={$newGame} />
  {:else}
    <Game newGame={$newGame} />
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: var(--background);

    user-select: none;
  }
</style>
