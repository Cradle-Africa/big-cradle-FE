"use client";

import Image from "next/image";
import { useRef } from "react";
import api_icon from "@/public/icons/api_icon.png";
import build_pipeline from "@/public/icons/build_pipeline.png";

interface PopUpProps {
    openPopup: boolean;
    onClose: () => void;
    onBuildPipeline: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ openPopup, onClose, onBuildPipeline }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <div>
        { openPopup && (
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
                        <button className="md:w-1/2 px-6 py-6 bg-[#FCEBFF] hover:bg-blue-500 hover:text-white hover:transition rounded-lg cursor-pointer">
                            <div className="flex justify-center">
                                <Image alt="api icon" src={api_icon} width={40} height={40} />
                            </div>
                            <p className="mt-3 text-md text-gray-800">Connect via API</p>
                            <p className="text-sm mt-3">
                                Integrate with your existing apps, websites, or CRM
                            </p>
                        </button>

                        <button
                            className="mt-5 md:mt-0 md:w-1/2 px-6 py-6 bg-[#E6E9FF] hover:bg-blue-500 hover:text-white hover:transition rounded-lg cursor-pointer"
                            onClick={() => {
                                onBuildPipeline();
                                onClose();
                            }}
                        >
                            <div className="flex justify-center">
                                <Image
                                    alt="build icon"
                                    src={build_pipeline}
                                    width={40}
                                    height={40}
                                />
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
