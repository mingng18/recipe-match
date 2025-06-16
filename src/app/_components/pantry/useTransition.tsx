export default function slideInOut(type: "left" | "right") {
  // Old Page
  document.documentElement.animate(
    [
      { opacity: 1, transform: "translateX(0)" },
      {
        opacity: 1,
        transform: `translateX(${type === "left" ? "-100%" : "100%"})`,
      },
    ],
    {
      duration: 500,
      easing: "cubic-bezier(0,.4,.44,1.56)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    },
  );

  // New Page
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: `translateX(${type === "left" ? "100%" : "-100%"})`,
      },
      { opacity: 1, transform: "translateX(0)" },
    ],
    // [
    //   { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
    //   { clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0 0%)" },
    // ],
    {
      duration: 500,
      easing: "cubic-bezier(0,.4,.44,1.56)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    },
  );
}
