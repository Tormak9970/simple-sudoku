<script lang="ts">
  import {
    board,
    ctrlNumSelected,
    errorsList,
    initialSelect,
    inNoteMode,
    selectedNumber,
    selectedSubCellId,
    solver,
  } from "../../stores";

  export let control: number;

  async function click() {
    if (!$initialSelect) $initialSelect = "ctrl";

    if ($initialSelect === "ctrl") {
      $ctrlNumSelected = $ctrlNumSelected === control ? null : control;
    }

    if ($selectedSubCellId) {
      if ($errorsList.includes($selectedSubCellId)) $errorsList.splice($errorsList.indexOf($selectedSubCellId), 1);
      $errorsList = [...$errorsList];

      const cellVal = $solver.getCell($selectedSubCellId);
      if (cellVal.editable) {
        if ($inNoteMode) {
          await $solver.setNote($selectedSubCellId, control.toString());
          
          if ($solver.getNote($selectedSubCellId).includes(control.toString())) {
            $selectedNumber = control;
          } else {
            $selectedNumber = null;
          }
        } else {
          if (cellVal.value !== control.toString()) {
            await $solver.setCell($selectedSubCellId, control.toString());
            $selectedNumber = control;
          } else if ($initialSelect === "cell") {
            await $solver.setCell($selectedSubCellId, ".");
            $selectedNumber = null;
          }
        }
      }
    }

    if (!$ctrlNumSelected && !$selectedSubCellId) {
      $initialSelect = null;
      $selectedNumber = null;
    }
  }

  $: numLeft = 9 - ($board.split(`${control}`).length - 1);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="number"
  class:selected={$ctrlNumSelected == control && $initialSelect == "ctrl"}
  on:click={click}
>
  <div class="inner">{control}</div>
  <div class="num-left">{numLeft > 0 ? numLeft : ""}</div>
</div>

<style>
  .number {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-radius: 50px;
   background-color: var(--foreground);

    width: 35px;
    height: 35px;
    padding: 7px;

    margin: 0px 5px;

    position: relative;

    transition: background-color 0.3s ease-in-out;
  }

  .number:hover {
    cursor: pointer;
    background-color: var(--foreground-hover);
  }

  .inner {
    font-size: 24px;
    color: var(--font-color);
  }

  .num-left {
    position: absolute;
    font-size: 12px;
    bottom: 1px;
  }

  .selected {
    background-color: var(--highlight);
  }
  .selected:hover {
    background-color: var(--highlight);
  }
</style>
