<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { update } from "idb-keyval";
  import {
    isPaused,
    selectedDifficulty,
    showMenu,
    timer,
  } from "../../stores";

  import Row from "./Row.svelte";

  let intervalId: any;

  async function timerFunction() {
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
  }

  onMount(() => {
    intervalId = setInterval(timerFunction, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="board">
  <Row cellStartId={0} />
  <div class="hor-div" />
  <Row cellStartId={3} />
  <div class="hor-div" />
  <Row cellStartId={6} />
</div>

<style>
  .board {
    width: min(60vh, 90vw, 420px);
    height: min(60vh, 90vw, 420px);

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
</style>
