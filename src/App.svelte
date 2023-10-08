<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  
  import { get, set } from "idb-keyval";

  import Game from "./components/Game.svelte";
  import Header from "./components/header/Header.svelte";
  import RestartModal from "./components/modals/RestartModal.svelte";
  import VictoryModal from "./components/modals/VictoryModal.svelte";
  import StartScreen from "./components/StartScreen.svelte";
  import { bestTime, newGame, selectedDifficulty, showLoadErrorModal, showMenu, showRestartModal, showVictoryModal, theme } from "./stores";
  import LoadErrorModal from "./components/modals/LoadErrorModal.svelte";

  let difficultyUnsub: Unsubscriber;
  let themeUnsub: Unsubscriber;

  onMount(() => {
    difficultyUnsub = selectedDifficulty.subscribe(async (difficulty: string) => {
      await set("difficulty", difficulty);
      $bestTime = await get(`bestTime-${$selectedDifficulty}`);
    });

    themeUnsub = theme.subscribe(async (newValue: string) => {
      await set("theme", newValue);
    });
  });

  onDestroy(() => {
    if (difficultyUnsub) difficultyUnsub();
    if (themeUnsub) themeUnsub();
  });
</script>

<main>
  <Header />
  {#if $showMenu}
    <StartScreen />
  {:else}
    <Game />
  {/if}
  {#if $showRestartModal}
    <RestartModal />
  {/if}
  {#if $showVictoryModal}
    <VictoryModal />
  {/if}
  {#if $showLoadErrorModal}
    <LoadErrorModal />
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
