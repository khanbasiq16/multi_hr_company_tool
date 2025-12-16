"use client"
import Accountsbreadcrumbs from '@/app/utils/accounts/components/breadcrumbs/Accountsbreadcrumbs'
import Accountslayout from '@/app/utils/accounts/layout/Accountslayout'
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const { slug } = useParams();
    return (
        <>
            <Accountslayout>

                <section className="w-full p-6">
                    <Accountsbreadcrumbs path2={"Expenses"} />




                </section>
            </Accountslayout>
        </>
    )
}

export default page