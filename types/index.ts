// ─── User & Auth ─────────────────────────────────────────────────────────────

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const RANK_LABELS: Record<Rank, string> = {
  1: 'Wanderer',
  2: 'Explorer',
  3: 'Adventurer',
  4: 'Trailblazer',
  5: 'Pathfinder',
  6: 'Conqueror',
  7: 'Legend',
};

export const RANK_XP_THRESHOLDS: Record<Rank, number> = {
  1: 0,
  2: 500,
  3: 1500,
  4: 3500,
  5: 7500,
  6: 15000,
  7: 30000,
};

export interface UserProfile {
  id: string;
  username: string;
  home_city: string;
  rank: Rank;
  total_xp: number;
  avatar_url: string | null;
}

// ─── POI ─────────────────────────────────────────────────────────────────────

export type POICategory =
  | 'Food & Drink'
  | 'Culture & Arts'
  | 'Nature & Outdoors'
  | 'Landmarks & History'
  | 'Social Hubs'
  | 'Hidden Gems';

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  city: string;
  lat: number;
  lng: number;
  difficulty: 1 | 2 | 3;
  xp_value: number;
  foursquare_id: string;
  is_hidden_gem: boolean;
}

export interface DailyHighlight {
  id: string;
  poi_id: string;
  highlight_date: string;
  xp_multiplier: number;
  poi?: POI;
}

// ─── Challenges & Conquests ───────────────────────────────────────────────────

export type ChallengeType = 'capture' | 'connect' | 'discover' | 'complete' | 'reflect';

export interface Challenge {
  id: string;
  conquest_id: string;
  type: ChallengeType;
  completed_at: string | null;
  photo_url: string | null;
  text_entry: string | null;
}

export interface Conquest {
  id: string;
  user_id: string;
  poi_id: string;
  conquered_at: string;
  is_full_conquest: boolean;
  xp_earned: number;
  verified_gps: boolean;
}

// ─── Journal ─────────────────────────────────────────────────────────────────

export interface DecorationState {
  stamp_placed: boolean;
  stickers: string[];       // sticker IDs placed on the page
  page_texture: string | null;
  margin_illustration: string | null;
}

export interface JournalPage {
  id: string;
  user_id: string;
  conquest_id: string;
  page_number: number;
  decoration_state: DecorationState;
  created_at: string;
}

// ─── Stamps & Badges ─────────────────────────────────────────────────────────

export type StampShape = 'circle' | 'octagon' | 'rectangle';

export interface Stamp {
  id: string;
  user_id: string;
  poi_id: string;
  earned_at: string;
  shape_type: StampShape;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
}
