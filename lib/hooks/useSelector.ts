import { SelectorControls } from "@/utils/types";
import { useCallback, useState } from "react";

// Hook for managing the state of a selector component. It provides the current open state of the selector, the index of the currently selected option, and functions to set the selected index and toggle the open state of the selector.
// An hook is useful bc we can access the state (currentIndex and close/open) from the parent component without passing fuctions in props
export const useSelector = (defaultIndex?: number): SelectorControls => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  {
    /* !! not only write defaultIndex bc 0 is interpreted as false  */
  }
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    defaultIndex !== undefined ? defaultIndex : null,
  );

  //   Open the selector
  const open = useCallback(() => setIsOpen(true), []);
  //   Close the selector
  const close = useCallback(() => setIsOpen(false), []);
  // Toggle open / close the selector
  const handleToggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    selectedIndex,
    setSelectedIndex,
    handleToggleOpen,
  };
};
