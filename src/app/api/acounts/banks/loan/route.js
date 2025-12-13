import { NextResponse } from "next/server";
import { getDoc, doc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

function convertCurrency(amount, fromRate, toRate) {
    const amountInUSD = amount / fromRate;               // Step 1: fromCurrency → USD
    return parseFloat((amountInUSD * toRate).toFixed(2)); // Step 2: USD → toCurrency
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { fromBank, toBank, amount, userId, ip } = body;

        // ===================== FETCH BANKS =====================
        const frombank = await getDoc(doc(db, "Banks", fromBank));
        const tobank = await getDoc(doc(db, "Banks", toBank));

        if (!frombank.exists() || !tobank.exists()) {
            return NextResponse.json(
                { success: false, error: "Bank not found" },
                { status: 404 }
            );
        }

        const fromCurrency = frombank.data()?.currency?.code;
        const fromsymbole = frombank.data()?.currency?.symbol;
        const toCurrency = tobank.data()?.currency?.code;
        const toSymbol = tobank.data()?.currency?.symbol;
        const fromRate = frombank.data()?.currency?.rate;   // rate vs USD
        const toRate = tobank.data()?.currency?.rate;       // rate vs USD

        if (!fromCurrency || !toCurrency || !fromRate || !toRate) {
            return NextResponse.json(
                { success: false, error: "Currency code or rate missing in DB" },
                { status: 400 }
            );
        }

        console.log("🌍 From:", fromCurrency, "To:", toCurrency);
        console.log("⚡ Rates:", fromRate, "→", toRate);

        // ===================== UNIVERSAL CURRENCY CONVERSION =====================
        const convertedAmount = convertCurrency(amount, fromRate, toRate);
        console.log("💱 Converted Amount:", convertedAmount);

        // ===================== GET ACCOUNT USER =====================
        const accountantUser = await getDoc(doc(db, "Accounts", userId));

        // ===================== UPDATE FROM BANK (DEBIT) =====================
        const loanfromid = uuidv4()
        const loantoid = uuidv4()
        const updatedFromBank = {
            ...frombank.data(),
            totalLoanAmount: `${parseFloat(frombank.data().totalLoanAmount || 0)} `,
            Loanlogs: arrayUnion({
                loanid: loanfromid,
                loantoid,
                status: "Debit",
                amount: amount,
                fromsymbole: fromsymbole,
                toSymbol: toSymbol,
                convertedAmount: convertedAmount,
                rate: fromRate,
                fromBankName: frombank.data()?.banktitle,
                toBankName: tobank.data()?.banktitle,
                name: accountantUser.data()?.accountuserName,
                role: "Accounts",
                amountdata: convertedAmount,
                userId,
                fromBankId: fromBank,
                toBankId: toBank,
                loanRepaymentStatus: "unpaid",
                ip,
                createdAt: new Date().toISOString(),
            }),
            balance: parseFloat(frombank.data().balance) - parseFloat(convertedAmount),
        };

        // ===================== UPDATE TO BANK (CREDIT) =====================
        const updatedToBank = {
            ...tobank.data(),

            totalLoanAmount: `${parseFloat(tobank.data().totalLoanAmount || 0) + parseFloat(convertedAmount)} `,
            Loanlogs: arrayUnion({
                loanid: loantoid,
                loanfromid,
                status: "Credit",
                amount: amount,
                fromsymbole: fromsymbole,
                toSymbol: toSymbol,
                convertedAmount: convertedAmount,
                rate: fromRate,
                fromBankName: frombank.data()?.banktitle,
                toBankName: tobank.data()?.banktitle,
                name: accountantUser.data()?.accountuserName,
                amountdata: convertedAmount,
                role: "Accounts",
                userId,
                amountdata: convertedAmount,
                fromBankId: fromBank,
                toBankId: toBank,
                loanRepaymentStatus: "pending",
                ip,
                createdAt: new Date().toISOString(),
            }),
            balance: parseFloat(tobank.data().balance) + parseFloat(convertedAmount),
        };

        await updateDoc(doc(db, "Banks", fromBank), updatedFromBank);
        await updateDoc(doc(db, "Banks", toBank), updatedToBank);

        const updatedfromBankRef = doc(db, "Banks", fromBank);
        const updatedfromBankSnapshot = await getDoc(updatedfromBankRef);
        const updatedfromBankData = updatedfromBankSnapshot.data();


        return NextResponse.json({
            success: true,
            message: `${amount} Loaned from ${frombank?.data()?.banktitle} and Credited to ${tobank?.data()?.banktitle}`,
            convertedAmount,
            bank: updatedfromBankData,
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
