<script lang="ts">
    import { onMount } from "svelte";
    import NumberEntry from "./NumberEntry.svelte";

    onMount(() => {
        
    })
</script>

<div id="numbers">
    <NumberEntry control={1} />
    <NumberEntry control={2} />
    <NumberEntry control={3} />
    <NumberEntry control={4} />
    <NumberEntry control={5} />
    <NumberEntry control={6} />
    <NumberEntry control={7} />
    <NumberEntry control={8} />
    <NumberEntry control={9} />
    <NumberEntry control={"note"} />
    <NumberEntry control={"clear"} />
</div>

<style>
    @import '../../themes.css';

    #numbers {
        width: 60vh;
        height: 15vh;

        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
  