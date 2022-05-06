<script lang="ts">
    export let control:number|string;

    function click(e:Event) {
        if (typeof control == "number") {

        } else {
            if (control == "note") {

            } else {

            }
        }
    }
</script>

<div class="number" on:click="{click}">
    
</div>

<style>
    @import '../../themes.css';

    .number {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
  