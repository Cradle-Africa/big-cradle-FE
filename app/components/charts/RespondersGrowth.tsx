import { Flex } from "@radix-ui/themes";
import React from "react";

const RespondersGrowth = () => {
  return (
    <div className="w-full bg-white p-4 border border-gray-100 rounded-md flex flex-col h-full">
      <p className="font-medium mb-4">Responders growth</p>
      <div className="relative w-[120px] h-[200px] mx-auto">
        <div className="bg-[#414EF4] rounded-full h-[80px] w-[80px] flex justify-center items-center absolute right-0 top-1/2 -translate-y-1/2 border border-blue-300">
          <p className="text-white">1232</p>
        </div>
        <div className="bg-[#6470FA] rounded-full h-[70px] w-[70px] flex justify-center items-center absolute left-4 bottom-6 border border-blue-300">
          <p className="text-white">890</p>
        </div>
        <div className="bg-[#6470FA] rounded-full h-[50px] w-[50px] flex justify-center items-center absolute left-0 top-1/2 -translate-y-1/2 border border-blue-300">
          <p className="text-white">12</p>
        </div>
      </div>

      <Flex gap="2" align="center">
        <div className="rounded-full border bg-gray-100 border-gray-200 h-[50px] w-[50px] flex flex-col justify-center items-center shrink-0">
          <p className="text-3xl">🇳🇬</p>
        </div>
        <Flex direction="column" gap="1" mb="1" className="w-full">
          <p>Nigeria</p>
          <div className="bg-gray-100 rounded-lg w-full h-[6px]">
            <div className="rounded-lg w-[50%] h-[6px] bg-blue-600"></div>
          </div>
        </Flex>
      </Flex>

      <Flex gap="2" align="center" mt="4">
        <div className="rounded-full border bg-gray-100 border-gray-200 h-[50px] w-[50px] flex flex-col justify-center items-center shrink-0">
          <p className="text-3xl">🇷🇼</p>
        </div>
        <Flex direction="column" gap="1" mb="1" className="w-full">
          <p>Rwanda</p>
          <div className="bg-gray-100 rounded-lg w-full h-[6px]">
            <div className="rounded-lg w-[70%] h-[6px] bg-blue-600"></div>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default RespondersGrowth;
