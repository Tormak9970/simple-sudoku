<script lang="ts">
  import { get } from "idb-keyval";
  import { calcTotalTime } from "../../../lib/Utils";

  import { afterUpdate, onDestroy, onMount } from "svelte";

  import {
    selectedSubCellId,
    selectedNumber,
    solver,
    selectedControlNumber,
    inNoteMode,
    firstSelected,
    errorsList,
    showVictory,
    isPaused,
    bestTime,
    timer,
    currentTimeIsBest,
    board,
    notes,
  } from "../../../stores";
  import type { Unsubscriber } from "svelte/store";

  export let cellId: number;
  export let subId: number;

  let boardUnsub: Unsubscriber;
  let notesUnsub: Unsubscriber;

  const firmId = `${cellId}|${subId}`;

  let editable = true; // set true if board is '.' here
  let value = "";
  let notesList = [];

  function getValue() {
    if ($solver.currentBoard) {
      const data = $solver.getCell(firmId);
      value = data.value;
      editable = data.editable;
    }
  }

  async function click() {
    if (!$firstSelected) $firstSelected = "cell";

    if ($firstSelected === "cell") {
      if ($selectedSubCellId == firmId) {
        $selectedSubCellId = null;
        $selectedNumber = null;
      } else {
        $selectedSubCellId = firmId;
        $selectedNumber = value === "" ? null : value;
      }
    }

    if ($selectedControlNumber && editable) {
      if ($errorsList.includes(firmId))
        $errorsList.splice($errorsList.indexOf(firmId), 1);
      $errorsList = [...$errorsList];

      if ($inNoteMode) {
        await $solver.setNote(firmId, $selectedControlNumber.toString());
        if (notesList.includes($selectedControlNumber)) {
          $selectedNumber = $selectedControlNumber;
        } else {
          $selectedNumber = null;
        }
      } else {
        if (value !== $selectedControlNumber) {
          await $solver.setCell(firmId, $selectedControlNumber.toString());
          $selectedNumber = $selectedControlNumber;
        } else if ($firstSelected === "ctrl") {
          await $solver.setCell(firmId, ".");
          $selectedNumber = null;
        }
      }
    }

    if (!$selectedControlNumber && !$selectedSubCellId) {
      $firstSelected = null;
      $selectedNumber = null;
    }
  }

  async function userWon() {
    $isPaused = true;
    $bestTime = await get(`bestTime-${$solver.currentDifficulty}`);

    if ($bestTime) {
      if (calcTotalTime($bestTime) > calcTotalTime($timer)) {
        $currentTimeIsBest = true;
      }
    }

    $showVictory = true;
  }

  afterUpdate(() => {
    if ($board === $solver.solvedBoard) userWon();
  });

  onMount(() => {
    boardUnsub = board.subscribe(() => {
      getValue();
    });
    notesUnsub = notes.subscribe((newNotes) => {
      notesList = editable ? newNotes[firmId] : [];
    });
  });

  onDestroy(() => {
    if (boardUnsub) boardUnsub();
    if (notesUnsub) notesUnsub();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="sub-cell"
  class:clue={!editable}
  class:ghost-selected={
    (
      ($selectedNumber === value || $selectedControlNumber === value || notesList.includes($selectedNumber?.toString())) &&
      (!$selectedControlNumber || $selectedControlNumber === value)
    ) ||
    notesList.includes($selectedControlNumber?.toString()) ||
    ($selectedSubCellId === firmId && !editable)
  }
  class:selected={$selectedSubCellId === firmId && editable && $firstSelected === "cell"}
  class:error={$errorsList.includes(firmId)}
  on:click={click}
>
  {#if value === ""}
    <div class="notes-cont">
      {#each notesList as note}
        <div class="note">
          <div>{note}</div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="val-cont">
      <div class="val">{value}</div>
    </div>
  {/if}
</div>

<style>
  .sub-cell {
    width: calc((100% - 4px - 12px) / 3);
    height: calc(100% - 4px);
    margin: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 24px;

    border-radius: 50px;

    background-color: transparent;

    transition: background-color 0.3s ease-in-out;
  }

  .notes-cont {
    width: 80%;
    height: 80%;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }

  .note {
    font-size: 10px;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sub-cell:hover {
    background-color: var(--foreground-hover);
    cursor: pointer;
  }
  .clue {
    background-color: var(--foreground);
  }

  .ghost-selected,
  .clue.ghost-selected:hover {
    background-color: var(--highlight-accent);
  }

  .selected { background-color: var(--highlight); }
  .selected:hover { background-color: var(--highlight-hover); }

  .error { background-color: var(--warning); }
  .error:hover,
  .error.selected {
    background-color: var(--warning-hover);
  }
</style>
