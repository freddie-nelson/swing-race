import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Singleplayer from "../views/Singleplayer.vue";
import Multiplayer from "../views/Multiplayer.vue";
import MapEditor from "../views/MapEditor.vue";
import Leaderboard from "../views/Leaderboard.vue";

import Game from "@/game/game";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/singleplayer",
    name: "Singleplayer",
    component: Singleplayer,
  },
  {
    path: "/multiplayer",
    name: "Multiplayer",
    component: Multiplayer,
  },
  {
    path: "/map-editor",
    name: "MapEditor",
    component: MapEditor,
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    component: Leaderboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(() => {
  Game.hide();
});

export default router;
