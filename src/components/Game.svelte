<script lang="ts">
  import { get, set } from "idb-keyval";

  import { newGame, selectedDifficulty, solver, timer } from "../stores";

  import Board from "./board/Board.svelte";
  import Controls from "./controls/Controls.svelte";
  import { LogController } from "../lib/LogController";

  async function load() {
    // get saved board or create new
    LogController.log("Selected difficulty:", $selectedDifficulty);
    await $solver.getBoard($selectedDifficulty, $newGame);

    // get saved time or start new timer
    if (!$newGame && (await get(`timer-${$selectedDifficulty}`))) {
      $timer = await get(`timer-${$selectedDifficulty}`);
    } else {
      await set(`timer-${$selectedDifficulty}`, $timer);
    }
  }
</script>

<div class="game-container">
  {#await load() then _}
    <Board />
    <Controls />
  {/await}
</div>

<style>
  .game-container {
    margin-top: min(calc((100vw - min(60vh, 90vw)) / 2 - 10px), 40px);

    width: min(60vh, 90vw, 465px);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
