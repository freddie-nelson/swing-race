<template>
  <canvas class="gameCanvas z-0"></canvas>

  <router-view />
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

.gameCanvas {
  position: absolute;
}

img {
  z-index: 1;
}
</style>
