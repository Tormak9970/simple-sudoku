<script lang="ts">
  import { del, set } from "idb-keyval";
  import { capitalizeFirstLetter } from "../../lib/Utils";
  import {
    showVictory,
    isPaused,
    timer,
    solver,
    bestTime,
    curIsBest,
    showMenu,
    showRestart,
    selectedNumber,
    selectedSubCellId,
    inNoteMode,
    initialSelect,
    ctrlNumSelected,
    errorsList,
  } from "../../stores";

  async function close() {
    const diff = $solver.currentDifficulty;
    await del(`iBoard-${diff}`);
    await del(`cBoard-${diff}`);
    await del(`sBoard-${diff}`);

    await del(`moves-${diff}`);
    await del(`notes-${diff}`);

    await del(`timer-${diff}`);

    if ($bestTime) {
      if ($curIsBest) await set(`bestTime-${diff}`, $timer);
    } else {
      await set(`bestTime-${diff}`, $timer);
    }

    // reset end game values
    $showVictory = false;
    $isPaused = false;
    $bestTime = null;
    $curIsBest = false;

    // reset other values
    $timer = "00:00:00";
    $isPaused = false;
    $showRestart = false;
    $selectedNumber = null;
    $selectedSubCellId = null;
    $inNoteMode = false;
    $initialSelect = null;
    $ctrlNumSelected = null;
    $errorsList = [];
    $showMenu = true;
  }
</script>

{#if $showVictory}
  <div class="backdrop">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal" on:click|stopPropagation={() => {}}>
      <div class="content">
        <div style="font-size: 20px; margin-bottom: 3px;">Board Complete!</div>
        <div style="font-size: 16px; margin-bottom: 7px;">
          Difficulty: {capitalizeFirstLetter($solver.currentDifficulty)}
        </div>
        {#if $bestTime}
          {#if $curIsBest}
            <div style="font-size: 14px;">New Best: {$timer}</div>
            <div style="font-size: 14px;">Old Best: {$bestTime}</div>
          {:else}
            <div style="font-size: 14px;">Best: {$bestTime}</div>
            <div style="font-size: 14px;">This Board: {$timer}</div>
          {/if}
        {:else}
          <div style="font-size: 14px;">New Best: {$timer}</div>
        {/if}

        <div class="btns-cont">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="btn" on:click={close}>Main Menu</div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    z-index: 10;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    padding: 14px;
    max-width: 70vw;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--background);
    border: 1px solid var(--highlight);

    overflow: hidden;

    box-shadow: -2px 2px 8px 1px #000;
  }

  .content {
    max-height: 50vh;
    overflow: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btns-cont {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .btn {
    padding: 6px 20px;
    border-radius: 8px;
    border: 1px solid var(--highlight);

    background-color: var(--foreground);
  }
  .btn:hover {
    background-color: var(--hover);
    cursor: pointer;
  }
  .btn:focus {
    background-color: var(--highlight);
  }
</style>
