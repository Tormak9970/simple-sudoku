<script lang="ts">
    import { afterUpdate } from "svelte";

    import { selectedSubCellId, selectedNumber, solver, ctrlNumSelected, inNoteMode, initialSelect } from "../../stores";

    export let cellId: number;
    export let subId: number;

    const firmId = `${cellId}|${subId}`;

    let editable = true; // set true if board is '.' here
    let value = ""; // value of this square
    let notesList:string[] = [];

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
            const data = $solver.getCell(firmId);
            value = data.value;
            editable = data.editable;
        }
    }
    function getNotes() {
        if ($solver.cBoard) {
            const data = $solver.getNote(firmId);
            if (data) notesList = data;
        }
    }

    afterUpdate(() => {
        getValue();
        if (value == "") getNotes();
    });

    function click(e:Event) {
        if ($selectedSubCellId == firmId) {
            $selectedSubCellId = null;
            $selectedNumber = null;
        } else {
            $selectedSubCellId = firmId;
            $selectedNumber = value == "" ? null : value;
        }

        if (!$initialSelect) $initialSelect = "cell";

        if ($ctrlNumSelected && editable) {
            if ($inNoteMode) {

            } else {
                if (value != $ctrlNumSelected) {
                    $solver.setCell(firmId, $ctrlNumSelected.toString());
                    $selectedNumber = $ctrlNumSelected.toString();
                } else if ($initialSelect == "ctrl") {
                    $solver.setCell(firmId, ".");
                    $selectedNumber = null;
                }
            }
        }

        if (!$ctrlNumSelected && !$selectedSubCellId) $initialSelect = null;
    }
</script>

<div class="sub-cell" class:clue={!editable} class:ghost-selected={($selectedNumber == value) || (notesList.includes($selectedNumber)) || ($ctrlNumSelected == value) || (notesList.includes($ctrlNumSelected)) || ($selectedSubCellId == firmId && !editable)} class:selected={$selectedSubCellId == firmId && editable} on:click="{click}">
    {#if value == ""}
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
