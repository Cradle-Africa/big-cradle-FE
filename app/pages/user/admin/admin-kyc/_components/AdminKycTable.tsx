import { AdminKyc } from "@/app/lib/type";
import { Eye, MoreVertical, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/app/utils/formatDate";
import ReviewAdminKyc from "./ReviewAdminKyc";
import KycViewerModal from "@/app/components/KycViewerModal";

const AdminKycTable = ({ data }: { data: AdminKyc[] }) => {
  const menuRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
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

  const handleOpenReviewModal = (businessId: string) => {
    setSelectedAdminId(businessId);
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
      <div className="overflow-x-auto h-125 2xl:h-160 rounded-[8px] border border-gray-200">
        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap ">First Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Last Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Country</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">State</th>
              <th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">KYC Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
            {data.map((business, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ formatDate(business?.createdAt) }</td>
                <td className="px-6 py-4 whitespace-nowrap">{business?.userType }</td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">{business?.firstName }</td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">{business?.lastName }</td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">{business?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{business?.country}</td>
                <td className="px-6 py-4 whitespace-nowrap">{business?.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">{business?.state}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    flex justify-center w-[140px]
                    ${business.kycStatus === 'approved'
                      ? 'border border-green-500 text-green-600'
                      : 'border border-red-500 text-red-600'} 
                    px-3 py-1 rounded-full`}>
                    {business.kycStatus}
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
                          onClick={() => handleViewKyc(business?.certificateOfIncorporation)}
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
                          onClick={() => handleOpenReviewModal(business.id)}
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

      {isModalOpen && selectedAdminId && (
        <ReviewAdminKyc setOpen={setIsModalOpen} adminUserId={selectedAdminId} />
      )}

      {viewKycOpen && (
        <KycViewerModal
          url={kycUrl}
          title="Ecosystem Enabler KYC Document"
          onClose={() => setViewKycOpen(false)}
        />
      )}
    </>
  );
};

export default AdminKycTable;
