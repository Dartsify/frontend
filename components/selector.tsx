import { SelectorControls } from "@/utils/types";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Selector({
  selectorControls,
  options,
  placeholder = "Sélectionnez une option",
  width = "w-45",
}: {
  selectorControls: SelectorControls;
  options: string[];
  placeholder?: string;
  width?: string;
}) {
  //   Controls from the specific hook
  const {
    selectedIndex,
    setSelectedIndex,
    handleToggleOpen,
    open,
    close,
    isOpen,
  } = selectorControls;

  const selectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!selectorRef.current) {
        return;
      }

      const target = event.target as Node | null;
      if (target && !selectorRef.current.contains(target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSelectOption = (index: number) => {
    // Set the selected index to the index of the option that was clicked
    setSelectedIndex(index);
    // Close the dropdown after selecting an option
    handleToggleOpen();
  };

  const listItem = (option: string, index: number) => {
    return (
      <li className="" key={index}>
        <button
          className="font-medium text-sm leading-none w-full text-left cursor-pointer transition-colors px-1.5 py-1 rounded-md flex justify-between items-center hover:bg-alice-blue-50"
          type="button"
          onClick={() => handleSelectOption(index)}
        >
          {option}
          {index == selectedIndex && (
            <Check size={16} className="stroke-foreground" />
          )}
        </button>
      </li>
    );
  };

  return (
    <div ref={selectorRef} className={`relative ${width} my-1`}>
      <div
        onClick={handleToggleOpen}
        // Padding of the container + elem in the dropdown : x : 1 + 1.5 / y : 1 + 1
        className="badge badge-neutral cursor-pointer justify-between px-2 py-1"
      >
        {/* !! not only write defaultIndex bc 0 is interpreted as false  */}
        {/* If a defaultIndex is provided, use it; otherwise, show the placeholder (which is set "Sélectionnez une option" by default) */}
        <p className={`${selectedIndex == null && "text-foreground-soft"}`}>
          {selectedIndex !== null ? options[selectedIndex] : placeholder}
        </p>
        <ChevronDown size={16} className="stroke-foreground-soft" />
      </div>

      <div
        className={`absolute top-0 left-0 right-0 bg-background shadow-md outline outline-border-2 rounded-lg p-1 ${isOpen ? "block" : "hidden"}`}
      >
        <ul className="flex flex-col gap-0.5">
          {options.map((option, index) => listItem(option, index))}
        </ul>
      </div>
    </div>
  );
}
