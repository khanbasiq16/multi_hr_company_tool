"use client";

import Accountsbreadcrumbs from '@/app/utils/accounts/components/breadcrumbs/Accountsbreadcrumbs';
import Listexpense from '@/app/utils/accounts/components/Listelements/Listexpense';
import Accountslayout from '@/app/utils/accounts/layout/Accountslayout';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const page = () => {
    const { slug } = useParams();
    const { user } = useSelector((state) => state.User);

    const [expensesCategories, setExpensesCategories] = useState([]);
    const [bankaccounts, setBankaccounts] = useState([]);
    const[loading , setLoading ]=useState(false)

    useEffect(() => {
        if (!user?.accountId) return;

        const fetchData = async () => {
            try {
                const [
                    expenseRes,
                    bankRes
                ] = await Promise.all([
                    axios.get('/api/acounts/expenses/get-expense-category'),
                    axios.get(`/api/acounts/get-banks/${user?.accountId}`, {
                        headers: {
                            'Content-Type': 'application/json',

                        }
                    })
                ]);

                if (expenseRes.data.success) {
                    setExpensesCategories(expenseRes?.data?.expensesCategories);
                }

                if (bankRes.data.success) {
                    setBankaccounts(bankRes?.data?.banks);
                }
            } catch (error) {
                console.error("API Error:", error);
            }
        };

        fetchData();
    }, [user?.accountId]);

    return (
        <Accountslayout>
            <section className="w-full p-6">
                <Accountsbreadcrumbs
                    path2="Expenses"
                    expensesCategories={expensesCategories}
                    bankaccounts={bankaccounts}
                />

                <Listexpense />
            </section>
        </Accountslayout>
    );
};

export default page;
