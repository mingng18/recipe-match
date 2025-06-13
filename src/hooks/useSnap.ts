import type {
  BoundingBox,
  MotionProps,
  DragHandler,
  SpringOptions,
  DragElastic,
  PanInfo,
  AnimationPlaybackControlsWithThen,
} from "framer-motion";
import { animate } from "framer-motion";
import { type RefObject, useRef, useState, useCallback, useMemo } from "react";

export type Point = {
  x?: number;
  y?: number;
};

const POWER = 0.1;

export type SnapPointsType =
  | { type: "absolute"; points: Point[] }
  | {
      // Based on constraints box
      type: "constraints-box";
      unit: "pixel" | "percent";
      points: Point[];
    }
  | {
      // Relative to initial position
      type: "relative-to-initial";
      points: Point[];
    };

export type SnapOptions = {
  direction: "x" | "y" | "both";
  ref: RefObject<Element | null>;
  snapPoints: SnapPointsType;
  springOptions?: Omit<SpringOptions, "velocity">;
  constraints?: Partial<BoundingBox> | RefObject<Element | null>;
  dragElastic?: DragElastic;
  onDragStart?: MotionProps["onDragStart"];
  onDragEnd?: MotionProps["onDragEnd"];
  onMeasureDragConstraints?: MotionProps["onMeasureDragConstraints"];
  onSnapComplete?: (x?: number, y?: number) => void;
};

export type DragProps = Pick<
  MotionProps,
  | "drag"
  | "onDragStart"
  | "onDragEnd"
  | "onMeasureDragConstraints"
  | "dragMomentum"
> &
  Partial<Pick<MotionProps, "dragConstraints">>;

export type UseSnapResult = {
  dragProps: DragProps;
  snapTo: (index: number) => void;
  currentSnappointIndex: number | null;
};

const minmax = (num: number, min: number, max: number) =>
  Math.max(Math.min(max, num), min);

