// import { db } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { NextResponse } from "next/server";

// function convertCurrency(amount, fromRate, toRate) {
//     const amountInUSD = amount / fromRate;
//     return parseFloat((amountInUSD * toRate).toFixed(2));
// }

// export async function POST(req) {
//     try {
//         const body = await req.json();
//         const { amount, loanid, bankid, repaystatus } = body;

//         if (!amount || !loanid || !bankid) {
//             return NextResponse.json(
//                 { success: false, error: "Incomplete data" },
//                 { status: 404 }
//             );
//         }

//         // ---------------------------
//         // Get TO BANK (Jis bank pr log save hai)
//         // ---------------------------

//         const tobankRef = doc(db, "Banks", bankid);
//         const tobankSnap = await getDoc(tobankRef);

//         if (!tobankSnap.exists()) {
//             return NextResponse.json(
//                 { success: false, error: "Bank not found" },
//                 { status: 404 }
//             );
//         }

//         const tobankData = tobankSnap.data();

//         // ---------------------------
//         // Find Loan Log (TO BANK)
//         // ---------------------------

//         const toLoanLogs = tobankData?.Loanlogs || [];
//         const foundToLoan = toLoanLogs.find((loanlog) => loanlog?.loanid === loanid);

//         if (!foundToLoan) {
//             return NextResponse.json(
//                 { success: false, error: "To Loan not found" },
//                 { status: 404 }
//             );
//         }

//         // ---------------------------
//         // Fetch FROM BANK
//         // ---------------------------

//         const fromBankId = foundToLoan?.fromBankId;

//         if (!fromBankId) {
//             return NextResponse.json(
//                 { success: false, error: "fromBankId missing in loan log" },
//                 { status: 404 }
//             );
//         }

//         const fromBankRef = doc(db, "Banks", fromBankId);
//         const fromBankSnap = await getDoc(fromBankRef);

//         if (!fromBankSnap.exists()) {
//             return NextResponse.json(
//                 { success: false, error: "From Bank not found" },
//                 { status: 404 }
//             );
//         }

//         const fromBankData = fromBankSnap.data();

//         // ---------------------------
//         // Find FROM Loan Log
//         // ---------------------------

//         const fromLoanLogs = fromBankData?.Loanlogs || [];
//         const foundFromLoan = fromLoanLogs.find(
//             (loanlog) => loanlog?.loanid === foundToLoan?.loanfromid
//         );

//         if (!foundFromLoan) {
//             return NextResponse.json(
//                 { success: false, error: "From Loan not found" },
//                 { status: 404 }
//             );
//         }

//         // ---------------------------
//         // COMPLETE CONSOLE LOGGING
//         // ---------------------------

//         console.log("========== TO BANK LOAN LOG ==========");
//         console.log(foundToLoan);

//         console.log("========== FROM BANK LOAN LOG ==========");
//         console.log(foundFromLoan);

//         console.log("========== TO BANK DATA ==========");
//         console.log(tobankData);

//         console.log("========== FROM BANK DATA ==========");
//         console.log(fromBankData);

//         // ---------------------------
//         // Conversion
//         // ---------------------------

//         const fromCurrency = tobankData?.currency?.code;
//         const fromSymbol = tobankData?.currency?.symbol;
//         const fromRate = tobankData?.currency?.rate;

//         const toCurrency = fromBankData?.currency?.code;
//         const toSymbol = fromBankData?.currency?.symbol;
//         const toRate = fromBankData?.currency?.rate;

//         const convertedAmount = convertCurrency(Number(amount), fromRate, toRate);


//         console.log("Minus Amount from that account", amount)
//         console.log("Add Couversion Amount to this account", convertedAmount)

//         // ---------------------------
//         // Update TO BANK
//         // --------------------------

//         // Update TO BANK
//         foundToLoan.loanRepaymentStatus = repaystatus;
//         foundFromLoan.loanRepaymentStatus = repaystatus;

//         tobankData.Loanlogs = toLoanLogs;
//         fromBankData.Loanlogs = fromLoanLogs;



//         console.log("Total Balance To bank jis se minus hoga Amount Before", tobankData?.balance)
//         console.log("Total Balance From bank jis se add hoga Amount Before", fromBankData?.balance)


//         console.log("Total Balance To bank jis se minus hoga Amount After", parseFloat(tobankData?.balance) - parseFloat(amount))
//         console.log("Total Balance From bank jis se add hoga Amount After", parseFloat(fromBankData?.balance) + parseFloat(convertedAmount))


//         console.log("Total Loan Amount To bank jis se minus hoga Amount Before", tobankData?.totalLoanAmount.split(" ")[0])
//         console.log("Total Loan Amount To bank jis se minus hoga Amount After", parseFloat(tobankData?.totalLoanAmount.split(" ")[0]) - parseFloat(amount))



