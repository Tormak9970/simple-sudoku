<script lang="ts">
  import { del, set } from "idb-keyval";
  import { capitalizeFirstLetter } from "../../lib/Utils";
  import {
    showVictoryModal,
    isPaused,
    timer,
    solver,
    bestTime,
    currentTimeIsBest,
    showMenu,
    showRestartModal,
    selectedNumber,
    selectedSubCellId,
    inNoteMode,
    firstSelected,
    selectedControlNumber,
    errorsList,
  } from "../../stores";
  import ModalBody from "./ModalBody.svelte";
  import Button from "../utils/Button.svelte";

  async function close() {
    const difficulty = $solver.currentDifficulty;
    
    await del(`initialBoard-${difficulty}`);
    await del(`currentBoard-${difficulty}`);
    await del(`solvedBoard-${difficulty}`);

    await del(`moves-${difficulty}`);
    await del(`notes-${difficulty}`);

    await del(`timer-${difficulty}`);

    if ($bestTime) {
      if ($currentTimeIsBest) {
        await set(`bestTime-${difficulty}`, $timer);
      }
    } else {
      await set(`bestTime-${difficulty}`, $timer);
    }

    // reset end game values
    $showVictoryModal = false;
    $isPaused = false;
    $bestTime = null;
    $currentTimeIsBest = false;

    // reset other values
    $timer = "00:00:00";
    $isPaused = false;
    $showRestartModal = false;
    $selectedNumber = null;
    $selectedSubCellId = null;
    $inNoteMode = false;
    $firstSelected = null;
    $selectedControlNumber = null;
    $errorsList = [];
    $showMenu = true;
  }
</script>

<ModalBody title="Board Complete!" canClose="{false}">
  <div class="content">
    <div class="info">
      <div style="font-size: 16px; margin-bottom: 7px;">
        Difficulty: {capitalizeFirstLetter($solver.currentDifficulty)}
      </div>
      {#if $bestTime}
        {#if $currentTimeIsBest}
          <div style="font-size: 14px;">New Best: {$timer}</div>
          <div style="font-size: 14px;">Old Best: {$bestTime}</div>
        {:else}
          <div style="font-size: 14px;">Best: {$bestTime}</div>
          <div style="font-size: 14px;">This Board: {$timer}</div>
        {/if}
      {:else}
        <div style="font-size: 14px;">New Best: {$timer}</div>
      {/if}
    </div>
    <div class="buttons">
      <Button
        label="Main Menu"
        onClick="{close}"
        width="80%" />
    </div>
  </div>
</ModalBody>

<style>
  .content {
    max-width: 400px;
    min-width: 300px;
  }

  .info {
    margin: 0px 10px;
    margin-top: 7px;
    font-size: 14px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .buttons {
    margin-top: 14px;
    margin-bottom: 7px;
    margin-left: 7px;
    margin-right: 7px;
    width: calc(100% - 14px);
    display: flex;
    justify-content: space-around;
    justify-self: flex-end;
  }
</style>
