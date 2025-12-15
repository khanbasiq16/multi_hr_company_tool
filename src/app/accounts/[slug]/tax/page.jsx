"use client"
import Accountslayout from '@/app/utils/accounts/layout/Accountslayout'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BankLoader from '@/app/utils/accounts/components/basecomponent/BankLoader'
import Accountsbreadcrumbs from '@/app/utils/accounts/components/breadcrumbs/Accountsbreadcrumbs'
import { useParams } from 'next/navigation'
import Listtaxes from '@/app/utils/accounts/components/Listelements/Listtaxes'

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

            <Accountslayout>

                <section className="w-full p-6">
                    <Accountsbreadcrumbs path="Tax" />

                    {loading ? <BankLoader /> : <Listtaxes employees={employees} />}

                </section>
            </Accountslayout>

        </>
    )
}

export default page