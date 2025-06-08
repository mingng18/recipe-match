"use client";

import React from 'react';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20"> {/* Ensure padding accommodates the navbar */}
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
        <Link href="/recipes" passHref>
          <Button variant="outline">Plate of the day</Button>
        </Link>
        <Link href="/capture" passHref>
          <Button variant="ghost" size="icon">
            <Camera className="h-6 w-6" />
          </Button>
        </Link>
      </nav>
    </div>
  );
}