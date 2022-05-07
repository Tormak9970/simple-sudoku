<script lang="ts">
    import { solver } from "../../stores";

    export let control:number;

    function click(e:Event) {
        
    }
</script>

<div class="number" on:click="{click}">
    <div class="inner">{control}</div>
    <div class="num-left">{9 - ($solver.cBoard.split(`${control}`).length - 1)}</div>
</div>

<style>
    @import '../../themes.css';

    .number {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        border-radius: 50px;
        border: 1px solid var(--highlight);

        width: 35px;
        height: 35px;
        padding: 7px;

        margin: 0px 5px;

        position: relative;
    }

    .number:hover { cursor: pointer; }

    .inner {
        font-size: 24px;
        color: var(--font-color);
    }

    .num-left {
        position: absolute;
        font-size: 12px;
        bottom: 1px;
    }
</style>
  