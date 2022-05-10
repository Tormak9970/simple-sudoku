<script lang="ts">
    import { get, set } from "idb-keyval";
  
    import { theme } from "../stores";
  
  
    async function load() {
      // get saved theme or save default
      if (await get("theme")) {
        $theme = await get("theme");
      } else {
        await set("theme", $theme);
      }
      document.documentElement.setAttribute('data-theme', $theme);
    }
  </script>
  
  <div id="startScreen">
    {#await load() then _}
        
    {/await}
  </div>
  
  <style>
    @import "../themes.css";
  
    main {
      width: 100%;
      height: 100%;
  
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  </style>
  