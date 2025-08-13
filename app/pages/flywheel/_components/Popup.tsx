// "use client";

import { ArrowUpDown, Network } from "lucide-react";
import { useRef } from "react";
// import Link from 'next/link'
// import { ArrowUpDown, Network } from "lucide-react";
import { useRouter } from "next/navigation";

interface PopUpProps {
    openPopup: boolean;
    onClose: () => void;
    onBuildPipeline: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ openPopup, onClose, onBuildPipeline }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    return (
        <div>
            {openPopup && (
                <div>
                    <div className="fixed inset-0 bg-black/40 z-10" onClick={onClose} />
                    <div
                        className="text-center bg-white px-5 py-5 md:px-8 md:py-8 rounded-lg w-82 md:w-full max-w-3xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ref={menuRef}
                    >

                        <h3 className="font-bold"> How would you like to collect your data?</h3>
                        <div className="md:flex justify-between gap-3 md:gap-5 mt-5">
                            <div className="md:w-full bg-orange-50">
                                <button
                                    onClick={() => {
                                        router.push("https://tinyurl.com/2ammll52")
                                        onClose();
                                    }}
                                    className="md:mt-0 w-full md:h-48 px-6 py-6 border-2 border-dashed border-orange-400 hover:border  hover:transition-all ease-in rounded-lg cursor-pointer"

                                >
                                    <div className="flex justify-center">
                                        <div className="bg-white text-orange-400 rounded-full p-3">
                                            <Network className="" />
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold mt-3">
                                        Connect via Api
                                    </p>
                                    <p className="mt-3 text-md text-gray-800">Integrate with your existing apps, websites, or CRM</p>
                                    
                                </button>
                                {/* <button
                                    className="w-full mt-5 bg-blue-600 text-white px-5 py-2 rounded-md flex justify-center hover:cursor-pointer"
                                    onClick={() => {
                                        onBuildPipeline();
                                        onClose();
                                    }}
                                >
                                        Connect via Api
                                </button> */}
                            </div>

                            <div className="md:w-full bg-blue-50">
                                <button
                                    onClick={() => {
                                        onBuildPipeline();
                                        onClose();
                                    }}
                                    className="md:mt-0 w-full md:h-48 px-6 py-6 border-2 border-dashed border-blue-500 hover:border  hover:transition-all ease-in rounded-lg cursor-pointer"

                                >
                                    <div className="flex justify-center">
                                        <div className="bg-white text-blue-600 rounded-full p-3">
                                            <ArrowUpDown className="" />
                                        </div>
                                    </div>
                                    <h2 className="text-lg font-bold mt-3">
                                        Build your own data pipeline
                                    </h2>
                                    <p className="mt-3 text-md text-gray-800">Use our form builder to create your own data pipeline</p>
                                    
                                </button>
                                {/* <button
                                    className="w-full mt-5 bg-blue-600 text-white px-5 py-2 rounded-md flex justify-center hover:cursor-pointer"
                                    onClick={() => {
                                        onBuildPipeline();
                                        onClose();
                                    }}
                                >
                                    Build your own pipeline
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
