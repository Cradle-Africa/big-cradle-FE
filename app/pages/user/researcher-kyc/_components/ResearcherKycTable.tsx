import { ResearcherKyc } from "@/app/lib/type";
import { Eye, MoreVertical, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReviewResearcherKyc from "./ReviewResearcherKyc";

const ResearcherKycTable = ({ data }: { data: ResearcherKyc[] }) => {
  const menuRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResearcherId, setSelectedResearcherId] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<string | null>(null);
  const [viewKyc, setViewKyc] = useState(false)

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

  const handleViewKyc = (certificate: string) => {
    setViewKyc(true)
    setCertificate(certificate)
    console.log(certificate)
  }

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
                    flex justify-center w-[140px]
                    ${researcher.kycStatus === 'approved'
                      ? 'border border-green-500 text-green-600'
                      : 'border border-red-500 text-red-600'} 
                    px-3 py-1 rounded-full`}>
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

      {viewKyc && (
        <div className="bg-white p-6 rounded-md  shadow-md w-82 h-[300px] md:h-[500px] md:w-3/4 z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
          className="absolute right-[-50px] top-1 hover:cursor-pointer bg-gray-100 rounded-full p-1 bg-opacity-90"
          onClick={ () => setViewKyc(false)}
          >
            <X size={25} className="text-red-500" />
          </button>
          <div className='flex w-full h-full border border-gray-100 rounded-md'>
            <iframe
              src={typeof certificate === 'string' ? certificate : ''}
              className="flex w-full h-full"
              width={100}
              title="Individual ID"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ResearcherKycTable;
