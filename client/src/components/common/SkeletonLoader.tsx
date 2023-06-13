import { Skeleton } from "@chakra-ui/react";
import * as React from "react";

interface ISkeletonLoaderProps {
  count: number;
  height: string;
  width?: string;
}

const SkeletonLoader: React.FC<ISkeletonLoaderProps> = ({
  count,
  height,
  width,
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          height={height}
          width={width}
          startColor="whiteAlpha.400"
          endColor="whiteAlpha.300"
          borderRadius={4}
        >
          <span>Chakra ui is cool</span>
        </Skeleton>
      ))}
    </>
  );
};

export default SkeletonLoader;
