<script lang="ts">
  import Cell from "./Cell.svelte";
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
  @import "../../themes.css";

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
