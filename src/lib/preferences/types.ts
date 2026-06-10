export type TheologicalLens =
  | "none"
  | "ecumenical"
  | "affirming"
  | "evangelical"
  | "mainline"
  | "academic";

export type Denomination =
  | "none"
  | "deconstructing"
  | "curious"
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
  | "jewish"
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
  none: "I'd rather not say",
  ecumenical: "Open across traditions",
  affirming: "Affirming / inclusive",
  evangelical: "Evangelical",
  mainline: "Mainline Protestant",
  academic: "Academic / non-religious",
};

export const DENOMINATION_LABELS: Record<Denomination, string> = {
  none: "None — or I'd rather not say",
  deconstructing: "I left the church (or I'm working on it)",
  curious: "Spiritually curious / not Christian",
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
  jewish: "Jewish",
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
