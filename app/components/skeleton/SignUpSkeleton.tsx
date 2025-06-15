import React from 'react'

const SignUpSkeleton = () => {
    return (
        <div>
            <div className="flex w-full h-screen justify-between gap-5 px-5 py-5 bg-gray-50">
                <div className='md:w-1/2 px-5 py-5 rounded-md bg-gray-100'>
                    <div className='bg-gray-100 rounded-md'>
                        <div className='bg-gray-200 w-18 h-18 flex justify-center items-center rounded-md'>
                            <div className='bg-gray-300 w-12 h-12 rounded-md' />
                        </div>
                    </div>
                    <div className='bg-gray-200 px-5 py-3 mt-3 rounded-md' >
                        <div className='bg-gray-300 py-1 rounded-md' />
                    </div>
                    <div className='bg-gray-200 px-3 py-1 mt-3 rounded-md' />
                    <div className='bg-gray-200 px-5 py-3 mt-5 rounded-md'>
                        <div className='bg-gray-300 py-1 rounded-md' />
                    </div>
                    <div className='bg-gray-200 px-1 py-1 mt-5 rounded-md' />
                    <div className='flex justify-between bg-gray-100 py-2 px-2 mt-3 border border-gray-200 rounded-md' >
                        <div className='bg-gray-200 px-10 py-3 rounded-md'>
                            <div className='bg-gray-300 py-1 rounded-md' />
                        </div>
                        <div className='bg-gray-200 px-10 py-3 rounded-md'>
                            <div className='bg-gray-300 py-1 rounded-md' />
                        </div>
                        <div className='bg-gray-200 px-10 py-3 rounded-md'>
                            <div className='bg-gray-300 py-1 rounded-md' />
                        </div>
                    </div>
                    <div className='bg-gray-200 px-5 py-5 mt-5 rounded-md' />
                    <div className='bg-gray-200 px-5 py-5 mt-5 rounded-md' />
                    <div className='bg-gray-200 px-5 py-5 mt-5 rounded-md' />
                    <div className='bg-gray-200 px-5 py-5 mt-5 rounded-md' />
                    <div className='flex justify-end'>
                        <div className='bg-gray-200 w-24 px-5 py-5 mt-5 rounded-md' />
                    </div>

                </div>
                <div className='hidden md:block md:w-1/2 px-5 py-5 rounded-md bg-gray-100'>

                </div>
            </div>
        </div>
    )
}

export default SignUpSkeleton
