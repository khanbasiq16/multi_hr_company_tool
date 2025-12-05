"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AccountDialog from '../dialog/Accountsdialog';
import { createAccountants } from '@/features/Slice/AccountantSlice';
import { Card } from '@/components/ui/card';
import { AccountsTable } from '../Tables/AccountsTable';

const ListAccountUser = () => {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const { accountants } = useSelector((state) => state.Acounts);

    useEffect(() => {
        const fetchaccounts = async () => {
            try {

                const res = await axios.get(`/api/acounts/get-all-accounts`);

                dispatch(createAccountants(res.data?.accounts || []));
            } catch (error) {
                console.error("Error fetching employees:", error);

            } finally {
                setLoading(false);
            }
        };

        fetchaccounts();
    }, []);


    return (
        <Card className="p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">
            {loading ? (
                <p className="text-center text-gray-500">Loading employees...</p>
            ) : accountants?.length === 0 ? (
                <div className="flex h-full justify-center items-center">
                    <AccountDialog />
                </div>
            ) : (
                <>

                    <AccountsTable accountants={accountants} />
                </>
            )}
        </Card>
    )
}

export default ListAccountUser