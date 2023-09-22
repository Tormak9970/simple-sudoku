<script lang="ts">
  import { get, set } from "idb-keyval";

  import { selectedDifficulty, solver, timer } from "../stores";

  import Board from "./board/Board.svelte";
  import Controls from "./controls/Controls.svelte";
  import VictoryModal from "./modals/VictoryModal.svelte";
  import Numbers from "./numbers/Numbers.svelte";

  export let newGame: boolean = false;

  async function load() {
    // get saved board or create new
    await $solver.getBoard($selectedDifficulty, newGame);

    // get saved time or start new timer
    if (!newGame && (await get(`timer-${$selectedDifficulty}`))) {
      $timer = await get(`timer-${$selectedDifficulty}`);
    } else {
      await set(`timer-${$selectedDifficulty}`, $timer);
    }
  }
</script>

<div id="game">
  {#await load() then _}
    <Board />
    <Numbers />
    <Controls />
  {/await}
  <VictoryModal />
</div>

<style>
  #game {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
