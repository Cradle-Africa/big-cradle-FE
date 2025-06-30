import { Business } from "@/app/lib/type";
import { LockKeyhole, MoreVertical, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "@/app/lib/axios";
import { useBusinessesResetPassword, useDeleteBusinesses } from "../_features/hook";

const BusinessTable = ({ data }: { data: Business[] }) => {
  const menuRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { mutate: deleteBusiness, isPending: deletePending } = useDeleteBusinesses(axios);

  const { mutate: resetBusinessPassword, isPending: resetPasswordPending } = useBusinessesResetPassword(axios);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = (id: string) => {
    deleteBusiness(id);
    setOpenIndex(null); 
  };

  const handleResetPassword = (id: string) => {
    resetBusinessPassword(id);
    setOpenIndex(null); 
  };

  
  return (
    <div className="overflow-x-auto rounded-[8px] border border-gray-200">
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
                  flex wrap-normal w-[140px] justify-center
                  ${business?.kycStatus === 'approved' 
                    ? 'border border-green-500 text-green-600' 
                    : 'border border-red-500 text-red-600'} 
                  px-3 lg:px-5 py-1 rounded-full`}>
                  {business.kycStatus}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`
                  ${business?.isActive 
                    ? 'border border-green-500 text-green-600' 
                    : 'border border-red-500 text-red-600'} 
                  px-3 lg:px-5 py-1 rounded-full`}>
                  {business.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 border-b border-r border-gray-100 whitespace-nowrap relative">
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
                    <li className="px-1">
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="flex w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-200 hover:cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          <Trash size={13} />
                          {deletePending ? 'Deleting...' : 'Delete this business'}
                        </div>
                      </button>
                    </li>
                    <li className="px-1">
                      <button
                        onClick={() => handleResetPassword(business.id)}
                        className="flex w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-200 hover:cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          <LockKeyhole size={13} />
                          {resetPasswordPending ? 'Resetting the password...' : 'Reset Password'}
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
  );
};

export default BusinessTable;