export const useSnap = ({
  direction,
  snapPoints,
  ref,
  springOptions = {},
  onSnapComplete,
  constraints,
  dragElastic = 0.5,
  onDragStart,
  onDragEnd,
  onMeasureDragConstraints,
}: SnapOptions): UseSnapResult => {
  const constraintsBoxRef = useRef<BoundingBox | null>(null);

  const [currentSnappointIndex, setCurrentSnappointIndex] = useState<
    null | number
  >(null);

  const resolveConstraints = useCallback(() => {
    if (constraints === undefined) {
      return null;
    }

    if (!ref.current) {
      throw new Error("Element ref is empty");
    }

    const box =
      "current" in constraints ? constraintsBoxRef.current : constraints;
    if (!box) {
      throw new Error("Constraints wasn't measured");
    }

    const elementBox = ref.current.getBoundingClientRect();
    const style = window.getComputedStyle(ref.current);
    const transformMatrix = new DOMMatrixReadOnly(style.transform);
    const baseX = window.scrollX + elementBox.x - transformMatrix.e;
    const baseY = window.scrollY + elementBox.y - transformMatrix.f;

    // For center-based positioning, adjust constraints by half element size
    const elementWidth = elementBox.width;
    const elementHeight = elementBox.height;
    
    const left = box.left !== undefined ? baseX + box.left + elementWidth / 2 : undefined;
    const top = box.top !== undefined ? baseY + box.top + elementHeight / 2 : undefined;

    const right = box.right !== undefined ? baseX + box.right - elementWidth / 2 : undefined;
    const bottom = box.bottom !== undefined ? baseY + box.bottom - elementHeight / 2 : undefined;

    const width =
      left !== undefined && right !== undefined ? right - left : undefined;
    const height =
      top !== undefined && bottom !== undefined ? bottom - top : undefined;

    return {
      left,
      top,
      width,
      height,
      right,
      bottom,
    };
  }, [constraints, ref]);

  const convertSnappoints = useCallback(
    (snapPointsToConvert: SnapPointsType) => {
      if (!ref.current) return null;

      if (snapPointsToConvert.type === "absolute") {
        return snapPointsToConvert.points;
      }

      if (snapPointsToConvert.type === "relative-to-initial") {
        const elementBox = ref.current.getBoundingClientRect();
        const style = window.getComputedStyle(ref.current);
        const transformMatrix = new DOMMatrixReadOnly(style.transform);
        const translateX = transformMatrix.e;
        const translateY = transformMatrix.f;
        const baseX = window.scrollX + elementBox.x - translateX;
        const baseY = window.scrollY + elementBox.y - translateY;

        return snapPointsToConvert.points.map((p) => {
          return {
            x: p.x === undefined ? undefined : baseX + p.x,
            y: p.y === undefined ? undefined : baseY + p.y,
          };
        });
      } else if (snapPointsToConvert.type === "constraints-box") {
        if (constraints === undefined) {
          throw new Error(
            `When using snapPoints type constraints-box, you must provide 'constraints' property`,
          );
        }

        const box = resolveConstraints();
        if (!box) {
          throw new Error(`constraints weren't provided`);
        }

        if (
          ["x", "both"].includes(direction) &&
          (box.left === undefined || box.right === undefined)
        ) {
          throw new Error(
            `constraints should describe both sides for each used drag direction`,
          );
        }
        if (
          ["y", "both"].includes(direction) &&
          (box.top === undefined || box.bottom === undefined)
        ) {
          throw new Error(
            `constraints should describe both sides for each used drag direction`,
          );
        }

        return snapPointsToConvert.points.map((p) => {
          const result: Point = {};
          if (p.x !== undefined) {
            if (snapPointsToConvert.unit === "pixel") {
              result.x = box.left! + p.x;
            } else {
              result.x = box.left! + box.width! * p.x;
            }
          }
          if (p.y !== undefined) {
            if (snapPointsToConvert.unit === "pixel") {
              result.y = box.top! + p.y;
            } else {
              result.y = box.top! + box.height! * p.y;
            }
          }
          return result;
        });
      } else {
        throw new Error("Unknown snapPoints type");
      }
    },
    [ref, constraints, resolveConstraints, direction],
  );

  const onDragEndHandler: DragHandler = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      onDragEnd?.(event, info);

      if (!ref.current) {
        throw new Error("element ref is not set");
      }

      const points = convertSnappoints(snapPoints);
      console.log("Converted snappoints", points);
      if (!points) {
        throw new Error(`snap point weren't calculated on drag start`);
      }

      const constraintsBox = resolveConstraints();
      const elementBox = ref.current.getBoundingClientRect();
      const style = window.getComputedStyle(ref.current);
      const transformMatrix = new DOMMatrixReadOnly(style.transform);
      const translate = { x: transformMatrix.e, y: transformMatrix.f };
      const base = {
        x: window.scrollX + elementBox.x - translate.x,
        y: window.scrollY + elementBox.y - translate.y,
      };

      const dropCoordinates = {
        x: window.scrollX + elementBox.x + elementBox.width / 2,
        y: window.scrollY + elementBox.y + elementBox.height / 2,
      };

      const afterInertia = {
        x: dropCoordinates.x + POWER * info.velocity.x,
        y: dropCoordinates.y + POWER * info.velocity.y,
      };

      const distances = points.map((p) => {
        if (p.x !== undefined && p.y !== undefined) {
          return Math.sqrt(
            Math.pow(p.x - afterInertia.x, 2) +
              Math.pow(p.y - afterInertia.y, 2),
          );
        }
        if (p.x !== undefined) return Math.abs(p.x - afterInertia.x);
        if (p.y !== undefined) return Math.abs(p.y - afterInertia.y);
        return 0;
      });
      const minDistance = Math.min(...distances);
      const minDistanceIndex = distances.indexOf(minDistance);
      setCurrentSnappointIndex(minDistanceIndex);
      const selectedPoint = points[minDistanceIndex];

      const afterInertiaClamped = {
        x: minmax(
          afterInertia.x,
          constraintsBox?.left ?? -Infinity,
          constraintsBox?.right ?? Infinity,
        ),
        y: minmax(
          afterInertia.y,
          constraintsBox?.top ?? -Infinity,
          constraintsBox?.bottom ?? Infinity,
        ),
      };

      const dragElasticResolved = (() => {
        if (typeof dragElastic === "number")
          return {
            top: dragElastic,
            left: dragElastic,
            right: dragElastic,
            bottom: dragElastic,
          };
        if (typeof dragElastic === "object")
          return { top: 0, left: 0, right: 0, bottom: 0, ...dragElastic };
        if (dragElastic === false)
          return { top: 0, left: 0, right: 0, bottom: 0 };
        else return { top: 0.5, left: 0.5, right: 0.5, bottom: 0.5 };
      })();
      const overshootCoefficient = { x: 1, y: 1 };
      const overshootDecreaseCoefficient = 0.999;

      if (
        constraintsBox?.left !== undefined &&
        afterInertia.x < constraintsBox.left
      ) {
        overshootCoefficient.x =
          Math.pow(
            overshootDecreaseCoefficient,
            Math.abs(constraintsBox.left - afterInertia.x),
          ) * dragElasticResolved.left;
      }
      if (
        constraintsBox?.right !== undefined &&
        afterInertia.x > constraintsBox.right
      ) {
        overshootCoefficient.x =
          Math.pow(
            overshootDecreaseCoefficient,
            Math.abs(constraintsBox.right - afterInertia.x),
          ) * dragElasticResolved.right;
      }
      if (
        constraintsBox?.top !== undefined &&
        afterInertia.y < constraintsBox.top
      ) {
        overshootCoefficient.y =
          Math.pow(
            overshootDecreaseCoefficient,
            Math.abs(constraintsBox.top - afterInertia.y),
          ) * dragElasticResolved.top;
      }
      if (
        constraintsBox?.bottom !== undefined &&
        afterInertia.y > constraintsBox.bottom
      ) {
        overshootCoefficient.y =
          Math.pow(
            overshootDecreaseCoefficient,
            Math.abs(constraintsBox.bottom - afterInertia.y),
          ) * dragElasticResolved.bottom;
      }

      const velocity = {
        x: info.velocity.x * overshootCoefficient.x,
        y: info.velocity.y * overshootCoefficient.y,
      };

      const target = {
        x:
          selectedPoint?.x !== undefined
            ? selectedPoint.x - base.x
            : afterInertiaClamped.x - base.x,
        y:
          selectedPoint?.y !== undefined
            ? selectedPoint.y - base.y
            : afterInertiaClamped.y - base.y,
      };

      console.log("Snapping result", {
        target,
        velocity,
        afterInertia,
        afterInertiaClamped,
        selectedPoint,
      });

      if (direction === "x" || direction === "both") {
        animate(
          ref.current,
          { x: target.x },
          {
            ...springOptions,
            type: "spring",
            velocity: velocity.x,
          },
        );
      }

      if (direction === "y" || direction === "both") {
        animate(
          ref.current,
          { y: target.y },
          {
            ...springOptions,
            type: "spring",
            velocity: velocity.y,
          },
        ).then(() => {
          // Call onSnapComplete with the absolute coordinates
          if (onSnapComplete) {
            const finalX = selectedPoint?.x ?? afterInertiaClamped.x;
            const finalY = selectedPoint?.y ?? afterInertiaClamped.y;
            onSnapComplete(finalX, finalY);
          }
        });
      }
    },
    [
      onDragEnd,
      ref,
      convertSnappoints,
      snapPoints,
      resolveConstraints,
      direction,
      dragElastic,
      springOptions,
      onSnapComplete,
    ],
  );

  const snapTo = useCallback(
    (index: number) => {
      const converted = convertSnappoints(snapPoints);
      if (!converted || !ref.current) return;
      const convertedPoint = converted[index];
      if (!convertedPoint) return;

      const elementBox = ref.current.getBoundingClientRect();
      // Thanks Claude Opus and this question on SO https://stackoverflow.com/questions/53866942/css-transform-matrix-to-pixel
      const style = window.getComputedStyle(ref.current);
      const transformMatrix = new DOMMatrixReadOnly(style.transform);
      const translate = { x: transformMatrix.e, y: transformMatrix.f };
      const base = {
        x: window.scrollX + elementBox.x - translate.x,
        y: window.scrollY + elementBox.y - translate.y,
      };

      setCurrentSnappointIndex(index);
      const animations: AnimationPlaybackControlsWithThen[] = [];
      if (convertedPoint.x !== undefined) {
        animations.push(
          animate(
            ref.current,
            { x: convertedPoint.x - base.x },
            {
              ...springOptions,
              type: "spring",
            },
          ),
        );
      }
      if (convertedPoint.y !== undefined) {
        animations.push(
          animate(
            ref.current,
            { y: convertedPoint.y - base.y },
            {
              ...springOptions,
              type: "spring",
            },
          ),
        );
      }

      // Wait for all animations to complete before calling onSnapComplete
      Promise.all(animations).then(() => {
        if (onSnapComplete) {
          // Pass absolute coordinates directly
          onSnapComplete(convertedPoint.x, convertedPoint.y);
        }
      });
    },
    [convertSnappoints, snapPoints, ref, springOptions, onSnapComplete],
  );

  const dragProps: Partial<MotionProps> = useMemo(
    () => ({
      drag: direction === "both" ? true : direction,
      onDragStart: (event, info) => {
        setCurrentSnappointIndex(null);
        onDragStart?.(event, info);
      },
      onDragEnd: onDragEndHandler,
      onMeasureDragConstraints(constraints) {
        constraintsBoxRef.current = constraints;
        onMeasureDragConstraints?.(constraints);
      },
      dragMomentum: true,
      dragConstraints: constraints,
      dragElastic,
    }),
    [
      direction,
      onDragStart,
      onDragEndHandler,
      onMeasureDragConstraints,
      constraints,
      dragElastic,
      setCurrentSnappointIndex, // setCurrentSnappointIndex is a stable setter, but good practice to include
    ],
  );

  return {
    dragProps,
    snapTo,
    currentSnappointIndex,
  };
};
