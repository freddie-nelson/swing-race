<template>
  <main class="flex flex-col justify-center items-center bg-bg p-12">
    <img
      src="/assets/logo.png"
      alt="Swing Race Logo"
      class="
        w-256
        -mt-[calc(36px*var(--img-scale))]
        mb-16
        [image-rendering:pixelated]
      "
    />

    <div class="flex mb-10">
      <s-image-button
        image="/assets/singleplayer-btn.png"
        hoverImage="/assets/singleplayer-btn-hover.png"
        class="w-128 h-32 mr-10 transform hover:scale-110"
        @click="$router.push({ name: 'Singleplayer' })"
      />

      <s-image-button
        image="/assets/multiplayer-btn.png"
        hoverImage="/assets/multiplayer-btn-hover.png"
        class="w-128 h-32 transform hover:scale-110"
        @click="$router.push({ name: 'Multiplayer' })"
      />
    </div>

    <s-image-button
      image="/assets/leaderboard-btn.png"
      hoverImage="/assets/leaderboard-btn-hover.png"
      class="w-128 h-32 transform hover:scale-110"
      @click="$router.push({ name: 'Leaderboard' })"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SImageButton from "@/components/app/SImageButton.vue";

export default defineComponent({
  name: "Home",
  components: {
    SImageButton,
  },
});
</script>
