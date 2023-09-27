<script lang="ts">
  import { onDestroy, onMount } from "svelte";
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
  import { bounceIn } from "svelte/easing"
  import { tweened } from 'svelte/motion';
  import type { Unsubscriber } from "svelte/store";
  import { LogController } from "../../lib/LogController";

  let controlNumSelectedUnsub: Unsubscriber;
  let initialSelectUnsub: Unsubscriber;

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

  const scale = tweened(1.0, { duration: 200, easing: bounceIn });

  $: numLeft = 9 - ($board.split(`${control}`).length - 1);
  $: selected = $selectedControlNumber === control.toString() && $firstSelected === "ctrl";

  onMount(() => {
    // controlNumSelectedUnsub = ctrlNumSelected.subscribe((selectedControl) => {
    //   if (selectedControl === control && $initialSelect === "ctrl") {
    //     scale.set(1.05);
    //   } else {
    //     scale.set(1.0);
    //   }
    // });

    // initialSelectUnsub = initialSelect.subscribe((initial) => {
    //   if ($ctrlNumSelected === control && initial === "ctrl") {
    //     scale.set(1.05);
    //   } else {
    //     scale.set(1.0);
    //   }
    // });
  });

  onDestroy(() => {
    if (controlNumSelectedUnsub) controlNumSelectedUnsub();
    if (initialSelectUnsub) initialSelectUnsub();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="number"
  class:selected={selected}
  style="transform: scale({$scale})"
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
