<script lang="ts">
  import Cell from "./cells/Cell.svelte";
  import VerticalRowDivider from "./dividers/VerticalRowDivider.svelte"

  export let cellStartId: number;
</script>

<div class="row">
  <Cell cellId={cellStartId} />
  <VerticalRowDivider cellStartId={cellStartId} />
  <Cell cellId={cellStartId + 1} />
  <VerticalRowDivider cellStartId={cellStartId} />
  <Cell cellId={cellStartId + 2} />
</div>

<style>
  .row {
    width: 100%;
    height: calc((100% - 10px) / 3);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
