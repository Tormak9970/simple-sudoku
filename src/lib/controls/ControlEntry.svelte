<script lang="ts">
    import { inNoteMode } from "../../stores";

    export let handler:Function;
    export let isNoteToggle=false;

    function click(e:Event) { handler(e); }
</script>

<div class="control" class:toggled={isNoteToggle && $inNoteMode} on:click="{click}">
    <slot />
</div>

<style>
    @import '../../themes.css';

    .control {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        border-radius: 50px;
        border: 1px solid var(--highlight);

        width: 60px;
        height: 18px;
        padding: 4px;

        margin: 0px 5px;

        transition: background-color 0.3s ease-in-out;
    }

    .control:hover { background-color: var(--foreground); cursor: pointer; }

    .toggled { background-color: var(--highlight); }
</style>
  