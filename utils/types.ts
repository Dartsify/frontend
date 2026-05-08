// Hooks

export type DialogControls = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
  back?: () => void;
  enter?: ({ username, id }: { username?: string; id?: number }) => void;
};

export type SelectorControls = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  handleToggleOpen: () => void;
};

// Data

export type GameMode = "501" | "custom-dartsify" | "301";

export type User = {
  username: string;
  email: string;
  name: string;
  age: number;
  creation_date: Date;
  guest?: boolean; // We add a guest property to the user data to know if the user is a guest or not (we consider that if the username contains "guest_" then it's a guest user)
};

export type Friend = {
  username: string;
  name: string;
  age: number;
  creation_date: Date;
  friends_since: Date;
  games_won_against: number;
  games_played_together: number;
};

export type FriendRequest = {
  username: string;
  name: string;
  age: number;
  creation_date: Date;
  request_date: Date;
};

export type GameStatus = "waiting" | "in_progress" | "finished";

export type Target = {
  id: string;
  name: string;
  description?: string;
  location: string;
  creation_date: Date;
  current_game_id?: number;
  current_game_status: GameStatus;
};

export type Game = {
  id: number;
  mode: GameMode;
  start_date: Date;
  creation_date: Date;
  end_date: Date | null;
  status: GameStatus;
  target_id: string;
  target_name: string;
  target_location: string;
  player_count: number;
  winner_username: string;
  winner_name: string;
};

export type Point = {
  points: number;
  multiplier: number;
  total: number;
};

export type Participant = {
  player_username: string;
  player_name: string;
  current_score: number;
  position: number | null;
  status: "validated" | "pending" | "rejected";
  checkout_suggestion: string[];
  is_host: boolean;
  current_average: number;
  is_friend: boolean;
  last_3_points: Point[];
};

export type Coordinates = {
  x: number;
  y: number;
};

export type GameDetail = {
  id: number;
  mode: GameMode;
  start_date: Date;
  creation_date: Date;
  end_date: Date | null;
  status: GameStatus;
  target_id: string;
  target_name: string;
  target_location: string;
  target_description?: string;
  participations: Participant[];
  current_player_username: string;
  current_turn_number: number;
  current_dart_number: number;
  board_hits: {
    current_player: Coordinates[];
    others: Coordinates[];
  };
};

export type Stats = {
  total_games_played: number;
  total_wins: number;
  win_rate_percentage: number;
  average_points_per_dart: number;
  total_darts_thrown: number;
  total_misses: number;
  total_triple_20: number;
  total_180s: number;
  total_100_plus: number;
  cursed_target: string;
  favorite_targets: string[];
  favorite_play_location: string;
};

export type FriendStats = {
  username: string;
  guest?: boolean;
  name: string;
  age: number;
  creation_date: Date;
  stats: {
    total_games_played: number;
    total_wins: number;
    win_rate_percentage: number;
    average_points_per_dart: number;
    total_darts_thrown: number;
    favorite_targets: string[];
    total_misses: number;
    total_triple_20: number;
    total_180s: number;
    total_100_plus: number;
    cursed_target: string;
    favorite_play_location: string;
  };
};

export type ZonesStats = {
  hit_distribution: { zone: string; hits: number }[];
};

export type HeatmapData = Coordinates[];

export type Notification = "pending-game" | "friend-request" | "other";

export type PendingInvitation = {
  game_id: number;
  game_mode: GameMode;
  final_score: number | null;
  status: "pending" | "accepted" | "rejected";
  player_username: string;
  player_name: string;
  current_score: number;
  position: number | null;
  join_date: Date;
  target_name: string;
  target_location: string;
};

export type PendingGameNotification = PendingInvitation & {
  type: "pending-game";
};

export type FriendRequestNotification = FriendRequest & {
  type: "friend-request";
};

export type DashboardNotification =
  | PendingGameNotification
  | FriendRequestNotification;

export interface ZoneStat {
  zone: string;
  total_hits: number;
  number: Record<string, number>;
}

export type GameStats = {
  game_id: number;
  zone_stats: ZoneStat[];
};

export type FriendStatsSummary = {
  username: string;
  player_name: string;
  stats: {
    total_games_played: number;
    total_wins: number;
  };
};

// Requests

export type FieldError = {
  field: string;
  message: string;
  value: string;
};

export type JoinGameResponse = {
  message: string;
  game_id: number;
  username: string;
  starting_score: number;
  // Received if the user has joined the game as guest
  access_token?: string;
  token_type?: string;
};

export type StartGameStreamOptions = {
  gameId: number;
  signal?: AbortSignal;
  onOpen?: () => void;
  onMessage: (payload: string) => void;
  onClose?: () => void;
};
