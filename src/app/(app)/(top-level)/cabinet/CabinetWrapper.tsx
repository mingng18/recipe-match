import React from "react";
import { CabinetItem } from "./dummy-data";

interface CabinetWrapperProps {
  items: CabinetItem[];
}

const CabinetWrapper: React.FC<CabinetWrapperProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border p-4">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="mb-2 h-32 w-full rounded-md object-cover"
            />
          )}
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default CabinetWrapper;
