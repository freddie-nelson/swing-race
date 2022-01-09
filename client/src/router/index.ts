import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Game from "../views/Game.vue";
import Singleplayer from "../views/Singleplayer.vue";
import Multiplayer from "../views/Multiplayer.vue";
import Leaderboard from "../views/Leaderboard.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/game",
    name: "Game",
    component: Game,
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
    path: "/leaderboard",
    name: "Leaderboard",
    component: Leaderboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
