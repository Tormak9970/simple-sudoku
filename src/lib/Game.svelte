<script lang="ts">
  import { get, set } from "idb-keyval";

  import { solver, timer } from "../stores";

  import Board from "./board/Board.svelte";
  import Controls from "./controls/Controls.svelte";
  import GameHeader from "./header/GameHeader.svelte";
  import Numbers from "./numbers/Numbers.svelte";

  export let newGame: boolean = false;
  export let difficulty: string;

  async function load() {
    // get saved board or create new
    await $solver.getBoard(difficulty, newGame);

    // get saved time or start new timer
    if (!newGame && (await get(`timer-${difficulty}`))) {
      $timer = await get(`timer-${difficulty}`);
    } else {
      await set(`timer-${difficulty}`, $timer);
    }
  }
</script>

<div id="game">
  {#await load() then _}
    <GameHeader difficulty={difficulty} />
    <Board />
    <Numbers />
    <Controls />
  {/await}
</div>

<style>
  @import "../themes.css";

  #game {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
