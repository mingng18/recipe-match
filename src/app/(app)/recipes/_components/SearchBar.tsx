"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setCurrentSearchTerm(term);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-card container mx-auto flex w-full max-w-2xl items-center space-x-2 rounded-full border p-2 shadow-lg mt-6">
      <Search className="ml-2 h-5 w-5 flex-shrink-0 text-gray-400" />
      <Input
        type="search"
        placeholder="Search recipes (e.g., chicken, dessert, quick)"
        value={currentSearchTerm}
        onChange={handleSearchChange}
        className="flex-grow border-none bg-transparent text-base placeholder-gray-500 focus:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
