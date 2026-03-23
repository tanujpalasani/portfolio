"use client";

import { create } from "zustand";

export type WindowId =
  | "about"
  | "education"
  | "certificates"
  | "projects"
  | "skills"
  | "resume"
  | "github"
  | "linkedin"
  | "achievements"
  | "contact"
  | "terminal";

export type WindowItem = {
  id: WindowId;
  title: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isMinimizing: boolean;
  isClosing: boolean;
  initialPosition: {
    x: number;
    y: number;
  };
};

type WindowStore = {
  windows: WindowItem[];
  activeWindowId: WindowId | null;
  topZIndex: number;
  openWindow: (id: WindowId, title: string) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMaximizeWindow: (id: WindowId) => void;
};

const BASE_Z_INDEX = 40;
const WINDOW_WIDTH_RATIO = 0.9;
const WINDOW_MAX_WIDTH = 620;
const WINDOW_VERTICAL_SPACE = 280;
const HORIZONTAL_MARGIN = 24;
const VERTICAL_MARGIN = 24;
const WINDOW_OFFSET_STEP = 30;
const MINIMIZE_ANIMATION_MS = 260;
const CLOSE_ANIMATION_MS = 180;

function getViewportWindowWidth(): number {
  if (typeof window === "undefined") {
    return WINDOW_MAX_WIDTH;
  }

  return Math.min(window.innerWidth * WINDOW_WIDTH_RATIO, WINDOW_MAX_WIDTH);
}

function getNextActiveWindowId(windows: WindowItem[]): WindowId | null {
  const visibleWindows = windows.filter(
    (windowItem) => !windowItem.isMinimized && !windowItem.isMinimizing && !windowItem.isClosing,
  );
  if (!visibleWindows.length) {
    return null;
  }

  return visibleWindows.reduce((highest, current) =>
    current.zIndex > highest.zIndex ? current : highest,
  ).id;
}

function getInitialPosition(windowCount: number): { x: number; y: number } {
  const offset = windowCount * WINDOW_OFFSET_STEP;
  const rawX = 220 + offset;
  const rawY = 110 + offset;

  if (typeof window === "undefined") {
    return { x: rawX, y: rawY };
  }

  const maxX = Math.max(HORIZONTAL_MARGIN, window.innerWidth - getViewportWindowWidth() - HORIZONTAL_MARGIN);
  const maxY = Math.max(VERTICAL_MARGIN, window.innerHeight - WINDOW_VERTICAL_SPACE - VERTICAL_MARGIN);

  return {
    x: Math.min(rawX, maxX),
    y: Math.min(rawY, maxY),
  };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  topZIndex: BASE_Z_INDEX,
  openWindow: (id, title) => {
    const { windows, topZIndex } = get();
    const nextZIndex = topZIndex + 1;
    const existingWindow = windows.find((windowItem) => windowItem.id === id);

    if (existingWindow) {
      set({
        windows: windows.map((windowItem) =>
          windowItem.id === id
            ? {
                ...windowItem,
                zIndex: nextZIndex,
                isMinimized: false,
                isMinimizing: false,
                isClosing: false,
              }
            : windowItem,
        ),
        activeWindowId: id,
        topZIndex: nextZIndex,
      });
      return;
    }

    set({
      windows: [
        ...windows,
        {
          id,
          title,
          zIndex: nextZIndex,
          isMinimized: false,
          isMaximized: false,
          isMinimizing: false,
          isClosing: false,
          initialPosition: getInitialPosition(windows.length),
        },
      ],
      activeWindowId: id,
      topZIndex: nextZIndex,
    });
  },
  closeWindow: (id) => {
    const target = get().windows.find((windowItem) => windowItem.id === id);
    if (!target || target.isClosing) {
      return;
    }

    const closingWindows = get().windows.map((windowItem) =>
      windowItem.id === id ? { ...windowItem, isClosing: true } : windowItem,
    );

    set({
      windows: closingWindows,
      activeWindowId: getNextActiveWindowId(closingWindows),
    });

    setTimeout(() => {
      const nextWindows = get().windows.filter((windowItem) => windowItem.id !== id);
      set({
        windows: nextWindows,
        activeWindowId: getNextActiveWindowId(nextWindows),
      });
    }, CLOSE_ANIMATION_MS);
  },
  focusWindow: (id) => {
    const { windows, topZIndex, activeWindowId } = get();
    const target = windows.find((windowItem) => windowItem.id === id);
    if (!target || target.isClosing || target.isMinimized || target.isMinimizing || activeWindowId === id) {
      return;
    }

    const nextZIndex = topZIndex + 1;
    set({
      windows: windows.map((windowItem) =>
        windowItem.id === id ? { ...windowItem, zIndex: nextZIndex } : windowItem,
      ),
      activeWindowId: id,
      topZIndex: nextZIndex,
    });
  },
  minimizeWindow: (id) => {
    const target = get().windows.find((windowItem) => windowItem.id === id);
    if (!target || target.isMinimized || target.isMinimizing || target.isClosing) {
      return;
    }

    const minimizingWindows = get().windows.map((windowItem) =>
      windowItem.id === id ? { ...windowItem, isMinimizing: true } : windowItem,
    );

    set({
      windows: minimizingWindows,
      activeWindowId: getNextActiveWindowId(
        minimizingWindows.map((windowItem) =>
          windowItem.id === id ? { ...windowItem, isMinimized: true, isMinimizing: false } : windowItem,
        ),
      ),
    });

    setTimeout(() => {
      const nextWindows = get().windows.map((windowItem) =>
        windowItem.id === id
          ? { ...windowItem, isMinimized: true, isMinimizing: false, isMaximized: false }
          : windowItem,
      );

      set({
        windows: nextWindows,
        activeWindowId: getNextActiveWindowId(nextWindows),
      });
    }, MINIMIZE_ANIMATION_MS);
  },
  toggleMaximizeWindow: (id) => {
    const { windows, topZIndex } = get();
    const nextZIndex = topZIndex + 1;
    const target = windows.find((windowItem) => windowItem.id === id);

    if (!target || target.isClosing || target.isMinimizing) {
      return;
    }

    const willMaximize = !target.isMaximized;
    set({
      windows: windows.map((windowItem) =>
        windowItem.id === id
          ? {
              ...windowItem,
              isMaximized: willMaximize,
              isMinimized: false,
              zIndex: nextZIndex,
            }
          : windowItem,
      ),
      activeWindowId: id,
      topZIndex: nextZIndex,
    });
  },
}));
