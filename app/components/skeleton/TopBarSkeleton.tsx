import React from 'react'

const TopBarSkeleton = () => {
    return (
        <div>
            <div className="border-b border-gray-100 w-full flex justify-end md:justify-between pl-5 pt-5 pb-4">
                {/* Search bar placeholder with animation */}
                <div className="hidden relative md:flex h-10 w-62 bg-gray-100 rounded-md px-2 py-2">
                    <div className="w-full bg-gray-200 rounded-md animate-pulse" />
                </div>

                {/* Right side icons and user info */}
                <div className='flex justify-between gap-3 bg-gray-100 pr-5 pl-2 py-1 h-8 lg:10 rounded-md'>
                    {/* Icon 1 */}
                    <div className='rounded-full w-6 h-6 bg-gray-200 animate-pulse' />

                    {/* Icon 2 */}
                    <div className='rounded-full w-6 h-6 bg-gray-200 animate-pulse' />

                    {/* User info */}
                    <div className='flex flex-col hover:cursor-pointer bg-gray-100 gap-1'>
                        <div className='hidden lg:block w-20 h-4 bg-gray-200 rounded animate-pulse' />
                        <div className='lg:hidden w-6 h-4 bg-gray-200 rounded animate-pulse' />
                        <div className='w-44 h-3 bg-gray-200 rounded animate-pulse' />
                    </div>

                    {/* Dropdown arrow */}
                    <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
            </div>
        </div>
    )
}

export default TopBarSkeleton
