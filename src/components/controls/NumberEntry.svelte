<script lang="ts">
  import {
    board,
    selectedControlNumber,
    errorsList,
    firstSelected,
    inNoteMode,
    selectedNumber,
    selectedSubCellId,
    solver,
  } from "../../stores";
  import BouncyCircle from "../utils/BouncyCircle.svelte";

  export let control: number;

  function notesContainControl(): boolean {
    return $solver.getNote($selectedSubCellId).includes(control.toString());
  }

  async function click() {
    if (!$firstSelected) $firstSelected = "ctrl";

    if ($firstSelected === "ctrl") {
      $selectedControlNumber = $selectedControlNumber === control.toString() ? null : control.toString();
    }

    if ($selectedSubCellId) {
      if ($errorsList.includes($selectedSubCellId)) {
        $errorsList.splice($errorsList.indexOf($selectedSubCellId), 1);
      }
      $errorsList = [...$errorsList];

      const cellVal = $solver.getCell($selectedSubCellId);
      if (cellVal.editable) {
        if ($inNoteMode) {
          await $solver.setNote($selectedSubCellId, control.toString());

          $selectedNumber = notesContainControl() ? control.toString() : null;
        } else {
          if (cellVal.value !== control.toString()) {
            await $solver.setCell($selectedSubCellId, control.toString());
            $selectedNumber = control.toString();
          } else if ($firstSelected === "cell") {
            await $solver.setCell($selectedSubCellId, ".");
            $selectedNumber = null;
          }
        }
      }
    }

    if (!$selectedControlNumber && !$selectedSubCellId) {
      $firstSelected = null;
      $selectedNumber = null;
    }
  }

  $: numLeft = 9 - ($board.split(`${control}`).length - 1);
  $: selected = $selectedControlNumber === control.toString() && $firstSelected === "ctrl";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="number-container">
  <BouncyCircle min={90} onClick={click} shouldAnimate={!($selectedNumber || $firstSelected === "cell")}>
    <div
      class="number"
      class:selected={selected}
    >
      <div class="inner">{control}</div>
      <div class="num-left">{numLeft > 0 ? numLeft : ""}</div>
    </div>
  </BouncyCircle>
</div>

<style>
  .number-container {
    width: 55px;
    height: 55px;
    
    margin: 0px 5px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .number {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-radius: 50px;
    background-color: var(--foreground);

    width: 100%;
    height: 100%;

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
