<script lang="ts">
    import Carousel from 'svelte-carousel';
    import { selectedDiff } from '../../stores';
    import { set } from 'idb-keyval';

    export let difficulties:string[];
    
    let renderedDiff = 0;
    let carousel;

    async function leftArrowClick(e:Event) {
        if (renderedDiff == 0) {
            renderedDiff = 3;
        } else {
            renderedDiff--;
        }
        $selectedDiff = difficulties[renderedDiff].toLowerCase();
        await set('difficulty', $selectedDiff);
        carousel.goToPrev();
    }
    async function rightArrowClick(e:Event) {
        if (renderedDiff == 3) {
            renderedDiff = 0;
        } else {
            renderedDiff++;
        }
        $selectedDiff = difficulties[renderedDiff].toLowerCase();
        await set('difficulty', $selectedDiff);
        carousel.goToNext();
    }
</script>

<div id="diffSelector">
    <Carousel
        dots={false}
        bind:this={carousel}
        >
        <div slot="prev" on:click={leftArrowClick} class="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path d="M77.25 256l137.4-137.4c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-160 160c-12.5 12.5-12.5 32.75 0 45.25l160 160C175.6 444.9 183.8 448 192 448s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L77.25 256zM269.3 256l137.4-137.4c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-160 160c-12.5 12.5-12.5 32.75 0 45.25l160 160C367.6 444.9 375.8 448 384 448s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L269.3 256z"/>
            </svg>
        </div>
        {#each difficulties as diff}
            <div class="panel-wrap">
                <div>{diff}</div>
            </div>
        {/each}
        <div slot="next" on:click={rightArrowClick} class="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path d="M246.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L178.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C47.63 444.9 55.81 448 64 448s16.38-3.125 22.62-9.375l160-160C259.1 266.1 259.1 245.9 246.6 233.4zM438.6 233.4l-160-160c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L370.8 256l-137.4 137.4c-12.5 12.5-12.5 32.75 0 45.25C239.6 444.9 247.8 448 256 448s16.38-3.125 22.62-9.375l160-160C451.1 266.1 451.1 245.9 438.6 233.4z"/>
            </svg>
        </div>
    </Carousel>
</div>

<style>
    @import "../../themes.css";

    #diffSelector {
        width: min(30vh, 50vw);

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        margin-top: 20px;
    }

    .arrow {
        background-color: var(--background); 
        transition: background-color 0.4s ease-in-out;

        width: 30px;
        height: 30px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border-radius: 8px;
    }
    .arrow:hover {background-color: var(--foreground); cursor: pointer;}
    .arrow > svg { width: 24px; }
    .arrow > svg > path { fill: var(--font-color); }

    .panel-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .panel-wrap > div {
        color: var(--font-color);
        font-size: 24px;
    }
</style>
