"use client"
import Accountsbreadcrumbs from '@/app/utils/accounts/components/breadcrumbs/Accountsbreadcrumbs'
import Listbanks from '@/app/utils/accounts/components/Listelements/Listbanks';
import Accountslayout from '@/app/utils/accounts/layout/Accountslayout'
import { createallBanks } from '@/features/Slice/BankSlice';
import { createcompany } from '@/features/Slice/CompanySlice';
import { createallCurency } from '@/features/Slice/CurencySlice';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
    const { slug } = useParams();

    const { user } = useSelector((state) => state.User)

    const dispatch = useDispatch();
    useEffect(() => {
        const getBanks = async () => {

            dispatch(createallBanks([]))
            try {
                const res = await axios.get(`/api/acounts/get-banks/${user.accountId}`);

                if (res.data.success) {

                    dispatch(createallBanks(res.data.banks))
                }
            } catch (error) {


                console.error("Error fetching banks:", error);
            }
        }
        getBanks();
    }, [])


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
            <Accountslayout>
                <section className="w-full p-6">
                    <Accountsbreadcrumbs path={slug} path2="Banks" />
                    <Listbanks />
                </section>
            </Accountslayout>
        </>
    )
}

export default page