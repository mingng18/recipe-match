import React from "react";
import { CabinetItem, dummyCabinetItems } from "./dummy-data";
import CabinetWrapper from "./CabinetWrapper";

const CabinetPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">My Cabinet</h1>
      <CabinetWrapper items={dummyCabinetItems} />
    </div>
  );
};

export default CabinetPage;
