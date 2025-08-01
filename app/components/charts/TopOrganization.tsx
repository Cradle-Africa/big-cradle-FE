import { ArrowUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import AfricaPicture from "@/public/images/africa-picture.png";

const TopOrganization = () => {
  return (
    <div className="flex w-full flex-col gap-4 h-full bg-white">
      <div className="border border-gray-200 rounded-md p-4 h-full flex flex-col justify-between">
        <p className="font-medium mb-4">Top organizations</p>
        <div className="flex gap-2 items-center">
          <p className="text-3xl font-bold">3,231</p>
          <div className="border-green-200 bg-green-100 border-1 rounded-full px-3 flex gap-2 items-center">
            <ArrowUp size={16} color="green" />
            <p>20%</p>
          </div>
        </div>
        <div className="h-[60px] w-full mt-2 relative">
          <div className="absolute left-0 h-[60px] w-[60px] bg-gray-100 rounded-full border border-gray-300" />
          <div className="absolute left-[40px] h-[60px] w-[60px] bg-gray-100 rounded-full border border-gray-300" />
          <div className="absolute left-[80px] h-[60px] w-[60px] bg-gray-100 rounded-full border border-gray-300" />
          <div className="absolute left-[120px] h-[60px] w-[60px] bg-gray-100 rounded-full border border-gray-300" />
          <div className="absolute left-[160px] h-[60px] w-[60px] bg-gray-100 rounded-full border border-gray-300" />
        </div>
      </div>
      <div className="border border-gray-200 rounded-md p-4 h-full flex gap-4">
        <div className="flex flex-col">
          <p className="text-3xl font-bold">24</p>
          <p className="text-2xl font-bold">Countries</p>
          <div className="border-green-200 bg-green-100 border-1 rounded-full px-3 flex gap-2 items-center mr-auto mt-4">
            <ArrowUp size={16} color="green" />
            <p>20%</p>
          </div>
        </div>
        <Image src={AfricaPicture} width={120} alt="africa-picture" />
      </div>
    </div>
  );
};

export default TopOrganization;
