<script lang="ts">
    import { afterUpdate } from "svelte";

    import { ctrlNumSelected, initialSelect, inNoteMode, selectedNumber, selectedSubCellId, solver } from "../../stores";

    export let control:number;

    function click(e:Event) {
        $ctrlNumSelected = $ctrlNumSelected == control ? null : control;

        if (!$initialSelect) $initialSelect = "ctrl";
        
        if ($selectedSubCellId) {
            const cellVal = $solver.getCell($selectedSubCellId)
            if (cellVal.editable) {
                if ($inNoteMode) {
                    // $solver.setNote($selectedSubCellId, control.toString());
                    // $selectedNumber = control;
                } else {
                    if (cellVal.value != control.toString()) {
                        $solver.setCell($selectedSubCellId, control.toString());
                        $selectedNumber = control;
                    } else if ($initialSelect == "cell") {
                        $solver.setCell($selectedSubCellId, ".");
                        $selectedNumber = null;
                    }
                }
            }
        }

        if (!$ctrlNumSelected && !$selectedSubCellId) $initialSelect = null;
    }

    let numLeft = 9 - ($solver.cBoard.split(`${control}`).length - 1);

    afterUpdate(() => {
        numLeft = 9 - ($solver.cBoard.split(`${control}`).length - 1);
    });
</script>

<div class="number" class:selected={$ctrlNumSelected == control && $initialSelect == "ctrl"} on:click="{click}">
    <div class="inner">{control}</div>
    <div class="num-left">{numLeft}</div>
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

        transition: background-color 0.3s ease-in-out;
    }

    .number:hover { cursor: pointer; background-color: var(--foreground); }

    .inner {
        font-size: 24px;
        color: var(--font-color);
    }

    .num-left {
        position: absolute;
        font-size: 12px;
        bottom: 1px;
    }

    .selected { background-color: var(--highlight); }
</style>
  