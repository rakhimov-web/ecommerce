// Durations and easing mirror DESIGN.md; seconds are used by motion/react.
export const motionTokens = {
  duration: { instant: 0.1, fast: 0.15, base: 0.25, slow: 0.4 },
  ease: {
    standard: [0.2, 0, 0, 1],
    enter: [0, 0, 0.2, 1],
    exit: [0.4, 0, 1, 1],
    linear: [0, 0, 1, 1],
  },
} as const;
