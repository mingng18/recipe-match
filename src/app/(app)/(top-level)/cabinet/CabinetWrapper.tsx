import React from "react";
import Link from "next/link"; // Added Link
import Image from "next/image"; // Added Image
import { CabinetItem } from "./dummy-data";

interface CabinetWrapperProps {
  items: CabinetItem[];
}

const CabinetWrapper: React.FC<CabinetWrapperProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <Link key={item.id} href={`/ingredient/${item.id}`} passHref>
          <div className="block rounded-lg border p-4 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-md">
            <div className="relative mb-2 h-32 w-full overflow-hidden rounded-md">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" // Basic sizes, adjust as needed
                  style={{ viewTransitionName: `ingredient-image-${item.id}` }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  {/* Placeholder, e.g. an icon */}
                  <span className="text-sm text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.quantity}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CabinetWrapper;
