import { DialogControls } from "@/utils/types";
import { useState, useCallback } from "react";

// Hook for managing the open state of a dialog. It provides functions to open, close, and toggle the dialog, as well as a boolean indicating whether the dialog is currently open.
export const useDialog = (): DialogControls => {
  const [isOpen, setIsOpen] = useState(false);

  // We handle the enter action in a state in order to be able to set it after the instance of the usedialog
  const [enterAction, setEnterAction] = useState<DialogControls["enter"]>();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  const setEnter = useCallback((action: DialogControls["enter"]) => {
    setEnterAction(() => action);
  }, []);

  return { isOpen, open, close, toggleOpen, enter: enterAction, setEnter };
};
