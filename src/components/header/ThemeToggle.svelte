<script lang="ts">
  import { set } from "idb-keyval";
  import { theme } from "../../stores";

  export let value = true;

  /**
   * Handles when the slider is clicked.
   * @param event The MouseEvent passed to the handler.
   */
  function handleClick(event: MouseEvent): void {
    const target = event.target as HTMLInputElement;

    const state = target.getAttribute("aria-checked");

    value = state === "true" ? false : true;
    
    $theme = value ? "dark" : "light";
    set("theme", $theme);
    document.documentElement.setAttribute("data-theme", $theme);
  }
</script>

<div class="toggle">
  <button role="switch" aria-checked="{value}" on:click="{handleClick}" />
</div>

<style>
  .toggle {
    display: flex;
    align-items: center;
  }

  .toggle button {
    width: 2.15em;
    height: 1.2em;
    position: relative;
    background: var(--background);
    border: none;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }
  .toggle button:hover {
    background: var(--background-hover);
  }

  .toggle button::before {
    position: absolute;
    width: 0.9em;
    height: 0.9em;

    top: 0.15em;
    right: 1.1em;

    transition: transform 0.3s;
    
    content: "";
    background-image: url("/images/light-mode.svg");
    background-size: 0.9em 0.9em;
  }

  .toggle button[aria-checked="true"] {
    background-color: var(--highlight);

    transition: background-color 0.15s ease-in-out;
  }
  .toggle button[aria-checked="true"]:hover {
    background-color: var(--highlight-hover);
  }
  .toggle button[aria-checked="true"]::before {
    transform: translateX(0.9em);
    transition: transform 0.3s;
    
    content: "";
    background-image: url("/images/dark-mode.svg");
    background-size: 0.9em 0.9em;
  }

  .toggle button {
    border-radius: 1.5em;
  }
  .toggle button::before {
    border-radius: 100%;
  }
</style>
