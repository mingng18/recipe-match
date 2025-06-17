import PantryTab from "@/app/_components/pantry/PantryTab";
import React from "react";

export default function PantryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-dvh overflow-hidden">
      <PantryTab />
      {children}
    </div>
  );
}
