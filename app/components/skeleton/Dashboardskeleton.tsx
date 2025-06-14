'use client';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DashboardSkeleton() {
    return (
        <div
            className="animate-pulse"
            // variants={containerVariants}
            // initial="hidden"
            // animate="show"
        >
            <div className="w-full space-y-2" >
                <div className="bg-gray-100 rounded-md py-5 px-5 h-24 space-y-2">
                    <div className="w-1/2 bg-gray-200 rounded-md py-3" />
                    <div className="w-2/3 bg-gray-200 rounded-md py-2" />
                </div>
                <div className="text-sm bg-gray-100 rounded-md px-5 py-3">
                    <div className=" bg-gray-200 rounded-md py-2" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="border border-[#F7F7F7] bg-gray-100 rounded-md px-5 py-4 space-y-3"
                        // variants={itemVariants}
                    >
                        <div className="bg-gray-200 rounded-md w-24 h-5 mt-2" />
                        <div className="bg-gray-200 rounded-md h-6" />
                        <p className="bg-gray-200 rounded-md h-4 w-2/3" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="border border-[#F7F7F7] bg-gray-100 rounded-md px-5 py-4 space-y-3"
                        // variants={itemVariants}
                    >
                        <div className="bg-gray-200 rounded-md h-5 w-1/3" />
                        <div className="bg-gray-200 rounded-md h-24" />
                        <p className="bg-gray-200 rounded-md h-4 w-2/4" />
                    </div>
                ))}
            </div>

            <div className="w-full mt-5 bg-gray-100 px-5 py-5" >
            {/* // variants={itemVariants} */}
                <p className="font-semibold text-md bg-gray-200 rounded-md p-5" />
            </div>
        </div>
    );
}
