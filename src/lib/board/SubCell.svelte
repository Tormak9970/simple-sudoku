<script lang="ts">
    import { afterUpdate } from "svelte";

    import { selectedSubCellId, selectedNumber, solver } from "../../stores";
    import { chunk } from "../../Utils";

    export let cellId: number;
    export let subId: number;

    const firmId = `${cellId}${subId}`;

    let displayNotes = false;
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

    let notesList:number[] = [];

    function click(e:Event) {
        if ($selectedSubCellId == firmId) {
            $selectedSubCellId = null;
            $selectedNumber = null;
        } else if (false /*(value == "") && (check if a number is active). if so write note or cell value*/) {

        } else {
            $selectedSubCellId = firmId;
            $selectedNumber = value == "" ? null : value;
        }
    }
</script>

<div class="sub-cell" class:clue={!editable} class:ghost-selected={($selectedNumber == value) || (notesList.includes($selectedNumber)) || ($selectedSubCellId == firmId && !editable)} class:selected={$selectedSubCellId == firmId && editable} on:click="{click}">
    {#if displayNotes}
        <div class="notes-cont">
            {#each notesList as note}
                <div class="note">{note}</div>
            {/each}
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

        border-radius: 50px;

        background-color: transparent;

        transition: background-color 0.3s ease-in-out;
    }

    .sub-cell:hover { background-color: var(--hover); cursor: pointer; }
    .clue { background-color: var(--foreground); }

    .ghost-selected { background-color: var(--hover); }
    .selected, .selected:hover { background-color: var(--highlight); }
</style>
