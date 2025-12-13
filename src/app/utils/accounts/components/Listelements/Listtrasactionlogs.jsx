"use client";
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import TransferDialog from '../dialog/Transferdialog';
import { useSelector } from 'react-redux';
import Transferlogstable from '../../Tables/Transferlogstable';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { bankdetails } from '@/features/Slice/BankSlice';

const Listtrasactionlogs = ({ logs, bank, setBank }) => {

    return (
        <Card className="p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">

            {/* 🧾 IF NO LOGS */}
            {logs?.length === 0 || logs?.length === undefined ? (
                <div className="flex h-full justify-center items-center">
                    <TransferDialog bank={bank} setBank={setBank} />
                </div>
            ) : (
                <Transferlogstable logs={logs} />
            )}


        </Card>
    );
};

export default Listtrasactionlogs;
