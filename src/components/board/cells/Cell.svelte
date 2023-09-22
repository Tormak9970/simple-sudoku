<script lang="ts">
  import HorizontalCellDivider from "../dividers/HorizontalCellDivider.svelte";
  import SubCell from "./SubCell.svelte";

  export let cellId: number;
</script>

<div class="cell">
  <div class="row">
    <SubCell {cellId} subId={0} />
    <div class="vertical-cell-divider" />
    <SubCell {cellId} subId={1} />
    <div class="vertical-cell-divider" />
    <SubCell {cellId} subId={2} />
  </div>
  <HorizontalCellDivider />
  <div class="row">
    <SubCell {cellId} subId={3} />
    <div class="vertical-cell-divider" />
    <SubCell {cellId} subId={4} />
    <div class="vertical-cell-divider" />
    <SubCell {cellId} subId={5} />
  </div>
  <HorizontalCellDivider />
  <div class="row">
    <SubCell {cellId} subId={6} />
    <div class="vertical-cell-divider" />
    <SubCell {cellId} subId={7} />
    <div class="vertical-cell-divider" />
    <SubCell {cellId} subId={8} />
  </div>
</div>

<style>
  .cell {
    width: calc((100% - 10px) / 3);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .vertical-cell-divider {
    background-color: var(--foreground);
    height: 75%;

    width: 2px;

    border-radius: 50px;
  }

  .row {
    width: 100%;
    height: calc((100% - 4px) / 3);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
