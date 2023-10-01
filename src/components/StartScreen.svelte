<script lang="ts">
  import { get, set } from "idb-keyval";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";

  import { newGame, showMenu, selectedDifficulty, theme, bestTime } from "../stores";
  import MenuButton from "./start-menu/Button.svelte";

  let difficultyUnsub: Unsubscriber

  const difficulties = ["Easy", "Medium", "Hard", "Expert"];
  let existingDifficulties = [];
  let hasSave = existingDifficulties.includes($selectedDifficulty);

  async function load() {
    // get saved theme or save default
    if (await get("theme")) {
      $theme = await get("theme");
    } else {
      await set("theme", $theme);
    }

    document.documentElement.setAttribute("data-theme", $theme);

    // get saved difficulty or save default
    if (await get("difficulty")) {
      $selectedDifficulty = await get("difficulty");
    } else {
      await set("difficulty", $selectedDifficulty);
    }

    // check existing saves
    for (const difficulty of difficulties.map((difficulty) => difficulty.toLowerCase())) {
      const initialBoardExists = await get(`initialBoard-${difficulty}`);

      if (initialBoardExists) {
        existingDifficulties.push(difficulty);
      }
    }
  }

  function resumeCurrentGame() {
    $newGame = false;
    $showMenu = false;
  }
  function startNewGame() {
    $newGame = true;
    $showMenu = false;
  }

  onMount(async () => {
    existingDifficulties = [];

    for (const difficulty of difficulties.map((difficulty) => difficulty.toLowerCase())) {
      const initialBoardExists = await get(`initialBoard-${difficulty}`);

      if (initialBoardExists) {
        existingDifficulties.push(difficulty);
      }
    }

    difficultyUnsub = selectedDifficulty.subscribe((difficulty: string) => {
      hasSave = existingDifficulties.includes(difficulty);
    });
  });

  onDestroy(() => {
    if (difficultyUnsub) difficultyUnsub();
  });
</script>

<div class="start-screen">
  {#await load()}
    <!-- TODO: show loading thing here -->
  {:then _}
    <div class="preview-container">
      <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16 66C16 38.3858 38.3858 16 66 16H446C473.614 16 496 38.3858 496 66V446C496 473.614 473.614 496 446 496H66C38.3858 496 16 473.614 16 446V66ZM173.825 83.075C173.825 78.063 177.888 74 182.9 74C187.912 74 191.975 78.063 191.975 83.075V169.825C191.975 172.034 193.766 173.825 195.975 173.825H315.025C317.234 173.825 319.025 172.034 319.025 169.825V83.075C319.025 78.063 323.088 74 328.1 74C333.112 74 337.175 78.063 337.175 83.075V169.825C337.175 172.034 338.966 173.825 341.175 173.825H427.925C432.937 173.825 437 177.888 437 182.9C437 187.912 432.937 191.975 427.925 191.975H341.175C338.966 191.975 337.175 193.766 337.175 195.975V315.025C337.175 317.234 338.966 319.025 341.175 319.025H427.925C432.937 319.025 437 323.088 437 328.1C437 333.112 432.937 337.175 427.925 337.175H341.175C338.966 337.175 337.175 338.966 337.175 341.175V427.925C337.175 432.937 333.112 437 328.1 437C323.088 437 319.025 432.937 319.025 427.925V341.175C319.025 338.966 317.234 337.175 315.025 337.175H195.975C193.766 337.175 191.975 338.966 191.975 341.175V427.925C191.975 432.937 187.912 437 182.9 437C177.888 437 173.825 432.937 173.825 427.925V341.175C173.825 338.966 172.034 337.175 169.825 337.175H83.075C78.063 337.175 74 333.112 74 328.1C74 323.088 78.063 319.025 83.075 319.025H169.825C172.034 319.025 173.825 317.234 173.825 315.025V195.975C173.825 193.766 172.034 191.975 169.825 191.975H83.075C78.063 191.975 74 187.912 74 182.9C74 177.888 78.063 173.825 83.075 173.825H169.825C172.034 173.825 173.825 172.034 173.825 169.825V83.075ZM315.025 319.025C317.234 319.025 319.025 317.234 319.025 315.025V195.975C319.025 193.766 317.234 191.975 315.025 191.975H195.975C193.766 191.975 191.975 193.766 191.975 195.975V315.025C191.975 317.234 193.766 319.025 195.975 319.025H315.025Z"
        />
      </svg>
    </div>

    {#if $bestTime}
      <div style="font-size: 20px; margin: 3px 0px;">Best Time: {$bestTime}</div>
    {:else}
      <div style="font-size: 20px; margin: 3px 0px;">No Best Time</div>
    {/if}

    <div class="menu-btn-cont">
      {#if hasSave}
        <MenuButton label="Resume" onClick={resumeCurrentGame} />
      {/if}

      <MenuButton label="New Game" onClick={startNewGame} />
    </div>
  {/await}
</div>

<style>
  .start-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    margin-top: min(calc((100vw - min(60vh, 90vw)) / 2 - 10px), 40px);
    width: min(60vh, 90vw, 465px);
  }

  .preview-container {

  }

  .start-screen > .preview-container > svg {
    width: min(40vw, 30vh);
    height: min(40vw, 30vh);
  }

  .start-screen > .preview-container > svg > path {
    fill: var(--highlight);
  }

  .menu-btn-cont {
    height: 101px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
