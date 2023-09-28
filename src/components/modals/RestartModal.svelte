<script lang="ts">
  import ModalBody from "./ModalBody.svelte";
  import { showRestartModal, restartCallback, isPaused } from "../../stores";
  import Button from "../utils/Button.svelte";

  /**
   * Function to run on confirmation.
   */
  function onConfirm(): void {
    $restartCallback()
  }

  /**
   * Function to run on cancel.
   */
  function onCancel(): void {
    $showRestartModal = false;
    $isPaused = false;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ModalBody title="Careful!" canClose="{false}">
  <div class="content">
    <div class="info">
      <div class="type-cont">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="3em"
          viewBox="0 0 512 512"
          fill="#ffee04">
          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
          ></path>
        </svg>
      </div>
      <div class="message">If you restart, all progress will be lost.</div>
    </div>
    <div class="buttons">
      <Button
        label="Continue"
        onClick="{onConfirm}"
        width="47.5%" />
      <Button
        label="Cancel"
        onClick="{onCancel}"
        width="47.5%" />
    </div>
  </div>
</ModalBody>

<style>
  .content {
    max-width: 400px;
  }

  .info {
    margin: 0px 10px;
    margin-top: 7px;
    font-size: 14px;

    display: flex;
    align-items: center;
  }

  .message {
    margin-left: 15px;
  }

  .buttons {
    margin-top: 14px;
    margin-bottom: 7px;
    margin-left: 7px;
    margin-right: 7px;
    width: calc(100% - 14px);
    display: flex;
    justify-content: space-around;
    justify-self: flex-end;
  }
</style>
