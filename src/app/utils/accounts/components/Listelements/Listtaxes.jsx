"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    PDFDownloadLink,
} from "@react-pdf/renderer";

/* ================= TAX LOGIC ================= */
const calculateTax = (basicSalary) => {
    const annualSalary = basicSalary * 12;
    let annualTax = 0;

    if (annualSalary <= 600000) annualTax = 0;
    else if (annualSalary <= 1200000)
        annualTax = (annualSalary - 600000) * 0.01;
    else if (annualSalary <= 2200000)
        annualTax = 6000 + (annualSalary - 1200000) * 0.11;
    else if (annualSalary <= 3200000)
        annualTax = 116000 + (annualSalary - 2200000) * 0.23;
    else if (annualSalary <= 4100000)
        annualTax = 346000 + (annualSalary - 3200000) * 0.3;
    else
        annualTax = 616000 + (annualSalary - 4100000) * 0.35;

    return {
        monthlyTax: annualTax / 12,
        annualTax,
    };
};

const formatPKR = (v) =>
    `PKR ${Number(v).toLocaleString("en-PK")}`;

/* ================= PDF STYLES ================= */
const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        padding: 30,
        fontSize: 12,
        backgroundColor: "#f7f7f7",
    },
    header: { textAlign: "center", marginBottom: 20 },
    companyLogo: { width: 80, height: 80, marginBottom: 10 },
    title: { fontSize: 18, fontWeight: "bold" },
    subtitle: { fontSize: 12, marginBottom: 10 },
    section: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    label: { fontWeight: "bold" },
    net: { color: "green", fontWeight: "bold" },
    footer: { textAlign: "center", marginTop: 20, fontSize: 10, color: "#555" },
});

/* ================= PDF DOCUMENT ================= */
const SalarySlipDocument = ({ employee, salary, monthlyTax }) => {
    const netSalary = salary - monthlyTax;
    const yearlyIncome = salary * 12;
    const { annualTax } = calculateTax(salary);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image
                        style={styles.companyLogo}
                        src="https://brintor.com/assets/img/logo-icon.png"
                    />
                    <Text style={styles.title}>Brintor Pvt Ltd</Text>
                    <Text style={styles.subtitle}>Employee Payslip</Text>
                </View>

                <View style={styles.section}>
                    <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Employee Info</Text>
                    <View style={styles.row}>
                        <Text>Name:</Text>
                        <Text>{employee.employeeName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Designation:</Text>
                        <Text>{employee.designation || "Employee"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Pay Month:</Text>
                        <Text>{new Date().toLocaleString("en-PK", { month: "long", year: "numeric" })}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Salary Details</Text>
                    <View style={styles.row}>
                        <Text>Gross Salary:</Text>
                        <Text>{formatPKR(salary)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Tax:</Text>
                        <Text>{formatPKR(monthlyTax.toFixed(2))}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.net}>Net Salary:</Text>
                        <Text style={styles.net}>{formatPKR(netSalary)}</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    This is a system generated payslip. No signature required.
                </Text>
            </Page>
        </Document>
    );
};

/* ================= COMPONENT ================= */
const Listtaxes = ({ employees = [] }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const salary = selectedEmployee?.employeeSalary || 0;
    const { monthlyTax, annualTax } = calculateTax(salary);

    return (
        <div className="bg-gray-50 p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold">Payroll Tax Calculator</h2>

            <Card className="p-6">
                <Select
                    onValueChange={(id) =>
                        setSelectedEmployee(employees.find((e) => e.id === id))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                                {emp.employeeName} — PKR {emp.employeeSalary.toLocaleString()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Card>

            {selectedEmployee && (
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-2">Monthly Summary</h3>
                        <Row label="Gross Salary" value={salary} />
                        <Row label="Tax" value={monthlyTax} />
                        <Row label="Net Salary" value={salary - monthlyTax} highlight />

                        <PDFDownloadLink
                            document={<SalarySlipDocument employee={selectedEmployee} salary={salary} monthlyTax={monthlyTax} />}
                            fileName={`${selectedEmployee.employeeName}-payslip.pdf`}
                            className="mt-4 w-full bg-[#5965AB] text-white py-2 rounded inline-block text-center"
                        >
                            {({ loading }) => (loading ? "Generating PDF..." : "Download Payslip PDF")}
                        </PDFDownloadLink>


                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold mb-2">Annual Summary</h3>
                        <Row label="Gross Income" value={salary * 12} />
                        <Row label="Annual Tax" value={annualTax} />
                        <Row label="Net Income" value={salary * 12 - annualTax} highlight />
                    </Card>
                </div>
            )}
        </div>
    );
};

const Row = ({ label, value, highlight }) => (
    <div className="flex justify-between py-1">
        <span>{label}</span>
        <span className={highlight ? "text-green-600 font-bold" : ""}>{formatPKR(value)}</span>
    </div>
);

export default Listtaxes;
