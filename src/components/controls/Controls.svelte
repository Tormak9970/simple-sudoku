<script lang="ts">
  import {
    selectedControlNumber,
    errorsList,
    firstSelected,
    inNoteMode,
    isPaused,
    restartCallback,
    selectedNumber,
    selectedSubCellId,
    showRestart,
    solver,
    timer,
  } from "../../stores";
  import ControlEntry from "./ControlEntry.svelte";

  import RestartModal from "../modals/RestartModal.svelte";
  import NumberEntry from "./NumberEntry.svelte";

  $restartCallback = reCallback;

  function restart() {
    $isPaused = true;
    $showRestart = true;
  }

  async function reCallback() {
    await $solver.restart();
    $timer = "00:00:00";
    $isPaused = false;
    $showRestart = false;
    $selectedNumber = null;
    $selectedSubCellId = null;
    $inNoteMode = false;
    $firstSelected = null;
    $selectedControlNumber = null;
    $errorsList = [];
  }
  
  function clearClick() {
    if ($selectedSubCellId && $solver.getCell($selectedSubCellId).editable) {
      $solver.setCell($selectedSubCellId, ".");
    }
  }

  function noteMode() {
    $inNoteMode = !$inNoteMode;
  }

  function validate() {
    const errs = $solver.validate();

    if (errs.length > 0) {
      $errorsList = errs;
    }
  }

  async function undo() {
    await $solver.undo();
  }
</script>

<div class="controls-container">
  <div class="numbers">
    <div class="row" style="margin-bottom: 7px;">
      <NumberEntry control={1} />
      <NumberEntry control={2} />
      <NumberEntry control={3} />
      <NumberEntry control={4} />
      <NumberEntry control={5} />
    </div>
    <div class="row">
      <NumberEntry control={6} />
      <NumberEntry control={7} />
      <NumberEntry control={8} />
      <NumberEntry control={9} />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="clear" on:click={clearClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
          <path
            d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"
          />
        </svg>
      </div>
    </div>
  </div>
  <div class="controls">
    <!-- Restart -->
    <ControlEntry handler={restart}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M464 16c-17.67 0-32 14.31-32 32v74.09C392.1 66.52 327.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.89 5.5 34.88-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c50.5 0 96.26 24.55 124.4 64H336c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32V48C496 30.31 481.7 16 464 16zM441.8 289.6c-16.92-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-50.5 0-96.25-24.55-124.4-64H176c17.67 0 32-14.31 32-32s-14.33-32-32-32h-128c-17.67 0-32 14.31-32 32v144c0 17.69 14.33 32 32 32s32-14.31 32-32v-74.09C119.9 445.5 184.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z"
          fill="var(--font-color)"
        />
      </svg>
    </ControlEntry>
    <!-- Note mode -->
    <ControlEntry handler={noteMode} isNoteToggle>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"
          fill={$inNoteMode ? "#141414" : "var(--font-color)"}
        />
      </svg>
    </ControlEntry>
    <!-- Validate -->
    <ControlEntry handler={validate}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
          fill="var(--font-color)"
        />
      </svg>
    </ControlEntry>
    <!-- Undo -->
    <ControlEntry handler={undo}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M459.5 71.41l-171.5 142.9v83.45l171.5 142.9C480.1 457.7 512 443.3 512 415.1V96.03C512 68.66 480.1 54.28 459.5 71.41zM203.5 71.41L11.44 231.4c-15.25 12.87-15.25 36.37 0 49.24l192 159.1c20.63 17.12 52.51 2.749 52.51-24.62v-319.9C255.1 68.66 224.1 54.28 203.5 71.41z"
          fill="var(--font-color)"
        />
      </svg>
    </ControlEntry>
    <RestartModal />
  </div>
</div>

<style>
  .controls-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .controls {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  svg {
    height: 18px;
  }
  svg > path {
    transition: fill 0.1s ease-in-out;
  }

  .numbers {
    margin: 2vh 0vh;
    width: min(60vh, 90vw);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .clear {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-radius: 50px;
    background-color: var(--foreground);

    width: 35px;
    height: 35px;
    padding: 5px;

    margin: 0px 7px;

    transition: background-color 0.3s ease-in-out;
  }

  .clear:hover {
    cursor: pointer;
    background-color: var(--foreground-hover);
  }

  .clear > svg {
    height: 24px;
  }
  .clear > svg > path {
    fill: var(--font-color);
  }
</style>
