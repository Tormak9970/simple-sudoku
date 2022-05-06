<script lang="ts">
    import { get, set, update } from "idb-keyval";
    import { isPaused, timer } from "../../stores";
    import { onDestroy, onMount } from "svelte";
    import ThemeController from "./ThemeController.svelte";

    export let difficulty:string;

    let intervalId: NodeJS.Timer;

    onMount(() => {
        intervalId = setInterval(() => {
            if (!$isPaused) {
                let [hours, minutes, seconds] = $timer.split(":").map(v => parseInt(v));

                if (seconds == 59) {
                    if (minutes == 59) {
                        if (hours != 23) {
                            hours++;
                            minutes = 0;
                            seconds = 0;
                        }
                    } else {
                        minutes++;
                        seconds = 0;
                    }
                } else {
                    seconds++;
                }

                $timer = `${(hours < 10) ? '0'+hours : hours}:${(minutes < 10) ? '0'+minutes : minutes}:${(seconds < 10) ? '0'+seconds : seconds}`;
                update(`timer-${difficulty}`, (oldTime) => oldTime = $timer);
            }
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

    function back(e:Event) {

    }
</script>

<div id="gameHeader">
    <div class="back-cont" on:click="{back}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z"/>
        </svg>
    </div>
    
    <div class="timer-cont">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path d="M272 0C289.7 0 304 14.33 304 32C304 49.67 289.7 64 272 64H256V98.45C293.5 104.2 327.7 120 355.7 143L377.4 121.4C389.9 108.9 410.1 108.9 422.6 121.4C435.1 133.9 435.1 154.1 422.6 166.6L398.5 190.8C419.7 223.3 432 262.2 432 304C432 418.9 338.9 512 224 512C109.1 512 16 418.9 16 304C16 200 92.32 113.8 192 98.45V64H176C158.3 64 144 49.67 144 32C144 14.33 158.3 0 176 0L272 0zM248 192C248 178.7 237.3 168 224 168C210.7 168 200 178.7 200 192V320C200 333.3 210.7 344 224 344C237.3 344 248 333.3 248 320V192z"/>
        </svg>
        <div style="padding-left: 5px; align-self:flex-end;">{$timer}</div>
    </div>

    <div class="themes-cont">
        <ThemeController />
    </div>
</div>

<style>
    @import '../../themes.css';

    #gameHeader {
        width: 60vh;
        height: 5vh;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .back-cont {
        height: 18px;
        width: 18px;
        border-radius: 50px;
        padding: 5px;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: background-color 0.4s ease-in-out;
    }

    .back-cont:hover {
        background-color: var(--highlight);
        cursor: pointer;
    }

    .timer-cont {
        display: flex;
        align-items: center;
        height: 22px;
        color: var(--font-color);
    }

    svg {
        width: 16px;
    }

    svg > path {
        fill: var(--font-color);
    }
</style>
  