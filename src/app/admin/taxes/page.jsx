"use client"
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import BankLoader from '@/app/utils/accounts/components/basecomponent/BankLoader'
import Listtaxes from '@/app/utils/superadmin/components/Listelements/Listtaxes'

const page = () => {
    const [employees, setemployees] = useState([])
    const [loading, setLoading] = useState(true);

    const { slug } = useParams();

    useEffect(() => {

        const getallemployees = async () => {
            try {
                const res = await axios.get(`/api/get-all-employees`);

                if (res.data.success) {
                    console.log(res.data.employees)
                    setemployees(res.data.employees)
                    setLoading(false);
                }
            } catch (error) {
                console.log(error)
                setLoading(false);
            }
        }

        getallemployees();
    }, [])

    return (
        <>

            <SuperAdminlayout>

                <section className="w-full p-6">
                    <Superbreadcrumb path="Tax" />

                    {loading ? <BankLoader /> : <Listtaxes employees={employees} />}

                </section>

            </SuperAdminlayout>
        </>
    )
}

export default page