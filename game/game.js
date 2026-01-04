import { GAME_CONFIG } from "./config.js";
import { STATUSES, COMPLETED_STATUSES } from "./statuses.js";
import { CATEGORIES } from "./categories.js";

import { boss } from "./data/boss.js";
import { main } from "./data/main.js";
import { weapon } from "./data/weapon.js";

console.log("GAME index loaded");

export const GAME = {
  ...GAME_CONFIG,
  statuses: STATUSES,
  completedStatuses: COMPLETED_STATUSES,
  categories: CATEGORIES,
  data: {
    main,
    boss,
    weapon
  }
};
