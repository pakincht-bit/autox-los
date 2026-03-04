import { useState, useEffect } from "react";
import { DollarSign, Briefcase, Plus, Trash2, Home, CreditCard, Building, PieChart, TrendingUp, TrendingDown, Pencil, Users, ImagePlus, X, Eye, Link } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/Checkbox";
import { Combobox } from "@/components/ui/combobox";
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

    // Helper for specific occupation tab field change
    const handleOccupationChange = (id: string, fieldOrUpdates: string | Record<string, any>, value?: any) => {
        setFormData((prev: any) => {
            const occs = prev.occupations || [{ id: 'main', isMain: true }];
            const updates = typeof fieldOrUpdates === 'string' ? { [fieldOrUpdates]: value } : fieldOrUpdates;
            const updated = occs.map((o: any) => o.id === id ? { ...o, ...updates } : o);
            return { ...prev, occupations: updated };
        });
    };

    const [activeTab, setActiveTab] = useState("main");
    const [isSpecialIncomeDialogOpen, setIsSpecialIncomeDialogOpen] = useState(false);
    const [editingSpecialIncome, setEditingSpecialIncome] = useState<SpecialIncomeSource | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id?: string, index?: number, name?: string, type: 'special' | 'reference' | 'photo' } | null>(null);

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
        } else if (itemToDelete.type === 'photo' && itemToDelete.index !== undefined) {
            handleRemovePhoto(itemToDelete.index);
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

    // Occupations Management
    const occupations = formData.occupations || [{ id: 'main', isMain: true }];

    const handleAddSecondaryOccupation = () => {
        const secondaryCount = occupations.filter((o: any) => !o.isMain).length;
        if (secondaryCount >= 10) return;

        const newId = `sec-${Date.now()}`;
        handleChange("occupations", [
            ...occupations,
            { id: newId, isMain: false }
        ]);
        setActiveTab(newId);
    };

    const handleRemoveOccupation = (id: string) => {
        const newOccupations = occupations.filter((o: any) => o.id !== id);
        handleChange("occupations", newOccupations);
        if (activeTab === id) {
            setActiveTab("main");
        }
    };

    // Photo Upload
    const handleAddPhoto = () => {
        const photos = formData.incomePhotos || [];
        const mockUrl = `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent('รูปประกอบ')}+${photos.length + 1}`;
        handleChange("incomePhotos", [...photos, mockUrl]);
    };

    const handleRemovePhoto = (index: number) => {
        const photos = [...(formData.incomePhotos || [])];
        photos.splice(index, 1);
        handleChange("incomePhotos", photos);
        setItemToDelete(null);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start animate-in fade-in slide-in-from-bottom-2">
            {/* Main Form Container */}
            <div className="flex-1 space-y-6 w-full min-w-0">

                {/* ===== SECTION 1: Income (อาชีพและรายได้) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            <Briefcase className="w-5 h-5" />
                            อาชีพและรายได้
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="relative flex items-center mb-6 border-b border-border-subtle">
                                {/* Scrollable Tab List */}
                                <div className="flex-1 overflow-x-auto no-scrollbar pr-4 min-w-0">
                                    <TabsList className="bg-transparent h-auto p-0 flex space-x-2 w-max pb-3">
                                        {occupations.map((occ: any, index: number) => (
                                            <TabsTrigger
                                                key={occ.id}
                                                value={occ.id}
                                                className="flex-shrink-0 px-4 py-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-chaiyo-blue data-[state=active]:border-chaiyo-blue border border-transparent hover:bg-gray-50 flex items-center gap-2 transition-all"
                                            >
                                                {occ.isMain ? (
                                                    <span className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4" /> อาชีพหลัก
                                                    </span>
                                                ) : (
                                                    `อาชีพรอง ${index}`
                                                )}
                                                {!occ.isMain && (
                                                    <div
                                                        className="w-5 h-5 rounded-full hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveOccupation(occ.id);
                                                        }}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                {/* Fixed Add Button */}
                                <div className="flex-shrink-0 pl-4 border-l border-gray-100 mb-3 ml-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddSecondaryOccupation}
                                        disabled={occupations.filter((o: any) => !o.isMain).length >= 10}
                                        className="h-10 border-dashed border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50 gap-2 whitespace-nowrap"
                                    >
                                        <Plus className="w-4 h-4" />
                                        เพิ่มอาชีพรอง
                                    </Button>
                                </div>
                            </div>

                            {occupations.map((occ: any) => (
                                <TabsContent key={occ.id} value={occ.id} className="space-y-8 animate-in fade-in duration-300">
                                    {/* 1. ข้อมูลอาชีพ */}
                                    <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                            <Briefcase className="w-5 h-5 text-chaiyo-blue" /> ข้อมูลอาชีพ
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-2">
                                                <Label>ประเภทการจ้างงาน <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.employmentType || ""}
                                                    onValueChange={(val) => {
                                                        handleOccupationChange(occ.id, {
                                                            employmentType: val,
                                                            jobPosition: "",
                                                            jobPositionOther: ""
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกประเภทการจ้างงาน" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SE">ธุรกิจส่วนตัว (SE)</SelectItem>
                                                        <SelectItem value="SA">พนักงานประจำ / ลูกจ้างชั่วคราว (SA)</SelectItem>
                                                        <SelectItem value="UNEMPLOYED">ว่างงาน</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>อาชีพ <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.occupationCode || ""}
                                                    onValueChange={(val) => handleOccupationChange(occ.id, "occupationCode", val)}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกอาชีพ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="occ1">Mockup อาชีพที่ 1</SelectItem>
                                                        <SelectItem value="occ2">Mockup อาชีพที่ 2</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {occ.employmentType === "SE" && (
                                                <div className="space-y-2">
                                                    <Label>ประเภทธุรกิจ (ISIC)</Label>
                                                    <Select
                                                        value={occ.businessTypeIsic || ""}
                                                        onValueChange={(val) => handleOccupationChange(occ.id, "businessTypeIsic", val)}
                                                    >
                                                        <SelectTrigger className="h-11 bg-white">
                                                            <SelectValue placeholder="เลือกประเภทธุรกิจ" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="isic1">Mockup ISIC ที่ 1</SelectItem>
                                                            <SelectItem value="isic2">Mockup ISIC ที่ 2</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="space-y-2 col-span-1 md:col-span-2">
                                                <Label>ระบุรายละเอียดเพิ่มเติม</Label>
                                                <Textarea
                                                    value={occ.occupationDetail || ""}
                                                    onChange={(e) => handleOccupationChange(occ.id, "occupationDetail", e.target.value)}
                                                    placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับอาชีพ"
                                                    className="resize-none h-20 bg-white"
                                                />
                                            </div>

                                            {occ.employmentType && (
                                                <div className="space-y-2 col-span-1 md:col-span-2">
                                                    <Label>ตำแหน่งงาน <span className="text-red-500">*</span></Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Select
                                                            value={occ.jobPosition || ""}
                                                            onValueChange={(val) => handleOccupationChange(occ.id, "jobPosition", val)}
                                                        >
                                                            <SelectTrigger className="h-11 bg-white">
                                                                <SelectValue placeholder="เลือกตำแหน่งงาน" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {occ.employmentType === 'SE' && (
                                                                    <>
                                                                        <SelectItem value="shareholder">ผู้ถือหุ้น / หุ้นส่วน</SelectItem>
                                                                        <SelectItem value="owner">เจ้าของกิจการ</SelectItem>
                                                                        <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                                                    </>
                                                                )}
                                                                {occ.employmentType === 'SA' && (
                                                                    <>
                                                                        <SelectItem value="executive">ผู้บริหารระดับสูง</SelectItem>
                                                                        <SelectItem value="general">พนักงานทั่วไป</SelectItem>
                                                                        <SelectItem value="permanent">ลูกจ้างประจำ (ข้าราชการ และรัฐวิสาหกิจ)</SelectItem>
                                                                        <SelectItem value="temporary">ลูกจ้างชั่วคราว</SelectItem>
                                                                        <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                                                    </>
                                                                )}
                                                                {occ.employmentType === 'UNEMPLOYED' && (
                                                                    <>
                                                                        <SelectItem value="retired">เกษียณ</SelectItem>
                                                                        <SelectItem value="unemployed">ว่างงาน</SelectItem>
                                                                        <SelectItem value="other">อื่นๆ โปรดระบุ</SelectItem>
                                                                    </>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {occ.jobPosition === "other" && (
                                                            <Input
                                                                value={occ.jobPositionOther || ""}
                                                                onChange={(e) => handleOccupationChange(occ.id, "jobPositionOther", e.target.value)}
                                                                placeholder="โปรดระบุตำแหน่งงาน"
                                                                className="h-11 bg-white"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <Label>ประเทศที่มา-รายได้ <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.incomeCountry || "TH"}
                                                    onValueChange={(val) => handleOccupationChange(occ.id, "incomeCountry", val)}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกประเทศ" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="TH">ไทย</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>แหล่งที่มา-รายได้ <span className="text-red-500">*</span></Label>
                                                <Select
                                                    value={occ.incomeSource || ""}
                                                    onValueChange={(val) => handleOccupationChange(occ.id, "incomeSource", val)}
                                                >
                                                    <SelectTrigger className="h-11 bg-white">
                                                        <SelectValue placeholder="เลือกแหล่งที่มารายได้" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="commission">ค่านายหน้า/ค่าธรรมเนียม/ค่าส่วนลด</SelectItem>
                                                        <SelectItem value="copyright">ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา</SelectItem>
                                                        <SelectItem value="freelance">ค่าวิชาชีพอิสระ</SelectItem>
                                                        <SelectItem value="rent">ค่าเช่า</SelectItem>
                                                        <SelectItem value="interest">ดอกเบี้ย เงินปันผล และ Cyptocurrency</SelectItem>
                                                        <SelectItem value="salary">เงินเดือน/ค่าจ้าง/เบี้ยเลี้ยง/โบนัส</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. ที่อยู่ที่ทำงาน / กิจการ */}
                                    <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                                        <div className={cn(
                                            "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-color",
                                            occ.isSameAsMainAddress && "opacity-80"
                                        )}>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                                    <Home className="w-5 h-5 text-chaiyo-blue" /> ที่อยู่ที่ทำงาน / กิจการ
                                                </h4>
                                                {occ.isSameAsMainAddress && (
                                                    <div className="flex items-center gap-1 bg-blue-50 text-chaiyo-blue text-[10px] px-2 py-0.5 rounded-full border border-blue-100 font-medium">
                                                        <Link className="w-3 h-3" /> เชื่อมโยงกับอาชีพหลัก
                                                    </div>
                                                )}
                                            </div>
                                            {!occ.isMain && (
                                                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-border-color shadow-sm">
                                                    <Checkbox
                                                        id={`same-as-main-${occ.id}`}
                                                        checked={occ.isSameAsMainAddress || false}
                                                        onCheckedChange={(checked) => {
                                                            const isChecked = !!checked;
                                                            handleOccupationChange(occ.id, "isSameAsMainAddress", isChecked);
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`same-as-main-${occ.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-chaiyo-blue"
                                                    >
                                                        เหมือนที่อยู่อาชีพหลัก
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        {(() => {
                                            // Live sync logic: use main occupation values if linked
                                            const mainOcc = formData.occupations?.find((o: any) => o.id === 'main') || {};
                                            const displayData = occ.isSameAsMainAddress ? mainOcc : occ;
                                            const isLinked = !!occ.isSameAsMainAddress;

                                            return (
                                                <div className={cn("space-y-6 pt-2 transition-opacity", isLinked && "opacity-75 pointer-events-none select-none")}>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label>ชื่อบริษัท / กิจการ {occ.employmentType === 'SA' && <span className="text-red-500">*</span>}</Label>
                                                            <Input
                                                                value={displayData.companyName || ""}
                                                                onChange={(e) => handleOccupationChange(occ.id, "companyName", e.target.value)}
                                                                placeholder="ระบุชื่อบริษัท หรือชื่อกิจการ"
                                                                className="h-11 bg-white"
                                                                disabled={isLinked}
                                                            />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <Label>สถานะกิจการปัจจุบัน {(occ.employmentType === 'SA' || occ.employmentType === 'SE') && <span className="text-red-500">*</span>}</Label>
                                                            <RadioGroup
                                                                value={displayData.businessStatus || ""}
                                                                onValueChange={(val) => handleOccupationChange(occ.id, "businessStatus", val)}
                                                                className="flex gap-6 pt-1"
                                                                disabled={isLinked}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="active" id={`${occ.id}-active`} disabled={isLinked} />
                                                                    <Label htmlFor={`${occ.id}-active`} className="font-normal cursor-pointer">ดำเนินกิจการอยู่</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="closed" id={`${occ.id}-closed`} disabled={isLinked} />
                                                                    <Label htmlFor={`${occ.id}-closed`} className="font-normal cursor-pointer">ปิดกิจการ</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">
                                                            รายละเอียดที่อยู่ {occ.employmentType === 'SA' && <span className="text-red-500 text-[10px] ml-1">*</span>}
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">เลขที่บ้าน</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workHouseNumber || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workHouseNumber", e.target.value)}
                                                                    placeholder="123/45"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ชั้น</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workFloor || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workFloor", e.target.value)}
                                                                    placeholder="เช่น 2"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">หน่วย/ห้อง</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workUnit || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workUnit", e.target.value)}
                                                                    placeholder="เช่น 201"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">หมู่ที่</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workMoo || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workMoo", e.target.value)}
                                                                    placeholder="เช่น 1"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">หมู่บ้าน/อาคาร</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workVillage || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workVillage", e.target.value)}
                                                                    placeholder="ชื่อหมู่บ้านหรืออาคาร"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ซอย</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workSoi || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workSoi", e.target.value)}
                                                                    placeholder="ชื่อซอย"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">แยก</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workYaek || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workYaek", e.target.value)}
                                                                    placeholder="ระบุแยก (ถ้ามี)"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ตรอก</Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workTrohk || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workTrohk", e.target.value)}
                                                                    placeholder="ระบุตรอก (ถ้ามี)"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ถนน</Label>
                                                                <Combobox
                                                                    value={displayData.workStreet || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "workStreet", val)}
                                                                    options={[{ label: "สุขุมวิท", value: "สุขุมวิท" }, { label: "พหลโยธิน", value: "พหลโยธิน" }]}
                                                                    placeholder="ระบุถนน"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">ตำบล/แขวง <span className="text-red-500">*</span></Label>
                                                                <Combobox
                                                                    value={displayData.workSubDistrict || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "workSubDistrict", val)}
                                                                    options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "วังทองหลาง", value: "วังทองหลาง" }]}
                                                                    placeholder="ระบุตำบล/แขวง"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">อำเภอ/เขต <span className="text-red-500">*</span></Label>
                                                                <Combobox
                                                                    value={displayData.workDistrict || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "workDistrict", val)}
                                                                    options={[{ label: "ลาดพร้าว", value: "ลาดพร้าว" }, { label: "จตุจักร", value: "จตุจักร" }]}
                                                                    placeholder="ระบุอำเภอ/เขต"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">จังหวัด <span className="text-red-500">*</span></Label>
                                                                <Combobox
                                                                    value={displayData.workProvince || ""}
                                                                    onValueChange={(val) => handleOccupationChange(occ.id, "workProvince", val)}
                                                                    options={[{ label: "กรุงเทพมหานคร", value: "กรุงเทพมหานคร" }, { label: "นนทบุรี", value: "นนทบุรี" }]}
                                                                    placeholder="ระบุจังหวัด"
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์ <span className="text-red-500">*</span></Label>
                                                                <Input
                                                                    className="h-11 bg-white"
                                                                    value={displayData.workZipCode || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workZipCode", e.target.value.replace(/\D/g, '').slice(0, 5))}
                                                                    placeholder="10XXX"
                                                                    maxLength={5}
                                                                    disabled={isLinked}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                        <div className="space-y-2">
                                                            <Label>เบอร์ติดต่อบริษัท {occ.employmentType === 'SA' && <span className="text-red-500">*</span>}</Label>
                                                            <Input
                                                                value={displayData.companyPhone || ""}
                                                                onChange={(e) => handleOccupationChange(occ.id, "companyPhone", e.target.value)}
                                                                placeholder="02-XXX-XXXX"
                                                                className="h-11 bg-white"
                                                                disabled={isLinked}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>บริเวณใกล้เคียง/จุดสังเกต</Label>
                                                            <Input
                                                                value={displayData.workLandmark || ""}
                                                                onChange={(e) => handleOccupationChange(occ.id, "workLandmark", e.target.value)}
                                                                placeholder="เช่น ใกล้เซเว่น, ตรงข้ามธนาคาร"
                                                                className="h-11 bg-white"
                                                                disabled={isLinked}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>ลักษณะที่ตั้งของกิจการ <span className="text-red-500">*</span></Label>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <Select
                                                                value={displayData.workLocationType || ""}
                                                                onValueChange={(val) => handleOccupationChange(occ.id, "workLocationType", val)}
                                                                disabled={isLinked}
                                                            >
                                                                <SelectTrigger className="h-11 bg-white" disabled={isLinked}>
                                                                    <SelectValue placeholder="โลเกชั่นที่ตั้ง" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="rental">พื้นที่เช่า/ร้านค้า</SelectItem>
                                                                    <SelectItem value="shop">ห้างร้าน</SelectItem>
                                                                    <SelectItem value="market">แผงลอยในตลาดนัด/ชุมชน</SelectItem>
                                                                    <SelectItem value="factory">โรงงาน</SelectItem>
                                                                    <SelectItem value="street_food">รถเข็นขายของ/ริมถนน</SelectItem>
                                                                    <SelectItem value="company">บริษัท</SelectItem>
                                                                    <SelectItem value="other">อื่นๆ รายละเอียดอื่นๆ</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {displayData.workLocationType === 'other' && (
                                                                <Input
                                                                    value={displayData.workLocationTypeOther || ""}
                                                                    onChange={(e) => handleOccupationChange(occ.id, "workLocationTypeOther", e.target.value)}
                                                                    placeholder="โปรดระบุรายละเอียด"
                                                                    className="h-11 bg-white"
                                                                    disabled={isLinked}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* 3. ช่องทางการรับรายได้ */}
                                    <div className="rounded-xl border border-border-color bg-gray-50/40 p-6 space-y-4">
                                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-border-color">
                                            <DollarSign className="w-5 h-5 text-chaiyo-blue" /> ช่องทางการรับรายได้
                                        </h4>
                                        <div className="p-8 border border-dashed border-gray-200 rounded-xl bg-white flex items-center justify-center">
                                            <span className="text-muted-foreground">พื้นที่สำหรับฟอร์ม ช่องทางการรับรายได้</span>
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>

                        {/* Special Incomes component has been removed in favor of this tab system */}
                    </CardContent>
                </Card>

                {/* ===== SECTION 2: Debt (ภาระหนี้สิน) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-orange-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                            <CreditCard className="w-5 h-5" />
                            ภาระหนี้สิน
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
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

                        {/* Remarks */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Briefcase className="w-4 h-4" /> หมายเหตุอื่นๆ
                            </h4>
                            <Textarea
                                value={formData.incomeRemarks || ""}
                                onChange={(e) => handleChange("incomeRemarks", e.target.value)}
                                placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)"
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ===== SECTION 3: Reference Persons (บุคคลอ้างอิง) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                                    <Users className="w-5 h-5" />
                                    บุคคลอ้างอิง (กรณีไม่มีเอกสารแสดงรายได้)
                                </CardTitle>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleAddReference}>
                                <Plus className="w-4 h-4 mr-1" /> เพิ่มบุคคลอ้างอิง
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="border border-border-subtle rounded-xl overflow-hidden">
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
                    </CardContent>
                </Card>

                {/* ===== SECTION 4: Upload Photos (อัพโหลดรูปประกอบ) ===== */}
                <Card className="border-border-strong">
                    <CardHeader className="bg-blue-50/50 border-b border-border-strong pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-chaiyo-blue">
                            <ImagePlus className="w-5 h-5" />
                            อัพโหลดรูปประกอบ (กรณีที่ไม่มีหลักฐานของรายได้ สามารถอัพโหลดรูปประกอบเพื่อใช้แทนได้


                            )
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-4">
                            {(formData.incomePhotos || []).map((photo: string, idx: number) => (
                                <div key={idx} className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 group bg-white shadow-sm transition-all hover:border-chaiyo-blue">
                                    <img src={photo} alt={`income-photo-${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setItemToDelete({ index: idx, name: `รูปที่ ${idx + 1}`, type: 'photo' })}
                                            className="text-white hover:text-red-300 transition-colors p-1.5 bg-white/10 rounded-full backdrop-blur-sm"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleAddPhoto}
                                className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-chaiyo-blue hover:bg-blue-50 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-chaiyo-blue transition-all bg-white shadow-sm group cursor-pointer"
                            >
                                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold">เพิ่มรูปถ่าย</span>
                            </button>
                        </div>
                        {(!formData.incomePhotos || formData.incomePhotos.length === 0) && (
                            <p className="text-sm text-muted-foreground mt-4">ยังไม่มีรูปประกอบ — กดปุ่ม &quot;เพิ่มรูปถ่าย&quot; เพื่ออัพโหลด</p>
                        )}
                    </CardContent>
                </Card>

            </div>

            {/* Right side breakdown */}
            <div className="w-full xl:w-[350px] shrink-0 sticky top-6 space-y-4">
                <Card className="border-border-subtle overflow-hidden">
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
                            คุณต้องการลบข้อมูล &quot;{itemToDelete?.name}&quot; ใช่หรือไม่?
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
