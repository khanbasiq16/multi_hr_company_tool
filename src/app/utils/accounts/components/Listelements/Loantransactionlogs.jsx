"use client";
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bankdetails } from '@/features/Slice/BankSlice';
import Loandialog from '../dialog/Loandialog';
import Loanlogstable from '../../Tables/Loanlogstable';

const Loantransactionlogs = ({ logs, bank, setBank }) => {

    return (
        <Card className="p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">

            {/* 🧾 IF NO LOGS */}
            {logs?.length === 0 || logs?.length === undefined ? (
                <div className="flex h-full justify-center items-center">
                    <Loandialog bank={bank} setBank={setBank} />
                </div>
            ) : (
                <>

                    <Loanlogstable logs={logs} bank={bank} setBank={setBank}/>
                </>
            )}


        </Card>
    );
};

export default Loantransactionlogs;
