<template>
  <section class="w-full max-w-sm h-screen bg-bg-light flex flex-col flex-grow">
    <img
      src="/assets/map-editor-banner.png"
      alt="Map Editor Banner"
      class="w-full pointer-events-none"
    />

    <div class="p-6">
      <h2 class="text-2xl text-white font-main font-bold mb-2.5 select-none">
        Tiles
      </h2>
      <div class="grid grid-cols-4 grid-flow-row gap-4">
        <button
          v-for="(image, i) of tileImages"
          :key="i"
          class="w-full outline-s-cyan"
          :class="{ 'outline outline-4': tileTypes[i] === selectedTile }"
          @click="changeTile(tileTypes[i])"
        >
          <img
            :src="`/assets/tiles/${image}.png`"
            :alt="tileTypes[i]"
            class="w-full"
          />
        </button>
      </div>
    </div>

    <div class="flex justify-between mt-auto mb-5 p-2 px-8">
      <s-image-button
        image="/assets/import-btn.png"
        hoverImage="/assets/import-btn-hover.png"
        class="w-48px h-16px transform scale-110 hover:scale-125"
      />

      <s-image-button
        image="/assets/export-btn.png"
        hoverImage="/assets/export-btn-hover.png"
        class="w-48px h-16px transform scale-110 hover:scale-125"
      />
    </div>

    <router-link
      to="/"
      class="
        font-main font-bold
        text-white text-xl
        underline
        hover:text-s-cyan
        transition-colors
        ease-in-out
        duration-300
        mb-6
        mx-auto
      "
      >Back to Menu</router-link
    >
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import Game from "@/game/game";
import MapEditor from "@/game/mapEditor";
import SImageButton from "@/components/app/SImageButton.vue";

export default defineComponent({
  name: "MapEditor",
  components: { SImageButton },
  setup() {
    const mapEditor = ref<MapEditor>();
    // eslint-disable-next-line no-undef
    const tileTypes = ref(TILE_TYPES);
    // eslint-disable-next-line no-undef
    const tileImages = ref(TILE_IMAGES);
    const selectedTile = ref("");

    const changeTile = (type: string) => {
      mapEditor.value?.setTileType(type);
      selectedTile.value = type;

      document.getElementById("blzCanvas")?.focus();
    };

    onMounted(() => {
      document.getElementById("app")?.classList.add("map-editor");

      Game.show();
      mapEditor.value = Game.loadMapEditor();
      selectedTile.value = mapEditor.value?.tileType || "";
    });

    onUnmounted(() => {
      document.getElementById("app")?.classList.remove("map-editor");

      Game.unload();
    });

    return {
      tileTypes,
      tileImages,
      selectedTile,
      mapEditor,

      changeTile,
    };
  },
});
</script>

<style lang="scss">
.map-editor {
  display: flex;

  .gameCanvas {
    height: 100vh !important;
  }
}
</style>

<style lang="scss" scoped>
</style>