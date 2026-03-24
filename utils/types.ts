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
};

export type FieldError = {
  field: string;
  message: string;
  value: string;
};
