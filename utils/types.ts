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
