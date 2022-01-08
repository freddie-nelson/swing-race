<template>
  <main>
    <canvas class="gameCanvas"></canvas>
  </main>
</template>

<script lang="ts">
import Game from "@/game/game";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "Game",
  components: {},
  setup() {
    onMounted(() => {
      const game = new Game();
    });
  },
});
</script>

<style lang="scss" scoped>
.gameCanvas {
  width: 100vw !important;
  height: 100vh !important;
}
</style>