//         const updatedToBank = {
//             ...tobankData,
//             balance: parseFloat(tobankData?.balance) - parseFloat(amount),
//             totalLoanAmount: parseFloat(tobankData?.totalLoanAmount.split(" ")[0]) - parseFloat(amount),
//         };

//         const updatedFromBank = {
//             ...fromBankData,
//             balance: parseFloat(fromBankData?.balance) + parseFloat(convertedAmount),
//         };

//         await updateDoc(doc(db, "Banks", tobankData?.bankid), updatedToBank);
//         await updateDoc(doc(db, "Banks", fromBankData?.bankid), updatedFromBank);


//         const updatedToBankRef = doc(db, "Banks", bankid);
//         const updatedToBankSnapshot = await getDoc(updatedToBankRef);
//         const updatedToBankData = updatedToBankSnapshot.data();

//         // ---------------------------
//         // Response
//         // ---------------------------

//         return NextResponse.json({
//             success: true,
//             message: "Logs printed successfully",
//             bank: updatedToBankData,
//         });

//     } catch (error) {
//         console.error("ERROR:", error);
//         return NextResponse.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }



import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

function convertCurrency(amount, fromRate, toRate) {
    const amountInUSD = amount / fromRate;
    return parseFloat((amountInUSD * toRate).toFixed(2));
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount, loanid, bankid, repaystatus, repaymentstatus ,disturbamount} = body;

        if (!amount || !loanid || !bankid) {
            return NextResponse.json({ success: false, error: "Incomplete data" }, { status: 404 });
        }

        // ---------------------------
        // Get TO BANK
        // ---------------------------
        const tobankRef = doc(db, "Banks", bankid);
        const tobankSnap = await getDoc(tobankRef);
        if (!tobankSnap.exists()) return NextResponse.json({ success: false, error: "Bank not found" }, { status: 404 });
        const tobankData = tobankSnap.data();
        const toLoanLogs = tobankData?.Loanlogs || [];
        const foundToLoan = toLoanLogs.find(loan => loan.loanid === loanid);
        if (!foundToLoan) return NextResponse.json({ success: false, error: "To Loan not found" }, { status: 404 });

        // ---------------------------
        // Get FROM BANK
        // ---------------------------
        const fromBankId = foundToLoan.fromBankId;
        if (!fromBankId) return NextResponse.json({ success: false, error: "fromBankId missing in loan log" }, { status: 404 });

        const fromBankRef = doc(db, "Banks", fromBankId);
        const fromBankSnap = await getDoc(fromBankRef);
        if (!fromBankSnap.exists()) return NextResponse.json({ success: false, error: "From Bank not found" }, { status: 404 });
        const fromBankData = fromBankSnap.data();
        const fromLoanLogs = fromBankData?.Loanlogs || [];
        const foundFromLoan = fromLoanLogs.find(loan => loan.loanid === foundToLoan.loanfromid);
        if (!foundFromLoan) return NextResponse.json({ success: false, error: "From Loan not found" }, { status: 404 });

        // ---------------------------
        // Conversion
        // ---------------------------
        const fromRate = tobankData?.currency?.rate;
        const toRate = fromBankData?.currency?.rate;
        const convertedAmount = convertCurrency(Number(amount), fromRate, toRate);

        // ---------------------------
        // Update Loanlogs Arrays
        // ---------------------------
        const updatedToLoanLogs = toLoanLogs.map(loan =>
            loan.loanid === loanid ? { ...loan, loanRepaymentStatus: repaystatus  , amountdata:disturbamount  } : loan
        );

        const updatedFromLoanLogs = fromLoanLogs.map(loan =>
            loan.loanid === foundToLoan.loanfromid ? { ...loan, loanRepaymentStatus: repaymentstatus  , amountdata:disturbamount  } : loan
        );

        // ---------------------------
        // Update balances
        // ---------------------------
        const updatedToBank = {
            ...tobankData,
            balance: parseFloat(tobankData.balance) - parseFloat(amount),
            totalLoanAmount: parseFloat(tobankData.totalLoanAmount) - parseFloat(amount),
            Loanlogs: updatedToLoanLogs,
        };

        const updatedFromBank = {
            ...fromBankData,
            balance: parseFloat(fromBankData.balance) + parseFloat(convertedAmount),
            Loanlogs: updatedFromLoanLogs,
        };

        await updateDoc(doc(db, "Banks", tobankData.bankid), updatedToBank);
        await updateDoc(doc(db, "Banks", fromBankData.bankid), updatedFromBank);

        const updatedToBankRef = doc(db, "Banks", bankid);
        const updatedToBankSnapshot = await getDoc(updatedToBankRef);
        const updatedToBankData = updatedToBankSnapshot.data();

        return NextResponse.json({
            success: true,
            message: "Loan repayment and balances updated successfully",
            bank: updatedToBankData,
        });

    } catch (error) {
        console.error("ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
