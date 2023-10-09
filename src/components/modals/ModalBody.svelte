<script lang="ts">
  export let title: string;
  export let onClose: () => void = () => {};

  let canQuit = false;

  /**
   * Function to run on mouse down to see if the modal should close.
   * @param e The associated event.
   */
  function checkCanQuit(e: MouseEvent): void {
    canQuit = e.currentTarget === e.target && e.button === 0;
  }

  /**
   * Function to run on mouse up to see if the modal should still close.
   * @param e The associated event.
   */
  function closeWrapper(e: MouseEvent): void {
    if (e.currentTarget === e.target && canQuit) onClose();
  }
</script>

<div class="blur"></div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="background"
  on:mousedown="{checkCanQuit}"
  on:mouseup="{closeWrapper}"
  on:contextmenu|preventDefault|stopPropagation>
  <div class="modal-body" on:contextmenu|stopPropagation>
    <div class="header">{title}</div>
    <div class="border" />
    <slot />
  </div>
</div>

<style>
  .background {
    font-size: 12px;
    z-index: 4;
    position: absolute;
    width: 100%;
    height: calc(100% - 30px);
    display: flex;
  }

  .blur {
    z-index: 3;
    position: absolute;
    width: 100%;
    height: calc(100% - 30px);

    background: rgba(6, 6, 6, 0.85);
    backdrop-filter: blur(1px);
  }

  .border {
    margin-top: 7px;
    border-bottom: 1px solid var(--foreground);
    width: 100%;
  }

  .modal-body {
    margin: auto;
    background-color: var(--background);
    border-radius: 4px;
    border: 1px solid var(--shadow);
    position: relative;
    width: min(60vh, 90vw, 400px);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header {
    text-align: center;
    font-size: 20px;
    margin-top: 4px;
  }
</style>
