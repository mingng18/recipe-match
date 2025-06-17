export const SpringAnimation = {
  type: "spring",
  stiffness: 200,
  damping: 20,
} as const;

export type SpringConfig = {
  type: "spring";
  stiffness: number;
  damping: number;
};

export const getDynamicSpringAnimation = (velocity: number) => {
  const absVelocity = Math.abs(velocity);

  // Map velocity to spring parameters
  // Higher velocity = lower damping (more bounce), higher stiffness (faster)
  // Lower velocity = higher damping (less bounce), lower stiffness (slower)
  const minVelocity = 0;
  const maxVelocity = 2000; // Typical max drag velocity

  // Normalize velocity between 0 and 1
  const normalizedVelocity = Math.min(absVelocity / maxVelocity, 1);

  // Calculate dynamic parameters
  const stiffness = 80 + normalizedVelocity * 120; // 80-200 range
  const damping = 25 - normalizedVelocity * 15; // 25-10 range (higher velocity = lower damping)

  return {
    type: "spring" as const,
    stiffness,
    damping,
  };
};
