<script lang="ts">
  import { get, set } from "idb-keyval";

  import { solver, theme, timer } from "../stores";

  import Board from "./board/Board.svelte";
  import Controls from "./Controls.svelte";
  import GameHeader from "./header/GameHeader.svelte";
  import Numbers from "./Numbers.svelte";

  export let newGame: boolean = false;
  export let difficulty: string;

  async function load() {
    // get saved theme or save default
    if (await get("theme")) {
      $theme = await get("theme");
    } else {
      await set("theme", $theme);
    }
    document.documentElement.setAttribute('data-theme', $theme);

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

<main>
  {#await load() then _}
    <GameHeader difficulty="medium" />
    <Board />
    <Numbers />
    <Controls />
  {/await}
</main>

<style>
  @import "../themes.css";

  main {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
