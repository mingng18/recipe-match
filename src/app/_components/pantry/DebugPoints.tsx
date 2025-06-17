import { memo } from "react";

function Points({ points }: { points: { x?: number; y?: number }[] }) {
  return points.map((p, index) => (
    <div
      key={`fridge-point-${index}`}
      className="absolute h-2 w-2 rounded-full bg-red-500"
      style={{
        top: p.y === undefined ? "0" : p.y,
        bottom: p.y === undefined ? "0" : undefined,
        left: p.x === undefined ? "0" : p.x,
        right: p.x === undefined ? "0" : undefined,
        width: p.x === undefined ? undefined : p.y === undefined ? 4 : 8,
        height: p.y === undefined ? undefined : p.x === undefined ? 4 : 8,
      }}
    />
  ));
}

export default memo(Points);
