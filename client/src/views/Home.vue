<template>
  <main class="flex flex-col justify-center items-center p-12">
    <img
      src="/assets/logo.png"
      alt="Swing Race Logo"
      class="
        w-256
        -mt-[calc(36px*var(--img-scale))]
        mb-16
        [image-rendering:pixelated]
        select-none
        pointer-events-none
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

    <div class="flex mb-10">
      <s-image-button
        image="/assets/map-editor-btn.png"
        hoverImage="/assets/map-editor-btn-hover.png"
        class="w-128 h-32 mr-10 transform hover:scale-110"
        @click="$router.push({ name: 'Leaderboard' })"
      />

      <s-image-button
        image="/assets/leaderboard-btn.png"
        hoverImage="/assets/leaderboard-btn-hover.png"
        class="w-128 h-32 transform hover:scale-110"
        @click="$router.push({ name: 'Leaderboard' })"
      />
    </div>
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
