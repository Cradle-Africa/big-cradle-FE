import { BusinessKyc } from "@/app/lib/type";
import { Eye, MoreVertical, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReviewBusinessKyc from "./ReviewBusinessKyc"; // Adjust the path if needed

const BusinessKycTable = ({ data }: { data: BusinessKyc[] }) => {
  const menuRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
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

  const handleOpenReviewModal = (businessId: string) => {
    setSelectedBusinessId(businessId);
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
      <div className="overflow-x-auto pb-10 rounded-[8px] border border-gray-200">
        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Business Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">First Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Last Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Country</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">State</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Address</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Size</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">KYC Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
            {data.map((business, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{business.businessName}</td>
                <td className="px-6 py-4 font-medium">{business.email}</td>
                <td className="px-6 py-4">{business.contactPersonFirstName}</td>
                <td className="px-6 py-4">{business.contactPersonLastName}</td>
                <td className="px-6 py-4">{business.businessCountry}</td>
                <td className="px-6 py-4">{business.businessCity}</td>
                <td className="px-6 py-4">{business.businessState}</td>
                <td className="px-6 py-4">{business.businessAddress}</td>
                <td className="px-6 py-4">{business.organizationSize}</td>
                <td className="px-6 py-4">
                  <span className={`
                    flex justify-center w-[140px]
                    ${business.kycStatus === 'approved'
                      ? 'border border-green-500 text-green-600'
                      : 'border border-red-500 text-red-600'} 
                    px-3 py-1 rounded-full`}>
                    {business.kycStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    ${business.isActive
                      ? 'border border-green-500 text-green-600'
                      : 'border border-red-500 text-red-600'} 
                    px-3 py-1 rounded-full`}>
                    {business?.isActive ? 'Active' : 'Inactive'}
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

      {isModalOpen && selectedBusinessId && (
        <ReviewBusinessKyc setOpen={setIsModalOpen} businessUserId={selectedBusinessId} />
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
              title="Certificate of corporation Preview"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessKycTable;
