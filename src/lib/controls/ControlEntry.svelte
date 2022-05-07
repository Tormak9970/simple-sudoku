<script lang="ts">
    export let handler:Function;

    function click(e:Event) { handler(e); }
</script>

<div class="control" on:click="{click}">
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

    .control:hover { background-color: var(--highlight); cursor: pointer; }
</style>
  