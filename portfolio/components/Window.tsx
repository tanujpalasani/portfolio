"use client";

import { motion } from "framer-motion";
import Draggable from "react-draggable";
import { useRef, useState } from "react";

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

export default function Window({
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
      nodeRef={nodeRef as unknown as React.RefObject<HTMLElement>}
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
    >
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: minimizing || closing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ zIndex }}
        onMouseDown={() => onFocus(id)}
        className={`pointer-events-auto absolute overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-xl will-change-transform transition-[opacity,box-shadow,border-color,transform,filter,width,height] duration-200 ${
          maximized ? "h-[calc(100vh-4.5rem)] w-[calc(100vw-2rem)] max-w-none" : "w-[90vw] max-w-[620px]"
        } ${
          active
            ? "border-white/20 brightness-[1.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_25px_80px_rgba(0,0,0,0.7),0_0_18px_rgba(6,182,212,0.10)]"
            : "border-white/10 opacity-70 blur-[0.5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_48px_rgba(0,0,0,0.58)]"
        } ${isDragging ? "cursor-grabbing shadow-[0_26px_70px_rgba(0,0,0,0.68)]" : ""}`}
      >
        <motion.div
          className="flex h-full w-full flex-col"
          animate={
            minimizing
              ? { scale: 0.22, y: 420, x: 40, opacity: 0.25 }
              : closing
                ? { scale: 0.9, y: 14, opacity: 0.6 }
                : { scale: active ? 1 : 0.98, y: 0, x: 0, opacity: 1 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <header
            className={`window-header relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-white/10 to-white/5 px-4 py-2 shadow-inner backdrop-blur-md ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="window-controls z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onClose(id);
                }}
                className="h-3 w-3 rounded-full bg-red-500 transition hover:scale-110 hover:brightness-125 disabled:opacity-70"
                aria-label={`Close ${title}`}
                disabled={closing || minimizing}
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMinimize(id);
                }}
                aria-label={`Minimize ${title}`}
                className="h-3 w-3 rounded-full bg-yellow-400 transition hover:scale-110 hover:brightness-125 disabled:opacity-70"
                disabled={closing || minimizing}
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onMaximize(id);
                }}
                aria-label={`${maximized ? "Restore" : "Maximize"} ${title}`}
                className="h-3 w-3 rounded-full bg-green-500 transition hover:scale-110 hover:brightness-125 disabled:opacity-70"
                disabled={closing || minimizing}
              />
            </div>
            <h2 className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-sm font-medium tracking-wide text-white/80">
              {title}
            </h2>
            <div className="w-[3.75rem]" aria-hidden="true" />
          </header>
          <div className={`px-5 py-4 text-sm text-slate-100/85 ${maximized ? "flex-1 overflow-auto" : "min-h-[220px]"}`}>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </Draggable>
  );
}
