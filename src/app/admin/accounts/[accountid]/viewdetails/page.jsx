"use client"
import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import AccountsDetails from '@/app/utils/superadmin/components/Details/AccountsDetails'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { accountid } = useParams()
    const [accounts, setAccounts] = useState("")


    useEffect(() => {

        const getemployee = async () => {
            try {
                const res = await axios.get(`/api/acounts/get-accounts/${accountid}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (res.data.account) {
                    console.log(res.data.account)
                    setAccounts(res.data.account)
                }

            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        }

        getemployee();
    }, [])


    return (
        <>
            <SuperAdminlayout>
                <section className="w-full p-6">
                    <Superbreadcrumb path={"Accounts User Details"} path2={`${accounts?.accountuserName}`} />

                    <AccountsDetails accounts={accounts} setAccounts={setAccounts} />
                </section>
            </SuperAdminlayout>
        </>
    )
}

export default page