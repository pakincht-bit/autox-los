"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(
    () => import('@/components/ui/PdfViewer').then((mod) => mod.PdfViewer),
    { ssr: false }
);

import { QuotationPrint } from "@/components/calculator/QuotationPrint";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ChevronLeft, Printer, FileText, PiggyBank, Briefcase, Car, Camera, Check, Sparkles, Bike, Truck, Tractor, Map, Upload, Eye, X, ChevronRight, Plus, CreditCard, Gift, Shield, Percent, ArrowRight, Star, User, Banknote, ShieldCheck } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
    CAR_BRANDS,
    MOTO_BRANDS,
    TRUCK_BRANDS,
    AGRI_BRANDS,
    MODELS_BY_BRAND,
    SUB_MODELS_BY_MODEL,
    YEARS
} from "@/data/vehicle-data";
import { toast } from "sonner";

function PreQuestionPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1;

    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'balloon'>('monthly');
    // Local state for "Sales Talk"
    const [formData, setFormData] = useState<any>({
        collateralType: 'car',
        appraisalPrice: 0,
        income: 0,
        // New Preliminary Fields
        loanPurpose: '',
        requestedAmount: '',
        collateralStatus: '',
        occupationGroup: '',
        jobTitle: '',
        salary: '',
        otherIncome: '',
        monthlyDebt: '',
        specialProject: 'none',
        borrowerAge: '',
        collateralCondition: 'yes',
        brand: '',
        model: '',
        subModel: '',
        year: '',
        aiPrice: 0,
        redbookPrice: 0,
        aiDetectedData: null,

        nationality: '',
        // Defaults for CalculatorStep
        requestedDuration: 24,

        // Collateral Questions
        collateralQuestions: {},
        isSalesheetRead: false,
    });

    // Step 1: Preliminary Questionnaire (Inc. Collateral Type)
    // Step 2: Upload / Analyze
    // Step 3: Info
    // Step 4: Calculate (Result)
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiDetectedFields, setAiDetectedFields] = useState<string[]>([]);
    const [isFetchingRedbook, setIsFetchingRedbook] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('preQuestionState');
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
                console.error("Failed to load pre-question state", e);
            }
        }
    }, [searchParams]);

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem('preQuestionState', JSON.stringify({
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
            `https://placehold.co/600x800/e2e8f0/1e293b?text=${encodeURIComponent(formData.collateralType === 'car' ? 'Car Front' : formData.collateralType === 'moto' ? 'Moto Side' : 'Document')}+${prev.length + 1}`
        ]);
    };

    const handleRemovePhoto = (idx: number) => {
        setUploadedDocs(prev => prev.filter((_, i) => i !== idx));
    };

    // Enhanced Product List for UI Design
    const PRODUCTS = [
        {
            id: "car",
            label: "รถเก๋ง / รถกระบะ / รถตู้",
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

    // Mock Questions for Collateral Assessment
    const COLLATERAL_QUESTIONS: Record<string, { id: string; text: string }[]> = {
        car: [
            { id: 'q1', text: 'มีการดัดแปลงสภาพรถหรือไม่?' },
            { id: 'q2', text: 'มีประวัติอุบัติเหตุหนักหรือไม่?' },
            { id: 'q3', text: 'เล่มทะเบียนมีผู้ครอบครองมากกว่า 1 คนหรือไม่?' },
        ],
        moto: [
            { id: 'q1', text: 'มีการดัดแปลงสภาพรถหรือไม่?' },
            { id: 'q2', text: 'รถใช้งานรับจ้างสาธารณะหรือไม่?' },
        ],
        truck: [
            { id: 'q1', text: 'มีการดัดแปลงต่อเติมกระบะ/โครงเหล็กหรือไม่?' },
            { id: 'q2', text: 'รถวิ่งงานข้ามจังหวัดเป็นหลักหรือไม่?' },
        ],
        agri: [
            { id: 'q1', text: 'เครื่องจักรมีการใช้งานหนักต่อเนื่องหรือไม่?' },
            { id: 'q2', text: 'มีอุปกรณ์ต่อพ่วงครบชุดหรือไม่?' },
        ],
        land: [
            { id: 'm', text: 'ที่ดินตาบอด, ที่ดินติดคลองติดลำธารที่ไม่ติดถนนสาธารณะ' },
            { id: 'n', text: 'ที่ดินติดหรือเป็น สถานที่ศักดิ์สิทธิ์ วัด ศาลเจ้า โรงเรียน' },
            { id: 'o', text: 'ที่ดินติดหรือเป็น สุสาน ป่าช้า บ่อขยะ' },
            { id: 'p', text: 'ที่ดินติดเขตกรรถไฟ' },
            { id: 'q', text: 'ที่ดินที่มีบ่อน้ำกินพื้นที่ตั้งแต่ 40% ขึ้นไป' },
            { id: 'r', text: 'ที่ดินรกร้าง, ห่างไกลชุมชน เช่น ห่างจากอำเภอเมือง หรือหัวเมืองใหญ่ หรือที่ดินรอบข้างไม่ใช่ที่ทำกิน และที่อยู่อาศัย' },
        ],
    };

    const handlePrint = () => {
        let pdfPath = "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
        if (formData.collateralType === 'land') {
            pdfPath = "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf";
        }
        window.open(pdfPath, '_blank');
    };

    const handleCreateApplication = () => {
        // Just move to the consent step within this page
        setCurrentStep(4);
    };

    const handleProceedToApplication = () => {
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
                mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', mileage: 85000, subModel: 'HEV Premium' };
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

    const { setBreadcrumbs, setRightContent } = useSidebar();

    useEffect(() => {
        setBreadcrumbs([
            { label: "รายการคำขอ", href: "/dashboard/applications" },
            { label: "แนะนำผลิตภัณฑ์", isActive: true }
        ]);
        return () => {
            setBreadcrumbs([]);
            setRightContent(null);
        };
    }, [setBreadcrumbs, setRightContent]);

    return (
        <div className="h-full">
            <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 pt-6">

                {/* Stepper Indicator (Matching Application Flow) */}
                <div className="flex justify-center items-center mb-16 print:hidden w-full">
                    <div className="relative flex items-center justify-between w-full max-w-2xl px-4 md:px-12">
                        {/* Progress Line */}
                        <div className="absolute left-4 right-4 md:left-12 md:right-12 top-[14px] -translate-y-1/2 h-[2px] bg-gray-200 z-0">
                            <div
                                className="h-full bg-chaiyo-blue transition-all duration-500 ease-in-out"
                                style={{
                                    width: `${((currentStep - 1) / 3) * 100}%`
                                }}
                            ></div>
                        </div>

                        {[
                            { id: 1, label: "แบบสอบถามเบื้องต้น", icon: FileText },
                            { id: 2, label: "สรุปวงเงินประเมิน", icon: Briefcase },
                            { id: 3, label: "แนะนำสินค้า", icon: Sparkles },
                            { id: 4, label: "เอกสารและความยินยอม", icon: ShieldCheck }
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

                {/* STEP 1: Preliminary Questionnaire (New) */}
                {/* STEP 1: Preliminary Questionnaire (New Github Layout) */}
                {currentStep === 1 && (
                    <div className="max-w-4xl mx-auto print:hidden animate-in slide-in-from-right-8 duration-300 pb-20 pt-4">
                        <div className="space-y-1 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">แบบสอบถามเบื้องต้น</h2>
                            <p className="text-gray-500">กรุณากรอกข้อมูลเพื่อประเมินผลิตภัณฑ์สินเชื่อที่เหมาะสม</p>
                        </div>

                        {/* Section 1: Collateral Info */}
                        <div className="relative border-l-[3px] border-gray-200 ml-4 pl-8 pb-12">
                            <div className="absolute -left-[18px] top-0 w-8 h-8 bg-white rounded-full border-[3px] border-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                                1
                            </div>

                            <div className="space-y-6 -mt-1">
                                <h3 className="text-xl font-bold text-gray-900">ข้อมูลหลักประกัน</h3>

                                <div className="space-y-4">
                                    <Label>ประเภทหลักประกัน *</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {PRODUCTS.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    setFormData({ ...formData, collateralType: p.id, brand: '', model: '', year: '', appraisalPrice: 0 });
                                                    setAiDetectedFields([]);
                                                }}
                                                className={cn(
                                                    "flex-1 min-w-[120px] py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all text-center group flex flex-col items-center justify-center gap-2",
                                                    formData.collateralType === p.id
                                                        ? "border-chaiyo-blue bg-blue-50 text-chaiyo-blue shadow-sm"
                                                        : "border-gray-200 bg-white text-gray-600 hover: hover:border-gray-300"
                                                )}
                                            >
                                                <p.icon className={cn("w-6 h-6", formData.collateralType === p.id ? "text-chaiyo-blue" : "text-gray-400 group-hover:text-gray-600")} />
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Photo Upload Area (Card 1) */}
                                    {formData.collateralType === 'car' && (
                                        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                            <div className="p-6 bg-blue-50/30">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">
                                                            อัพโหลดรูปถ่ายหลักประกัน วิเคราะห์โดย AI
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleAddPhoto}
                                                            className="flex items-center gap-2 border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            อัพโหลดรูปภาพ
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleAddPhoto}
                                                            className="flex items-center gap-2 border-chaiyo-blue text-chaiyo-blue hover:bg-blue-50"
                                                        >
                                                            <Camera className="w-4 h-4" />
                                                            เปิดกล้อง
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-4">
                                                    {uploadedDocs.map((doc, idx) => (
                                                        <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 group bg-white shadow-sm">
                                                            <img src={doc} alt={`doc-${idx}`} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => setLightboxIndex(idx)}
                                                                    className="text-white hover:text-blue-200 transition-colors p-1"
                                                                >
                                                                    <Eye className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx); }}
                                                                    className="text-white hover:text-red-300 transition-colors p-1"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                            {isAnalyzing && (
                                                                <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center">
                                                                    <div className="w-full h-0.5 bg-blue-400 absolute top-0 animate-[scan_2s_infinite]" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                </div>

                                                <div className="mt-5 flex justify-end">
                                                    <Button
                                                        size="lg"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsAnalyzing(true);
                                                            setAiDetectedFields([]);
                                                            toast.info("กำลังวิเคราะห์รูปถ่าย...", { duration: 1500 });

                                                            setTimeout(() => {
                                                                let mockData: any = { appraisalPrice: 450000 };
                                                                let fields = ['appraisalPrice', 'brand', 'model', 'year'];

                                                                if (formData.collateralType === 'car') {
                                                                    mockData = { ...mockData, brand: 'Toyota', model: 'Camry', year: '2019', subModel: 'HEV Premium' };
                                                                    fields.push('subModel');
                                                                } else if (formData.collateralType === 'moto') {
                                                                    mockData = { ...mockData, brand: 'Honda', model: 'Wave 125i', year: '2021', appraisalPrice: 35000 };
                                                                } else if (formData.collateralType === 'truck') {
                                                                    mockData = { ...mockData, brand: 'Isuzu', model: 'D-Max', year: '2020', appraisalPrice: 500000 };
                                                                } else if (formData.collateralType === 'agri') {
                                                                    mockData = { ...mockData, brand: 'Kubota', model: 'L5018', year: '2022', appraisalPrice: 600000 };
                                                                }

                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    aiDetectedData: mockData,
                                                                    aiPrice: mockData.appraisalPrice,
                                                                    redbookPrice: 0 // Will be set when user selects from redbook
                                                                }));
                                                                setAiDetectedFields(fields);
                                                                setIsAnalyzing(false);
                                                                toast.success("วิเคราะห์รูปถ่ายสำเร็จ!", {
                                                                    icon: <Sparkles className="w-4 h-4 text-purple-500" />
                                                                });
                                                            }, 1500);
                                                        }}
                                                        disabled={isAnalyzing || uploadedDocs.length === 0}
                                                        className="font-bold"
                                                    >
                                                        {isAnalyzing ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                                กำลังวิเคราะห์...
                                                            </>
                                                        ) : (
                                                            <>วิเคราะห์รูปภาพ</>
                                                        )}
                                                    </Button>
                                                </div>

                                                {/* AI Analysis Result Display (New) */}
                                                {formData.aiDetectedData && (
                                                    <div className="mt-8 pt-6 border-t border-blue-100 flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-top-2 duration-500">
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex items-center gap-2">

                                                                <h4 className="font-bold text-gray-900">ผลการวิเคราะห์โดย AI (AI Result)</h4>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 bg-white/60 p-5 rounded-2xl border border-blue-100/50 shadow-sm">
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ยี่ห้อ (Brand)</p>
                                                                    <p className="text-sm font-bold text-gray-800">{formData.aiDetectedData.brand || '-'}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">รุ่น (Model)</p>
                                                                    <p className="text-sm font-bold text-gray-800">{formData.aiDetectedData.model || '-'}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ปี (Year)</p>
                                                                    <p className="text-sm font-bold text-gray-800">{formData.aiDetectedData.year || '-'}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ราคาประเมิน AI</p>
                                                                    <p className="text-sm font-bold text-emerald-600">฿{formData.aiDetectedData.appraisalPrice?.toLocaleString() || '-'}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="md:w-px md:bg-blue-100/50" />

                                                        <div className="flex-1 flex flex-col justify-center bg-blue-50/50 p-5 rounded-2xl border border-dashed border-blue-200">
                                                            <p className="text-xs text-blue-600 font-medium mb-1">คำแนะนำ</p>
                                                            <p className="text-[13px] text-gray-600 leading-relaxed">
                                                                ระบบ AI วิเคราะห์ข้อมูลเบื้องต้นจากรูปถ่ายเรียบร้อยแล้ว กรุณาตรวจสอบและ <span className="font-bold text-gray-900">เลือกข้อมูลที่ถูกต้องจากฐานข้อมูล Redbook</span> ในส่วนถัดไปเพื่อความแม่นยำทางบัญชี
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Form and Pricing Summary Card (Card 2) */}
                                    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
                                        {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck' || formData.collateralType === 'agri') ? (
                                            <div className="flex flex-col">
                                                {/* Redbook Form Section Header */}
                                                <div className="px-6 pt-6 pb-2">
                                                    <div className="flex items-center gap-2 mb-">
                                                        <h3 className="text-lg font-bold text-gray-900">ข้อมูลหลักประกันจากฐานข้อมูล Redbook</h3>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-6 pt-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>ยี่ห้อ</Label>
                                                        </div>
                                                        <Combobox
                                                            options={
                                                                formData.collateralType === 'moto' ? MOTO_BRANDS :
                                                                    formData.collateralType === 'truck' ? TRUCK_BRANDS :
                                                                        formData.collateralType === 'agri' ? AGRI_BRANDS :
                                                                            CAR_BRANDS
                                                            }
                                                            value={formData.brand}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, brand: val, model: '', subModel: '' });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'brand' && f !== 'model'));
                                                            }}
                                                            placeholder="เลือกยี่ห้อ..."
                                                            searchPlaceholder="ค้นหายี่ห้อ..."
                                                            emptyText="ไม่พบยี่ห้อที่ค้นหา"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>รุ่น</Label>
                                                        </div>
                                                        <Combobox
                                                            options={MODELS_BY_BRAND[formData.brand] || []}
                                                            value={formData.model}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, model: val });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'model'));
                                                            }}
                                                            placeholder="เลือกรุ่น..."
                                                            searchPlaceholder="ค้นหารุ่น..."
                                                            emptyText="ไม่พบรุ่นที่ค้นหา"
                                                            className={!formData.brand ? "opacity-50 pointer-events-none" : ""}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>รุ่นย่อย</Label>
                                                        </div>
                                                        <Combobox
                                                            options={SUB_MODELS_BY_MODEL[formData.model] || []}
                                                            value={formData.subModel}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, subModel: val });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'subModel'));
                                                            }}
                                                            placeholder="เลือกรุ่นย่อย..."
                                                            searchPlaceholder="ค้นหารุ่นย่อย..."
                                                            emptyText="ไม่พบรุ่นที่ค้นหา"
                                                            className={!formData.model ? "opacity-50 pointer-events-none" : ""}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>ปีจดทะเบียน</Label>
                                                        </div>
                                                        <Combobox
                                                            options={YEARS}
                                                            value={formData.year}
                                                            onValueChange={(val) => {
                                                                setFormData({ ...formData, year: val });
                                                                setAiDetectedFields((prev: any[]) => prev.filter(f => f !== 'year'));
                                                            }}
                                                            placeholder="เลือกปี..."
                                                            searchPlaceholder="ค้นหาปี..."
                                                            emptyText="ไม่พบปีที่ค้นหา"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>สถานะหลักประกัน</Label>
                                                        <Select value={formData.collateralStatus || 'clear'} onValueChange={(val) => setFormData({ ...formData, collateralStatus: val })}>
                                                            <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกสถานะ" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                                <SelectItem value="pledge">จำนำ</SelectItem>
                                                                <SelectItem value="hire_purchase">เช่าซื้อ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="px-6 pb-6 pt-2 flex justify-end">
                                                    <Button
                                                        variant="default"
                                                        className="bg-chaiyo-blue hover:bg-blue-800 text-white font-bold"
                                                        onClick={() => {
                                                            setIsFetchingRedbook(true);
                                                            // Mock API Call
                                                            setTimeout(() => {
                                                                setIsFetchingRedbook(false);
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    redbookPrice: 475000,
                                                                    appraisalPrice: 475000
                                                                }));
                                                                toast.success("ดึงข้อมูลจาก Redbook สำเร็จ");
                                                            }, 1000);
                                                        }}
                                                        disabled={isFetchingRedbook || !formData.brand || !formData.model || !formData.year}
                                                    >
                                                        {isFetchingRedbook ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                                กำลังดึงข้อมูล...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FileText className="w-4 h-4 mr-2" />
                                                                ดึงข้อมูล Redbook
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                                {/* 1. ประเภท โฉนดที่ดิน */}
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-sm text-gray-700">ประเภท โฉนดที่ดิน</Label>
                                                    <Select value={formData.landDeedType || ''} onValueChange={(val) => {
                                                        setFormData({ ...formData, landDeedType: val, residenceType: '' });
                                                    }}>
                                                        <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                            <SelectValue placeholder="เลือกประเภทโฉนด" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ns4">น.ส. 4</SelectItem>
                                                            <SelectItem value="ns3k">น.ส. 3 ก</SelectItem>
                                                            <SelectItem value="orchor2">อ.ช. 2</SelectItem>
                                                            <SelectItem value="trajong_deed">โฉนดตราจอง</SelectItem>
                                                            <SelectItem value="trajong_utilized">ตราจองที่ว่าได้ทำประโยชน์แล้ว</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* 2. ลักษณะที่ดิน */}
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-sm text-gray-700">ลักษณะที่ดิน</Label>
                                                    <Select value={formData.landFeatureType || ''} onValueChange={(val) => setFormData({ ...formData, landFeatureType: val })}>
                                                        <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                            <SelectValue placeholder="เลือกลักษณะที่ดิน" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="empty_land">ที่ดินเปล่า</SelectItem>
                                                            <SelectItem value="land_with_building">ที่ดินพร้อมสิ่งปลูกสร้าง</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {formData.landFeatureType === 'land_with_building' && (
                                                    <>
                                                        {/* 3. อายุสิ่งปลูกสร้าง */}
                                                        <div className="space-y-2 md:col-span-1">
                                                            <Label className="text-sm text-gray-700">อายุสิ่งปลูกสร้าง (ปี)</Label>
                                                            <Input
                                                                type="number"
                                                                value={formData.buildingAge || ''}
                                                                onChange={(e) => setFormData({ ...formData, buildingAge: e.target.value })}
                                                                className="h-12 text-base rounded-xl"
                                                                placeholder="กรอกอายุสิ่งปลูกสร้าง"
                                                            />
                                                        </div>

                                                        {/* 4. รีโนเวท */}
                                                        <div className="space-y-2 md:col-span-1">
                                                            <Label className="text-sm text-gray-700">ในช่วงเวลา x ปีมีการรีโนเวทหรือไม่</Label>
                                                            <Select value={formData.hasRenovation || ''} onValueChange={(val) => setFormData({ ...formData, hasRenovation: val })}>
                                                                <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                    <SelectValue placeholder="เลือก" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="yes">มีการรีโนเวท</SelectItem>
                                                                    <SelectItem value="no">ไม่มีการรีโนเวท</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {/* 5. ที่อยู่อาศัยเป็นแบบใด */}
                                                        <div className="space-y-2 md:col-span-2">
                                                            <Label className="text-sm text-gray-700">ที่อยู่อาศัยเป็นแบบใด</Label>
                                                            <Select value={formData.residenceType || ''} onValueChange={(val) => setFormData({ ...formData, residenceType: val })}>
                                                                <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                    <SelectValue placeholder="เลือกแบบที่อยู่อาศัย" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {formData.landDeedType === 'orchor2' ? (
                                                                        <SelectItem value="condo">คอนโดมิเนียม</SelectItem>
                                                                    ) : (
                                                                        <>
                                                                            <SelectItem value="housing_estate">หมู่บ้านจัดสรร</SelectItem>
                                                                            <SelectItem value="general_residence">ที่อยู่อาศัยทั่วไป / สร้างเอง</SelectItem>
                                                                        </>
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </>
                                                )}

                                                {/* 6. ราคาประเมิน */}
                                                <div className="space-y-4 md:col-span-2 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                                    <Label className="text-sm text-gray-700">ราคาประเมิน กรอก เบื้องต้น</Label>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-500">แหล่งอ้างอิงราคาประเมิน</Label>
                                                        <Select value={formData.appraisalSource || ''} onValueChange={(val) => setFormData({ ...formData, appraisalSource: val })}>
                                                            <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                                <SelectValue placeholder="เลือกแหล่งอ้างอิง" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="department_of_lands">กรมที่ดิน</SelectItem>
                                                                <SelectItem value="external_appraisal">บ.ประเมินนอก</SelectItem>
                                                                <SelectItem value="treasury_department">กรมธนารักษ์ (ที่ดินพร้อมสิ่งปลูกสร้าง, ห้องชุด)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-500">ราคาที่ดิน (บาท)</Label>
                                                            <Input
                                                                type="text"
                                                                value={formData.appraisedLandPrice ? Number(formData.appraisedLandPrice).toLocaleString() : ''}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/,/g, '');
                                                                    if (!isNaN(Number(value))) {
                                                                        const landPrice = Number(value) || 0;
                                                                        const buildingPrice = Number(formData.appraisedBuildingPrice) || 0;
                                                                        setFormData({
                                                                            ...formData,
                                                                            appraisedLandPrice: value,
                                                                            appraisalPrice: landPrice + buildingPrice
                                                                        });
                                                                    }
                                                                }}
                                                                className="h-12 text-base rounded-xl font-mono text-right"
                                                                placeholder="0"
                                                            />
                                                        </div>

                                                        {formData.landFeatureType === 'land_with_building' && (
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-gray-500">ราคาสิ่งปลูกสร้าง (บาท)</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={formData.appraisedBuildingPrice ? Number(formData.appraisedBuildingPrice).toLocaleString() : ''}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value.replace(/,/g, '');
                                                                        if (!isNaN(Number(value))) {
                                                                            const buildingPrice = Number(value) || 0;
                                                                            const landPrice = Number(formData.appraisedLandPrice) || 0;
                                                                            setFormData({
                                                                                ...formData,
                                                                                appraisedBuildingPrice: value,
                                                                                appraisalPrice: landPrice + buildingPrice
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="h-12 text-base rounded-xl font-mono text-right"
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 7. แสดง Sum รวม */}
                                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                                        <Label className="text-sm text-gray-700">ราคารวม (ที่ดิน + สิ่งปลูกสร้าง)</Label>
                                                        <span className="text-xl font-bold text-chaiyo-blue">
                                                            {((Number(formData.appraisedLandPrice) || 0) + (Number(formData.appraisedBuildingPrice) || 0)).toLocaleString()} บาท
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 8. หลักประกันที่เอามาใช้ */}
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label className="text-sm text-gray-700">หลักประกันที่เอามาใช้</Label>
                                                    <Select value={formData.landCollateralPurpose || ''} onValueChange={(val) => setFormData({ ...formData, landCollateralPurpose: val })}>
                                                        <SelectTrigger className="bg-white text-base h-12 rounded-xl">
                                                            <SelectValue placeholder="เลือกชนิดหลักประกัน" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="clear">ปลอดภาระ</SelectItem>
                                                            <SelectItem value="refinance">Refinance</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                        {/* Pricing Summary Section */}
                                        {(formData.aiPrice > 0 || formData.redbookPrice > 0 || formData.appraisalPrice > 0) && (
                                            <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    สรุปราคาประเมินเบื้องต้น
                                                </h4>
                                                <div className={cn(
                                                    "grid grid-cols-1 gap-4",
                                                    formData.collateralType === 'car' ? "md:grid-cols-3" :
                                                        formData.collateralType === 'land' ? "md:grid-cols-1" :
                                                            "md:grid-cols-2"
                                                )}>
                                                    {formData.collateralType === 'car' && (
                                                        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-1">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Analysis Price</p>
                                                            <p className="text-lg font-bold text-gray-900">฿{formData.aiPrice?.toLocaleString() || '0'}</p>
                                                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px]">From Photos</Badge>
                                                        </div>
                                                    )}
                                                    {(formData.collateralType === 'car' || formData.collateralType === 'moto' || formData.collateralType === 'truck' || formData.collateralType === 'agri') && (
                                                        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-1">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Redbook Database</p>
                                                            <p className="text-lg font-bold text-gray-900">฿{formData.redbookPrice?.toLocaleString() || '0'}</p>
                                                            <Badge className="bg-purple-50 text-purple-600 border-none text-[9px]">Market Standard</Badge>
                                                        </div>
                                                    )}
                                                    <div className="p-4 rounded-xl bg-chaiyo-blue text-white shadow-sm space-y-1">
                                                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Final Appraisal Price</p>
                                                        <p className="text-2xl font-black">฿{formData.appraisalPrice?.toLocaleString() || '0'}</p>
                                                        <p className="text-[9px] text-blue-100 italic">* อ้างอิงวงเงินสูงสุด</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* End of Form and Pricing Summary Card (Card 2) */}
                                    </div>

                                    {/* Dynamic Collateral Questions Card (Card 3) */}
                                    {(() => {
                                        let questions = COLLATERAL_QUESTIONS[formData.collateralType] || [];

                                        // Special logic for Land: Filter by Deed Type per screenshot requirements
                                        if (formData.collateralType === 'land') {
                                            if (formData.landDeedType === 'orchor2') {
                                                questions = []; // Hide all questions for OrChor 2
                                            }
                                        }

                                        if (questions.length === 0) return null;

                                        return (
                                            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm divide-y divide-gray-100">
                                                {questions.map((q) => (
                                                    <div key={q.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40">
                                                        <div>
                                                            <Label>{q.text}</Label>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm shrink-0">
                                                            <button
                                                                onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'yes' } })}
                                                                className={cn("px-5 py-2 rounded-lg text-sm font-bold transition-all", formData.collateralQuestions?.[q.id] === 'yes' ? "bg-gray-200 text-gray-700 shadow-sm" : "text-gray-500 hover:bg-gray-100")}
                                                            >
                                                                ใช่
                                                            </button>
                                                            <button
                                                                onClick={() => setFormData({ ...formData, collateralQuestions: { ...formData.collateralQuestions, [q.id]: 'no' } })}
                                                                className={cn("px-5 py-2 rounded-lg text-sm font-bold transition-all", formData.collateralQuestions?.[q.id] === 'no' ? "bg-chaiyo-blue text-white shadow-lg shadow-blue-200" : "text-gray-500 hover:bg-gray-100")}
                                                            >
                                                                ไม่ใช่
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}

                                </div>

                            </div>
                        </div>

                        {/* Section 2: Borrower Info */}
                        <div className="relative border-l-[3px] border-gray-200 ml-4 pl-8 pb-12">
                            <div className="absolute -left-[18px] top-0 w-8 h-8 bg-white rounded-full border-[3px] border-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                                2
                            </div>

                            <div className="space-y-6 -mt-1">
                                <h3 className="text-xl font-bold text-gray-900">ข้อมูลทั่วไป</h3>

                                <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        <div className="space-y-2">
                                            <Label>สัญชาติ *</Label>
                                            <Select value={formData.nationality} onValueChange={(val) => setFormData({ ...formData, nationality: val })}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกสัญชาติ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="thai">ไทย</SelectItem>
                                                    <SelectItem value="non-thai">ต่างชาติ (Non-Thai)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>โครงการพิเศษ</Label>
                                            <Select value={formData.specialProject} onValueChange={(val) => setFormData({ ...formData, specialProject: val })}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกโครงการพิเศษ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">ไม่ระบุ</SelectItem>
                                                    <SelectItem value="b2b_payroll">B2B Payroll</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>กลุ่มอาชีพ</Label>
                                            <Select value={formData.occupationGroup} onValueChange={(val) => setFormData({ ...formData, occupationGroup: val })}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="เลือกกลุ่มอาชีพ" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="employee">พนักงานประจำ</SelectItem>
                                                    <SelectItem value="business_owner">เจ้าของกิจการ</SelectItem>
                                                    <SelectItem value="farmer">เกษตรกร</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>อายุผู้กู้ (ปี)</Label>
                                            <Input
                                                type="number"
                                                placeholder="เช่น 35"
                                                value={formData.borrowerAge || ''}
                                                onChange={(e) => setFormData({ ...formData, borrowerAge: e.target.value })}

                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>รายได้ต่อเดือน (บาท)</Label>
                                            <Input
                                                type="text"
                                                placeholder="ระบุรายได้"
                                                value={formData.salary ? Number(formData.salary).toLocaleString() : ''}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/,/g, '');
                                                    if (!isNaN(Number(value))) {
                                                        setFormData({ ...formData, salary: value });
                                                    }
                                                }}
                                                className="text-right font-mono"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>ภาระหนี้ต่อเดือน (บาท)</Label>
                                            <Input
                                                type="text"
                                                placeholder="ระบุภาระหนี้"
                                                value={formData.monthlyDebt ? Number(formData.monthlyDebt).toLocaleString() : ''}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/,/g, '');
                                                    if (!isNaN(Number(value))) {
                                                        setFormData({ ...formData, monthlyDebt: value });
                                                    }
                                                }}
                                                className="text-right font-mono"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>วงเงินที่ต้องการ (บาท)</Label>
                                            <Input
                                                type="text"
                                                placeholder="ระบุวงเงิน"
                                                value={formData.requestedAmount ? Number(formData.requestedAmount).toLocaleString() : ''}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/,/g, '');
                                                    if (!isNaN(Number(value))) {
                                                        setFormData({ ...formData, requestedAmount: value });
                                                    }
                                                }}
                                                className="text-right font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary / Submit */}
                        <div className="relative border-l-[3px] border-transparent ml-4 pl-8">
                            <div className="absolute -left-[18px] top-0 w-8 h-8 rounded-full border-[3px] border-chaiyo-blue bg-chaiyo-blue flex items-center justify-center text-white shadow-sm ring-4 ring-white">
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <div className="pt-0 flex flex-col items-start -mt-1 space-y-4">
                                <Button
                                    size="xl"
                                    onClick={nextStep}
                                    className="min-w-[200px] shadow-lg shadow-chaiyo-blue/20 font-bold transition-all"
                                    disabled={!formData.collateralType || !formData.nationality || !formData.specialProject}
                                >
                                    ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                                <p className="text-xs text-gray-400">ระบบจำเป็นต้องใช้ข้อมูลเหล่านี้เพื่อประเมินความสามารถในการชำระหนี้</p>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* REMOVED Step 2: Select Type */}

                {/* STEP 2: Verify Info & Result Preview (Was Step 3 and 4) */}
                {
                    currentStep === 2 && (() => {
                        // Calculate LTV dynamic logic based on rules
                        let baseLTV = formData.collateralType === 'land' ? 0.70 : 0.80; // Default base
                        let ltvAdjustments = [];

                        // 1. Occupation
                        if (formData.occupationGroup === 'employee') {
                            baseLTV += 0.05;
                            ltvAdjustments.push({ label: 'กลุ่มอาชีพพนักงานประจำ', value: '+5%' });
                        } else if (formData.occupationGroup === 'business_owner') {
                            baseLTV += 0.05;
                            ltvAdjustments.push({ label: 'กลุ่มอาชีพเจ้าของกิจการ', value: '+5%' });
                        }

                        // 2. Special Project
                        if (formData.specialProject === 'b2b_payroll') {
                            baseLTV += 0.10;
                            ltvAdjustments.push({ label: 'โครงการพิเศษ B2B Payroll', value: '+10%' });
                        }

                        // 3. Age
                        const age = Number(formData.borrowerAge);
                        if (age >= 25 && age <= 60) {
                            baseLTV += 0.05;
                            ltvAdjustments.push({ label: 'อายุอยู่ในเกณฑ์มาตรฐาน (25-60)', value: '+5%' });
                        }

                        // Cap LTV at maximums
                        const maxLtvCap = formData.collateralType === 'land' ? 0.90 : 1.20;
                        let finalLTV = Math.min(baseLTV, maxLtvCap);

                        const appraisalPrice = Number(formData.appraisalPrice) || 0;
                        const finalLimit = Math.floor(appraisalPrice * finalLTV);

                        return (
                            <div className="max-w-6xl mx-auto print:hidden animate-in slide-in-from-right-8 duration-300 pb-20">

                                {/* Page Header */}
                                <div className="mb-8 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-2xl font-bold text-gray-800">สรุปวงเงินประเมินเบื้องต้น</h2>
                                        </div>
                                        <p className="text-gray-500">ตรวจสอบความถูกต้องและวงเงินประเมินสูงสุด</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                                    {/* RIGHT MAIN CONTENT: Form & Summary */}
                                    <div className="col-span-1 lg:col-span-12 space-y-8">



                                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                            {/* Display Info Section */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                    <div className="p-6 space-y-6">
                                                        <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                                            <User className="w-5 h-5 text-chaiyo-blue" /> ปัจจัยที่มีผลต่อการคำนวณ LTV
                                                        </h4>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">ประเภทหลักประกัน</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {PRODUCTS.find(p => p.id === formData.collateralType)?.label || '-'}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">กลุ่มอาชีพ</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formData.occupationGroup === 'employee' ? 'พนักงานประจำ' :
                                                                        formData.occupationGroup === 'business_owner' ? 'เจ้าของกิจการ' :
                                                                            formData.occupationGroup === 'farmer' ? 'เกษตรกร' : '-'}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">โครงการพิเศษ</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formData.specialProject === 'b2b_payroll' ? 'B2B Payroll' : 'ทั่วไป'}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-gray-500 text-sm">อายุผู้กู้</p>
                                                                <p className="font-semibold text-gray-900">{formData.borrowerAge ? `${formData.borrowerAge} ปี` : '-'}</p>
                                                            </div>
                                                        </div>

                                                        {/* Visual context for the asset choice */}
                                                        <div className="mt-4 pt-6 border-t border-gray-50">
                                                            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                                                                <div className={cn(
                                                                    "p-3 rounded-full",
                                                                    PRODUCTS.find(p => p.id === formData.collateralType)?.color || "bg-gray-100 text-gray-400"
                                                                )}>
                                                                    {(() => {
                                                                        const Icon = PRODUCTS.find(p => p.id === formData.collateralType)?.icon || Briefcase;
                                                                        return <Icon className="w-6 h-6" />;
                                                                    })()}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">หลักประกันที่ประเมิน</p>

                                                                    </div>
                                                                    <p className="font-bold text-gray-900">
                                                                        {formData.brand} {formData.model} {formData.year}
                                                                        {formData.collateralType === 'land' && `${formData.province} (${formData.area || '-'})`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-8 pt-4 border-t border-gray-100">
                                                            <Button
                                                                variant="outline"
                                                                size="xl"
                                                                onClick={() => setCurrentStep(1)}
                                                                className="w-full font-bold transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <ChevronLeft className="w-4 h-4" /> แก้ไขข้อมูล
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Loan Summary Limit Card Breakdown */}
                                            <div className="lg:col-span-3 space-y-6">
                                                <div className="bg-white border-2 border-chaiyo-blue rounded-2xl overflow-hidden shadow-lg shadow-blue-900/5">
                                                    <div className="bg-gradient-to-r from-chaiyo-blue to-blue-700 p-6 text-white flex items-center gap-3">
                                                        <Briefcase className="w-6 h-6 text-chaiyo-gold" />
                                                        <h3 className="font-bold text-lg">สรุปวงเงินกู้สูงสุด (Maximum Loan Limit)</h3>
                                                    </div>

                                                    <div className="p-6 space-y-6">
                                                        {/* Row 1: Appraisal */}
                                                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-800">ราคาประเมิน (Appraisal Price)</p>
                                                                </div>
                                                                <p className="text-xs text-blue-500 mt-1">
                                                                    {formData.collateralType === 'land' ? '*อ้างอิงจากราคาประเมินราชการ' : '*อ้างอิงจากข้อมูลราคากลาง Redbook'}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xl font-bold text-gray-900">
                                                                    {formData.appraisalPrice ? Number(formData.appraisalPrice).toLocaleString() : '0'}
                                                                </span>
                                                                <span className="text-gray-500 ml-2">บาท</span>
                                                            </div>
                                                        </div>

                                                        {/* Row 2: LTV Breakdown */}
                                                        <div className="space-y-3 pb-4 border-b border-gray-100">
                                                            <div className="flex justify-between items-center">
                                                                <p className="font-medium text-gray-800">สัดส่วนวงเงินกู้ (LTV)</p>
                                                                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                                    {(finalLTV * 100).toFixed(0)}%
                                                                </span>
                                                            </div>

                                                            {/* LTV Sub-list */}
                                                            <div className=" rounded-xl p-4 space-y-2 text-sm border border-gray-100">
                                                                <div className="flex justify-between text-gray-600">
                                                                    <span>ฐาน LTV มาตรฐาน</span>
                                                                    <span>{(formData.collateralType === 'land' ? 0.70 : 0.80) * 100}%</span>
                                                                </div>
                                                                {ltvAdjustments.map((adj, idx) => (
                                                                    <div key={idx} className="flex justify-between text-emerald-600 font-medium">
                                                                        <span className="flex items-center gap-1.5">
                                                                            <Plus className="w-3.5 h-3.5" />
                                                                            {adj.label}
                                                                        </span>
                                                                        <span>{adj.value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Row 3: Final Limit */}
                                                        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 mt-2">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-blue-900 font-bold text-lg">วงเงินประเมินสูงสุดที่ได้</span>
                                                                <div className="text-right">
                                                                    <span className="text-4xl font-black text-chaiyo-blue tracking-tight">
                                                                        {finalLimit.toLocaleString()}
                                                                    </span>
                                                                    <span className="text-gray-500 font-medium ml-2">บาท</span>
                                                                </div>
                                                            </div>

                                                            <p className="text-xs text-blue-600/80 mt-3 text-right">
                                                                *คำนวณจาก {Number(appraisalPrice).toLocaleString()} × {(finalLTV * 100).toFixed(0)}%
                                                            </p>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex justify-end pt-4 gap-4">

                                                            <Button
                                                                size="xl"
                                                                onClick={() => setCurrentStep(3)}
                                                                className="min-w-[200px] shadow-lg shadow-chaiyo-blue/20 font-bold transition-all"
                                                            >
                                                                ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })()
                }




                {/* REMOVED Step 4: Customer Info */}

                {/* REMOVED Step 4: Customer Info */}

                {/* STEP 3: Product Suggestion (Was Step 4) */}
                {
                    currentStep === 3 && (() => {
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

                                    <div className="grid grid-cols-1 max-w-lg mx-auto gap-6 items-start">
                                        {/* Column 1: Product Card */}
                                        <div className="w-full">
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

                                                        </div>

                                                        {/* Key Stats Bar */}
                                                        <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10">
                                                            <div>
                                                                <p className="text-white/70 text-xs">วงเงินสูงสุด</p>
                                                                <p className="font-bold">{maxLoan.toLocaleString()} <span className="text-[10px] font-normal opacity-75">บาท</span></p>
                                                            </div>
                                                            <div>
                                                                <p className="text-white/70 text-xs">ดอกเบี้ย</p>
                                                                <p className="font-bold">23.99% <span className="text-[10px] font-normal opacity-75">ต่อปี</span></p>
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

                                                        <div className=" rounded-xl p-4 border border-gray-100">
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

                                                        {/* Bundle Deal: Free Insurance */}
                                                        <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

                                                            <div className="flex items-start gap-4 relative z-10">
                                                                <div className="shrink-0">
                                                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                        <ShieldCheck className="w-7 h-7 text-blue-600" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h5 className="font-bold text-gray-800 text-sm">ฟรี! ประกันวงเงินสินเชื่อ</h5>
                                                                        <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                            <Gift className="w-2.5 h-2.5" /> Special
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                                        รับความคุ้มครองทันที คุ้มครองวงเงินสินเชื่อ อุ่นใจตลอดสัญญา ไม่มีค่าใช้จ่ายเพิ่มเติม
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons for Monthly Plan */}
                                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                                            <Button
                                                                size="xl"
                                                                onClick={handleCreateApplication}
                                                                className="w-full shadow-lg shadow-chaiyo-blue/20 font-bold"
                                                            >
                                                                ดำเนินการต่อ
                                                            </Button>
                                                            <Button
                                                                size="xl"
                                                                onClick={handlePrint}
                                                                variant="outline"
                                                                className="w-full font-bold"
                                                            >
                                                                <Printer className="w-4 h-4" /> พิมพ์ Salesheets
                                                            </Button>
                                                        </div>
                                                        <div className="mt-4 text-xs text-gray-400 space-y-1 text-center">
                                                            <p>1) กู้เท่าที่จำเป็นและชำระคืนไหว</p>
                                                            <p>2) หากเลือกระยะเวลาในการผ่อนนาน จะทำให้เสียดอกเบี้ยรวมทั้งสัญญาเพิ่มขึ้น</p>
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

                                                        </div>

                                                        {/* Key Stats Bar */}
                                                        <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10">


                                                            <div>
                                                                <p className="text-white/70 text-xs">วงเงินสูงสุด</p>
                                                                <p className="font-bold">{maxLoan.toLocaleString()} <span className="text-[10px] font-normal opacity-75">บาท</span></p>
                                                            </div>
                                                            <div>
                                                                <p className="text-white/70 text-xs">ดอกเบี้ย</p>
                                                                <p className="font-bold">23.99% <span className="text-[10px] font-normal opacity-75">ต่อปี</span></p>
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
                                                                size="xl"
                                                                onClick={handleCreateApplication}
                                                                className="w-full bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 font-bold"
                                                            >
                                                                ดำเนินการต่อ
                                                            </Button>
                                                            <Button
                                                                size="xl"
                                                                onClick={handlePrint}
                                                                variant="outline"
                                                                className="w-full font-bold border-amber-500/20 text-amber-600 hover:bg-amber-50 hover:border-amber-500/40"
                                                            >
                                                                <Printer className="w-4 h-4" /> พิมพ์ Salesheets
                                                            </Button>
                                                        </div>
                                                        <div className="mt-4 text-xs text-gray-400 space-y-1 text-center">
                                                            <p>1) กู้เท่าที่จำเป็นและชำระคืนไหว</p>
                                                            <p>2) หากเลือกระยะเวลาในการผ่อนนาน จะทำให้เสียดอกเบี้ยรวมทั้งสัญญาเพิ่มขึ้น</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </div>


                                        {/* Column 2: Document Checklist (Hidden for now) */}
                                        {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm animate-in fade-in duration-500 h-full"> */}
                                        {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm animate-in fade-in duration-500 h-full">
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
                                </div> */}
                                    </div>
                                </Tabs>

                                {/* Actions Bar */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        onClick={prevStep}
                                        className="w-full md:w-auto px-6 font-bold"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        แก้ไขข้อมูล
                                    </Button>
                                </div>
                            </div>
                        );
                    })()
                }

                {/* STEP 4: Salesheet View */}
                {
                    currentStep === 4 && (() => {
                        let pdfPath = "/salesheets/Sale Sheet_รถ บุคคลทั่วไป V8.0 2.pdf";
                        let pdfRotation = 90;
                        if (formData.collateralType === 'land') {
                            pdfPath = "/salesheets/Sales Sheet_ที่ดิน_บุคคลทั่วไปV7_ปกค231.2568.pdf";
                            pdfRotation = 0;
                        }
                        return (
                            <div className="max-w-6xl mx-auto py-8 animate-in slide-in-from-right-8 duration-300">
                                <Card className="border border-border-subtle shadow-xl rounded-[2rem] bg-white overflow-hidden">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                            <div className="w-12 h-12 rounded-xl bg-chaiyo-blue/10 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-chaiyo-blue" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">เอกสารแนะนำผลิตภัณฑ์ (Salesheet)</h2>
                                                <p className="text-gray-500 text-sm">กรุณาอธิบายรายละเอียดให้ลูกค้าทราบและให้ลูกค้าอ่านเอกสารก่อนทำรายการต่อ</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-gray-200 relative flex items-center justify-center w-full" style={{ height: '80vh' }}>
                                            <PdfViewer key={pdfPath} url={pdfPath} rotation={pdfRotation} />
                                        </div>

                                        <div className="flex items-center space-x-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <Checkbox
                                                id="salesheet-read"
                                                checked={formData.isSalesheetRead}
                                                onCheckedChange={(checked) => setFormData({ ...formData, isSalesheetRead: checked === true })}
                                                className="w-5 h-5 border-chaiyo-blue data-[state=checked]:bg-chaiyo-blue"
                                            />
                                            <label
                                                htmlFor="salesheet-read"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-800"
                                            >
                                                ข้าพเจ้าได้อธิบายรายละเอียด Salesheet ให้ลูกค้าทราบ และลูกค้าได้อ่านทำความเข้าใจแล้ว
                                            </label>
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                            <Button
                                                variant="outline"
                                                size="xl"
                                                onClick={() => setCurrentStep(3)}
                                                className="px-6 font-bold"
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                                            </Button>
                                            <Button
                                                size="xl"
                                                onClick={handleProceedToApplication}
                                                disabled={!formData.isSalesheetRead}
                                                className="px-8 shadow-lg shadow-blue-500/20 font-bold"
                                            >
                                                ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })()
                }

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
        </div >
    );
}

export default function PreQuestionPage() {
    return (
        <Suspense fallback={<div className="flex justify-center flex-col items-center h-full min-h-[50vh]"><p className="text-gray-500">กำลังโหลด...</p></div>}>
            <PreQuestionPageContent />
        </Suspense>
    );
}
