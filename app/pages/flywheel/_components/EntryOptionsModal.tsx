"use client";

import { X, Plus, FileStackIcon } from "lucide-react";
import Link from "next/link";

interface EntryOptionsModalProps {
  onClose: () => void;
  onNewEntry: () => void;
  pipelineId: string;
  fieldId: string;
}

const EntryOptionsModal: React.FC<EntryOptionsModalProps> = ({
  onClose,
  onNewEntry,
  fieldId,
  pipelineId,
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-10" />
      <div className="w-3/4 md:w-2/4 text-center bg-white px-5 py-5 rounded-lg z-50 fixed top-[300px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>
            <X size={20} className="text-red-500 cursor-pointer" />
          </button>
        </div>

        <div className="md:flex justify-between gap-5 mt-5">
          <div className="md:w-1/2 bg-blue-50 text-blue-600 rounded-md p-5 hover:border hover:border-blue-300 h-28">
            <Plus
              size={25}
              color="white"
              className="mr-1 inline bg-blue-600 rounded-full p-1"
            />
            <button
              className="mt-3 py-1 px-2 w-full flex items-center justify-center cursor-pointer text-white rounded-md bg-blue-600"
              onClick={onNewEntry}
            >
              New Data Entry
            </button>
          </div>

          <div className="mt-5 md:mt-0 md:w-1/2 bg-blue-50 text-blue-600 rounded-md p-5 hover:border hover:border-blue-300 h-28">
            <FileStackIcon
              size={25}
              color="white"
              className="mr-1 inline bg-blue-600 rounded-full p-1"
            />
            <Link
              className="mt-3 py-1 px-2 flex justify-center items-center cursor-pointer text-white rounded-md bg-blue-600"
              href={`/pages/flywheel/data-entry/new/bulk/${pipelineId}/${fieldId}`}
            >
              Bulk Data Entry
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntryOptionsModal;
