<script lang="ts">
    import { get, set, update } from "idb-keyval";
    import { createEventDispatcher } from 'svelte';
    
    import { theme } from "../../stores";

    const dispatch = createEventDispatcher();

    export let dataThemeName:string;
    export let placeholder=false;

    function click(e:Event) {
        if (!placeholder) {
            $theme = dataThemeName;
            update('theme', (oldTheme) => oldTheme = dataThemeName);
            document.documentElement.setAttribute('data-theme', dataThemeName);

            dispatch('themeChanged');
        }
    }
</script>

<div class="theme-btn" on:click="{click}">
    <div class="btn-cont">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 352C309 352 352 309 352 256C352 202.1 309 160 256 160C202.1 160 160 202.1 160 256C160 309 202.1 352 256 352z"/>
        </svg>
    </div>
</div>

<style>
    .theme-btn {
        height: 16px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50px;

        padding: 4px;

        margin: 2px;

        background-color: var(--background);

        transition: background-color 0.4s ease-in-out;
    }

    .theme-btn:hover {
        cursor: pointer;
        background-color: var(--hover);
    }

    svg { width: 16px; }

    .btn-cont {
        border-radius: 50px;

        width: 16px;
        height: 16px;

        background-color: var(--foreground);
    }

    .btn-cont > svg > path { fill: var(--highlight); }
    .btn-cont:hover > svg > path { fill: var(--highlight__hover); }
</style>
  