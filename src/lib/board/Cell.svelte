<script lang="ts">
    import SubCell from "./SubCell.svelte";

    export let cellId:number;
</script>

<div class="cell">
    <div class="row">
        <SubCell cellId={cellId} subId={0} />
        <div class="div-seg-h"></div>
        <SubCell cellId={cellId} subId={1} />
        <div class="div-seg-h"></div>
        <SubCell cellId={cellId} subId={2} />
    </div>
    <div class="div-row">
        <div class="div-seg"></div>
        <div class="div-seg"></div>
        <div class="div-seg"></div>
    </div>
    <div class="row">
        <SubCell cellId={cellId} subId={3} />
        <div class="div-seg-h"></div>
        <SubCell cellId={cellId} subId={4} />
        <div class="div-seg-h"></div>
        <SubCell cellId={cellId} subId={5} />
    </div>
    <div class="div-row">
        <div class="div-seg"></div>
        <div class="div-seg"></div>
        <div class="div-seg"></div>
    </div>
    <div class="row">
        <SubCell cellId={cellId} subId={6} />
        <div class="div-seg-h"></div>
        <SubCell cellId={cellId} subId={7} />
        <div class="div-seg-h"></div>
        <SubCell cellId={cellId} subId={8} />
    </div>
</div>

<style>
    @import '../../themes.css';

    .cell {
        width: calc((100% - 10px) / 3);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .div-row {
        width: 100%;

        display: flex;
        justify-content: space-around;
    }

    .div-seg {
        background-color: var(--foreground);
        height: 2px;

        width: 25%;

        border-radius: 50px;
    }

    .div-seg-h {
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
      