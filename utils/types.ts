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
  enter?: () => void;
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
