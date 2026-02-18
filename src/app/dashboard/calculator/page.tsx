"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { QuotationPrint } from "@/components/calculator/QuotationPrint";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ChevronLeft, Printer, FileText, PiggyBank, Briefcase, Car, Camera, Check, Sparkles, Bike, Truck, Tractor, Map, Upload, Eye, X, ChevronRight, Plus, CreditCard, Gift, Shield, Percent, ArrowRight, Star, User, Banknote } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

const CAR_BRANDS = [
    { value: "toyota", label: "Toyota" },
    { value: "honda", label: "Honda" },
    { value: "isuzu", label: "Isuzu" },
    { value: "mitsubishi", label: "Mitsubishi" },
    { value: "nissan", label: "Nissan" },
    { value: "mazda", label: "Mazda" },
    { value: "ford", label: "Ford" },
    { value: "suzuki", label: "Suzuki" },
    { value: "mg", label: "MG" },
    { value: "byd", label: "BYD" },
    { value: "gwm", label: "GWM" },
    { value: "bmw", label: "BMW" },
    { value: "mercedes", label: "Mercedes-Benz" },
];

const CAR_MODELS = [
    { value: "yaris", label: "Yaris" },
    { value: "vios", label: "Vios" },
    { value: "altis", label: "Corolla Altis" },
    { value: "camry", label: "Camry" },
    { value: "hilux", label: "Hilux Revo" },
    { value: "fortuner", label: "Fortuner" },
    { value: "city", label: "City" },
    { value: "civic", label: "Civic" },
    { value: "crv", label: "CR-V" },
    { value: "hrv", label: "HR-V" },
    { value: "accord", label: "Accord" },
    { value: "dmax", label: "D-Max" },
    { value: "mux", label: "MU-X" },
    { value: "triton", label: "Triton" },
    { value: "pajero", label: "Pajero Sport" },
    { value: "ranger", label: "Ranger" },
    { value: "everest", label: "Everest" },
    { value: "attrage", label: "Attrage" },
    { value: "mirage", label: "Mirage" },
    { value: "swift", label: "Swift" },
    { value: "ciaz", label: "Ciaz" },
];

const YEARS = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
});

