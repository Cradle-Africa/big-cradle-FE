import { Skeleton } from "@/components/ui/skeleton";

export default function SurveySkeleton() {
  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-24" />          {/* "Surveys" title */}
        <Skeleton className="h-9 w-44 rounded-md" /> {/* "Create new survey" button */}
      </div>

      {/* Subtitle */}
      <Skeleton className="h-4 w-[70%] mt-2" />

      {/* Survey Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-6 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
              <Skeleton className="h-4 w-24" />              {/* Title */}
            </div>
            <Skeleton className="h-7 w-16" />  {/* Value */}
            <Skeleton className="h-3 w-32" />  {/* Subtitle */}
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col rounded-md bg-white lg:p-4 mt-8">

        {/* Table title */}
        <Skeleton className="h-5 w-20 mb-4" />

        {/* Status filters */}
        <div className="flex gap-4 my-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>

        {/* Table header */}
        <div className="flex gap-4 border-b pb-3 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}