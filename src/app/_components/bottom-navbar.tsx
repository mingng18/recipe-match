"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBasket, User, Soup } from 'lucide-react';
import clsx from 'clsx';

// Define navigation items
const navItems = [
  { href: '/recipes', label: 'Recipes', icon: Soup },
  { href: '/pantry', label: 'Pantry', icon: ShoppingBasket },
  { href: '/account', label: 'Account', icon: User },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-md md:hidden z-40">
      <div className="container mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = item.href === '/recipes' 
            ? pathname === item.href || pathname.startsWith(item.href + '/')
            : (pathname.startsWith(item.href) && item.href !== '/');
          
          if (item.href === '/' && pathname !== '/') {
            // isActive = false; // This logic would be needed if '/' was a nav item
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center flex-1 py-2 text-center",
                isActive ? "text-primary" : "text-muted-foreground",
                "hover:text-primary transition-colors"
              )}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1 leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 