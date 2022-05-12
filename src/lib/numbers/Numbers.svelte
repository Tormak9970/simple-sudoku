<script lang="ts">
    import { rerender, selectedSubCellId, solver } from "../../stores";

    import NumberEntry from "./NumberEntry.svelte";

    function clearClick(e:Event) {
        if ($selectedSubCellId && $solver.getCell($selectedSubCellId).editable) {
            $solver.setCell($selectedSubCellId, ".");
            $rerender();
        }
    }
</script>

<div id="numbers">
    <div class="row" style="margin-bottom: 7px;">
        <NumberEntry control={1} />
        <NumberEntry control={2} />
        <NumberEntry control={3} />
        <NumberEntry control={4} />
        <NumberEntry control={5} />
    </div>
    <div class="row">
        <NumberEntry control={6} />
        <NumberEntry control={7} />
        <NumberEntry control={8} />
        <NumberEntry control={9} />
        <div class="clear" on:click="{clearClick}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/>
            </svg>
        </div>
    </div>
</div>

<style>
    @import '../../themes.css';

    #numbers {
        margin: 2vh 0vh;
        width: min(60vh, 90vw);

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .clear {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        border-radius: 50px;
        border: 1px solid var(--highlight);

        width: 35px;
        height: 35px;
        padding: 5px;

        margin: 0px 7px;

        transition: background-color 0.3s ease-in-out;
    }

    .clear:hover { cursor: pointer; background-color: var(--foreground); }

    .clear > svg { height: 24px; }
    .clear > svg > path { fill: var(--font-color); }
</style>
  