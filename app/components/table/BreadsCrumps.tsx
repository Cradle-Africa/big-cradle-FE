import React, { useEffect, useRef } from 'react'
import { getBusinessId, getToken } from '../../utils/user/userData';
import FormPopup from '../pop-up/PopUpForm'
import { Department } from './types/Table';
import { BreadsCrumpsProps } from './types/Table'
import { BASE_URL } from '@/app/lib/axios';


const BreadsCrumps: React.FC<BreadsCrumpsProps> = (
    {
        title,
        openEmployee,
        setOpenEmployee,
        // openDepartment,
        // setOpenDepartment,
        // openBusiness,
        // setOpenBusiness,
        breadcrumbs,
        rightAction
    }) => {

    const businessId = getBusinessId();
    const accessToken = getToken();
    // const adminUserId = getAdminUserId();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenEmployee(false);
            }
        };
        document.addEventListener('mousedown', handler);

    }, [setOpenEmployee])



    return (

        <>
           

            {openEmployee && (
                <FormPopup
                    setOpen={setOpenEmployee}
                    title="Send Invite Link"
                    method={rightAction?.add?.method || 'POST'}
                    endPoint={rightAction?.add?.endpoint}
                    fields={[
                        { name: 'email', label: 'Email', type: 'email', required: true },
                        { name: 'role', label: '', type: 'hidden', required: true },
                        { name: 'businessUserId', label: '', type: 'hidden', required: false },
                        {
                            name: 'departmentId', label: 'Department', type: 'select', required: true,
                            fetchOptions: async () => {
                                const res = await fetch(
                                    `${BASE_URL}/department-mgt/all-business-departments?businessUserId=${businessId}`,
                                    {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${accessToken}`,
                                        },
                                    }
                                );
                                const data = await res.json();
                                return (data?.department as Department[])?.map((d: Department) => ({ label: d.departmentName, value: d.id }));
                            }
                        },
                    ]}
                    defaultValues={{ businessUserId: businessId || '', role: 'employee' }}
                />
            )}

            
            <div className='flex justify-between w-full text-sm'>
                <div>
                    <span className='text-gray-700 ml-1' key="breadcrumb-current">
                        {breadcrumbs.current}
                    </span>
                </div>
                <div>
                    {rightAction && rightAction.add && (
                        <>
                            <button
                                onClick={() => {
                                    if (title === 'Employees') {
                                        setOpenEmployee(true)
                                    }
                                }}
                                className={`btn ${rightAction.add.className || 'bg-blue-600 text-white px-2 py-1 rounded-md cursor-pointer'}`}
                                key="right-action-button"
                            >
                                {rightAction.add.icon && (
                                    <span className={`icon ${rightAction.add.icon}`} key="right-action-icon"></span>
                                )}
                                {rightAction.add.label}
                            </button>
                        </>

                    )}
                </div>
            </div>
        </>

    )
}

export default BreadsCrumps
