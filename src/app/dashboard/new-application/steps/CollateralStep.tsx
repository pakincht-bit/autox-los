"use client";

import { useState, useEffect } from "react";
import { Car, Bike, Truck, Tractor, MapIcon } from "lucide-react";
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
    const [isEditing, setIsEditing] = useState<boolean>(!formData.existingAssetId); // Edit mode false if using existing asset initially

    useEffect(() => {
        if (formData.collateralType) {
            setSelectedType(formData.collateralType as string);
        }
    }, [formData.collateralType]);

    // Pre-fill form when an existing asset is selected
    const handleSelectAsset = (asset: any) => {
        setSelectedAssetId(asset.id);
        setSelectedType(asset.type);
        setIsEditing(false); // Default to read-only for existing assets
        setFormData({
            ...formData,
            collateralType: asset.type,
            existingAssetId: asset.id, // Track that we used an existing asset
            brand: asset.brand,
            model: asset.model,
            year: asset.year,
            licensePlate: asset.licensePlate,
            vin: asset.vin,
            // Clear land fields just in case
            deedNumber: "",
            parcelNumber: "",
        });
    };

    const handleAddNew = () => {
        setSelectedAssetId(null);
        setSelectedType("car"); // Default to car
        setIsEditing(true); // Always edit mode for new assets
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

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setFormData({ ...formData, collateralType: type });
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
            <div className={cn("grid gap-8", isExistingCustomer ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1")}>

                {/* LEFT COLUMN: Asset Selection (Only for Existing Customers) */}
                {isExistingCustomer && existingCollaterals.length > 0 && (
                    <div className="lg:col-span-4 space-y-4">
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
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className={cn(
                                                    "text-[10px] px-1.5 h-5 pointer-events-none",
                                                    asset.status === 'Free' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                                                )}>
                                                    {asset.status === 'Free' ? 'ปลอดภาระ' : 'ติดจำนำ'}
                                                </Badge>
                                            </div>
                                        </div>
                                        {selectedAssetId === asset.id && (
                                            <div className="absolute top-3 right-3 w-4 h-4 bg-chaiyo-blue text-white rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Option to Add New */}
                            <div
                                onClick={handleAddNew}
                                className={cn(
                                    "p-4 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer transition-all hover:bg-gray-50 flex items-center gap-3 text-muted-foreground",
                                    selectedAssetId === null ? "border-chaiyo-blue text-chaiyo-blue bg-blue-50/30" : "bg-white"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <span className="text-xl font-light">+</span>
                                </div>
                                <span className="font-medium text-sm">เพิ่มทรัพย์สินใหม่</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* RIGHT COLUMN: Form Details */}
                <div className={cn("space-y-6", isExistingCustomer ? "lg:col-span-8" : "w-full")}>

                    {/* Header with Edit Toggle */}
                    <div className="flex justify-between items-center mb-4">
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

                    {/* Bookmark Tabs Container (Only show if adding new or editing type allowed) */}
                    {/* For existing asset, maybe lock the type unless in full edit mode? Let's allow type switch only if adding new for now to simplify, or if editing. */}
                    <div className={cn(
                        "flex w-full overflow-x-auto no-scrollbar items-end pl-2",
                        (!isEditing && selectedAssetId) ? "opacity-50 pointer-events-none grayscale" : ""
                    )}>
                        {LOAN_TYPES.map((type) => {
                            const isActive = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => handleTypeSelect(type.id)}
                                    disabled={!isEditing && !!selectedAssetId}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 px-8 py-4 min-w-[120px] transition-all duration-300 relative group outline-none cursor-pointer",
                                        "rounded-t-2xl",
                                        isActive
                                            ? "bg-white text-chaiyo-blue z-20 translate-y-[2px]"
                                            : "bg-gray-50 text-muted hover:bg-gray-100 z-10 mb-[2px]"
                                    )}
                                >
                                    {/* Active Top Accent */}
                                    {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-chaiyo-blue rounded-t-full"></div>}

                                    <type.icon className={cn("w-6 h-6", isActive ? "scale-110" : "opacity-50")} />
                                    <span className={cn("text-xs font-bold", isActive ? "" : "opacity-70")}>{type.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Main Content Area - Connected to active tab */}
                    <div className="bg-white pt-8 relative z-10">

                        {/* 1. Vehicle Form */}
                        {!isLand && (
                            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ปีจดทะเบียน</Label>
                                    <Input
                                        placeholder="เช่น 2020"
                                        className="font-mono h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.year || ""}
                                        onChange={(e) => handleChange("year", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ยี่ห้อ</Label>
                                    <Input
                                        placeholder="Toyota, Honda..."
                                        className="h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.brand || ""}
                                        onChange={(e) => handleChange("brand", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">รุ่น</Label>
                                    <Input
                                        placeholder="Hilux Revo..."
                                        className="h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.model || ""}
                                        onChange={(e) => handleChange("model", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขทะเบียน</Label>
                                    <Input
                                        placeholder="1กข 1234"
                                        className="h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.licensePlate || ""}
                                        onChange={(e) => handleChange("licensePlate", e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขตัวถัง (VIN)</Label>
                                    <Input
                                        placeholder="ระบุเลขตัวถัง..."
                                        className="font-mono uppercase h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
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
                                        className="h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.deedNumber || ""}
                                        onChange={(e) => handleChange("deedNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">เลขที่ดิน</Label>
                                    <Input
                                        placeholder="ระบุเลขที่ดิน"
                                        className="h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.parcelNumber || ""}
                                        onChange={(e) => handleChange("parcelNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">ระวาง</Label>
                                    <Input
                                        placeholder="ระบุระวาง"
                                        className="h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                        disabled={!isEditing}
                                        value={formData.gridNumber || ""}
                                        onChange={(e) => handleChange("gridNumber", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-muted ml-1">หน้าสำรวจ</Label>
                                    <Input
                                        placeholder="ระบุหน้าสำรวจ"
                                        className="h-12 rounded-xl text-lg disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
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
                                            className="h-12 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            disabled={!isEditing}
                                            value={formData.rai || ""}
                                            onChange={(e) => handleChange("rai", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">งาน</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-12 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
                                            disabled={!isEditing}
                                            value={formData.ngan || ""}
                                            onChange={(e) => handleChange("ngan", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-muted ml-1">ตร.ว.</Label>
                                        <Input
                                            type="number" placeholder="0"
                                            className="h-12 rounded-xl text-lg text-center disabled:opacity-100 disabled:bg-gray-50 disabled:text-gray-600"
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
