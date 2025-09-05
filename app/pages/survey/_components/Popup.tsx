"use client";

import { List, PlusCircle } from "lucide-react";
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

                        <p className="mt-3 text-md font-bold text-gray-800">How would you like to collect your data?</p>

                        <div className="md:flex justify-between gap-3 md:gap-5 mt-5 ">
                            <div className="md:w-full bg-[#F5FAFE]">
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
                                            <PlusCircle className="" />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-blue-600 font-semibold">Internal Survey</p>
                                    <p className="text-lg mt-3">
                                        Collect responses from audiences using the Big Cradle app
                                    </p>
                                </button>
                            </div>


                            <div className="mt-5 md:mt-0 md:w-full bg-[#FEF9F5]">
                                <button
                                    onClick={() => {
                                        onBuildPipeline();
                                        router.push("/pages/survey/new?survey=survey-name-and-description&survey-type=external")
                                        onClose();
                                    }}
                                    className="md:mt-0 w-full md:h-44 px-6 py-6 border-2 border-dashed border-[#E6BE9F] hover:border  hover:transition-all ease-in rounded-lg cursor-pointer"

                                >
                                    <div className="flex justify-center">
                                        <div className="bg-white text-[#E6BE9F] rounded-full p-3">
                                            <List className="" />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-blue-600 font-semibold">External Survey</p>
                                    <p className="text-lg mt-3">
                                        Collect responses from external audiences using sharable links
                                    </p>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>


    );
};

export default PopUp;
