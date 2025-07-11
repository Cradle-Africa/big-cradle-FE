"use client";

import { ArrowUpDown } from "lucide-react";
import { useRef } from "react";
// import Link from 'next/link'
// import { ArrowUpDown, Network } from "lucide-react";

interface PopUpProps {
    openPopup: boolean;
    onClose: () => void;
    onBuildPipeline: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ openPopup, onClose, onBuildPipeline }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <div>
            {openPopup && (
                <div>
                    <div className="fixed inset-0 bg-black/40 z-10" onClick={onClose} />
                    <div
                        className="text-center bg-white px-5 py-5 md:px-8 md:py-8 rounded-lg w-82 md:w-full max-w-2xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ref={menuRef}
                    >
                        <h2 className="text-gray-800 text-sm lg:text-lg font-normal">
                            How would you like to collect your data?
                        </h2>
                        <p className="mt-5 text-gray-700 hidden lg:block">
                            Choose an integration method or build your own feedback tool
                        </p>

                        <div className="md:flex justify-between gap-3 md:gap-5 mt-5 lg:mt-10">
                            {/* <div className="md:w-1/2 md:h-44 px-6 py-6 bg-[#FCEBFF] hover:border hover:border-[#d27ce1] hover:transition rounded-lg cursor-pointer">
                                <Link className="w-full h-full"
                                href="/pages/flywheel/social-media"
                                >
                                    <div className="flex justify-center">
                                        <div className="bg-white text-[#d27ce1] rounded-full p-3">
                                            <Network className="" />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-md text-gray-800">Connect social media account</p>
                                    <p className="text-sm mt-3">
                                        Analyse your Social media account
                                    </p>
                                </Link>
                            </div> */}

                            <button
                                className="mt-5 md:mt-0 md:w-2/2 md:h-44 px-6 py-6 bg-[#E6E9FF] hover:border hover:border-blue-500 hover:transition rounded-lg cursor-pointer"
                                onClick={() => {
                                    onBuildPipeline();
                                    onClose();
                                }}
                            >
                                <div className="flex justify-center">
                                    <div className="bg-white text-blue-600 rounded-full p-3">
                                        <ArrowUpDown className="" />
                                    </div>
                                </div>
                                <p className="mt-3 text-md text-gray-800">Build Custom Pipeline</p>
                                <p className="text-sm mt-3">
                                    Use our form builder to create your own survey
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
};

export default PopUp;
