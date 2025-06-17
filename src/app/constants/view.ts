export const acceptedViews = ["recipe", "fridge", "cabinet"] as const;
export type ViewType = (typeof acceptedViews)[number];
