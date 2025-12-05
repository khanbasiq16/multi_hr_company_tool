import Superbreadcrumb from '@/app/utils/superadmin/components/breadcrumbs/Superbreadcrumb'
import ListAccountUser from '@/app/utils/superadmin/components/Listelements/ListAccountUser'
import SuperAdminlayout from '@/app/utils/superadmin/layout/SuperAdmin'
import React from 'react'

const page = () => {
    return (
        <>
            <SuperAdminlayout>
                <section className="w-full p-6">
                    <Superbreadcrumb path={"Accountants"} />
                    <ListAccountUser />
                </section>
            </SuperAdminlayout>
        </>
    )
}

export default page