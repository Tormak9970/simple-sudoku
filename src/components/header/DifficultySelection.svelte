<script lang="ts">
  import { selectedDifficulty } from "../../stores";

  export let difficulties: string[];

 function setDifficulty(difficulty: string): void {
  $selectedDifficulty = difficulties[difficulty].toLowerCase();
 }
</script>

<div class="diff-selector">
  
</div>

<style>
  .diff-selector {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-top: 2px;
  }
</style>
