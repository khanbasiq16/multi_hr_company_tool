"use client"
import BankLoader from '@/app/utils/accounts/components/basecomponent/BankLoader'
import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import Listbanks from '@/app/utils/superadmin/components/Listelements/Listbanks'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import { createallBanks } from '@/features/Slice/BankSlice'
import { createcompany } from '@/features/Slice/CompanySlice'
import { createallCurency } from '@/features/Slice/CurencySlice'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {

    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.User)

    const dispatch = useDispatch();


    useEffect(() => {
        const getBanks = async () => {
            dispatch(createallBanks([]))
            try {
                const res = await axios.get(`/api/acounts/banks/get-all-banks`);

                if (res.data.success) {

                    dispatch(createallBanks(res.data.banks))
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        getBanks();
    }, []);


    useEffect(() => {
        const getCurrencies = async () => {
            const res = await axios.get(`/api/admin/get-curency`);

            if (res.data.success) {
                dispatch(createallCurency(res.data.currencies))
            }

        }
        getCurrencies();
    }, [])


    useEffect(() => {
        const getAllActiveCompanies = async () => {
            try {
                const res = await axios.get("/api/get-maincompanies");

                if (res.data.success) {

                    dispatch(createcompany(res.data.companies))
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        getAllActiveCompanies();
    }, []);




    return (
        <>

            <SuperAdminlayout>
                <section className="w-full p-6">
                    <Superbreadcrumb path={"Banks"} />
                    {loading ? <BankLoader /> : <Listbanks />}

                </section>
            </SuperAdminlayout>


        </>
    )
}

export default page