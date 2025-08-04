"use client";

import { ArrowUpDown, Network } from "lucide-react";
import {useRouter} from "next/navigation";
import { useRef } from "react";

interface PopUpProps {
    openPopup: boolean;
    onClose: () => void;
    onBuildPipeline: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ openPopup, onClose, onBuildPipeline }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter()

    return (
        <div>
            {openPopup && (
                <div>
                    <div className="fixed inset-0 bg-black/40 z-10" onClick={onClose} />
                    <div
                        className="text-center bg-white px-5 py-5 md:px-8 md:py-8 rounded-lg w-82 md:w-full max-w-3xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ref={menuRef}
                    >

                        <p className="mt-3 text-md text-gray-800">How would you like to collect your data?</p>

                        <div className="md:flex justify-between gap-3 md:gap-5 mt-5 ">
                            <div className="md:w-full bg-[#FEFAFF]">
                                <button
                                    onClick={() => {
                                        onBuildPipeline();
                                        router.push("/pages/survey/new?survey=survey-name-and-description&survey-type=internal")
                                        onClose();
                                    }}
                                    className="md:mt-0 w-full md:h-44 px-6 py-6 border-2 border-dashed border-blue-500 hover:border  hover:transition-all ease-in rounded-lg cursor-pointer"

                                >
                                    <div className="flex justify-center">
                                        <div className="bg-white text-blue-600 rounded-full p-3">
                                            <ArrowUpDown className="" />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-md font-semibold">Internal Survey</p>
                                    <p className="text-sm mt-3">
                                        Collect responses from audiences using the Big Cradle app
                                    </p>
                                </button>
                                {/* <button
                                    className="w-full mt-5 bg-blue-600 text-white px-5 py-2 rounded-md flex justify-center hover:cursor-pointer"
                                    onClick={() => {
                                        onBuildPipeline();
                                        onClose();
                                    }}
                                >
                                    Create an internal survey
                                </button> */}
                            </div>


                            <div className="md:w-full bg-[#FAFBFF]">
                                <button
                                    onClick={() => {
                                        onBuildPipeline();
                                        router.push("/pages/survey/new?survey=survey-name-and-description&survey-type=external")
                                        onClose();
                                    }}
                                    className="md:mt-0 w-full md:h-44 px-6 py-6 border-2 border-dashed border-blue-500 hover:border  hover:transition-all ease-in rounded-lg cursor-pointer"

                                >
                                    <div className="flex justify-center">
                                        <div className="bg-white text-blue-600 rounded-full p-3">
                                            <Network className="" />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-md font-semibold">External Survey</p>
                                    <p className="text-sm mt-3">
                                        Collect responses from external audiences using sharable links
                                    </p>
                                </button>
                                {/* <button
                                    className="w-full mt-5 bg-blue-600 text-white px-5 py-2 rounded-md flex justify-center hover:cursor-pointer"
                                    onClick={() => {
                                        onBuildPipeline();
                                        onClose();
                                    }}
                                >
                                    Create an external survey
                                </button> */}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>


    );
};

export default PopUp;
