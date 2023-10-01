<script lang="ts">
  import Button from "../utils/Button.svelte";

  export let label: string;
  export let onClick: (e?: Event) => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div style="height: 7px; width: 100%" />
<Button label={label} onClick={onClick} width="120px" height="40px" fontSize="16px" />
