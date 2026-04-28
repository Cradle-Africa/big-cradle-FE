import { Skeleton } from "@/components/ui/skeleton";

export function IntroductionSkeleton (){
    return(
        <div className="md:mt-0 md:flex flex-col w-full bg-gray-100  rounded-md border p-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-52 bg-gray-200"/>
                <Skeleton className="h-8 w-12 bg-gray-200"/>
            </div>
        </div>
    )
}