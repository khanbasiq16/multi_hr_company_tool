"use client"
import Accountslayout from '@/app/utils/accounts/layout/Accountslayout'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { createallBanks, bankdetails } from '@/features/Slice/BankSlice'
import { useParams } from 'next/navigation'
import Accountsbankbreadcrumbs from '@/app/utils/accounts/components/breadcrumbs/Accountsbankbreadcrumbs'
import Listtrasactionlogs from '@/app/utils/accounts/components/Listelements/Listtrasactionlogs'
import BankLoader from '@/app/utils/accounts/components/basecomponent/BankLoader'

const page = () => {

    const dispatch = useDispatch()

    const { bankslug } = useParams();

    const [bank, setBank] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchBank = async () => {
            const res = await axios.get(`/api/acounts/banks/get-bank-details/${bankslug}`);
            if (res.data.success) {
                setBank(res.data.bank)
                setLoading(false)
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
        <Accountslayout>
            <section className="w-full p-6">
                <Accountsbankbreadcrumbs path={"Transfer"} bank={bank} setBank={setBank} />


                {loading ? <BankLoader /> : <Listtrasactionlogs logs={bank?.Transferlogs}  bank={bank} setBank={setBank} />}
            </section>
        </Accountslayout>
    )
}

export default page