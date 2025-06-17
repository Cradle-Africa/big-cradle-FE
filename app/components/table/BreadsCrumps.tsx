import React, { useEffect, useRef } from 'react'
import Link from 'next/link';
import { getBusinessId, getAdminUserId, getToken } from '../../utils/user/userData';
import FormPopup from '../pop-up/PopUpForm'
import { BASE_URL } from '@/app/services/base'
import { Department } from './types/Table';
import { BreadsCrumpsProps } from './types/Table'


const BreadsCrumps: React.FC<BreadsCrumpsProps> = (
    {
        title,
        openEmployee,
        setOpenEmployee,
        openDepartment,
        setOpenDepartment,
        openBusiness,
        setOpenBusiness,
        breadcrumbs,
        rightAction
    }) => {

    const businessId = getBusinessId();
    const accessToken = getToken();
    const adminUserId = getAdminUserId();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenEmployee(false);
                setOpenDepartment(false);
                setOpenBusiness(false);
            }
        };
        document.addEventListener('mousedown', handler);

    }, [setOpenEmployee, setOpenDepartment, setOpenBusiness])



    return (

        <>
            {openDepartment && (
                <FormPopup
                    setOpen={setOpenDepartment}
                    title="Create Department"
                    method={rightAction?.add?.method || 'POST'}
                    endPoint={rightAction?.add?.endpoint || ''}
                    fields={[
                        { name: 'departmentName', label: 'Name', type: 'text', required: true },
                        { name: 'departmentDescription', label: 'Description', type: 'text', required: false },
                        { name: 'businessUserId', label: '', type: 'hidden', required: true }
                    ]}
                    defaultValues={{ businessUserId: businessId || '' }}
                />
            )}

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

            {openBusiness && (
                <FormPopup
                    setOpen={setOpenBusiness}
                    title="Send Invite Link"
                    method={rightAction?.add?.method || 'POST'}
                    endPoint={rightAction?.add?.endpoint}
                    fields={[
                        { name: 'email', label: 'Email', type: 'email', required: true },
                        { name: 'adminBusinessUserId', label: '', type: 'hidden', required: false },
                    ]}
                    defaultValues={{ adminBusinessUserId: adminUserId }}
                />
            )}
            <div className='flex justify-between w-full text-sm'>
                <div>
                    <span className='text-gray-400'>
                        <Link href={breadcrumbs.parent.path} key="breadcrumb-link">
                            {breadcrumbs.parent.label} /
                        </Link>
                    </span>
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
                                    } else if (title === 'Departments') {
                                        setOpenDepartment(true)
                                    } else if (title === 'Businesses') {
                                        setOpenBusiness(true)
                                    }
                                }}
                                className={`btn ${rightAction.add.className || 'bg-gradient-to-br from-[#578CFF] to-[#0546D2] opacity-90 text-white px-2 py-1 rounded-sm cursor-pointer'}`}
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
