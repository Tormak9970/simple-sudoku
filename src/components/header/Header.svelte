<script lang="ts">
  import { capitalizeFirstLetter } from "../../lib/Utils";
  import {
    selectedControlNumber,
    errorsList,
    firstSelected,
    inNoteMode,
    isPaused,
    showMenu,
    selectedNumber,
    selectedSubCellId,
    showRestartModal,
    solver,
    timer,
    selectedDifficulty,
    theme,
  } from "../../stores";
  import DifficultySelection from "./DifficultySelection.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  
  async function back() {
    await $solver.save();
    $timer = "00:00:00";
    $isPaused = false;
    $showRestartModal = false;
    $selectedNumber = null;
    $selectedSubCellId = null;
    $inNoteMode = false;
    $firstSelected = null;
    $selectedControlNumber = null;
    $errorsList = [];
    $showMenu = true;
  }
</script>

<div class="header">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="logo-cont" on:click={back}>
    <svg viewBox="0 0 512 512" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 66C16 38.3858 38.3858 16 66 16H446C473.614 16 496 38.3858 496 66V446C496 473.614 473.614 496 446 496H66C38.3858 496 16 473.614 16 446V66ZM173.825 83.075C173.825 78.063 177.888 74 182.9 74C187.912 74 191.975 78.063 191.975 83.075V169.825C191.975 172.034 193.766 173.825 195.975 173.825H315.025C317.234 173.825 319.025 172.034 319.025 169.825V83.075C319.025 78.063 323.088 74 328.1 74C333.112 74 337.175 78.063 337.175 83.075V169.825C337.175 172.034 338.966 173.825 341.175 173.825H427.925C432.937 173.825 437 177.888 437 182.9C437 187.912 432.937 191.975 427.925 191.975H341.175C338.966 191.975 337.175 193.766 337.175 195.975V315.025C337.175 317.234 338.966 319.025 341.175 319.025H427.925C432.937 319.025 437 323.088 437 328.1C437 333.112 432.937 337.175 427.925 337.175H341.175C338.966 337.175 337.175 338.966 337.175 341.175V427.925C337.175 432.937 333.112 437 328.1 437C323.088 437 319.025 432.937 319.025 427.925V341.175C319.025 338.966 317.234 337.175 315.025 337.175H195.975C193.766 337.175 191.975 338.966 191.975 341.175V427.925C191.975 432.937 187.912 437 182.9 437C177.888 437 173.825 432.937 173.825 427.925V341.175C173.825 338.966 172.034 337.175 169.825 337.175H83.075C78.063 337.175 74 333.112 74 328.1C74 323.088 78.063 319.025 83.075 319.025H169.825C172.034 319.025 173.825 317.234 173.825 315.025V195.975C173.825 193.766 172.034 191.975 169.825 191.975H83.075C78.063 191.975 74 187.912 74 182.9C74 177.888 78.063 173.825 83.075 173.825H169.825C172.034 173.825 173.825 172.034 173.825 169.825V83.075ZM315.025 319.025C317.234 319.025 319.025 317.234 319.025 315.025V195.975C319.025 193.766 317.234 191.975 315.025 191.975H195.975C193.766 191.975 191.975 193.766 191.975 195.975V315.025C191.975 317.234 193.766 319.025 195.975 319.025H315.025Z"
      />
    </svg>
    {#if !$showMenu}
      <div style="margin-left: 7px;">{capitalizeFirstLetter($selectedDifficulty)}</div>
    {/if}
  </div>

  {#if !$showMenu}
    <div class="timer-cont">
      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="var(--font-color)" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M272 0C289.7 0 304 14.33 304 32C304 49.67 289.7 64 272 64H256V98.45C293.5 104.2 327.7 120 355.7 143L377.4 121.4C389.9 108.9 410.1 108.9 422.6 121.4C435.1 133.9 435.1 154.1 422.6 166.6L398.5 190.8C419.7 223.3 432 262.2 432 304C432 418.9 338.9 512 224 512C109.1 512 16 418.9 16 304C16 200 92.32 113.8 192 98.45V64H176C158.3 64 144 49.67 144 32C144 14.33 158.3 0 176 0L272 0zM248 192C248 178.7 237.3 168 224 168C210.7 168 200 178.7 200 192V320C200 333.3 210.7 344 224 344C237.3 344 248 333.3 248 320V192z"
        />
      </svg>
      <div style="margin-left: 5px; align-self:flex-end;">{$timer}</div>
    </div>
  {:else if !$isPaused}
    <DifficultySelection difficulties={["Easy", "Medium", "Hard", "Expert"]} />
  {/if}

  <div class="theme-cont">
    <ThemeToggle value={$theme === "dark"} />
  </div>
</div>

<style>
  .header {
    margin-top: min(calc((100vw - min(60vh, 90vw)) / 2 - 10px), 40px);
    width: min(60vh, 90vw, 465px);
    height: 34px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: var(--foreground);

    border-radius: 50px;

    padding: 0px 10px;
  }

  .logo-cont {
    display: flex;
    align-items: center;

    cursor: pointer;
  }

  .logo-cont svg {
    fill: var(--highlight);
  }

  .logo-cont:hover svg {
    fill: var(--highlight-hover);
  }

  .timer-cont {
    display: flex;
    align-items: center;
    padding-right: 21px;
  }

  .theme-cont {
    width: 80px;
    display: flex;
    justify-content: end;
  }
</style>
