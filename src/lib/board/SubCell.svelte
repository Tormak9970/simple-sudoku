<script lang="ts">
    import { afterUpdate } from "svelte";

    import { selectedSubCellId, selectedNumber, solver, ctrlNumSelected, inNoteMode, initialSelect, rerender } from "../../stores";

    export let cellId: number;
    export let subId: number;

    const firmId = `${cellId}|${subId}`;

    let editable = true; // set true if board is '.' here
    let value = ""; // value of this square
    let notesList:string[] = [];

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
            notesList = data;
        }
    }

    afterUpdate(() => {
        getValue();
        if (editable) getNotes();
    });

    async function click(e:Event) {
        if (!$initialSelect) $initialSelect = "cell";

        if ($initialSelect == "cell") {
            if ($selectedSubCellId == firmId) {
                $selectedSubCellId = null;
                $selectedNumber = null;
            } else {
                $selectedSubCellId = firmId;
                $selectedNumber = value == "" ? null : value;
            }
        }

        if ($ctrlNumSelected && editable) {
            if ($inNoteMode) {
                await $solver.setNote(firmId, $ctrlNumSelected.toString());
                if ($solver.getNote(firmId).includes($ctrlNumSelected)) {
                    $selectedNumber = $ctrlNumSelected;
                } else {
                    $rerender();
                }
            } else {
                if (value != $ctrlNumSelected) {
                    await $solver.setCell(firmId, $ctrlNumSelected.toString());
                    $selectedNumber = $ctrlNumSelected.toString();
                } else if ($initialSelect == "ctrl") {
                    await $solver.setCell(firmId, ".");
                    $selectedNumber = null;
                }
            }
        }

        if (!$ctrlNumSelected && !$selectedSubCellId) $initialSelect = null;
    }
</script>

<div class="sub-cell" class:clue={!editable} class:ghost-selected={
    ((($selectedNumber == value) ||
    (notesList.includes($selectedNumber?.toString()))) && (!$ctrlNumSelected || $ctrlNumSelected == value)) ||
    ($ctrlNumSelected == value) ||
    (notesList.includes($ctrlNumSelected?.toString())) ||
    ($selectedSubCellId == firmId && !editable)} class:selected={$selectedSubCellId == firmId && editable && $initialSelect == "cell"} on:click="{click}">
    {#if value == ""}
        <div class="notes-cont">
            {#each notesList as note}
                <div class="note">
                    <div>{note}</div>
                </div>
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

    .notes-cont {
        width: 80%;
        height: 80%;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
    }

    .note {
        font-size: 10px;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sub-cell:hover { background-color: var(--hover); cursor: pointer; }
    .clue { background-color: var(--foreground); }

    .ghost-selected { background-color: var(--highlight-accent); }
    .selected, .selected:hover { background-color: var(--highlight); }
</style>
