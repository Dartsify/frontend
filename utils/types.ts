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
  msg: string;
  input: string;
};

export type FastAPIFieldError = {
  input: string;
  loc: [string];
  msg: string;
  type: string;
  ctx: {
    reason?: string;
  };
};
