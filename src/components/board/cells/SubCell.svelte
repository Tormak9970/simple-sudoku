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
    showVictoryModal,
    isPaused,
    bestTime,
    timer,
    currentTimeIsBest,
    board,
    notes,
  } from "../../../stores";
  import type { Unsubscriber } from "svelte/store";
  import BouncyCircle from "../../utils/BouncyCircle.svelte";

  export let cellId: number;
  export let subId: number;

  let notesUnsub: Unsubscriber;

  const firmId = `${cellId}|${subId}`;

  $: cellData = $board ? $solver.getCell(firmId) : null;
  $: editable = cellData ? cellData.editable : true; // set true if board is '.' here
  $: value = cellData ? cellData.value : "";
  let notesList = [];

  $: selected = $selectedSubCellId === firmId && editable && $firstSelected === "cell";

  $: sameAsSelectedNumber = $selectedSubCellId !== firmId && ($selectedNumber === value || $selectedControlNumber === value || notesList.includes($selectedNumber?.toString()) || notesList.includes($selectedControlNumber?.toString()));
  $: sameAsSelected = sameAsSelectedNumber || ($selectedSubCellId === firmId && !editable)

  async function click() {
    if (!$firstSelected) $firstSelected = "cell";

    if ($firstSelected === "cell") {
      if ($selectedSubCellId === firmId) {
        $selectedSubCellId = null;
        $selectedNumber = null;
      } else {
        $selectedSubCellId = firmId;
        $selectedNumber = value === "" ? null : value;
      }
    }

    if ($selectedControlNumber && editable) {
      if ($errorsList.includes(firmId)) {
        $errorsList.splice($errorsList.indexOf(firmId), 1);
      }
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

    $showVictoryModal = true;
  }

  afterUpdate(() => {
    if ($board === $solver.solvedBoard) userWon();
  });

  onMount(() => {
    notesUnsub = notes.subscribe((newNotes) => {
      notesList = editable ? newNotes[firmId] ?? [] : [];
    });
  });

  onDestroy(() => {
    if (notesUnsub) notesUnsub();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="sub-cell-container">
  <BouncyCircle onClick={click} shouldAnimate={!(!editable && $selectedControlNumber)}>
    <div
      class="sub-cell"
      class:clue={!editable}
      class:same-as-selected={sameAsSelected}
      class:selected={selected}
      class:error={$errorsList.includes(firmId)}
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
  </BouncyCircle>
</div>

<style>
  .sub-cell-container {
    width: calc((100% - 4px - 12px) / 3);
    height: calc(100% - 4px);

    margin: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
  .sub-cell {
    width: 100%;
    height: 100%;
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

  .same-as-selected,
  .clue.same-as-selected:hover {
    background-color: var(--highlight-accent);
  }
  .same-as-selected:hover {
    background-color: var(--highlight-accent-hover);
  }

  .selected { background-color: var(--highlight); }
  .selected:hover { background-color: var(--highlight-hover); }

  .error { background-color: var(--warning); }
  .error:hover,
  .error.selected {
    background-color: var(--warning-hover);
  }
</style>
