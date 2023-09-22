<script lang="ts">
  import { update } from "idb-keyval";
  import {
    isPaused,
    selectedDifficulty,
    showMenu,
    timer,
  } from "../../stores";
  import { onDestroy, onMount } from "svelte";

  import Cell from "./Cell.svelte";

  let intervalId: any;

  onMount(() => {
    intervalId = setInterval(async () => {
      if (!$isPaused && !$showMenu) {
        let [hours, minutes, seconds] = $timer.split(":").map((v: string) => parseInt(v));

        if (seconds == 59) {
          if (minutes == 59) {
            if (hours != 23) {
              hours++;
              minutes = 0;
              seconds = 0;
            }
          } else {
            minutes++;
            seconds = 0;
          }
        } else {
          seconds++;
        }

        $timer = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        await update(`timer-${$selectedDifficulty}`, (oldTime) => (oldTime = $timer));
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="board">
  <div class="row">
    <Cell cellId={0} />
    <div
      class="vert-div"
      style="border-top-left-radius: 50px; border-top-right-radius: 50px;"
    />
    <Cell cellId={1} />
    <div
      class="vert-div"
      style="border-top-left-radius: 50px; border-top-right-radius: 50px;"
    />
    <Cell cellId={2} />
  </div>
  <div class="hor-div" />
  <div class="row">
    <Cell cellId={3} />
    <div class="vert-div" />
    <Cell cellId={4} />
    <div class="vert-div" />
    <Cell cellId={5} />
  </div>
  <div class="hor-div" />
  <div class="row">
    <Cell cellId={6} />
    <div
      class="vert-div"
      style="border-bottom-left-radius: 50px; border-bottom-right-radius: 50px;"
    />
    <Cell cellId={7} />
    <div
      class="vert-div"
      style="border-bottom-left-radius: 50px; border-bottom-right-radius: 50px;"
    />
    <Cell cellId={8} />
  </div>
</div>

<style>
  .board {
    width: min(60vh, 90vw);
    height: min(60vh, 90vw);

    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--font-color);
  }

  .hor-div {
    background-color: var(--highlight);
    width: 100%;

    border-radius: 50px;

    height: 5px;
  }

  .vert-div {
    background-color: var(--highlight);
    height: 100%;

    width: 5px;
  }

  .row {
    width: 100%;
    height: calc((100% - 10px) / 3);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
