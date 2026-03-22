import { DialogControls } from "@/utils/types";
import { useEffect, useLayoutEffect, useRef } from "react";

export default function Dialog({
  children,
  width = "w-auto",
  dialogControls,
}: {
  children: React.ReactNode;
  width?: string;
  dialogControls: DialogControls;
}) {
  const veil = useRef<HTMLDivElement | null>(null);
  const dialogBody = useRef<HTMLDivElement | null>(null);
  const dialogContent = useRef<HTMLDivElement | null>(null);

  const { isOpen, close } = dialogControls;

  const duration = 300;

  useEffect(() => {
    // Animate the veil when showDialog changes. We want to fade it in and out, and also toggle its display to avoid it being clickable when not shown.
    // Hidden when not shown
    if (!veil.current) return;

    if (isOpen) {
      veil.current.style.opacity = "0";
      veil.current.style.display = "flex";

      const frame = requestAnimationFrame(() => {
        if (veil.current) {
          veil.current.style.opacity = "1";
        }
      });

      return () => cancelAnimationFrame(frame);
    }

    veil.current.style.opacity = "0";
    const hideTimeout = setTimeout(() => {
      if (veil.current) {
        // Remove inline display so Tailwind `hidden` applies again.
        veil.current.style.display = "";
      }
    }, duration);

    return () => clearTimeout(hideTimeout);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !dialogBody.current || !dialogContent.current) return;

    const body = dialogBody.current;
    const content = dialogContent.current;

    const getTargetHeight = () => {
      const computedStyles = getComputedStyle(body);
      const paddingTop = Number.parseFloat(computedStyles.paddingTop) || 0;
      const paddingBottom =
        Number.parseFloat(computedStyles.paddingBottom) || 0;
      return content.scrollHeight + paddingTop + paddingBottom;
    };

    // Keep explicit heights so transitions can interpolate between values.
    const syncHeight = (animate: boolean) => {
      const targetHeight = getTargetHeight();

      if (!animate) {
        body.style.transition = "none";
        body.style.height = `${targetHeight}px`;

        // Force reflow so the non-animated height is committed before restoring transition.
        void body.offsetHeight;
        body.style.transition = "";
        return;
      }

      body.style.height = `${targetHeight}px`;
    };

    // Do not animate on initial open to avoid a distracting first-time grow effect.
    syncHeight(false);

    const resizeObserver = new ResizeObserver(() => {
      syncHeight(true);
    });

    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [isOpen]);

  return (
    <div
      ref={veil}
      className={`hidden absolute inset-0 z-10 opacity-0 backdrop-blur-xs bg-ink-black-950/30 transition-opacity items-center justify-center duration-${duration}`}
    >
      <div className="absolute inset-0" onClick={close} />
      {/* Dialog style */}
      <div
        ref={dialogBody}
        className={`p-5 bg-background rounded-lg absolute ${width} self-center border border-border shadow-xs h-0 overflow-hidden transition-[height] duration-3000 ease-in-out`}
      >
        <div ref={dialogContent}>{children}</div>
      </div>
    </div>
  );
}
