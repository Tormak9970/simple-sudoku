<script>
  import Game from "./lib/Game.svelte";
</script>

<main>
  <Game difficulty="medium" newGame />
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
</style>
