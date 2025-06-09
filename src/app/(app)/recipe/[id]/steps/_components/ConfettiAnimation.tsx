"use client";

import React, { useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface ConfettiAnimationProps {
  isActive: boolean;
  onComplete?: () => void; // Optional callback for when animation might be considered complete
}

const STATE_MACHINE_NAME = "State Machine 1"; // Common default, or specific animation name like "explode"

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ isActive, onComplete }) => {
  const { rive, RiveComponent } = useRive({
    src: '/rive/confetti_burst.riv', // Assuming this path is correct
    stateMachines: STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.Cover, // Or Fit.Contain, depending on desired effect
      alignment: Alignment.Center,
    }),
    autoplay: false, // We will control playback
    onLoad: () => {
      // Optional: Log when Rive is loaded
      console.log("Rive confetti loaded");
    },
    onStateChange: (event) => {
      // Rive state machines can emit events. If the animation has a specific "end" state or event.
      // This is a more robust way to detect animation completion than setTimeout.
      // For example, if a state named "ExitState" or an event "AnimationEnd" is triggered.
      // console.log("Rive State Change:", event.data);
      // if (event.data.includes("ExitState") && onComplete) {
      //   onComplete();
      // }
    }
  });

  useEffect(() => {
    if (isActive && rive) {
      rive.reset(); // Reset to ensure it plays from the beginning if played multiple times
      rive.play();

      // Fallback completion if onStateChange is not configured or reliable for one-shot
      // This is less ideal than using Rive's own state events.
      if (onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, 2500); // Assume animation duration is ~2.5s
        return () => clearTimeout(timer);
      }
    }
  }, [isActive, rive, onComplete]);

  if (!isActive) {
    return null; // Don't render anything if not active
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000, // Ensure it's on top
      pointerEvents: 'none', // Allow clicks to go through
    }}>
      <RiveComponent />
    </div>
  );
};

export default ConfettiAnimation;
