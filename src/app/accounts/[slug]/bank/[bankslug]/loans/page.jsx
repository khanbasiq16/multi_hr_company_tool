"use client"
import Accountslayout from '@/app/utils/accounts/layout/Accountslayout'
import Accountsbankbreadcrumbs from '@/app/utils/accounts/components/breadcrumbs/Accountsbankbreadcrumbs'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { createallBanks } from '@/features/Slice/BankSlice'
import Loantransactionlogs from '@/app/utils/accounts/components/Listelements/Loantransactionlogs'
import BankLoader from '@/app/utils/accounts/components/basecomponent/BankLoader'

const page = () => {
    const { bankslug } = useParams();
    const [bank, setBank] = useState("");
    const [loading, setLoading] = useState(true);
    const { banks } = useSelector((state) => state.Banks);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchBank = async () => {
            setLoading(true);
            const res = await axios.get(`/api/acounts/banks/get-bank-details/${bankslug}`);
            if (res.data.success) {
                console.log(res.data.bank)
                setBank(res.data.bank);
                setLoading(false);
            }
        };
        fetchBank();
    }, [])


    useEffect(() => {
        const fetchBanks = async () => {
            const res = await axios.get("/api/acounts/banks/get-all-banks");
            if (res.data.success) {
                dispatch(createallBanks(res.data.banks));
            }
        };
        fetchBanks();
    }, [])




    return (
        <>
            <Accountslayout>
                <section className="w-full p-6">
                    <Accountsbankbreadcrumbs path={"Loans"} bank={bank} setBank={setBank} />

                    {loading ? <BankLoader /> : <Loantransactionlogs logs={bank?.Loanlogs}  bank={bank} setBank={setBank} />}

                </section>
            </Accountslayout>
        </>
    )
}

export default page