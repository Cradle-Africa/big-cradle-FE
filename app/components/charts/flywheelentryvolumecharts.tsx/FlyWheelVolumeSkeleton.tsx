import { Skeleton } from "@/components/ui/skeleton";

export function FlywheelEntryVolumeSkeleton() {
  return (
    <div className="relative h-full w-full bg-white rounded-xl px-4 py-4 border border-gray-200">
      
      {/* Title */}
      <Skeleton className="h-5 w-52 mb-4" />

      {/* Chart area */}
      <div className="flex items-center justify-between w-full h-[300px]">
        
        {/* Donut chart placeholder — positioned like cx="35%" */}
        <div className="flex items-center justify-center w-[50%] h-full">
          <div className="relative flex items-center justify-center">
            {/* Outer circle */}
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
            {/* Inner hole to simulate donut */}
            <div className="absolute h-[150px] w-[150px] rounded-full bg-white" />
          </div>
        </div>

        {/* Legend placeholder — vertical list on the right */}
        <div className="flex flex-col gap-3 w-[45%]">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-sm" /> {/* Color square */}
              <Skeleton className="h-3 w-28" />            {/* Label */}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}