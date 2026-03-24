"use client";

import { motion } from "framer-motion";
import Draggable from "react-draggable";
import { memo, useRef, useState } from "react";

import type { WindowId } from "@/store/useWindowStore";

type WindowProps = {
  id: WindowId;
  title: string;
  zIndex: number;
  maximized: boolean;
  minimizing: boolean;
  closing: boolean;
  initialPosition: {
    x: number;
    y: number;
  };
  active: boolean;
  children: React.ReactNode;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onMaximize: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
};

function WindowComponent({
  id,
  title,
  zIndex,
  maximized,
  minimizing,
  closing,
  initialPosition,
  active,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: WindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      handle=".window-header"
      cancel=".window-controls,button,a,input,textarea"
      defaultPosition={initialPosition}
      disabled={maximized || minimizing || closing}
      position={maximized ? { x: 0, y: 0 } : undefined}
      bounds="parent"
      nodeRef={nodeRef}
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
    >
      <div
        ref={nodeRef}
        style={{ zIndex }}
        onMouseDown={() => onFocus(id)}
        className={`pointer-events-auto absolute overflow-hidden rounded-2xl border backdrop-blur-2xl will-change-transform transition-[width,height,border-color] duration-300 ease-out ${
          maximized
            ? "!left-4 !top-2.5 h-[calc(100vh-4.5rem)] w-[calc(100vw-2rem)] max-w-none"
            : "w-[90vw] max-w-[620px]"
        } ${
          active
            ? "border-white/20 bg-white/[0.06] shadow-window-active brightness-[1.02]"
            : "border-white/8 bg-white/[0.03] shadow-window-inactive opacity-80"
        } ${isDragging ? "cursor-grabbing shadow-[0_30px_90px_rgba(0,0,0,0.75)] scale-[1.01]" : ""}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
          animate={
            minimizing || closing
              ? {
                  opacity: 0,
                  scale: minimizing ? 0.7 : 0.85,
                  filter: "blur(8px)",
                }
              : {
                  opacity: 1,
                  scale: active ? 1 : 0.985,
                  filter: active ? "blur(0px)" : "blur(0.4px)",
                }
          }
          exit={{
            opacity: 0,
            scale: 0.85,
            filter: "blur(6px)",
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          }}
          transition={{
            duration: minimizing ? 0.25 : closing ? 0.18 : 0.35,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: minimizing ? 0.22 : closing ? 0.15 : 0.3 },
            filter: { duration: 0.25 },
            scale: { type: "spring", stiffness: 300, damping: 25 },
          }}
          className="relative flex h-full w-full flex-col"
          style={{ pointerEvents: minimizing || closing ? "none" : "auto" }}
        >
          {active && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.08), transparent 60%)",
              }}
            />
          )}

          <header
            className={`window-header group relative flex items-center justify-between border-b backdrop-blur-xl ${
              active
                ? "border-white/12 bg-gradient-to-r from-white/[0.12] to-white/[0.06]"
                : "border-white/6 bg-gradient-to-r from-white/[0.06] to-white/[0.03]"
            } px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-200 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="window-controls z-20 flex items-center gap-2">
              <motion.button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onClose(id);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group/btn relative h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-150 hover:shadow-[0_2px_8px_rgba(239,68,68,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] disabled:opacity-50"
                aria-label={`Close ${title}`}
                disabled={closing || minimizing}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] text-red-900/60 opacity-0 transition-opacity group-hover/btn:opacity-100">
                  x
                </span>
              </motion.button>
              <motion.button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMinimize(id);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label={`Minimize ${title}`}
                className="group/btn relative h-3 w-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-150 hover:shadow-[0_2px_8px_rgba(251,191,36,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] disabled:opacity-50"
                disabled={closing || minimizing}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] text-amber-900/60 opacity-0 transition-opacity group-hover/btn:opacity-100">
                  -
                </span>
              </motion.button>
              <motion.button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMaximize(id);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label={`${maximized ? "Restore" : "Maximize"} ${title}`}
                className="group/btn relative h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-150 hover:shadow-[0_2px_8px_rgba(52,211,153,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] disabled:opacity-50"
                disabled={closing || minimizing}
              >
                <span className="absolute inset-0 flex items-center justify-center pb-[1px] text-[9px] text-emerald-900/60 opacity-0 transition-opacity group-hover/btn:opacity-100">
                  +
                </span>
              </motion.button>
            </div>

            <h2
              className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-sm font-medium tracking-wide transition-colors duration-200 ${
                active ? "text-white/90" : "text-white/60"
              }`}
            >
              {title}
            </h2>

            <div className="w-[3.75rem]" aria-hidden="true" />
          </header>

          <div
            className={`overflow-y-auto overflow-x-hidden px-5 py-5 text-sm text-slate-100/85 ${
              maximized ? "flex-1" : "max-h-[60vh] min-h-[220px]"
            }`}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </Draggable>
  );
}

const Window = memo(WindowComponent);
Window.displayName = "Window";

export default Window;
