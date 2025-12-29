"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ExpensesCatdailog from "../dialog/ExpensesCatdailog";
import ExpenseDialog from "../dialog/ExpenseDialog";
import BankLoader from "../basecomponent/BankLoader";
import Expensetable from "../../Tables/Expensetable";

const Listexpense = ({ bankaccounts, expenses, setExpenses }) => {
    const { user } = useSelector((state) => state.User);

    const [expenseCategory, setExpenseCategory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.accountId) return;

        setLoading(true);

        Promise.all([
            axios.get(`/api/acounts/expenses/get-expense-category`),

        ])
            .then(([catRes]) => {
                if (catRes.data?.success) {
                    setExpenseCategory(catRes.data.expensesCategories || []);
                }

            })
            .catch((err) => {
                console.error("Expense fetch error:", err);
            })
            .finally(() => setLoading(false));
    }, [user?.accountId]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Expenses</h2>
                <ExpensesCatdailog categories={expenseCategory} />
            </div>

            {loading && (
                <div className="flex h-full justify-center items-center">
                    <BankLoader />
                </div>
            )}


            {!loading && expenses.length === 0 && (
                <div className="flex h-full justify-center items-center">
                    <ExpenseDialog expensesCategories={expenseCategory} bankaccounts={bankaccounts} setExpenses={setExpenses} />
                </div>
            )}


            {!loading && expenses.length > 0 && (
                <Expensetable
                    expenses={expenses}
                    expenseCategory={expenseCategory}
                />
            )}
        </div>
    );
};

export default Listexpense;
