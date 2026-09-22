"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CheckIcon, ChevronDown } from "@/components/icons";

export type SelectOption = { value: string; label: string };

type SelectMenuProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export function SelectMenu({ label, value, options, onChange }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const listId = `${baseId}-list`;
  const selectedIndex = options.findIndex((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openList = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), options.length - 1));
    setOpen(true);
  };

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openList(selectedIndex < 0 ? 0 : selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openList(selectedIndex < 0 ? options.length - 1 : selectedIndex);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openList(selectedIndex);
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + options.length) % options.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(activeIndex);
    }
  };

  return (
    <div className="select-menu" ref={rootRef} data-open={open ? "true" : undefined}>
      <span className="field-label" id={labelId}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className="select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        onClick={() => open ? setOpen(false) : openList(selectedIndex)}
        onKeyDown={onTriggerKeyDown}
      >
        <span id={valueId}>{options[selectedIndex]?.label ?? ""}</span>
        <ChevronDown />
      </button>
      {open ? (
        <ul
          ref={listRef}
          id={listId}
          className="select-list"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${baseId}-option-${activeIndex}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${baseId}-option-${index}`}
              className="select-option"
              role="option"
              aria-selected={option.value === value}
              data-active={index === activeIndex ? "true" : undefined}
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => selectOption(index)}
            >
              <span>{option.label}</span>
              {option.value === value ? <CheckIcon /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