export default function CalculatorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1;

    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'balloon'>('monthly');
    // Local state for "Sales Talk"
    const [formData, setFormData] = useState<any>({
        collateralType: 'car',
        appraisalPrice: 0,
        income: 0,
        // Defaults for CalculatorStep
        requestedAmount: 0,
        requestedDuration: 24,
    });

    // Step 1: Select Type
    // Step 2: Upload / Analyze
    // Step 3: Info
    // Step 4: Calculate (Result)
    // Step 4: Calculate (Result)
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('calculatorState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.formData) setFormData(parsed.formData);
                // If URL param step exists, use it has priority (for the back navigation scenario)
                // Otherwise use saved step if available, or default to 1.
                // Wait, if initialStep is from URL, currentStep is already initialized with it.
                // If no URL param, initialStep is 1.
                // We should only overwrite currentStep from storage if URL param is NOT present.
                if (!searchParams.get('step') && parsed.currentStep) {
                    setCurrentStep(parsed.currentStep);
                }
            } catch (e) {
                console.error("Failed to load calculator state", e);
            }
        }
    }, [searchParams]);

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem('calculatorState', JSON.stringify({
            formData,
            currentStep
        }));
    }, [formData, currentStep]);

    // Lightbox State
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([
        "https://placehold.co/600x800/e2e8f0/1e293b?text=Registration+Book+Page+1",
    ]);

    const handleAddPhoto = () => {
        setUploadedDocs(prev => [
            ...prev,
            `https://placehold.co/600x800/e2e8f0/1e293b?text=New+Photo+${prev.length + 1}`
        ]);
    };

    // Enhanced Product List for UI Design
    const PRODUCTS = [
        {
            id: "car",
            label: "รถเก๋ง / รถกระบะ",
            desc: "เล่มทะเบียนรถ",
            icon: Car,
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: "moto",
            label: "รถจักรยานยนต์",
            desc: "เล่มทะเบียนรถ",
            icon: Bike,
            color: "bg-purple-100 text-purple-600"
        },
        {
            id: "truck",
            label: "รถบรรทุก",
            desc: "เล่มทะเบียนรถ",
            icon: Truck,
            color: "bg-orange-100 text-orange-600"
        },
        {
            id: "agri",
            label: "รถเพื่อการเกษตร",
            desc: "เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย",
            icon: Tractor,
            color: "bg-green-100 text-green-600"
        },
        {
            id: "land",
            label: "ที่ดิน",
            desc: "โฉนดที่ดิน",
            icon: Map,
            color: "bg-yellow-100 text-yellow-600 hover:text-yellow-700"
        },
    ];

    // Document requirements per collateral type (matches CollateralStepNew.tsx)
    const DOCUMENT_REQUIREMENTS: Record<string, { name: string; description: string }> = {
        car: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        moto: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        truck: { name: 'เล่มทะเบียนรถ', description: 'หน้ารายการจดทะเบียน' },
        agri: { name: 'เล่มทะเบียน หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย', description: 'เอกสารแสดงกรรมสิทธิ์' },
        land: { name: 'โฉนดที่ดิน', description: 'หน้าแรก - ครุฑ' },
    };

    const handlePrint = () => {
        let pdfPath = "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
        if (formData.collateralType === 'land') {
            pdfPath = "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf";
        }
        window.open(pdfPath, '_blank');
    };

    const handleCreateApplication = () => {
        // Save current sales talk data to localStorage for prefilling the application form
        localStorage.setItem('salesTalkData', JSON.stringify(formData));
        router.push("/dashboard/new-application");
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    // Mock AI Analysis from Photo Step
    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            // Mock Data Filling based on type
            let mockData: any = {
                appraisalPrice: 450000
            };

            if (formData.collateralType === 'car') {
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', mileage: 85000 };
            } else if (formData.collateralType === 'moto') {
                mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
            } else if (formData.collateralType === 'land') {
                mockData = { ...mockData, landRai: 1, landNgan: 2, landWah: 50, province: 'กรุงเทพมหานคร', appraisalPrice: 2500000 };
            }

            setFormData((prev: any) => ({ ...prev, ...mockData }));
            setIsAnalyzing(false);
            nextStep(); // Go to Step 3
        }, 2000);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 h-full max-w-5xl mx-auto pb-20">
            {/* Header / Nav */}
            <div className="flex items-center justify-between print:hidden">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        localStorage.removeItem('calculatorState');
                        router.push("/dashboard/applications");
                    }}
                    className="text-muted hover:text-foreground -ml-2"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    กลับไปหน้ารายการใบคำขอ
                </Button>
            </div>

            {/* Stepper Indicator (Matching Application Flow) */}
            <div className="flex justify-center items-center mb-16 print:hidden w-full">
                <div className="relative flex items-center justify-between w-full max-w-2xl px-4 md:px-12">
                    {/* Progress Line */}
                    <div className="absolute left-4 right-4 md:left-12 md:right-12 top-[14px] -translate-y-1/2 h-[2px] bg-gray-200 z-0">
                        <div
                            className="h-full bg-chaiyo-blue transition-all duration-500 ease-in-out"
                            style={{
                                width: `${((currentStep - 1) / 4) * 100}%`
                            }}
                        ></div>
                    </div>

                    {[
                        { id: 1, label: "เลือกประเภท", icon: Car },
                        { id: 2, label: "อัปโหลดเอกสาร", icon: Camera },
                        { id: 3, label: "ข้อมูลหลักประกัน", icon: Briefcase },
                        { id: 4, label: "ข้อมูลลูกค้า", icon: User },
                        { id: 5, label: "แนะนำสินค้า", icon: Sparkles }
                    ].map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                {/* Circle Step Indicator */}
                                <div className={cn(
                                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-white shadow-sm",
                                    isActive
                                        ? "border-chaiyo-blue text-chaiyo-blue shadow-[0_0_0_4px_rgba(37,99,235,0.1)] scale-110"
                                        : isCompleted
                                            ? "bg-chaiyo-blue border-chaiyo-blue text-white"
                                            : "border-gray-200 text-gray-300"
                                )}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                                </div>

                                {/* Label positioned below */}
                                <div className="absolute top-9 w-24 flex justify-center">
                                    <span className={cn(
                                        "text-[10px] md:text-xs font-bold text-center transition-colors whitespace-nowrap",
                                        isActive ? "text-chaiyo-blue" : isCompleted ? "text-gray-800" : "text-gray-400"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* STEP 1: Type Selection (Redesigned) */}
            {currentStep === 1 && (
                <div className="max-w-5xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-chaiyo-blue fill-current" />
                            <h2 className="text-2xl font-bold text-gray-800">เลือกประเภทหลักประกัน</h2>
                        </div>
                        <p className="text-gray-500 pl-8">กรุณาเลือกประเภททรัพย์สินที่ต้องการใช้เป็นหลักประกัน</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRODUCTS.map((p) => {
                            const Icon = p.icon;
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        setFormData({ ...formData, collateralType: p.id });
                                        setTimeout(nextStep, 200);
                                    }}
                                    className={cn(
                                        "cursor-pointer bg-white rounded-2xl border transition-all p-8 flex flex-col items-center justify-center gap-4 hover:shadow-xl group relative overflow-hidden h-[240px]",
                                        formData.collateralType === p.id
                                            ? "border-chaiyo-blue ring-2 ring-chaiyo-blue/20"
                                            : "border-gray-200 hover:border-chaiyo-blue/30"
                                    )}
                                >
                                    <div className={cn(
                                        "w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                                        p.color
                                    )}>
                                        <Icon className="w-10 h-10" />
                                    </div>
                                    <div className="text-center space-y-2 relative z-10">
                                        <h3 className="font-bold text-xl text-gray-800">{p.label}</h3>
                                        <p className="text-sm text-gray-400">{p.desc}</p>
                                    </div>

                                    {/* Hover Effect Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STEP 2: Upload Documents (Type-specific) */}
            {currentStep === 2 && (() => {
                const docReq = DOCUMENT_REQUIREMENTS[formData.collateralType] || DOCUMENT_REQUIREMENTS.car;
                const selectedProduct = PRODUCTS.find(p => p.id === formData.collateralType);
                const TypeIcon = selectedProduct?.icon || Car;
                return (
                    <div className="max-w-4xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300">
                        {/* Header */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <FileText className="w-6 h-6 text-chaiyo-blue" />
                                <h2 className="text-2xl font-bold text-gray-800">อัปโหลดเอกสารหลักประกัน</h2>
                            </div>
                            <p className="text-gray-500 pl-8">กรุณาอัปโหลด{docReq.name} ({docReq.description})</p>
                        </div>

                        {/* Selected Type Badge */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <TypeIcon className="w-5 h-5 text-chaiyo-blue" />
                                <div>
                                    <p className="text-sm font-bold text-chaiyo-blue">{selectedProduct?.label}</p>
                                    <p className="text-xs text-blue-600">ประเภทหลักประกันที่เลือก</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={prevStep}
                                className="text-chaiyo-blue hover:text-chaiyo-blue/80"
                            >
                                เปลี่ยนประเภท
                            </Button>
                        </div>

                        {/* Upload Zone */}
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-3xl p-16 text-center transition-all relative overflow-hidden",
                                isAnalyzing ? "border-chaiyo-blue bg-blue-50/10 cursor-wait" : "border-chaiyo-blue/30 bg-blue-50/20 hover:bg-blue-50/50 cursor-pointer group"
                            )}
                            onClick={!isAnalyzing ? handleAnalyze : undefined}
                        >
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300 py-8">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-chaiyo-blue/20 animate-spin"></div>
                                        <div className="absolute inset-0 border-4 border-chaiyo-blue border-t-transparent rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-chaiyo-gold animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-lg font-bold text-chaiyo-blue">AI กำลังอ่านข้อมูลจากเอกสาร...</h4>
                                        <p className="text-sm text-blue-600 mt-1">ระบบกำลังดึงข้อมูลเพื่อกรอกอัตโนมัติ</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-6">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-10 h-10 text-chaiyo-blue" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-chaiyo-blue">คลิกเพื่ออัปโหลด{docReq.name}</h4>
                                    <p className="text-muted text-sm max-w-md mx-auto">{docReq.description}</p>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.JPG</span>
                                        <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.PNG</span>
                                        <span className="text-xs bg-white px-3 py-1.5 rounded-md border border-gray-200 text-gray-500">.PDF</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentStep(3)}
                                className="text-gray-400 hover:text-chaiyo-blue hover:bg-transparent"
                            >
                                ข้ามการอัปโหลดเอกสาร
                            </Button>
                        </div>
                    </div>
                );
            })()}


            {/* STEP 3: Verify Info & Result Preview */}
            {
                currentStep === 3 && (
                    <div className="max-w-6xl mx-auto print:hidden animate-in slide-in-from-right-8 duration-300 pb-20">

                        {/* Page Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-6 h-6 text-chaiyo-blue" />
                                <h2 className="text-2xl font-bold text-gray-800">ข้อมูลหลักประกัน</h2>
                            </div>
                            <p className="text-gray-500 pl-8">ตรวจสอบและแก้ไขข้อมูลที่ระบบอ่านได้จากเอกสาร</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* LEFT SIDEBAR: Document Preview */}
                            <div className="lg:col-span-3 space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                                        <FileText className="w-4 h-4" /> เอกสารที่อัปโหลด ({uploadedDocs.length})
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        {uploadedDocs.map((doc, index) => (
                                            <div
                                                key={index}
                                                className="group relative aspect-[3/4] cursor-zoom-in rounded-xl overflow-hidden border border-gray-200 hover:border-chaiyo-blue transition-all shadow-sm"
                                                onClick={() => setLightboxIndex(index)}
                                            >
                                                <img
                                                    src={doc}
                                                    alt={`Document ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Eye className="w-6 h-6 text-white drop-shadow-md" />
                                                </div>
                                                <div className="absolute top-1 right-1 bg-green-500/90 text-white p-0.5 rounded-full shadow-sm">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add More Placeholder */}
                                        <div
                                            onClick={handleAddPhoto}
                                            className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-chaiyo-blue hover:text-chaiyo-blue transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px]">เพิ่มรูปภาพ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-600 flex items-start gap-2">
                                    <div className="shrink-0 mt-0.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                    </div>
                                    สามารถคลิกที่รูปภาพเพื่อดูขนาดใหญ่ หรือเพิ่มรูปภาพเพิ่มเติมได้
                                </div>

                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setFormData({ ...formData, collateralType: 'car' }); // Reset minimal
                                            setCurrentStep(1);
                                        }}
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        ล้างข้อมูล / เริ่มใหม่ทั้งหมด
                                    </Button>
                                </div>
                            </div>

                            {/* RIGHT MAIN CONTENT: Form & Summary */}
                            <div className="lg:col-span-9 space-y-8">

                                {/* AI OCR Banner */}
                                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-sm shrink-0">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">ข้อมูลจาก AI OCR</h4>
                                        <p className="text-sm text-purple-600">ระบบได้อ่านและกรอกข้อมูลอัตโนมัติ กรุณาตรวจสอบความถูกต้อง</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                {/* Form Fields — Type-specific (matches CollateralStepNew.tsx) */}
                                {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck') && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ทะเบียนรถ</Label>
                                            <Input value={formData.licensePlate || ''} onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">จังหวัด</Label>
                                            <Input value={formData.province || ''} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ยี่ห้อ</Label>
                                            <Combobox options={CAR_BRANDS} value={formData.brand} onValueChange={(val) => setFormData({ ...formData, brand: val })} placeholder="เลือกยี่ห้อ..." searchPlaceholder="ค้นหายี่ห้อ..." emptyText="ไม่พบยี่ห้อที่ค้นหา" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">รุ่น</Label>
                                            <Combobox options={CAR_MODELS} value={formData.model} onValueChange={(val) => setFormData({ ...formData, model: val })} placeholder="เลือกรุ่น..." searchPlaceholder="ค้นหารุ่น..." emptyText="ไม่พบรุ่นที่ค้นหา" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ปี</Label>
                                            <Combobox options={YEARS} value={formData.year} onValueChange={(val) => setFormData({ ...formData, year: val })} placeholder="เลือกปี..." searchPlaceholder="ค้นหาปี..." emptyText="ไม่พบปีที่ค้นหา" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">สี</Label>
                                            <Input value={formData.color || ''} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขเครื่องยนต์</Label>
                                            <Input value={formData.engineNumber || ''} onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขตัวถัง</Label>
                                            <Input value={formData.chassisNumber || ''} onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <Label className="text-gray-500">สถานะทางกฎหมาย</Label>
                                            <Select value={formData.legalStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, legalStatus: val })}>
                                                <SelectTrigger className="h-12 bg-white w-full"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                    <SelectItem value="pledge">จำนำ</SelectItem>
                                                    <SelectItem value="hire_purchase">เช่าซื้อ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {formData.collateralType === 'agri' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ยี่ห้อ</Label>
                                            <Input value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">รุ่น</Label>
                                            <Input value={formData.model || ''} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ปี</Label>
                                            <Input value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">หมายเลขเครื่อง/Serial Number</Label>
                                            <Input value={formData.serialNumber || ''} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <Label className="text-gray-500">สถานะทางกฎหมาย</Label>
                                            <Select value={formData.legalStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, legalStatus: val })}>
                                                <SelectTrigger className="h-12 bg-white w-full"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                    <SelectItem value="pledge">จำนำ</SelectItem>
                                                    <SelectItem value="hire_purchase">เช่าซื้อ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {formData.collateralType === 'land' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขที่โฉนด</Label>
                                            <Input value={formData.deedNumber || ''} onChange={(e) => setFormData({ ...formData, deedNumber: e.target.value })} className="bg-white h-12 font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">เลขที่ดิน</Label>
                                            <Input value={formData.landNumber || ''} onChange={(e) => setFormData({ ...formData, landNumber: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">หน้าสำรวจ</Label>
                                            <Input value={formData.surveyNumber || ''} onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">ตำบล/แขวง</Label>
                                            <Input value={formData.tambon || ''} onChange={(e) => setFormData({ ...formData, tambon: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">อำเภอ/เขต</Label>
                                            <Input value={formData.amphoe || ''} onChange={(e) => setFormData({ ...formData, amphoe: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-500">จังหวัด</Label>
                                            <Input value={formData.province || ''} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="bg-white h-12" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-gray-500">เนื้อที่ (ไร่-งาน-ตารางวา)</Label>
                                            <Input value={formData.area || ''} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="bg-white h-12 font-mono" placeholder="2-0-50" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-gray-500">สถานะทางกฎหมาย</Label>
                                            <Select value={formData.legalStatus || 'pledge_clear'} onValueChange={(val) => setFormData({ ...formData, legalStatus: val })}>
                                                <SelectTrigger className="h-12 bg-white w-full"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pledge_clear">จำนำ (ปลอดภาระ)</SelectItem>
                                                    <SelectItem value="pledge_refinance">จำนำ (Refinance)</SelectItem>
                                                    <SelectItem value="mortgage_clear">จำนอง (ปลอดภาระ)</SelectItem>
                                                    <SelectItem value="mortgage_refinance">จำนอง (Refinance)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {/* Loan Summary Limit Card */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
                                    <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-4">
                                        <Sparkles className="w-5 h-5 text-chaiyo-blue" />
                                        <h3 className="font-bold text-gray-800">สรุปวงเงินกู้สูงสุด (Maximum Loan Limit)</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-gray-600">ราคาประเมิน (Appraisal Price)</span>
                                                <span className="text-xs text-blue-500 mt-0.5">
                                                    {formData.collateralType === 'land' ? '*อ้างอิงจากราคาประเมินราชการ' : '*อ้างอิงจากข้อมูลราคากลาง Redbook'}
                                                </span>
                                            </div>
                                            <span className="font-bold text-gray-800 text-lg">
                                                {Number(formData.appraisalPrice || 0).toLocaleString()} บาท
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end pt-4 gap-4">

                                    <Button onClick={nextStep} className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white min-w-[150px] h-12 shadow-lg shadow-chaiyo-blue/20">
                                        ถัดไป <ChevronLeft className="w-5 h-5 rotate-180 ml-2" />
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }

            {/* STEP 4: Customer Info (Occupation & Income) */}
            {currentStep === 4 && (
                <div className="max-w-4xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300">
                    {/* Header */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="w-6 h-6 text-chaiyo-blue" />
                            <h2 className="text-2xl font-bold text-gray-800">ข้อมูลลูกค้า</h2>
                        </div>
                        <p className="text-gray-500 pl-8">กรุณากรอกข้อมูลอาชีพและรายได้ของลูกค้า</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-6">
                        {/* Occupation */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-chaiyo-blue" />
                                อาชีพ
                            </Label>
                            <Select
                                value={formData.occupation || ''}
                                onValueChange={(val) => setFormData((prev: any) => ({ ...prev, occupation: val }))}
                            >
                                <SelectTrigger className="h-12 bg-white border-gray-200">
                                    <SelectValue placeholder="เลือกอาชีพ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employee">พนักงานบริษัท</SelectItem>
                                    <SelectItem value="government">ข้าราชการ / พนักงานรัฐวิสาหกิจ</SelectItem>
                                    <SelectItem value="business">ธุรกิจส่วนตัว / เจ้าของกิจการ</SelectItem>
                                    <SelectItem value="freelance">รับจ้างอิสระ / ฟรีแลนซ์</SelectItem>
                                    <SelectItem value="farmer">เกษตรกร</SelectItem>
                                    <SelectItem value="retired">เกษียณ</SelectItem>
                                    <SelectItem value="other">อื่นๆ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Occupation Detail (conditional) */}
                        {formData.occupation === 'other' && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">ระบุอาชีพ</Label>
                                <Input
                                    placeholder="กรุณาระบุอาชีพ"
                                    value={formData.occupationDetail || ''}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, occupationDetail: e.target.value }))}
                                    className="h-12 bg-white border-gray-200"
                                />
                            </div>
                        )}

                        {/* Workplace */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">สถานที่ทำงาน / ชื่อกิจการ</Label>
                            <Input
                                placeholder="เช่น บริษัท ABC จำกัด"
                                value={formData.workplace || ''}
                                onChange={(e) => setFormData((prev: any) => ({ ...prev, workplace: e.target.value }))}
                                className="h-12 bg-white border-gray-200"
                            />
                        </div>

                        {/* Divider */}
                        {/* Income & Expense Section Hidden for Sales Talk Flow
                        <div className="border-t border-gray-100 pt-4">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                                <Banknote className="w-4 h-4 text-emerald-600" />
                                ข้อมูลรายได้
                            </Label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">รายได้ต่อเดือน (บาท)</Label>
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={formData.monthlyIncome ? Number(formData.monthlyIncome).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/,/g, '');
                                            if (!isNaN(Number(value))) {
                                                setFormData((prev: any) => ({ ...prev, monthlyIncome: Number(value) }));
                                            }
                                        }}
                                        className="h-12 bg-white border-gray-200 text-right text-lg font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">รายได้อื่นๆ ต่อเดือน (บาท)</Label>
                                    <Input
                                        type="text"
                                        placeholder="0"
                                        value={formData.otherIncome ? Number(formData.otherIncome).toLocaleString() : ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/,/g, '');
                                            if (!isNaN(Number(value))) {
                                                setFormData((prev: any) => ({ ...prev, otherIncome: Number(value) }));
                                            }
                                        }}
                                        className="h-12 bg-white border-gray-200 text-right text-lg font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm text-gray-600">ภาระหนี้สินต่อเดือน (บาท)</Label>
                            <Input
                                type="text"
                                placeholder="0"
                                value={formData.monthlyExpense ? Number(formData.monthlyExpense).toLocaleString() : ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, '');
                                    if (!isNaN(Number(value))) {
                                        setFormData((prev: any) => ({ ...prev, monthlyExpense: Number(value) }));
                                    }
                                }}
                                className="h-12 bg-white border-gray-200 text-right text-lg font-semibold"
                            />
                            <p className="text-xs text-gray-400">รวมค่างวดรถ, บ้าน, บัตรเครดิต, สินเชื่อส่วนบุคคล ฯลฯ</p>
                        </div>
                        */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button variant="ghost" onClick={prevStep} className="text-gray-500 h-12">
                            <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                        </Button>
                        <Button onClick={nextStep} className="bg-chaiyo-blue hover:bg-chaiyo-blue/90 text-white min-w-[150px] h-12 shadow-lg shadow-chaiyo-blue/20">
                            ถัดไป <ChevronLeft className="w-5 h-5 rotate-180 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 5: Product Suggestion */}
            {currentStep === 5 && (() => {
                const ltvRate = formData.collateralType === 'land' ? 0.7 : 0.9;
                const maxLoan = Math.max(0, Math.floor((formData.appraisalPrice || 0) * ltvRate) - (Number(formData.existingDebt) || 0));
                const selectedProduct = PRODUCTS.find(p => p.id === formData.collateralType);
                const TypeIcon = selectedProduct?.icon || Car;

                // Unified interest rate: 23.99% per year for all types
                const annualRate = 0.2399;
                const monthlyRate = annualRate / 12;

                // Determine loan product name
                const loanProduct = (() => {
                    switch (formData.collateralType) {
                        case 'land': return { name: 'สินเชื่อโฉนดที่ดิน', tagline: 'สินเชื่อโฉนดที่ดินไชโย' };
                        case 'moto': return { name: 'สินเชื่อรถจักรยานยนต์', tagline: 'สินเชื่อรถจักรยานยนต์ไชโย' };
                        case 'truck': return { name: 'สินเชื่อรถบรรทุก', tagline: 'สินเชื่อรถบรรทุกไชโย' };
                        case 'agri': return { name: 'สินเชื่อรถเพื่อการเกษตร', tagline: 'สินเชื่อรถเพื่อการเกษตรไชโย' };
                        default: return { name: 'สินเชื่อรถยนต์', tagline: 'สินเชื่อรถยนต์ไชโย' };
                    }
                })();

                // Monthly installment calculation (amortization)
                const calcMonthly = (principal: number, months: number) => {
                    if (principal <= 0 || months <= 0) return 0;
                    return Math.ceil(principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
                };

                // Balloon payment calculation (interest-only monthly + lump sum at end)
                const calcBalloonMonthly = (principal: number) => {
                    return Math.ceil(principal * monthlyRate);
                };

                const exampleMonths = [12, 24, 36, 48, 60];

                // Document checklist per collateral type & plan
                type SectionGroup = { title: string; items: string[] };
                const documentChecklist: { label: string; items: (string | SectionGroup)[] } = (() => {
                    const common = [
                        'บัตรประชาชนตัวจริง (ผู้กู้)',
                        'ทะเบียนบ้าน (สำเนา)',
                        'รูปถ่ายหน้าตรงคู่บัตรประชาชน',
                    ];

                    const isVehicle = ['car', 'moto', 'truck'].includes(formData.collateralType || '');

                    if (isVehicle) {
                        return {
                            label: `เอกสารสำหรับ${loanProduct.name} (${selectedPlan === 'monthly' ? 'ผ่อนรายเดือน' : 'One-Time'})`,
                            items: [
                                {
                                    title: "ยืนยันตัวตน",
                                    items: [
                                        "สำเนาบัตรประชาชน ผู้กู้",
                                        "สำเนาบัตรประชาชน ผู้ค้ำประกัน (ถ้ามี)",
                                        "ใบเปลี่ยนชื่อ-นามสกุล ผู้กู้ (ถ้ามี)"
                                    ]
                                },
                                {
                                    title: "ตรวจสอบหลักประกัน / รูปถ่ายหลักประกัน (Time Stamp)",
                                    items: [
                                        "รูปหลังรถเห็นป้ายทะเบียน พร้อม เซลฟี่-ถือบัตรพนักงาน",
                                        "รูปหน้ารถ เห็นป้ายทะเบียน / เปิดกระโปงหน้า + เห็นเครื่องยนต์",
                                        "รูปหน้ารถ - เฉียงซ้าย45องศา",
                                        "รูปหน้ารถ - เฉียงขวา45องศา",
                                        "รูปหลังรถ - เฉียงซ้าย45องศา",
                                        "รูปหลังรถ - เฉียงขวา45องศา",
                                        "รูปภายในรถ + เห็นคอนโซล + เกียร์รถ",
                                        "รูปเลขตัวถัง/คัสซี",
                                        formData.collateralType === 'truck' ? "รูปเกียร์ 4x4 / 4WD (ถ้ามี)_สำหรับรถกระบะที่ขับเคลื่อน 4ล้อ" : null
                                    ].filter(Boolean) as string[]
                                },
                                {
                                    title: "หลักประกัน / เล่มทะเบียน เอกสารตรวจหลักประกัน (Time Stamp)",
                                    items: [
                                        "รูปถ่ายเล่มทะเบียน หน้าปก",
                                        "รูปถ่ายเล่มทะเบียน หน้ารายการจดทะเบียน",
                                        "รูปถ่ายเล่มทะเบียน หน้ากลางเล่ม",
                                        "รูปถ่ายเล่มทะเบียน หน้ารายการภาษี",
                                        "รูปถ่ายเล่มทะเบียน หน้าบันทึกเจ้าหน้าที่",
                                        "ผลเช็คต้น (ตามเงื่อนไข)",
                                        "หน้าตรวจสอบการชำระภาษีจากเว็ปกรมการขนส่งทางบก"
                                    ]
                                },
                                {
                                    title: "พิจารณาอนุมัติสินเชื่อ",
                                    items: [
                                        "สำเนาสมุดคู่ฝากธนาคารเพื่อใช้ในการโอนเงิน (บัญชีของลูกค้าเท่านั้น)",
                                        "ใบประเมินความสามารถลูกค้า (ผ่าน Branch App)",
                                        "แบบฟอร์มตรวจที่พักอาศัย (ถ้ามี)",
                                        "อีเมลผล ABC (ถ้ามี)"
                                    ]
                                },
                                {
                                    title: "รายได้",
                                    items: [
                                        "แบบฟอร์มประเมินรายได้ ผู้กู้",
                                        "แบบฟอร์มประเมินรายได้ ผู้ค้ำ (ถ้ามี)",
                                        "เอกสารรายได้ ของผู้กู้ (สลิปเงินเดือน, Bank Statement หรือ เอกสารอื่นๆ ที่แสดงให้เห็นรายได้ชัดเจน เช่น ใบประทวน, ใบเสร็จซื้อขายพืชผลทางการเกษตร, สัญญาว่าจ้าง เป็นต้น)",
                                        "เอกสารรายได้ ของผู้ค้ำ (ถ้ามี) (สลิปเงินเดือน, Bank Statement หรือ เอกสารอื่นๆ ที่แสดงให้เห็นรายได้ชัดเจน เช่น ใบประทวน, ใบเสร็จซื้อขายพืชผลทางการเกษตร, สัญญาว่าจ้าง เป็นต้น)",
                                        "แบบฟอร์มตรวจสอบภาคสนาม และข้อมูลบุคคลอ้างอิง (กรณีไม่มีเอกสารแสดงรายได้)"
                                    ]
                                },
                                {
                                    title: "เอกสารยืนยันการประกอบอาชีพ",
                                    items: [
                                        "รูปถ่ายกิจการ ของผู้กู้ (Time Stamp)",
                                        "รูปถ่ายกิจการ ของผู้ค้ำ (ถ้ามี) (Time Stamp)"
                                    ]
                                },
                                {
                                    title: "เอกสารอนุโลม",
                                    items: [
                                        "อนุโลม ผู้กู้ทำหรือไม่ทำประกัน ( PA Safty Loan) / ประกันภัยรถยนต์"
                                    ]
                                }
                            ]
                        };
                    }

                    switch (formData.collateralType) {
                        case 'agri':
                            return {
                                label: 'เอกสารสำหรับสินเชื่อเครื่องจักรเกษตร',
                                items: [
                                    ...common,
                                    'เล่มทะเบียนเครื่องจักร หรือ ใบอินวอยซ์/ใบเสร็จซื้อขาย',
                                    'รูปถ่ายเครื่องจักร (4 ด้าน)',
                                    'หลักฐานการครอบครอง',
                                ]
                            };
                        case 'land':
                            return {
                                label: 'เอกสารสำหรับสินเชื่อโฉนดที่ดิน',
                                items: [
                                    ...common,
                                    'โฉนดที่ดิน (ตัวจริง)',
                                    'รูปถ่ายที่ดิน (ภาพรวม + 4 ด้าน)',
                                    'แผนที่ที่ตั้งที่ดิน / Google Maps Pin',
                                    'หนังสือยินยอมคู่สมรส (ถ้ามี)',
                                ]
                            };
                        default:
                            return { label: 'เอกสารที่ต้องใช้', items: common };
                    }
                })();

                return (
                    <div className="max-w-6xl mx-auto print:hidden space-y-8 animate-in slide-in-from-right-8 duration-300 pb-20">
                        {/* Header */}
                        <div className="space-y-1">

                            <h2 className="text-2xl font-bold text-gray-800">ผลิตภัณฑ์ที่แนะนำ</h2>
                            <p className="text-gray-500">เลือกผลิตภัณฑ์ที่เหมาะสมกับลูกค้าเพื่อดูรายการเอกสารที่ต้องใช้</p>
                        </div>

                        <Tabs
                            defaultValue="monthly"
                            value={selectedPlan}
                            onValueChange={(val) => setSelectedPlan(val as 'monthly' | 'balloon')}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-gray-100 p-1.5 rounded-2xl">
                                <TabsTrigger
                                    value="monthly"
                                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-sm text-gray-500 font-bold h-full text-base transition-all"
                                >
                                    ผ่อนชำระรายเดือน
                                </TabsTrigger>
                                <TabsTrigger
                                    value="balloon"
                                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-gray-500 font-bold h-full text-base transition-all"
                                >
                                    โปะงวดท้าย (One-Time)
                                </TabsTrigger>
                            </TabsList>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                {/* Column 1: Product Card */}
                                <div>
                                    <TabsContent value="monthly" className="mt-0 animate-in fade-in zoom-in-95 duration-300">
                                        {/* Option 1: Monthly Installment */}
                                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg shadow-blue-100 relative group w-full">
                                            {/* Header - Product & Key Figures */}
                                            <div className="p-6 text-white relative overflow-hidden transition-colors bg-gradient-to-r from-chaiyo-blue to-blue-600">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{loanProduct.tagline}</p>
                                                            <div className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold backdrop-blur-sm border border-white/10">
                                                                {selectedProduct?.label}
                                                            </div>
                                                        </div>
                                                        <h3 className="text-2xl font-bold">ผ่อนชำระรายเดือน</h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white/80 text-xs">วงเงินสูงสุด</p>
                                                        <div className="flex items-baseline gap-1 justify-end">
                                                            <span className="text-3xl font-bold">{maxLoan.toLocaleString()}</span>
                                                            <span className="text-sm">บาท</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Key Stats Bar */}
                                                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10">
                                                    <div>
                                                        <p className="text-white/70 text-xs">ดอกเบี้ย</p>
                                                        <p className="font-bold">23.99% <span className="text-[10px] font-normal opacity-75">ต่อปี</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 text-xs">ราคาประเมิน</p>
                                                        <p className="font-bold">{Number(formData.appraisalPrice || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 text-xs">LTV</p>
                                                        <p className="font-bold">{formData.collateralType === 'land' ? '70%' : '90%'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Method Details */}
                                            <div className="p-6 bg-white">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-blue-50">
                                                        <PiggyBank className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg text-gray-800">ชำระแบบผ่อนรายเดือน</h4>
                                                        <p className="text-xs text-gray-500">ผ่อนเท่ากันทุกงวด นานสูงสุด 60 เดือน</p>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                    <p className="text-xs font-medium text-gray-500 mb-3">ตัวอย่างค่างวด (Estimated Installment)</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                        {exampleMonths.map((m) => (
                                                            <div key={m} className="bg-white p-3 rounded-lg border border-gray-200 text-center shadow-sm">
                                                                <div className="text-xs text-gray-400 mb-1">{m} เดือน</div>
                                                                <div className="font-bold text-[13px] text-chaiyo-blue">{calcMonthly(maxLoan, m).toLocaleString()}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Bundle Deal Inside Monthly Card */}
                                                <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

                                                    <div className="flex items-start gap-4 relative z-10">
                                                        <div className="shrink-0">
                                                            <img
                                                                src="/images/chaiyo-card.svg"
                                                                alt="Chaiyo Card"
                                                                className="w-28 h-auto shadow-sm rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h5 className="font-bold text-gray-800 text-sm">รับฟรี! บัตรเงินไชโย</h5>
                                                                <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                    <Gift className="w-2.5 h-2.5" /> Bundle
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                                วงเงินหมุนเวียนพร้อมใช้ จ่ายเงินต้นไปแล้วเท่าไร กดใช้เพิ่มได้เท่านั้น ไม่มีค่าธรรมเนียม
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons for Monthly Plan */}
                                                <div className="mt-6 grid grid-cols-2 gap-3">
                                                    <Button
                                                        onClick={handleCreateApplication}
                                                        className="w-full h-12 gap-2 bg-chaiyo-blue hover:bg-chaiyo-blue/90 shadow-lg shadow-chaiyo-blue/20 text-white rounded-xl"
                                                    >
                                                        สร้างใบคำขอสินเชื่อ
                                                    </Button>
                                                    <Button
                                                        onClick={handlePrint}
                                                        variant="outline"
                                                        className="w-full h-12 gap-2 border-chaiyo-blue/20 text-chaiyo-blue hover:bg-blue-50 hover:border-chaiyo-blue/40 rounded-xl"
                                                    >
                                                        <Printer className="w-4 h-4" /> พิมพ์ Salesheets
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="balloon" className="mt-0 animate-in fade-in zoom-in-95 duration-300">
                                        {/* Option 2: Balloon Payment */}
                                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg shadow-amber-100 relative group w-full">
                                            {/* Header - Product & Key Figures (Amber Variant) */}
                                            <div className="p-6 text-white relative overflow-hidden transition-colors bg-gradient-to-r from-amber-500 to-orange-600">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{loanProduct.tagline}</p>
                                                            <div className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold backdrop-blur-sm border border-white/10">
                                                                {selectedProduct?.label}
                                                            </div>
                                                        </div>
                                                        <h3 className="text-2xl font-bold">โปะงวดท้าย (One-Time)</h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white/80 text-xs">วงเงินสูงสุด</p>
                                                        <div className="flex items-baseline gap-1 justify-end">
                                                            <span className="text-3xl font-bold">{maxLoan.toLocaleString()}</span>
                                                            <span className="text-sm">บาท</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Key Stats Bar */}
                                                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10">
                                                    <div>
                                                        <p className="text-white/70 text-xs">ดอกเบี้ย</p>
                                                        <p className="font-bold">23.99% <span className="text-[10px] font-normal opacity-75">ต่อปี</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 text-xs">ราคาประเมิน</p>
                                                        <p className="font-bold">{Number(formData.appraisalPrice || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 text-xs">LTV</p>
                                                        <p className="font-bold">{formData.collateralType === 'land' ? '70%' : '90%'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Method Details */}
                                            <div className="p-6 bg-white">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-amber-50">
                                                        <Star className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg text-gray-800">โปะงวดท้าย (One-Time)</h4>
                                                        <p className="text-xs text-gray-500">ผ่อนสบาย จ่ายเฉพาะดอกเบี้ย แล้วปิดงวดยอดสุดท้าย</p>
                                                    </div>
                                                </div>

                                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 space-y-3">
                                                    <div className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-amber-100 shadow-sm">
                                                        <span className="text-gray-600">ผ่อนชำระต่อเดือน (เฉพาะดอกเบี้ย)</span>
                                                        <span className="font-bold text-amber-700 text-lg">{calcBalloonMonthly(maxLoan).toLocaleString()} บาท</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm px-2">
                                                        <span className="text-gray-500 text-xs">เงินต้นคงเหลือ (ชำระงวดสุดท้าย)</span>
                                                        <span className="font-semibold text-gray-700">{maxLoan.toLocaleString()} บาท</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons for Balloon Plan */}
                                                <div className="mt-6 grid grid-cols-2 gap-3">
                                                    <Button
                                                        onClick={handleCreateApplication}
                                                        className="w-full h-12 gap-2 bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 text-white rounded-xl"
                                                    >
                                                        สร้างใบคำขอสินเชื่อ
                                                    </Button>
                                                    <Button
                                                        onClick={handlePrint}
                                                        variant="outline"
                                                        className="w-full h-12 gap-2 border-amber-500/20 text-amber-600 hover:bg-amber-50 hover:border-amber-500/40 rounded-xl"
                                                    >
                                                        <Printer className="w-4 h-4" /> พิมพ์ Salesheets
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>

                                {/* Column 2: Document Checklist */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm animate-in fade-in duration-500 h-full">
                                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{documentChecklist.label}</h3>
                                            <p className="text-xs text-gray-500">เอกสารที่ต้องใช้สำหรับ: <span className="font-semibold text-chaiyo-blue">{selectedPlan === 'monthly' ? 'แบบผ่อนรายเดือน' : 'แบบโปะงวดท้าย (One-Time)'}</span></p>
                                        </div>
                                    </div>
                                    {typeof documentChecklist.items[0] === 'string' ? (
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                                            {(documentChecklist.items as string[]).map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-3 py-2 px-3">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-chaiyo-blue shrink-0" />
                                                    <span className="text-sm text-gray-700 leading-snug whitespace-pre-line">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {(documentChecklist.items as SectionGroup[]).map((section, idx) => (
                                                <div key={idx}>
                                                    <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-4 bg-chaiyo-blue rounded-full"></div>
                                                        {section.title}
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 pl-2">
                                                        {section.items.map((subItem, subIdx) => (
                                                            <div key={subIdx} className="flex items-start gap-2.5 py-1">
                                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                                                                <span className="text-sm text-gray-600 leading-snug">{subItem}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-gray-100 mt-auto">
                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            เอกสารที่แนะนำนี้สร้างขึ้นจากข้อมูลที่ได้รับโดยอัตโนมัติ สามารถปรับเปลี่ยนได้ตามเงื่อนไขของสาขา
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Tabs>

                        {/* Actions Bar */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                className="w-full md:w-auto px-6 h-12 text-gray-500 hover:text-gray-900 border-gray-300 bg-white"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                กลับไปแก้ไขข้อมูล
                            </Button>
                        </div>
                    </div>
                );
            })()}

            {/* Hidden Print Component */}
            <QuotationPrint
                data={{
                    collateralType: formData.collateralType,
                    estimatedValue: formData.appraisalPrice,
                    loanAmount: formData.requestedAmount,
                    duration: formData.requestedDuration,
                    monthlyPayment: formData.estimatedMonthlyPayment || 0,
                    interestRate: formData.interestRate || 0.2399,
                    totalInterest: formData.totalInterest || 0,
                    // Vehicle
                    brand: formData.brand,
                    model: formData.model,
                    year: formData.year,
                    // Land
                    landRai: formData.landRai,
                    landNgan: formData.landNgan,
                    landWah: formData.landWah,
                    province: formData.province,
                    // Finance
                    paymentMethod: formData.paymentMethod,
                    income: formData.income,
                    monthlyDebt: formData.monthlyDebt,
                    occupation: formData.occupation
                }}
            />
            {/* Lightbox / Gallery View */}
            {
                lightboxIndex !== null && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation */}
                        {uploadedDocs.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null ? (prev - 1 + uploadedDocs.length) % uploadedDocs.length : 0);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <ChevronLeft className="w-10 h-10" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxIndex(prev => prev !== null ? (prev + 1) % uploadedDocs.length : 0);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <ChevronRight className="w-10 h-10" />
                                </button>
                            </>
                        )}

                        {/* Main Image */}
                        <img
                            src={uploadedDocs[lightboxIndex]}
                            alt={`Document ${lightboxIndex + 1}`}
                            className="max-h-[80vh] max-w-full object-contain shadow-2xl rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                            {uploadedDocs.map((doc, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className={cn(
                                        "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                                        idx === lightboxIndex ? "border-white scale-110 shadow-lg ring-2 ring-white/20" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={doc} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="absolute top-4 left-4 text-white/80 font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                            {lightboxIndex + 1} / {uploadedDocs.length}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
