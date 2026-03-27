export type GameMode = "501" | "custom-dartsify" | "301";

export type User = {
  username: string;
  email: string;
  name: string;
};

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

export type FieldError = {
  field: string;
  message: string;
  value: string;
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
};

export type Participant = {
  player_username: string;
  player_name: string;
  current_score: number;
  position: number | null;
  status: "validated" | "pending" | "rejected";
  checkout_suggestion: string[];
  is_host: boolean;
};

export type GameDetail = {
  id: number;
  mode: GameMode;
  start_date: Date;
  status: GameStatus;
  target_id: string;
  target_name?: string;
  target_location?: string;
  target_description?: string;
  participations: Participant[];
};
