<script lang="ts">
  export let cellStartId: number;
</script>

<div style="background-color: var(--highlight); height: 100%; width: 5px; border-{cellStartId === 0 ? "top" : "bottom"}-left-radius: {cellStartId === 3 ? "0" : "50"}px; border-{cellStartId === 0 ? "top" : "bottom"}-right-radius: {cellStartId === 3 ? "0" : "50"}px;" />
