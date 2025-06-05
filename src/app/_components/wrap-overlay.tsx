"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useTransform,
} from "motion/react"; // Assuming this is the intended library, not framer-motion
import { useEffect, useRef, useState } from "react";

/**
 * For the overlay circles, this example uses elements with
 * a high blur radius. A more performant approach could be to
 * bake these circles into background-images as pre-blurred pngs.
 */

export default function WarpOverlay({
  intensity = 0.1,
}: {
  // Increase intensity to make the effect more pronounced
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (ref.current) {
      setSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
    }
  }, [ref]); // Consider adding a ResizeObserver if the size can change dynamically after mount

  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deform = useMotionValue(0);
  const rotateX = useTransform(() => deform.get() * -5);
  const skewY = useTransform(() => deform.get() * -1.5);
  const scaleY = useTransform(() => 1 + deform.get() * intensity);
  const scaleX = useTransform(() => 1 - deform.get() * intensity * 0.6);

  // Open delete modal and trigger deformation animation
  const handleDeleteClick = () => {
    if (selectedEmails.length === 0) return;

    setIsDeleteModalOpen(true);

    animate([
      [deform, 1, { duration: 0.3, ease: [0.65, 0, 0.35, 1] }],
      [deform, 0, { duration: 1.5, ease: [0.22, 1, 0.36, 1] }],
    ]);
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedEmails((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const closeModal = () => setIsDeleteModalOpen(false);

  return (
    // Styles for body (overflow: hidden; margin: 0; padding: 0; background-color: #f0f0f0;)
    // would typically be in a global CSS file or layout component:
    // e.g., <body className="overflow-hidden m-0 p-0 bg-zinc-100">
    <div className="max-h-[600px]:p-0 box-border flex h-screen w-full items-center justify-center p-5">
      <div className="max-h-[900px]:w-[300px] max-h-[900px]:h-[600px] max-h-[600px]:w-full max-h-[600px]:h-full max-h-[600px]:bg-transparent max-h-[600px]:rounded-none max-h-[600px]:pt-[50px] max-h-[600px]:shadow-none relative box-border h-[812px] w-[375px] overflow-hidden rounded-[50px] bg-[#1a1a1a] p-0 shadow-[0_0_0_14px_#121212,0_0_0_17px_#232323,0_20px_40px_rgba(0,0,0,0.8)]">
        <div className="max-h-[600px]:rounded-none relative flex h-full w-full flex-col overflow-hidden rounded-[38px] bg-[#0b1011]">
          <div className="max-h-[600px]:hidden absolute top-[12px] left-1/2 z-[2000] h-[34px] w-[120px] -translate-x-1/2 rounded-[20px] bg-black"></div>
          <div className="max-h-[600px]:!hidden flex h-[60px] items-end justify-between px-5 pt-[15px] pb-0 text-sm font-semibold text-white">
            <div className="status-time">9:41</div>
          </div>

          <div
            className="mt-[10px] flex flex-1 flex-col overflow-hidden p-0"
            ref={ref}
          >
            <motion.div
              className="flex h-full flex-col overflow-hidden bg-[#0b1011] text-[#f5f5f5]"
              style={{
                rotateX,
                skewY,
                scaleY,
                scaleX,
                originX: 0.5,
                originY: 0,
                transformPerspective: 500,
                willChange: "transform", // This can be replaced by Tailwind's `will-change-transform` if needed
              }}
            >
              <header className="flex items-center justify-between border-b border-[#1d2628] px-5 pt-[26px] pb-4">
                <h1 className="m-0 text-2xl">Inbox</h1>
                <motion.button
                  className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-white/25 disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-50"
                  onClick={handleDeleteClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={selectedEmails.length === 0}
                  aria-label="Delete"
                >
                  <DeleteIcon />
                </motion.button>
              </header>

              <div className="flex-1 overflow-y-auto p-0">
                {fakeEmails.map((email, index) => (
                  <div
                    className="flex items-center gap-4 border-b border-[#1d2628] px-5 py-4"
                    key={index}
                  >
                    <div className="flex-1">
                      <h3 className="mb-2 text-base font-semibold">
                        {email.subject}
                      </h3>
                      <p className="m-0 line-clamp-2 text-sm opacity-70">
                        {email.preview}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                      className="h-5 w-5 accent-[#f5f5f5]" // Added accent color for visibility
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isDeleteModalOpen ? (
              <ImmersiveOverlay
                close={closeModal}
                itemCount={selectedEmails.length}
                size={size}
              />
            ) : null}
          </AnimatePresence>

          <div className="max-h-[600px]:hidden absolute bottom-[8px] left-1/2 z-[2000] h-[5px] w-[134px] -translate-x-1/2 rounded-[3px] bg-white opacity-20"></div>
        </div>
      </div>
    </div>
  );
}

function GradientOverlay({
  size,
}: {
  size: { width: number; height: number };
}) {
  const breathe = useMotionValue(0);
  const isPresent = useIsPresent();

  useEffect(() => {
    if (!isPresent) {
      animate(breathe, 0, { duration: 0.5, ease: "easeInOut" });
      return; // Return early if not present
    }

    async function playBreathingAnimation() {
      await animate(breathe, 1, {
        duration: 0.5,
        delay: 0.35,
        ease: [0, 0.55, 0.45, 1],
      });

      // Ensure component is still present before starting infinite animation
      if (isPresent) {
        animate(breathe, [null, 0.7, 1], {
          duration: 15,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        });
      }
    }

    playBreathingAnimation();
  }, [isPresent, breathe]); // Added breathe to dependency array

  const enterDuration = 0.75;
  const exitDuration = 0.5;

  const expandingCircleRadius = size.width / 3;

  return (
    <div className="absolute inset-0 z-[1001]">
      <motion.div
        className="absolute origin-center rounded-full bg-[rgba(251,148,137,0.8)] blur-[15px] will-change-transform"
        initial={{
          scale: 0,
          opacity: 1,
          backgroundColor: "rgb(233, 167, 160)", // Kept for initial state if different from className
        }}
        animate={{
          scale: 10,
          opacity: 0.2,
          backgroundColor: "rgb(246, 63, 42)", // Kept for animate state
          transition: {
            duration: enterDuration,
            opacity: { duration: enterDuration, ease: "easeInOut" },
          },
        }}
        exit={{
          scale: 0,
          opacity: 1,
          backgroundColor: "rgb(233, 167, 160)", // Kept for exit state
          transition: { duration: exitDuration },
        }}
        style={{
          left: `calc(50% - ${expandingCircleRadius / 2}px)`,
          top: "100%",
          width: expandingCircleRadius,
          height: expandingCircleRadius,
          originX: 0.5,
          originY: 1,
        }}
      />

      <motion.div
        className="absolute aspect-square rounded-full bg-[rgba(246,63,42,0.9)] blur-[100px] will-change-transform"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.9, // Target opacity
          transition: { duration: enterDuration },
        }}
        exit={{
          opacity: 0,
          transition: { duration: exitDuration },
        }}
        style={{
          scale: breathe,
          width: size.width * 2,
          height: size.width * 2,
          top: -size.width,
          left: -size.width,
        }}
      />

      <motion.div
        className="absolute aspect-square rounded-full bg-[rgba(243,92,76,0.9)] blur-[100px] will-change-transform"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.9, // Target opacity
          transition: { duration: enterDuration },
        }}
        exit={{
          opacity: 0,
          transition: { duration: exitDuration },
        }}
        style={{
          scale: breathe,
          width: size.width * 2,
          height: size.width * 2,
          top: size.height - size.width,
          left: 0,
        }}
      />
    </div>
  );
}

function ImmersiveOverlay({
  close,
  itemCount,
  size,
}: {
  close: () => void;
  itemCount: number;
  size: { width: number; height: number };
}) {
  const transition = {
    duration: 0.35,
    ease: [0.59, 0, 0.35, 1],
  };

  const enteringState = {
    rotateX: 0,
    skewY: 0,
    scaleY: 1,
    scaleX: 1,
    y: 0,
    transition: {
      ...transition,
      y: { type: "spring", stiffness: 100, damping: 15, mass: 0.5 }, // Adjusted spring for visual duration
    },
  };

  const exitingState = {
    rotateX: -5,
    skewY: -1.5,
    scaleY: 2,
    scaleX: 0.4,
    y: 100,
  };

  return (
    <div className="absolute inset-0 overflow-hidden" onClick={close}>
      <GradientOverlay size={size} />
      <motion.div
        className="will-change-opacity absolute inset-0 z-[1001] flex items-center justify-center bg-[rgba(246,63,42,0.2)] backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
      >
        <motion.div
          className="relative flex w-3/4 flex-col items-center justify-center gap-[30px] will-change-transform"
          onClick={(e) => e.stopPropagation()}
          initial={exitingState}
          animate={enteringState}
          exit={exitingState}
          transition={transition}
          style={{
            transformPerspective: 1000,
            originX: 0.5,
            originY: 0,
          }}
        >
          <header className="flex flex-col items-center justify-center gap-[5px] text-center">
            <h2 className="text-xl font-semibold text-[#f5f5f5]">
              {" "}
              {/* Adjusted size from h3 to text-xl */}
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </h2>
            <p className="text-base text-[#f5f5f5]">
              {" "}
              {/* Adjusted size from big to text-base */}
              Are you sure you want to delete these entries? You can't undo this
              action.
            </p>
          </header>
          <div className="flex w-full flex-col items-center justify-center gap-[10px]">
            <button
              onClick={close}
              className="w-full max-w-xs rounded-[20px] bg-[#f5f5f5] px-5 py-[10px] font-medium text-[#0f1115]"
            >
              Delete
            </button>
            <button
              onClick={close}
              className="w-full max-w-xs rounded-[20px] border border-[#f5f5f5]/50 bg-transparent px-5 py-[10px] font-medium text-[#f5f5f5] hover:border-[#f5f5f5]"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * ==============   Icons   ================
 */

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

/**
 * ==============   Data   ================
 */
const fakeEmails = [
  {
    subject: "Weekly team update",
    preview:
      "Hi team, Just a quick update on our progress this week. We've made significant strides in the new project and...",
  },
  {
    subject: "Your subscription confirmation",
    preview:
      "Thank you for subscribing to our newsletter! You'll now receive updates about our latest products and exclusive offers...",
  },
  {
    subject: "Invoice #1234 for April",
    preview:
      "Your monthly invoice is now available. Please find attached the detailed breakdown of your subscription charges for...",
  },
  {
    subject: "Security alert: New login",
    preview:
      "We detected a new sign-in to your account from a new device or location. If this was you, you can safely ignore this...",
  },
  {
    subject: "Upcoming maintenance notice",
    preview:
      "Please be advised that our platform will undergo scheduled maintenance this weekend. During this time, services may be...",
  },
];

// The StyleSheet component is no longer needed as styles are applied via Tailwind classes.
