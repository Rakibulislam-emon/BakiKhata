import React from "react";

// Mocking AnimatePresence
export const AnimatePresence = ({ children, ...props }: any) => {
  return <>{children}</>;
};

// Extractor to drop generic framer-motion props
const dropFramerProps = (props: any) => {
  const {
    initial,
    animate,
    exit,
    transition,
    whileHover,
    whileTap,
    whileFocus,
    whileInView,
    viewport,
    variants,
    layoutId,
    layout,
    layoutScroll,
    custom,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    onAnimationStart,
    onAnimationComplete,
    onUpdate,
    onPan,
    onPanStart,
    onPanEnd,
    onHoverStart,
    onHoverEnd,
    onTap,
    onTapStart,
    onTapCancel,
    ...rest
  } = props;
  return rest;
};

// Cache to store component refs — this is the critical fix.
// Without this, a new function is created on every render which causes
// React to unmount/remount the DOM node, losing input focus on every keystroke.
const componentCache: Record<string, React.ComponentType<any>> = {};

export const m = new Proxy(
  {},
  {
    get: (target, tag: string) => {
      if (!componentCache[tag]) {
        const Component = (props: any) => {
          const cleanProps = dropFramerProps(props);
          return React.createElement(tag, cleanProps);
        };
        Component.displayName = `m.${tag}`;
        componentCache[tag] = Component;
      }
      return componentCache[tag];
    },
  }
) as any;

export const LazyMotion = ({ children, features }: { children: React.ReactNode, features?: any }) => {
  return <>{children}</>;
};

export const domAnimation = {};

export const useScroll = (...args: any[]) => ({ scrollYProgress: 0 });
export const useTransform = (...args: any[]) => 0;
