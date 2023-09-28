<script>
  import Game from "./components/Game.svelte";
  import Header from "./components/header/Header.svelte";
  import RestartModal from "./components/modals/RestartModal.svelte";
  import VictoryModal from "./components/modals/VictoryModal.svelte";
  import StartScreen from "./components/StartScreen.svelte";
  import { newGame, showMenu, showRestartModal, showVictoryModal } from "./stores";
</script>

<main>
  <Header />
  {#if showMenu}
    <StartScreen />
  {:else}
    <Game newGame={$newGame} />
  {/if}
  {#if $showRestartModal}
    <RestartModal />
  {/if}
  {#if $showVictoryModal}
    <VictoryModal />
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
