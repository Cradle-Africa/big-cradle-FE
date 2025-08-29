"use client";

import React from "react";
import { useSearch } from "./_features/_hook";
import axios from "@/app/lib/axios";
import {
    AdminUser,
    BusinessUser,
    DataPoint,
    Department,
    EmployeeUser,
    Researcher,
    SuperUser,
    Survey,
    SurveyEntry,
    Transaction,
} from "./_features/types/types";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@radix-ui/themes";
import DashboardLayout from "@/app/DashboardLayout";

const TableWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto pb-10 rounded-[8px] border border-gray-200">
        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
            {children}
        </table>
    </div>
);

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const { data, isLoading, error } = useSearch(axios, query);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="text-red-500">Something went wrong</div>
            </DashboardLayout>
        );
    }

    const results = data?.data;

    if (!results) {
        return (
            <DashboardLayout>
                <div>No results found.</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <h1 className="text-xl font-bold mt-3">Search Results of <span className="text-blue-600">{query}</span></h1>

                {/* Surveys */}
                {results.surveys?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Surveys</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        City
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Country
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.surveys.map((survey: Survey) => (
                                    <tr key={survey.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{survey.surveyName}</td>
                                        <td className="px-6 py-4">{survey.city}</td>
                                        <td className="px-6 py-4">{survey.country}</td>
                                        <td className="px-6 py-4">{survey.isActive ? 'Active' : 'Inactive'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}


                {/* data pipeline */}
                {results.datapoints?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Data pipeline</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.datapoints.map((dataPoint: DataPoint) => (
                                    <tr key={dataPoint.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{dataPoint.dataPointName}</td>
                                        <td className="px-6 py-4">{dataPoint.dataPointDescription?.slice(0, 20)}</td>
                                        <td className="px-6 py-4">{dataPoint.isActive ? 'Active' : 'Inactive'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}

                {/* Researchers */}
                {results.researchers?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Researchers</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        First Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Last Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Address
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.researchers.map((r: Researcher) => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{r.firstName}</td>
                                        <td className="px-6 py-4">{r.lastName}</td>
                                        <td className="px-6 py-4">{r.email}</td>
                                        <td className="px-6 py-4">{r.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}

                {/* Survey Entries */}
                {results.surveyentries?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Survey Entries</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Entry ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Answers Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.surveyentries.map((entry: SurveyEntry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{entry.id}</td>
                                        <td className="px-6 py-4">{entry.answers.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}

                {/* Transactions */}
                {results.transactions?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.transactions.map((tx: Transaction) => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{tx.type}</td>
                                        <td className="px-6 py-4">${tx.amount}</td>
                                        <td className="px-6 py-4">{tx.paymentStatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}

                {/* Super admin Users */}
                {results.superusers?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Super admin Users</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Verified
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.superusers.map((su: SuperUser) => (
                                    <tr key={su.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{su.fullName}</td>
                                        <td className="px-6 py-4">{su.role}</td>
                                        <td className="px-6 py-4">
                                            {su.isVerified ? "✅" : "❌"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}

                {/* Business Users */}
                {results.businessusers?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Business Users</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Business Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold    ">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Contact Person
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Country
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.businessusers.map((bu: BusinessUser) => (
                                    <tr key={bu.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{bu.businessName}</td>
                                        <td className="px-6 py-4">{bu.email}</td>
                                        <td className="px-6 py-4">
                                            {bu.contactPersonFirstName} {bu.contactPersonLastName}
                                        </td>
                                        <td className="px-6 py-4">{bu.businessCountry}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}


                {/* admin user Users */}
                {results.adminusers?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Admin Users</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Business Name & Full name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Country
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.adminusers.map((au: AdminUser) => (
                                    <tr key={au.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{au.businessName || au.firstName + ' ' + au.lastName}</td>
                                        <td className="px-6 py-4">{au.email}</td>
                                        <td className="px-6 py-4">{au.country}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                )}


                {/* employee user Users */}
                {results.employeeusers?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Employee Users</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Full name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Is verified
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.employeeusers.map((eu: EmployeeUser) => (
                                    <tr key={eu.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{eu.firstName + ' ' + eu.lastName}</td>
                                        <td className="px-6 py-4">{eu.email}</td>
                                        <td className="px-6 py-4">
                                            {eu.isVerified ? "✅" : "❌"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>

                )}

                {/* department */}
                {results.departments?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Departments</h2>
                        <TableWrapper>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                                {results.departments.map((d: Department) => (
                                    <tr key={d.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{d.departmentName}</td>
                                        <td className="px-6 py-4">{d.departmentDescription.slice(0, 42)}...</td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>

                )}
            </div>
        </DashboardLayout>
    );
};

export default SearchPage;
