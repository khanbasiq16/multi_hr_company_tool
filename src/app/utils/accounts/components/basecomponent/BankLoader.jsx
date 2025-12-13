import React from 'react'

const BankLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium animate-pulse">Loading Bank Details...</p>
        </div>
    )
}

export default BankLoader