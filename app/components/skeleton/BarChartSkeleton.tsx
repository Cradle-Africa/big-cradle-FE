import { Skeleton } from "@/components/ui/skeleton";

const heights = [60, 80, 45, 90, 55, 70, 40, 85, 65, 75]

export function BarChartSkeleton() {
  return (
    <div className="relative h-full w-full bg-white rounded-xl px-4 py-4 border border-gray-200">
      
      {/* Header row — title + select */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-52 bg-gray-200" /> {/* Title */}
        <Skeleton className="h-8 w-24 rounded bg-gray-200" /> {/* Select dropdown */}
      </div>

      {/* Chart area */}
      <div className="flex items-end gap-3 w-full px-2" style={{ height: "300px" }}>
  {heights.map((height, i) => (
    <div key={i} className="flex flex-col items-end justify-end gap-2 flex-1 h-full">
      <Skeleton
        className="w-full rounded-sm bg-gray-200"
        style={{ height: `${height}%` }}
      />
            {/* X axis label */}
            <Skeleton className="h-3 w-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}