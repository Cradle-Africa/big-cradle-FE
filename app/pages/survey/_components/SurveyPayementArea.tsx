import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const SurveyPayementArea = () => {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto my-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-red-600 border border-red-600 px-4 py-1 cursor-pointer rounded-lg hover:bg-blue-50 mb-8"
      >
        <ArrowLeft />
      </button>
      <p className="text-3xl font-bold mb-5">Payment</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores illo
        incidunt architecto maxime neque, magni perspiciatis odio eaque minus
        voluptatibus vitae quaerat sequi quod mollitia aliquam veniam blanditiis
        fugiat consequatur?
      </p>
    </div>
  );
};

export default SurveyPayementArea;
