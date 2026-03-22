export type User = {
  username: string;
  email: string;
  full_name: string;
};

export type DialogControls = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
};
