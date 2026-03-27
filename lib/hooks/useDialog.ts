import { DialogControls } from "@/utils/types";
import { useState, useCallback } from "react";

// Hook for managing the open state of a dialog. It provides functions to open, close, and toggle the dialog, as well as a boolean indicating whether the dialog is currently open.
export const useDialog = (): DialogControls => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggleOpen };
};
