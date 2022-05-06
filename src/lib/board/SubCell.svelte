<script lang="ts">
    import { afterUpdate } from "svelte";

    import { solver } from "../../stores";
    import { chunk } from "../../Utils";

    export let cellId: number;
    export let subId: number;

    let hasNotes = false;
    let editable = true; // set true if board is '.' here
    let value = ""; // value of this square

    /**
     * TODO:
     * Selected cell should have ghost highlight if same number is selected
     * Ghost selected class should be overwriten by selected class
     *
     * Cell should overwrite notes when number is chosen
     *
     */

    function getValue() {
        if ($solver.cBoard) {
            const iBoardArr = chunk($solver.iBoard.split(""), 9);
            const cBoardArr = chunk($solver.cBoard.split(""), 9);
            const iVals = [];
            const cVals = [];

            for (let i = 0; i < 3; i++) {
                const sIdx = (cellId % 3) * 3;
                iVals.push(...(iBoardArr[i + Math.floor(cellId / 3) * 3].slice(sIdx, sIdx + 3)));
                cVals.push(...(cBoardArr[i + Math.floor(cellId / 3) * 3].slice(sIdx, sIdx + 3)));
            }

            if (cVals[subId] != ".") {
                value = cVals[subId];
                editable = iVals[subId] == ".";
            }
        }
    }

    afterUpdate(() => {
        getValue();
    });
</script>

<div class="sub-cell">
    {#if hasNotes}
        <div class="notes-cont">

        </div>
    {:else}
        <div class="val-cont">
            <div class="val">{value}</div>
        </div>
    {/if}
</div>

<style>
    @import "../../themes.css";

    .sub-cell {
        width: calc((100% - 4px) / 3);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 24px;

        border-radius: 8px;
    }

    .sub-cell:hover {
        background-color: var(--hover);
        cursor: pointer;
    }
</style>
