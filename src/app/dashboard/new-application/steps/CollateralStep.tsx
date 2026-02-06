"use client";

import { useState, useEffect } from "react";
import { Car, Bike, Truck, Tractor, MapIcon, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface CollateralStepProps {
    formData: any;
    setFormData: (data: any) => void;
    isExistingCustomer?: boolean;
    existingCollaterals?: any[];
}

export function CollateralStep({ formData, setFormData, isExistingCustomer = false, existingCollaterals = [] }: CollateralStepProps) {
    const [selectedType, setSelectedType] = useState<string>(formData.collateralType || "car");
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(formData.existingAssetId || null);
    const [isEditing, setIsEditing] = useState<boolean>(!formData.existingAssetId);

    useEffect(() => {
        if (formData.collateralType) {
            let type = formData.collateralType as string;
            if (type === 'agriculture_car') type = 'agri';
            setSelectedType(type);
        }
    }, [formData.collateralType]);

    const handleSelectAsset = (asset: any) => {
        setSelectedAssetId(asset.id);
        setSelectedType(asset.type);
        setIsEditing(false);
        setFormData({
            ...formData,
            collateralType: asset.type,
            existingAssetId: asset.id,
            brand: asset.brand,
            model: asset.model,
            year: asset.year,
            licensePlate: asset.licensePlate,
            vin: asset.vin,
            deedNumber: "",
            parcelNumber: "",
        });
    };

    const handleAddNew = () => {
        setSelectedAssetId(null);
        setSelectedType("car");
        setIsEditing(true);
        setFormData({
            ...formData,
            collateralType: "car",
            existingAssetId: null,
            brand: "",
            model: "",
            year: "",
            licensePlate: "",
            vin: "",
        });
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setFormData({ ...formData, collateralType: type });
    };

    const formatNumber = (num: number | string) => {
        if (!num && num !== 0) return "";
        const parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    const handleAppraisalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (rawValue === "" || /^\d+$/.test(rawValue)) {
            handleChange("appraisalPrice", rawValue === "" ? 0 : Number(rawValue));
        }
    };

    const LOAN_TYPES = [
        { id: "car", label: "รถยนต์", icon: Car },
        { id: "moto", label: "มอเตอร์ไซค์", icon: Bike },
        { id: "truck", label: "รถบรรทุก", icon: Truck },
        { id: "agri", label: "เกษตร", icon: Tractor },
        { id: "land", label: "ที่ดิน", icon: MapIcon },
    ];

    const isLand = selectedType === 'land';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">

                {/* LEFT COLUMN: Sidebar (Asset List OR Appraisal Summary) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* CASE A: Existing Customer List View */}
                    {isExistingCustomer && existingCollaterals.length > 0 && !selectedAssetId && (
                        <div className="space-y-4">
                            <Label className="text-base font-bold text-foreground block mb-2">เลือกทรัพย์สิน</Label>
                            <div className="space-y-3">
                                {existingCollaterals.map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => handleSelectAsset(asset)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 relative overflow-hidden",
                                            selectedAssetId === asset.id
                                                ? "border-chaiyo-blue bg-blue-50/50 ring-2 ring-chaiyo-blue/10"
                                                : "border-border-subtle bg-white"
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                                selectedAssetId === asset.id ? "bg-chaiyo-blue text-white" : "bg-gray-100 text-gray-500"
                                            )}>
                                                {asset.type === 'car' ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                                            </div>
                                            <div className="space-y-0.5 min-w-0">
                                                <p className="font-bold text-foreground text-sm truncate">{asset.brand} {asset.model}</p>
                                                <p className="text-xs text-muted truncate">ทะเบียน: {asset.licensePlate}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    onClick={handleAddNew}
                                    className="p-4 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer transition-all hover:bg-gray-50 flex items-center gap-3 text-muted-foreground bg-white"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <span className="text-xl font-light">+</span>
                                    </div>
                                    <span className="font-medium text-sm">เพิ่มทรัพย์สินใหม่</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CASE B: Appraisal & AI Analysis (Show when editing/viewing a specific asset) */}
                    {(!isExistingCustomer || selectedAssetId || isEditing) && (
                        <div className="space-y-6 sticky top-6">
                            {/* Appraisal Card */}
                            <div className="bg-gradient-to-br from-white to-emerald-50/50 p-6 rounded-2xl border-2 border-emerald-100 shadow-sm space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

                                <div className="space-y-1 relative">
                                    <Label className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-600" />
                                        ราคาประเมิน (AI)
                                    </Label>
                                    <p className="text-xs text-emerald-600/80">ประเมินจากสภาพรถในภาพถ่าย</p>
                                </div>

                                <div className="relative bg-white rounded-xl shadow-inner border border-emerald-100 p-1">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-xl">฿</span>
                                    <Input
                                        type="text"
                                        className="h-14 pl-10 pr-4 text-3xl font-bold text-right text-emerald-800 border-none bg-transparent focus-visible:ring-0 placeholder:text-emerald-200"
                                        value={formData.appraisalPrice ? formatNumber(formData.appraisalPrice) : ""}
                                        onChange={handleAppraisalChange}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-3 pt-2 border-t border-emerald-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                            {(() => {
                                                const activeType = LOAN_TYPES.find(t => t.id === selectedType) || LOAN_TYPES[0];
                                                const Icon = activeType.icon;
                                                return <Icon className="w-5 h-5" />;
                                            })()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-emerald-900 truncate">
                                                {formData.brand || "ระบุยี่ห้อ"} {formData.model || ""}
                                            </p>
                                            <p className="text-xs text-emerald-600 truncate">
                                                {formData.year ? `ปี ${formData.year}` : "ไม่ระบุปี"} • {formData.color || "สีไม่ระบุ"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800" size="sm">
                                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                                    วิเคราะห์ใหม่ (Re-analyze)
                                </Button>
                            </div>

                            {/* Collateral Type Selection (Moved if editing or new) */}
                            {(!isExistingCustomer || (isExistingCustomer && isEditing && !selectedAssetId)) && !isExistingCustomer && (
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                    <Label className="text-sm font-bold text-muted">ประเภทหลักประกัน</Label>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200/50">
                                        <div className="w-8 h-8 rounded-full bg-chaiyo-blue text-white flex items-center justify-center shrink-0">
                                            {(() => {
                                                const activeType = LOAN_TYPES.find(t => t.id === selectedType) || LOAN_TYPES[0];
                                                const Icon = activeType.icon;
                                                return <Icon className="w-4 h-4" />;
                                            })()}
                                        </div>
                                        <span className="font-bold text-sm text-foreground">
                                            {LOAN_TYPES.find(t => t.id === selectedType)?.label || selectedType}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Form Details */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Header with Edit Toggle */}
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-base font-bold text-foreground">รายละเอียดหลักประกัน</Label>
                        {isExistingCustomer && selectedAssetId && (
                            <Button
                                variant={isEditing ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => {
                                    if (isEditing) {
                                        // Cancel edit: revert to original asset data
                                        const originalAsset = existingCollaterals.find(a => a.id === selectedAssetId);
                                        if (originalAsset) handleSelectAsset(originalAsset);
                                    } else {
                                        setIsEditing(true);
                                    }
                                }}
                                className="h-8 text-xs"
                            >
                                {isEditing ? "ยกเลิกการแก้ไข" : "แก้ไขข้อมูล"}
                            </Button>
                        )}
                    </div>

                    {/* Leftover Tabs for existing customers adding new assets */}
                    {isExistingCustomer && isEditing && !selectedAssetId && (
                        <div className="flex w-full overflow-x-auto no-scrollbar items-end pl-2 mb-6">
                            {LOAN_TYPES.map((type) => {
                                const isActive = selectedType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => handleTypeSelect(type.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 px-8 py-4 min-w-[120px] transition-all duration-300 relative group outline-none cursor-pointer",
                                            "rounded-t-2xl",
                                            isActive
                                                ? "bg-white text-chaiyo-blue z-20 translate-y-[2px]"
                                                : "bg-gray-50 text-muted hover:bg-gray-100 z-10 mb-[2px]"
                                        )}
                                    >
                                        {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-chaiyo-blue rounded-t-full"></div>}
                                        <type.icon className={cn("w-6 h-6", isActive ? "scale-110" : "opacity-50")} />
                                        <span className={cn("text-xs font-bold", isActive ? "" : "opacity-70")}>{type.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="bg-white pt-6 relative z-10">

                        {/* 1. Vehicle Form (Cleaned up, no Appraisal) */}
                        {!isLand && (
                            <div className="grid gap-x-10 gap-y-6 md:grid-cols-2 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ปีจดทะเบียน</Label>
                                    <Input
                                        placeholder="เช่น 2020"
                                        className="font-mono h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.year || ""}
                                        onChange={(e) => handleChange("year", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ยี่ห้อ</Label>
                                    <Input
                                        placeholder="Toyota, Honda..."
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.brand || ""}
                                        onChange={(e) => handleChange("brand", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">รุ่น</Label>
                                    <Input
                                        placeholder="Hilux Revo..."
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.model || ""}
                                        onChange={(e) => handleChange("model", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">สี</Label>
                                    <Input
                                        placeholder="ขาว, ดำ..."
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.color || ""}
                                        onChange={(e) => handleChange("color", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขทะเบียน</Label>
                                    <Input
                                        placeholder="1กข 1234"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.licensePlate || ""}
                                        onChange={(e) => handleChange("licensePlate", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขตัวถัง (VIN)</Label>
                                    <Input
                                        placeholder="ระบุเลขตัวถัง..."
                                        className="font-mono uppercase h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.vin || ""}
                                        onChange={(e) => handleChange("vin", e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 2. Land Form */}
                        {isLand && (
                            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขที่โฉนด</Label>
                                    <Input
                                        placeholder="ระบุเลขที่โฉนด"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.deedNumber || ""}
                                        onChange={(e) => handleChange("deedNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขที่ดิน</Label>
                                    <Input
                                        placeholder="ระบุเลขที่ดิน"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.parcelNumber || ""}
                                        onChange={(e) => handleChange("parcelNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ระวาง</Label>
                                    <Input
                                        placeholder="ระบุระวาง"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.gridNumber || ""}
                                        onChange={(e) => handleChange("gridNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">หน้าสำรวจ</Label>
                                    <Input
                                        placeholder="ระบุหน้าสำรวจ"
                                        className="h-14 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.surveyPage || ""}
                                        onChange={(e) => handleChange("surveyPage", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">ไร่</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-14 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            disabled={!isEditing}
                                            value={formData.rai || ""}
                                            onChange={(e) => handleChange("rai", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">งาน</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-14 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            disabled={!isEditing}
                                            value={formData.ngan || ""}
                                            onChange={(e) => handleChange("ngan", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">ตร.ว.</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-14 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            disabled={!isEditing}
                                            value={formData.wah || ""}
                                            onChange={(e) => handleChange("wah", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
