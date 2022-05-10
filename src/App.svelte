<script>
  import Game from "./lib/Game.svelte";
  import ThemeController from "./lib/header/ThemeController.svelte";
</script>

<main>
  <div class="theme-cont">
    <ThemeController />
  </div>
  <Game difficulty="medium" newGame />
</main>

<style>
  @import 'themes.css';

  main {
    width: 100%;
    height: calc(100% - 5vh);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: var(--background);
  }

  .theme-cont {
    width: 90%;
    height: 5vh;

    display: flex;
    justify-content: flex-end;
  }
</style>
