import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface ToggleDropdownProps<T extends string> {
  options: T[];
  selected: T;
  titleText: string;
  includeTitle: boolean;
  onChange: (value: T) => void;
}

export const ToggleDropdown = <T extends string>({
  options,
  selected,
  titleText,
  includeTitle,
  onChange,
}: ToggleDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block cursor-pointer" ref={dropdownRef}>

      {/* Title above toggle */}
      {includeTitle &&
      <p className="absolute -top-6 left-1/2 -ml-[0.1em] -translate-x-1/2 text-center font-im text-xs text-main-300 ">
        {titleText}
      </p>
      }

      <div className="relative rounded-r-xl border-[0.12em] border-main-base bg-primary-button-gradient sm:border">
        <button
          onClick={toggleDropdown}
          className="flex w-full items-center justify-center px-4 py-2"
          aria-label="Toggle dropdown"
        >
          <ChevronDownIcon className="h-6 w-4 text-main-base" strokeWidth={4} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-max">
            <div className="flex flex-col rounded-xl border-[0.12em] bg-black p-2 shadow-lg sm:border">
              {options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`rounded-lg px-3 py-2 text-left font-im text-sm text-main-base ${
                    selected === option ? "bg-white/20" : "hover:bg-white/10"
                  } ${index !== options.length - 1 ? "mb-1" : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
