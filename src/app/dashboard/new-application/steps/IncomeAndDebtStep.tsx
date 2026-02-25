import { useState, useEffect } from "react";
import { DollarSign, Briefcase, Plus, Trash2, Home, CreditCard, Building, PieChart, TrendingUp, TrendingDown, Pencil } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { SpecialIncomeDialog, SpecialIncomeSource } from "./SpecialIncomeDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IncomeAndDebtStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
}

export function IncomeAndDebtStep({ formData, setFormData, isExistingCustomer = false }: IncomeAndDebtStepProps) {
    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const [isSpecialIncomeDialogOpen, setIsSpecialIncomeDialogOpen] = useState(false);
    const [editingSpecialIncome, setEditingSpecialIncome] = useState<SpecialIncomeSource | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id?: string, index?: number, name?: string, type: 'special' | 'reference' } | null>(null);

    const handleSaveSpecialIncome = (source: SpecialIncomeSource) => {
        const currentIncomes = formData.specialIncomes || [];
        if (editingSpecialIncome) {
            handleChange("specialIncomes", currentIncomes.map((item: any) => item.id === source.id ? source : item));
        } else {
            handleChange("specialIncomes", [...currentIncomes, source]);
        }
        setEditingSpecialIncome(null);
    };

    const handleRemoveSpecialIncome = (id: string) => {
        const currentIncomes = formData.specialIncomes || [];
        handleChange("specialIncomes", currentIncomes.filter((item: any) => item.id !== id));
        setItemToDelete(null);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'special' && itemToDelete.id) {
            handleRemoveSpecialIncome(itemToDelete.id);
        } else if (itemToDelete.type === 'reference' && itemToDelete.index !== undefined) {
            handleRemoveReference(itemToDelete.index);
        }
    };

    const handleNumberChange = (field: string, value: string) => {
        const cleanValue = value.replace(/,/g, '');
        if (/^\d*\.?\d*$/.test(cleanValue)) {
            handleChange(field, cleanValue);
        }
    };

    const formatNumberWithCommas = (val: string | number) => {
        if (val === null || val === undefined || val === "") return "";
        const parts = val.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    // Calculate Totals automatically
    useEffect(() => {
        // Special Income Calc
        const specialIncomesList = formData.specialIncomes || [];
        const specialIncomeSum = specialIncomesList.reduce((sum: number, item: any) => sum + (item.netIncome || 0), 0);

        if (formData.specialIncome !== specialIncomeSum.toString()) {
            handleChange("specialIncome", specialIncomeSum.toString());
        }

        // Income
        const main = Number(formData.mainIncome) || 0;
        const special = specialIncomeSum;
        const other = Number(formData.otherIncome) || 0;
        const totalIncome = main + special + other;
        if (formData.totalIncome !== totalIncome.toString()) {
            handleChange("totalIncome", totalIncome.toString());
        }

        // Debt - Personal
        const home = Number(formData.homeInstallment) || 0;
        const car = Number(formData.carInstallment) || 0;
        const otherPersonal = Number(formData.otherPersonalDebt) || 0;
        const totalPersonalDebt = home + car + otherPersonal;
        if (formData.totalPersonalDebt !== totalPersonalDebt.toString()) {
            handleChange("totalPersonalDebt", totalPersonalDebt.toString());
        }

        // Debt - Chaiyo
        const chaiyoLoan = Number(formData.chaiyoLoanInstallment) || 0;
        const chaiyoNew = Number(formData.chaiyoNewInstallment) || 0;
        const chaiyoIns = Number(formData.chaiyoInsuranceInstallment) || 0;
        const totalChaiyoDebt = chaiyoLoan + chaiyoNew + chaiyoIns;
        if (formData.totalChaiyoDebt !== totalChaiyoDebt.toString()) {
            handleChange("totalChaiyoDebt", totalChaiyoDebt.toString());
        }

        // Total Debt
        const totalDebt = totalPersonalDebt + totalChaiyoDebt;
        if (formData.totalDebt !== totalDebt.toString()) {
            handleChange("totalDebt", totalDebt.toString());
        }
    }, [
        formData.mainIncome, formData.specialIncome, formData.otherIncome,
        formData.homeInstallment, formData.carInstallment, formData.otherPersonalDebt,
        formData.chaiyoLoanInstallment, formData.chaiyoNewInstallment, formData.chaiyoInsuranceInstallment
    ]);

    // Reference Persons
    const handleAddReference = () => {
        const refs = formData.referencePersons || [];
        setFormData((prev: any) => ({
            ...prev,
            referencePersons: [...refs, { name: "", phone: "" }]
        }));
    };

    const handleUpdateReference = (index: number, field: string, value: string) => {
        const refs = [...(formData.referencePersons || [])];
        refs[index] = { ...refs[index], [field]: value };
        handleChange("referencePersons", refs);
    };

    const handleRemoveReference = (index: number) => {
        const refs = [...(formData.referencePersons || [])];
        refs.splice(index, 1);
        handleChange("referencePersons", refs);
        setItemToDelete(null);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
            {/* Main Form Container */}
            <div className="flex-1 space-y-8 w-full">
                <Card className="border-border-subtle shadow-sm">
                    <CardHeader className="bg-blue-50/50 border-b border-border-subtle pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            <DollarSign className="w-5 h-5" />
                            รายได้และภาระหนี้สิน (Income & Debt)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {/* Occupation Type Selection */}
                        <div className="space-y-4">
                            <Label className="text-base text-gray-800">กลุ่มอาชีพ *</Label>
                            <Select
                                value={formData.occupationType || ""}
                                onValueChange={(val) => handleChange("occupationType", val)}
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="เลือกกลุุ่มอาชีพ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee">พนักงานประจำ/ลูกจ้าง</SelectItem>
                                    <SelectItem value="business_owner">เจ้าของกิจการ</SelectItem>
                                    <SelectItem value="farmer">เกษตรกร</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(formData.occupationType === "employee" || formData.occupationType === "business_owner") && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                {/* SECTION 1: General Info */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-chaiyo-blue flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <Building className="w-4 h-4" /> ข้อมูลทั่วไป
                                    </h4>
                                    {formData.occupationType === "employee" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-2">
                                                <Label>ชื่อบริษัท</Label>
                                                <Input
                                                    value={formData.companyName || ""}
                                                    onChange={(e) => handleChange("companyName", e.target.value)}
                                                    placeholder="ระบุชื่อบริษัท"
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ตำแหน่ง</Label>
                                                <Input
                                                    value={formData.jobPosition || ""}
                                                    onChange={(e) => handleChange("jobPosition", e.target.value)}
                                                    placeholder="ระบุตำแหน่ง"
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>อายุงาน</Label>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-1">
                                                        <Input
                                                            type="number"
                                                            value={formData.workExperienceYears || ""}
                                                            onChange={(e) => handleChange("workExperienceYears", e.target.value)}
                                                            placeholder="ปี"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <Input
                                                            type="number"
                                                            value={formData.workExperienceMonths || ""}
                                                            onChange={(e) => handleChange("workExperienceMonths", e.target.value)}
                                                            placeholder="เดือน"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-2">
                                                <Label>ชื่อกิจการ</Label>
                                                <Input
                                                    value={formData.businessName || ""}
                                                    onChange={(e) => handleChange("businessName", e.target.value)}
                                                    placeholder="ระบุชื่อกิจการ"
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ประเภทกิจการ</Label>
                                                <Input
                                                    value={formData.businessType || ""}
                                                    onChange={(e) => handleChange("businessType", e.target.value)}
                                                    placeholder="ระบุประเภทกิจการ"
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>อายุกิจการ</Label>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-1">
                                                        <Input
                                                            type="number"
                                                            value={formData.businessExperienceYears || ""}
                                                            onChange={(e) => handleChange("businessExperienceYears", e.target.value)}
                                                            placeholder="ปี"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <Input
                                                            type="number"
                                                            value={formData.businessExperienceMonths || ""}
                                                            onChange={(e) => handleChange("businessExperienceMonths", e.target.value)}
                                                            placeholder="เดือน"
                                                            className="h-11"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {formData.occupationType === "business_owner" && (
                                    <>
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-chaiyo-blue flex items-center gap-2 pb-2 border-b border-gray-100">
                                                <TrendingUp className="w-4 h-4" /> ยอดขายรวม
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                <div className="space-y-2 col-span-1 md:col-span-2">
                                                    <Label>ยอดขายรวม (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.totalSales) || ""}
                                                        onChange={(e) => handleNumberChange("totalSales", e.target.value)}
                                                        className="text-right h-11"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>ยอดขายต่อวัน (บาท/วัน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.dailySales) || ""}
                                                        onChange={(e) => handleNumberChange("dailySales", e.target.value)}
                                                        className="text-right h-11"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>วันที่เปิดขาย (วัน/เดือน)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.daysOpenPerMonth || ""}
                                                        onChange={(e) => handleChange("daysOpenPerMonth", e.target.value)}
                                                        className="text-right h-11"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-red-600 flex items-center gap-2 pb-2 border-b border-gray-100">
                                                <TrendingDown className="w-4 h-4" /> ต้นทุนรวม
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                <div className="space-y-2 col-span-1 md:col-span-2">
                                                    <Label>รวมต้นทุน (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.totalCost) || ""}
                                                        onChange={(e) => handleNumberChange("totalCost", e.target.value)}
                                                        className="text-right h-11 text-red-600 focus-visible:ring-red-200"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>ค่าวัตถุดิบ (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.rawMaterialCost) || ""}
                                                        onChange={(e) => handleNumberChange("rawMaterialCost", e.target.value)}
                                                        className="text-right h-11"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>ค่าเช่า (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.rentCost) || ""}
                                                        onChange={(e) => handleNumberChange("rentCost", e.target.value)}
                                                        className="text-right h-11"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>ค่าใช้จ่ายอื่นๆ (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.otherExpenses) || ""}
                                                        onChange={(e) => handleNumberChange("otherExpenses", e.target.value)}
                                                        className="text-right h-11"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>ค่าจ้าง (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.wagesCost) || ""}
                                                        onChange={(e) => handleNumberChange("wagesCost", e.target.value)}
                                                        className="text-right h-11"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* SECTION 2: Income */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-chaiyo-blue flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <DollarSign className="w-4 h-4" /> รายได้
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 pt-2">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>รายได้หลัก (บาท/เดือน)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.mainIncome) || ""}
                                                    onChange={(e) => handleNumberChange("mainIncome", e.target.value)}
                                                    className="text-right h-11"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>รายได้อื่นๆ (บาท/เดือน)</Label>
                                                <Input
                                                    value={formatNumberWithCommas(formData.otherIncome) || ""}
                                                    onChange={(e) => handleNumberChange("otherIncome", e.target.value)}
                                                    className="text-right h-11"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label>รายได้พิเศษ (กิจการ/เกษตร)</Label>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => { setEditingSpecialIncome(null); setIsSpecialIncomeDialogOpen(true); }} className="h-8">
                                                        <Plus className="w-3 h-3 mr-1" /> เพิ่มรายได้
                                                    </Button>
                                                </div>

                                                <div className="border border-gray-200 rounded-xl overflow-hidden mt-2">
                                                    <Table>
                                                        <TableHeader className="bg-gray-50">
                                                            <TableRow className="hover:bg-gray-50">
                                                                <TableHead className="w-[10%] py-3 text-center">ลำดับ</TableHead>
                                                                <TableHead className="w-[45%] py-3">กิจการ/ธุรกิจ</TableHead>
                                                                <TableHead className="w-[30%] py-3 text-right">รายได้สุทธิ (บาท)</TableHead>
                                                                <TableHead className="w-[15%] py-3 text-center"></TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {(!formData.specialIncomes || formData.specialIncomes.length === 0) ? (
                                                                <TableRow className="hover:bg-transparent">
                                                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                                        ยังไม่มีข้อมูลรายได้พิเศษ
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                formData.specialIncomes.map((item: any, index: number) => (
                                                                    <TableRow key={item.id} className="table-row-hover group">
                                                                        <TableCell className="py-3 text-center font-medium">{index + 1}</TableCell>
                                                                        <TableCell className="py-3">
                                                                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {item.type === 'business_owner' ? 'ธุรกิจส่วนตัว' : (item.type === 'temporary_employee' ? 'พนักงานชั่วคราว' : (item.farmerSubType === 'crop' ? 'เกษตรกร (ปลูกพืช)' : 'เกษตรกร (ปศุสัตว์)'))}
                                                                            </p>
                                                                        </TableCell>
                                                                        <TableCell className="py-3 text-right">
                                                                            <span className="font-mono font-bold">฿{formatNumberWithCommas(item.netIncome)}</span>
                                                                        </TableCell>
                                                                        <TableCell className="py-3 text-center">
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="text-gray-500 hover:text-chaiyo-blue hover:bg-blue-50 h-8 w-8 p-0 rounded-full"
                                                                                    onClick={() => {
                                                                                        setEditingSpecialIncome(item);
                                                                                        setIsSpecialIncomeDialogOpen(true);
                                                                                    }}
                                                                                >
                                                                                    <Pencil className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                                    onClick={() => setItemToDelete({ id: item.id, name: item.name, type: 'special' })}
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                {/* SECTION 3: Debt */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-chaiyo-blue flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <CreditCard className="w-4 h-4" /> ภาระหนี้
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Personal Debt */}
                                        <div className="space-y-4">
                                            <h5 className="font-bold text-gray-700 flex items-center justify-between">
                                                <span>ภาระหนี้ส่วนตัวรวม</span>
                                            </h5>
                                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">ค่างวดผ่อนบ้าน/ที่ดิน (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.homeInstallment) || ""}
                                                        onChange={(e) => handleNumberChange("homeInstallment", e.target.value)}
                                                        className="text-right h-11 bg-white"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">ค่างวดรถ (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.carInstallment) || ""}
                                                        onChange={(e) => handleNumberChange("carInstallment", e.target.value)}
                                                        className="text-right h-11 bg-white"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-gray-500">ภาระหนี้อื่น (บาท/เดือน)</Label>
                                                    <Input
                                                        value={formatNumberWithCommas(formData.otherPersonalDebt) || ""}
                                                        onChange={(e) => handleNumberChange("otherPersonalDebt", e.target.value)}
                                                        className="text-right h-11 bg-white"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chaiyo Debt */}
                                        {isExistingCustomer && (
                                            <div className="space-y-4">
                                                <h5 className="font-bold text-gray-700 flex items-center justify-between">
                                                    <span>ภาระหนี้กับเงินไชโยรวม</span>
                                                </h5>
                                                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500">ค่างวดสินเชื่อกับเงินไชโย (บาท/เดือน)</Label>
                                                        <div className="text-right h-11 border-gray-200 bg-white flex items-center justify-end px-3 rounded-md border text-sm">
                                                            {formatNumberWithCommas(formData.chaiyoLoanInstallment) || "0"}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500">ค่างวดประกันผ่อนกับเงินไชโย (บาท/เดือน)</Label>
                                                        <div className="text-right h-11 border-gray-200 bg-white flex items-center justify-end px-3 rounded-md border text-sm">
                                                            {formatNumberWithCommas(formData.chaiyoInsuranceInstallment) || "0"}
                                                        </div>
                                                    </div>
                                                    <div className="pt-2">
                                                        <p className="text-[11px] text-red-500">* หมายเหตุ: ค่านี้ยังไม่รวมยอดขอสินเชื่อในครั้งนี้</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                </div>

                                {/* SECTION 4: Remarks */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-chaiyo-blue flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <Briefcase className="w-4 h-4" /> หมายเหตุอื่นๆ (Other)
                                    </h4>
                                    <Textarea
                                        value={formData.incomeRemarks || ""}
                                        onChange={(e) => handleChange("incomeRemarks", e.target.value)}
                                        placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                                        className="min-h-[100px] resize-none"
                                    />
                                </div>

                                {/* SECTION 5: References (ตารางบุคคลอ้างอิง) */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <h4 className="text-sm font-bold text-chaiyo-blue flex items-center gap-2">
                                            <Home className="w-4 h-4" /> บุคคลอ้างอิง (กรณีไม่มีเอกสารแสดงรายได้)
                                        </h4>
                                        <Button variant="outline" size="sm" onClick={handleAddReference}>
                                            <Plus className="w-4 h-4 mr-1" /> เพิ่มบุคคลอ้างอิง
                                        </Button>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow className="hover:bg-gray-50">
                                                    <TableHead className="w-[10%] py-3 text-center">ลำดับ</TableHead>
                                                    <TableHead className="w-[40%] py-3">ชื่อ-นามสกุล</TableHead>
                                                    <TableHead className="w-[40%] py-3">เบอร์ติดต่อ</TableHead>
                                                    <TableHead className="w-[10%] py-3 text-center">จัดการ</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(!formData.referencePersons || formData.referencePersons.length === 0) ? (
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                            ยังไม่มีบุคคลอ้างอิง
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    formData.referencePersons.map((ref: any, index: number) => (
                                                        <TableRow key={index} className="table-row-hover group">
                                                            <TableCell className="py-3 text-center font-medium">{index + 1}</TableCell>
                                                            <TableCell className="py-3">
                                                                <Input
                                                                    value={ref.name}
                                                                    onChange={(e) => handleUpdateReference(index, "name", e.target.value)}
                                                                    placeholder="ระบุชื่อ-นามสกุล"
                                                                    className="h-9"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <Input
                                                                    value={ref.phone}
                                                                    onChange={(e) => handleUpdateReference(index, "phone", e.target.value)}
                                                                    placeholder="08x-xxx-xxxx"
                                                                    className="h-9 font-mono"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3 text-center">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                                    onClick={() => setItemToDelete({ index, name: ref.name || `บุคคลที่ ${index + 1}`, type: 'reference' })}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Placeholder for other occupations layout can be built later... */}
                        {formData.occupationType !== "employee" && formData.occupationType !== "business_owner" && formData.occupationType && (
                            <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium">แบบฟอร์มสำหรับ เกษตรกร จะแตกต่างออกไป (Coming Soon)</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right side breakdown */}
            <div className="w-full xl:w-[350px] shrink-0 sticky top-6 space-y-4">
                <Card className="border-border-subtle shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
                        <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                            <PieChart className="w-5 h-5 text-chaiyo-blue" />
                            สรุปรายได้และภาระหนี้
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 space-y-4">
                            {/* Income Breakdown */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                                    รายได้รับ   <TrendingUp className="w-4 h-4" />
                                </h4>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้หลัก</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.mainIncome || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้พิเศษ</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.specialIncome || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายได้อื่นๆ</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.otherIncome || 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                                        <span>รวมรายได้</span>
                                        <span className="font-mono text-emerald-600">฿{formatNumberWithCommas(formData.totalIncome || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Debt Breakdown */}
                            <div className="space-y-2 pt-3">
                                <h4 className="text-sm font-bold text-orange-700 flex items-center gap-2">
                                    ภาระหนี้ <TrendingDown className="w-4 h-4" />
                                </h4>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>หนี้ส่วนตัวรวม</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.totalPersonalDebt || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>หนี้เงินไชโยรวม</span>
                                        <span className="font-mono">{formatNumberWithCommas(formData.totalChaiyoDebt || 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                                        <span>รวมภาระหนี้</span>
                                        <span className="font-mono text-orange-600">฿{formatNumberWithCommas(formData.totalDebt || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Net Income Remaining */}
                        <div className="bg-blue-50/50 p-4 border-t border-blue-100 space-y-1">
                            <Label className="text-chaiyo-blue text-sm block">รายได้คงเหลือรายเดือน (Capacity)</Label>
                            <div className={Number(formData.totalIncome || 0) - Number(formData.totalDebt || 0) < 0 ? "text-2xl font-black text-red-600 font-mono" : "text-2xl font-black text-blue-700 font-mono"}>
                                ฿{formatNumberWithCommas((Number(formData.totalIncome || 0) - Number(formData.totalDebt || 0)))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <SpecialIncomeDialog
                open={isSpecialIncomeDialogOpen}
                onOpenChange={setIsSpecialIncomeDialogOpen}
                onSave={handleSaveSpecialIncome}
                initialData={editingSpecialIncome}
            />

            <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                        <AlertDialogDescription>
                            คุณต้องการลบข้อมูล "{itemToDelete?.name}" ใช่หรือไม่?
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-status-rejected hover:bg-status-rejected/90"
                        >
                            ยืนยันการลบ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
