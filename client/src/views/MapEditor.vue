<template>
  <section
    class="
      w-full
      max-w-sm
      h-screen
      bg-bg-light
      flex flex-col flex-grow
      relative
    "
  >
    <img
      src="/assets/misc/map-editor-banner.png"
      alt="Map Editor Banner"
      class="w-full pointer-events-none"
    />

    <div class="p-6">
      <h2 class="text-2xl text-white font-main font-bold mb-4 select-none">
        Tiles
      </h2>
      <s-input-text
        v-model="tileRotationInc"
        name="tileRotationInc"
        placeholder="-360 to 360"
        label="Rotation Step"
        class="text-white text-sm mb-5"
      />
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

    <div class="flex flex-col mt-auto">
      <div class="flex justify-between mb-7 p-2 px-8">
        <s-image-button
          image="/assets/buttons/import-btn.png"
          hoverImage="/assets/buttons/import-btn-hover.png"
          class="w-48px h-16px transform scale-110 hover:scale-125"
          @click="importMap"
        />

        <s-image-button
          image="/assets/buttons/export-btn.png"
          hoverImage="/assets/buttons/export-btn-hover.png"
          class="w-48px h-16px transform scale-110 hover:scale-125"
          @click="showExportModal = true"
        />
        <s-modal
          v-if="showExportModal"
          @close="showExportModal = false"
          class="w-full max-w-xl"
        >
          <div class="flex flex-col items-center">
            <h2 class="text-3xl">Export Map</h2>
            <form
              class="flex flex-col gap-4 mt-6 w-full max-w-lg"
              @submit.prevent="exportMap"
            >
              <s-input-text
                v-model="mapName"
                name="mapName"
                label="Map Name"
                placeholder="My Map"
                required
              />
              <s-input-text
                v-model="mapAuthor"
                name="mapAuthor"
                label="Author Name"
                placeholder="Joe Mama"
                required
              />

              <s-button class="mt-5 py-0 text-lg" type="submit"
                >Export</s-button
              >
            </form>
          </div>
        </s-modal>
      </div>

      <s-button
        class="
          text-base
          w-[calc(100%-1.3rem)]
          mx-auto
          h-6
          mb-9
          transform
          scale-90
        "
        @click="playTest"
      >
        {{ isPlayTesting ? "Stop Play Test" : "Play Test" }}
      </s-button>

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
      >
        Back to Menu
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import Game from "@/game/game";
import MapEditor from "@/game/mapEditor";

import SImageButton from "@/components/button/SImageButton.vue";
import SModal from "@/components/modal/SModal.vue";
import SInputText from "@/components/input/SInputText.vue";
import SButton from "@/components/button/SButton.vue";

export default defineComponent({
  name: "MapEditor",
  components: {
    SImageButton,
    SModal,
    SInputText,
    SButton,
  },
  setup() {
    let mapEditor: MapEditor;
    // eslint-disable-next-line no-undef
    const tileTypes = ref(TILE_TYPES);
    // eslint-disable-next-line no-undef
    const tileImages = ref(TILE_IMAGES);
    const selectedTile = ref("");

    const changeTile = (type: string) => {
      mapEditor?.setTileType(type);
      selectedTile.value = type;

      document.getElementById("blzCanvas")?.focus();
    };

    // eslint-disable-next-line no-undef
    const tileRotationInc = ref(String((TILE_ROTATION_INC / Math.PI) * 180));
    watch(tileRotationInc, (rot) => {
      // eslint-disable-next-line no-undef
      TILE_ROTATION_INC = ((Number(rot) || -90) * Math.PI) / 180;
      mapEditor.ghostTile.setRotation(0);
      mapEditor.ghostTile.setPosition(mapEditor.ghostTile.getPosition());
    });

    const importMap = () => {
      if (!mapEditor) return;

      mapEditor.importMap();
      mapName.value = mapEditor.map.name;
      mapAuthor.value = mapEditor.map.author;
    };

    const showExportModal = ref(false);

    const mapName = ref("");
    const mapAuthor = ref("");
    const exportMap = () => {
      if (!mapEditor || !mapName.value || !mapAuthor.value) return;

      mapEditor.exportMap(mapName.value, mapAuthor.value);
      showExportModal.value = false;
    };

    const isPlayTesting = ref(false);
    const playTest = () => {
      if (!mapEditor) return;

      isPlayTesting.value = !isPlayTesting.value;
      mapEditor.playTest();
    };

    onMounted(() => {
      document.getElementById("app")?.classList.add("map-editor");

      Game.show();
      let m = Game.loadMapEditor();
      if (m) mapEditor = m;
      selectedTile.value = mapEditor?.tileType || "";
    });

    onUnmounted(() => {
      document.getElementById("app")?.classList.remove("map-editor");

      Game.unload();
    });

    return {
      tileTypes,
      tileImages,
      selectedTile,

      changeTile,
      tileRotationInc,

      importMap,

      showExportModal,
      mapName,
      mapAuthor,
      exportMap,

      isPlayTesting,
      playTest,
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