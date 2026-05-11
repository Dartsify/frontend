"use client";

import { DialogControls } from "@/utils/types";
import { gsap } from "gsap";
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
  // Overlay (voile) that darkens/blurs the page behind the dialog.
  const veil = useRef<HTMLDivElement | null>(null);
  // Outer dialog container: this is the element whose height we animate.
  const dialogBody = useRef<HTMLDivElement | null>(null);
  // Inner content wrapper: used only for accurate height measurement.
  const dialogContent = useRef<HTMLDivElement | null>(null);

  // Dialog open state + close action come from parent controls.
  const { isOpen, close } = dialogControls;

  // Shared animation duration in seconds for GSAP tweens.
  const animationDuration = 0.3;

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0); // Scroll to top to ensure dialog is fully visible
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    // If the overlay element is not mounted yet, nothing to animate.
    if (!veil.current) return;

    const veilElement = veil.current;

    // Stop any running opacity animation before starting a new one.
    // This avoids race conditions during rapid open/close interactions.
    gsap.killTweensOf(veilElement);

    if (isOpen) {
      // Opening keeps the overlay fade animation.
      // Only height animation is blocked on open (handled in the layout effect).
      gsap.set(veilElement, { display: "flex", opacity: 0 });
      gsap.to(veilElement, {
        opacity: 1,
        duration: animationDuration,
        ease: "power2.out",
      });
      return;
    }

    // Closing sequence:
    // 1) Fade opacity to 0
    // 2) Reset display so Tailwind's hidden class applies again
    //    (prevents an invisible but clickable overlay)
    gsap.to(veilElement, {
      opacity: 0,
      duration: animationDuration,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(veilElement, { display: "" });
      },
    });
  }, [animationDuration, isOpen]);

  useLayoutEffect(() => {
    // Height sync is only meaningful when the dialog is open and mounted.
    if (!isOpen || !dialogBody.current || !dialogContent.current) return;

    const body = dialogBody.current;
    const content = dialogContent.current;

    // Compute the final dialog height:
    // content height + top/bottom paddings of the outer container.
    // Including paddings avoids clipping the bottom area (ex: button cut).
    const getTargetHeight = () => {
      const computedStyles = getComputedStyle(body);
      const paddingTop = Number.parseFloat(computedStyles.paddingTop) || 0;
      const paddingBottom =
        Number.parseFloat(computedStyles.paddingBottom) || 0;
      return content.scrollHeight + paddingTop + paddingBottom;
    };

    // Keep explicit heights so GSAP can animate between exact measured values.
    // animate=false is used for immediate sync without tween.
    const syncHeight = (animate: boolean) => {
      const targetHeight = getTargetHeight();

      // Cancel a previous height tween before creating a new one.
      gsap.killTweensOf(body, "height");

      if (!animate) {
        // Immediate set: no animation for the first visible frame.
        gsap.set(body, { height: targetHeight });
        return;
      }

      // Smooth resize for all subsequent content changes.
      gsap.to(body, {
        height: targetHeight,
        duration: animationDuration,
        ease: "power2.out",
      });
    };

    // On open, we always set the exact height immediately (no tween).
    syncHeight(false);

    // Some environments can trigger an immediate ResizeObserver callback right after observe().
    // Skip that first callback so opening never animates; only real content changes animate.
    let skipNextResizeAnimation = true;

    // Observe real content size changes (login <-> signup, validation messages, etc.)
    // and animate the outer container to the new target height.
    const resizeObserver = new ResizeObserver(() => {
      if (skipNextResizeAnimation) {
        skipNextResizeAnimation = false;
        syncHeight(false);
        return;
      }

      syncHeight(true);
    });

    resizeObserver.observe(content);

    return () => {
      // Cleanup when dialog closes/unmounts.
      resizeObserver.disconnect();
      gsap.killTweensOf(body);
    };
  }, [animationDuration, isOpen]);

  return (
    <div
      ref={veil}
      // Base hidden state is controlled by Tailwind class + GSAP display toggles.
      className="hidden absolute inset-0 z-10 opacity-0 backdrop-blur-xs bg-ink-black-950/30 items-center justify-center"
    >
      {/* Backdrop click closes the dialog. */}
      <div className="absolute inset-0" onClick={close} />
      {/* Outer dialog shell: style + animated height container. */}
      <div
        ref={dialogBody}
        className={`p-5 bg-background rounded-lg absolute ${width} self-center -translate-y-5 sm:translate-0 border border-border shadow-xs h-0 overflow-hidden`}
      >
        {/* Inner content wrapper measured by ResizeObserver. */}
        <div ref={dialogContent}>{children}</div>
      </div>
    </div>
  );
}
