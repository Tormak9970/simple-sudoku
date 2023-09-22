<script lang="ts">
  export let label: string;
  export let handler: (e: Event) => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="menu-btn" on:click={handler}>
  <div>{label}</div>
</div>

<style>
  @import "../../themes.css";

  .menu-btn {
    width: 90px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin-top: 10px;

    padding: 10px 50px;

    border-radius: 50px;
    border: 1px solid var(--highlight);

    background-color: var(--foreground);

    transition: background-color 0.4s ease-in-out;
  }

  .menu-btn:hover {
    background-color: var(--hover);
    cursor: pointer;
  }
</style>
