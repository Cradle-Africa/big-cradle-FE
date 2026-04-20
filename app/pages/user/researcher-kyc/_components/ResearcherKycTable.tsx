import { ResearcherKyc } from "@/app/lib/type";
import { Eye, MoreVertical, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReviewResearcherKyc from "./ReviewResearcherKyc";
import KycViewerModal from "@/app/components/KycViewerModal";

const ResearcherKycTable = ({ data }: { data: ResearcherKyc[] }) => {
  const menuRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResearcherId, setSelectedResearcherId] = useState<string | null>(null);
  const [kycUrl, setKycUrl] = useState<string | null>(null);
  const [viewKycOpen, setViewKycOpen] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpenReviewModal = (researcherId: string) => {
    setSelectedResearcherId(researcherId);
    setIsModalOpen(true);
    setOpenIndex(null);
  };

  const handleViewKyc = (url: string | null) => {
    setKycUrl(url ?? null);
    setViewKycOpen(true);
    setOpenIndex(null);
  };

  return (
    <>
      <div className="overflow-x-auto  pb-10 rounded-[8px] border border-gray-200">
        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">First Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Last Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Country</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">State</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Address</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">KYC Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
            {data.map((researcher, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-6 py-4">{researcher.firstName }</td>
                <td className="px-6 py-4">{researcher.lastName }</td>
                <td className="px-6 py-4 font-medium">{researcher.email}</td>

                <td className="px-6 py-4">{researcher.country }</td>
                <td className="px-6 py-4">{researcher.city }</td>
                <td className="px-6 py-4">{researcher.state }</td>
                <td className="px-6 py-4">{researcher.address }</td>
                <td className="px-6 py-4">
                  <span className={`
                    flex justify-center w-[140px] px-3 py-1 rounded-full
                    ${researcher.kycStatus === 'approved'
                      ? 'border border-green-500 text-green-600'
                      : researcher.kycStatus === 'pending'
                      ? 'border border-yellow-500 text-yellow-600'
                      : researcher.kycStatus === 'rejected'
                      ? 'border border-red-500 text-red-600'
                      : 'border border-gray-400 text-gray-500'}`}>
                    {researcher.kycStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    ${researcher.isVerified
                      ? 'border border-green-500 text-green-600'
                      : 'border border-red-500 text-red-600'} 
                    px-3 py-1 rounded-full`}>
                    {researcher?.isVerified ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-gray-100 whitespace-nowrap relative">
                  <button
                    className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-600 hover:text-white"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openIndex === index && (
                    <ul
                      ref={menuRef}
                      className="absolute right-10 py-1 mt-2 w-auto bg-white rounded-md shadow-md border border-gray-100 z-50"
                    >
                      <li className="px-2">
                        <button
                          onClick={() => handleViewKyc(researcher?.individualValidMeansOfId)}
                          className="flex w-full px-4 py-2 text-left text-sm rounded-md text-blue-700 hover:bg-blue-200 hover:cursor-pointer"
                        >
                          <div className="flex items-center gap-1">
                            <Eye size={13} />
                            View KYC
                          </div>
                        </button>
                      </li>
                      <li className="px-2">
                        <button
                          onClick={() => handleOpenReviewModal(researcher.id)}
                          className="flex w-full px-4 py-2 text-left text-sm rounded-md text-blue-700 hover:bg-blue-200 hover:cursor-pointer"
                        >
                          <div className="flex items-center gap-1">
                            <Pencil size={13} />
                            Review KYC
                          </div>
                        </button>
                      </li>
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedResearcherId && (
        <ReviewResearcherKyc setOpen={setIsModalOpen} businessUserId={''} researcherUserId={selectedResearcherId} />
      )}

      {viewKycOpen && (
        <KycViewerModal
          url={kycUrl}
          title="Researcher ID Document"
          onClose={() => setViewKycOpen(false)}
        />
      )}
    </>
  );
};

export default ResearcherKycTable;
