<script lang="ts">
  import { get } from "idb-keyval";
  import { calcTotalTime } from "../../../lib/Utils";

  import { afterUpdate } from "svelte";

  import {
    selectedSubCellId,
    selectedNumber,
    solver,
    ctrlNumSelected,
    inNoteMode,
    initialSelect,
    rerender,
    errorsList,
    showVictory,
    isPaused,
    bestTime,
    timer,
    curIsBest,
  } from "../../../stores";

  export let cellId: number;
  export let subId: number;

  const firmId = `${cellId}|${subId}`;

  let editable = true; // set true if board is '.' here
  let value = ""; // value of this square
  let notesList: string[] = [];

  function getValue() {
    if ($solver.currentBoard) {
      const data = $solver.getCell(firmId);
      value = data.value;
      editable = data.editable;
    }
  }
  function getNotes() {
    if ($solver.currentBoard) {
      const data = $solver.getNote(firmId);
      notesList = data;
    }
  }

  afterUpdate(async () => {
    getValue();
    if (editable) getNotes();
    if ($solver.currentBoard == $solver.solvedBoard) {
      $isPaused = true;
      const bTime = await get(`bestTime-${$solver.currentDifficulty}`);
      $bestTime = bTime;
      if (bTime) {
        if (calcTotalTime(bTime) > calcTotalTime($timer)) {
          $curIsBest = true;
        }
      }
      $showVictory = true;
    }
  });

  async function click(e: Event) {
    if (!$initialSelect) $initialSelect = "cell";

    if ($initialSelect == "cell") {
      if ($selectedSubCellId == firmId) {
        $selectedSubCellId = null;
        $selectedNumber = null;
      } else {
        $selectedSubCellId = firmId;
        $selectedNumber = value == "" ? null : value;
        console.log($selectedNumber == value, !$ctrlNumSelected);
      }
    }

    if ($ctrlNumSelected && editable) {
      if ($errorsList.includes(firmId))
        $errorsList.splice($errorsList.indexOf(firmId), 1);
      $errorsList = [...$errorsList];

      if ($inNoteMode) {
        await $solver.setNote(firmId, $ctrlNumSelected.toString());
        if ($solver.getNote(firmId).includes($ctrlNumSelected)) {
          $selectedNumber = $ctrlNumSelected;
        } else {
          $selectedNumber = null;
          $rerender();
        }
      } else {
        if (value != $ctrlNumSelected) {
          await $solver.setCell(firmId, $ctrlNumSelected.toString());
          $selectedNumber = $ctrlNumSelected;
          $rerender();
        } else if ($initialSelect == "ctrl") {
          await $solver.setCell(firmId, ".");
          $selectedNumber = null;
          $rerender();
        }
      }
    }

    if (!$ctrlNumSelected && !$selectedSubCellId) {
      $initialSelect = null;
      $selectedNumber = null;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="sub-cell"
  class:clue={!editable}
  class:ghost-selected={(($selectedNumber == value || $ctrlNumSelected == value || notesList.includes($selectedNumber?.toString())) &&
    (!$ctrlNumSelected || $ctrlNumSelected == value)) || notesList.includes($ctrlNumSelected?.toString()) || ($selectedSubCellId == firmId && !editable)}
  class:selected={$selectedSubCellId == firmId && editable && $initialSelect == "cell"}
  class:error={$errorsList.includes(firmId)}
  on:click={click}
>
  {#if value == ""}
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
