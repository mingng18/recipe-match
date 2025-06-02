"use client"; // Required for usePathname

import React from 'react';
// Link, usePathname, Camera, BookOpen, User, clsx might be unused now if navItems are solely in BottomNavbar
// Reviewing imports after BottomNavbar handles its own items.
import BottomNavbar from '../../_components/bottom-navbar'; // Import the new component
// Fab import removed

// Define navigation items - This is now managed within BottomNavbar.tsx, so it can be removed here.
// const navItems = [
//   { href: '/capture', label: 'Capture', icon: Camera },
//   { href: '/recipes', label: 'Recipes', icon: BookOpen },
//   // { href: '/account', label: 'Account', icon: User }, // Add when account page is ready
// ];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // pathname might be unused here now if not directly controlling nav items

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20"> {/* Ensure padding accommodates the navbar */}
        {children}
      </main>
      <BottomNavbar /> {/* Use the component here */}
      {/* Fab component usage removed */}
    </div>
  );
} 