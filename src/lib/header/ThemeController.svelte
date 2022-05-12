<script lang="ts">
    import ThemeBtn from "./ThemeBtn.svelte";

    type Theme = {
        fg:string,
        bg:string,
        hvr:string,
        hlgt:string,
        hlgtH:string
    }

    let themes:{[theme:string]: Theme} = {
        "light": {
            bg:"#FCF8E8",
            fg:"#e9d7b6",
            hvr:"#e6c895",
            hlgt:"#e38a53",
            hlgtH:"#e17938"
        },
        "earth": {
            bg:"#FAFDD6",
            fg:"#E4E9BE",
            hvr:"#cfd4a7",
            hlgt:"#A2B38B",
            hlgtH:"#8da36e"
        },
        "sea": {
            bg:"#EFFFFD",
            fg:"#c8f3fa",
            hvr:"#add1d7",
            hlgt:"#4addea",
            hlgtH:"#46d5e2"
        },
        "grass": {
            bg: "#F4EEA9",
            fg: "#F0BB62",
            hvr: "#d4a149",
            hlgt: "#519259",
            hlgtH: "#3c7c44"
        },
        "peace": {
            bg: "#D5BFBF",
            fg: "#d09393",
            hvr: "#b66b6b",
            hlgt: "#6D8299",
            hlgtH: "#4f6d8e"
        },
        "dark": {
            bg:"#1a1a1a",
            fg:"#252525",
            hvr:"#303030",
            hlgt:"#82b74bff",
            hlgtH:"#8ac24e"
        },
        "sunset": {
            bg:"#511845",
            fg:"#900C3F",
            hvr:"#a9164e",
            hlgt:"#C70039",
            hlgtH:"#d41249"
        },
        "pop": {
            bg:"#251D3A",
            fg:"#2A2550",
            hvr:"#382f7f",
            hlgt:"#E04D01",
            hlgtH:"#e03711"
        },
        "space": {
            bg:"#180A0A",
            fg:"#711A75",
            hvr:"#9d19a4",
            hlgt:"#F10086",
            hlgtH:"#eb136a"
        },
        "magma": {
            bg:"#000000",
            fg:"#3D0000",
            hvr:"#5d0404",
            hlgt:"#950101",
            hlgtH:"#b30808"
        },
        "placeholder": {
            bg:"transparent",
            fg:"transparent",
            hvr:"transparent",
            hlgt:"transparent",
            hlgtH:"transparent"
        },
    }

    let expanded = false;
</script>

<div id="themeController">
    <div class="theme-selection" class:collapsed={!expanded}>
        {#each Object.entries(themes) as [name, theme]}
            <ThemeBtn dataThemeName={name} --foreground={theme.fg} --background={theme.bg} --hover={theme.hvr} --highlight={theme.hlgt} --highlight-hover={theme.hlgtH} on:themeChanged={() => { expanded = false; }}/>
        {/each}
    </div>
    <div class="current-theme" on:click="{() => { expanded = !expanded; }}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path d="M222.7 32.15C227.7 49.08 218.1 66.9 201.1 71.94C121.8 95.55 64 169.1 64 255.1C64 362 149.1 447.1 256 447.1C362 447.1 448 362 448 255.1C448 169.1 390.2 95.55 310.9 71.94C293.9 66.9 284.3 49.08 289.3 32.15C294.4 15.21 312.2 5.562 329.1 10.6C434.9 42.07 512 139.1 512 255.1C512 397.4 397.4 511.1 256 511.1C114.6 511.1 0 397.4 0 255.1C0 139.1 77.15 42.07 182.9 10.6C199.8 5.562 217.6 15.21 222.7 32.15V32.15z"/>
        </svg>
    </div>
</div>

<style>
    @import '../../themes.css';

    #themeController {
        height: 16px;
        
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        position: relative;

        padding: 6px;

        margin: 1px;
    }

    .theme-selection {
        z-index: 1;
        height: 100%;
        right: -7px;

        background-color: var(--foreground);

        display: flex;
        position: absolute;

        border-radius: 50px;

        max-width: 400px;

        transition: max-width 1s ease-in-out, background-color 0.4s ease-in-out;

        overflow: hidden;
    }

    .collapsed {
        max-width: 28px;
        background-color: transparent;
    }

    svg { width: 16px; }

    .current-theme {
        z-index: 3;
        position: absolute;
        border-radius: 50px;

        padding: 6px;
        width: 16px;
        height: 16px;

        background-color: var(--background);

        transition: background-color 0.4s ease-in-out;
    }

    .current-theme:hover { cursor: pointer; background-color: var(--hover); }
    .current-theme:hover > svg > path { fill: var(--highlight-hover); }
    .current-theme > svg > path { fill: var(--highlight); }
</style>
  