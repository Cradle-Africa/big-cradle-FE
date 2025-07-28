import { Flex } from "@radix-ui/themes";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { pieData } from "./FeedbackChart";

const SentimentAnalysis = () => {
  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md">
      <p className="font-medium mb-4">Sentiment analysis</p>
      <div className="bg-gray-50 h-[200px] w-full mb-4 border border-gray-200 rounded-md flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="90%" // Push it down
              startAngle={180} // From 180°
              endAngle={0} // To 0° (counterclockwise)
              outerRadius={155} // instead of 80
              innerRadius={130} // maintain same thickness
              paddingAngle={1}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col absolute  mt-4 items-center">
          <p className="font-bold text-3xl">256</p>
          <p>Responses</p>
        </div>
      </div>
      <Flex gap="4">
        <Flex
          direction="column"
          justify="start"
          gap="2"
          className="bg-gray-50 p-4 rounded-md mr-auto border border-gray-200 w-full"
        >
          <Flex gap="2">
            <p>Negative</p>
            <div className="border-red-200 bg-red-100 border-1 rounded-full px-3 flex items-center gap-2">
              <ArrowDown size={16} color="red" />
              <p>30%</p>
            </div>
          </Flex>
          <p className="text-2xl font-bold">12</p>
        </Flex>

        <Flex
          direction="column"
          justify="start"
          gap="2"
          className="bg-gray-50 p-4 rounded-md mr-auto border border-gray-200 w-full"
        >
          <Flex gap="2">
            <p>Positive</p>
            <div className="border-green-200 bg-green-100 border-1 rounded-full px-3 flex gap-2 items-center">
              <ArrowUp size={16} color="green" />
              <p>30%</p>
            </div>
          </Flex>
          <p className="text-2xl font-bold">768</p>
        </Flex>
      </Flex>
    </div>
  );
};

export default SentimentAnalysis;
