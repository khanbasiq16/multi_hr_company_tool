import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Banknote, User, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';
import BankDialog from '../dialog/BankDialog';

const Listbanks = () => {
    const { banks, loading } = useSelector((state) => state.Banks);

    const router = useRouter();

    const { slug } = useParams();

    const [open, setOpen] = React.useState(false);
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-[64vh] overflow-auto">

            {loading ? (
                <p className="text-center text-gray-500 font-medium">Loading Banks...</p>
            ) : banks?.length === 0 ? (
                <div className="flex h-full justify-center items-center text-gray-500">
                    <BankDialog open={open} setOpen={setOpen} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {banks.map((bank) => (
                        <Card
                            key={bank.id}
                            className="rounded-xl shadow-md hover:shadow-lg transition border border-gray-200"
                        >
                            {/* Top */}
                            <CardHeader className="flex flex-row items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
                                    <Banknote className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="font-semibold text-lg truncate">
                                    {bank?.banktitle}
                                </h2>
                            </CardHeader>

                            {/* Body */}
                            <CardContent className="space-y-2 text-sm text-gray-700">

                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">{bank.accountType} Account</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-green-600" />
                                    <span className="font-semibold">
                                        {parseFloat(bank.balance).toLocaleString()} {bank.currency?.symbol}
                                    </span>
                                </div>

                                <p className="text-[12px] text-gray-500 truncate">
                                    IBAN: {bank.iban}
                                </p>

                                <p className="text-[12px] text-gray-500 truncate">
                                    Branch Code: {bank.branchCode}
                                </p>
                            </CardContent>

                            {/* Button */}
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => router.push(
                                        `/admin/bank/${bank?.bankslug}`
                                    )}

                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Listbanks