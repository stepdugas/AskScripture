export type TheologicalLens =
  | "none"
  | "ecumenical"
  | "affirming"
  | "evangelical"
  | "mainline"
  | "academic";

export type Denomination =
  | "none"
  | "catholic"
  | "orthodox"
  | "anglican"
  | "lutheran"
  | "reformed"
  | "methodist"
  | "baptist"
  | "pentecostal"
  | "anabaptist"
  | "non-denominational"
  | "other";

export type FontSize = "comfortable" | "compact" | "large";

export type ChatMode =
  | "scholarly"
  | "devotional"
  | "objective"
  | "affirming"
  | "story"
  | "kids";

export type UserPreferences = {
  translation: string;
  lens: TheologicalLens;
  denomination: Denomination;
  fontSize: FontSize;
  dailyVerse: boolean;
  defaultChatMode: ChatMode;
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  translation: "BSB",
  lens: "none",
  denomination: "none",
  fontSize: "comfortable",
  dailyVerse: true,
  defaultChatMode: "objective",
};

export const LENS_LABELS: Record<TheologicalLens, string> = {
  none: "No declared lens",
  ecumenical: "Ecumenical",
  affirming: "Affirming / inclusive",
  evangelical: "Evangelical",
  mainline: "Mainline Protestant",
  academic: "Academic / critical",
};

export const DENOMINATION_LABELS: Record<Denomination, string> = {
  none: "None / not affiliated",
  catholic: "Catholic",
  orthodox: "Orthodox",
  anglican: "Anglican / Episcopal",
  lutheran: "Lutheran",
  reformed: "Reformed / Presbyterian",
  methodist: "Methodist",
  baptist: "Baptist",
  pentecostal: "Pentecostal / Charismatic",
  anabaptist: "Anabaptist / Mennonite",
  "non-denominational": "Non-denominational",
  other: "Other",
};

export const CHAT_MODE_LABELS: Record<ChatMode, string> = {
  scholarly: "Scholarly",
  devotional: "Devotional",
  objective: "Objective",
  affirming: "Affirming",
  story: "Storytelling",
  kids: "Kids & family",
};
