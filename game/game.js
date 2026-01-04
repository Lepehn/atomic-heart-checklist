import { GAME_CONFIG } from "./config.js";
import { STATUSES, COMPLETED_STATUSES } from "./statuses.js";
import { CATEGORIES } from "./categories.js";

import { bosses } from "./data/bosses.js";
import { main } from "./data/main.js";
import { weapons } from "./data/weapons.js";

console.log("GAME index loaded");

export const GAME = {
  ...GAME_CONFIG,
  statuses: STATUSES,
  completedStatuses: COMPLETED_STATUSES,
  categories: CATEGORIES,
  data: {
    main,
    bosses,
    weapons
  }
};