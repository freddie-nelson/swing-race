<template>
  <canvas class="gameCanvas"></canvas>

  <router-view class="bg-bg" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Game from "./game/game";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    onMounted(() => {
      Game.init();
    });
  },
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  image-rendering: pixelated;
}

:root {
  --img-scale: 2.75;
}

body,
#app,
main {
  width: 100vw;
  min-height: 100vh;
}

img {
  z-index: 1;
  user-select: none;
}
</style>
