"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ArrowLeft, Check, ChevronRight, User, FileText, Banknote, ShieldCheck, ChevronLeft, Save, Car, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Steps
import { IdentityCheckStep } from "./steps/IdentityCheckStep";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { CollateralStep } from "./steps/CollateralStep";
import { IncomeStep } from "./steps/IncomeStep";
import { CalculatorStep } from "./steps/CalculatorStep";
import { DocumentUploadStep } from "./steps/DocumentUploadStep";
import { ReviewStep } from "./steps/ReviewStep"; // New Review Step
import { ExistingCustomerView } from "./components/ExistingCustomerView";

// NOTE: Step 1 (Identity) is removed from the flow. 
// Flow starts at Step 2 (Collateral) or Step 4 (Calculator).
const ALL_STEPS = [
    // { id: 1, title: 'ข้อมูลผู้สมัคร', description: 'Identification', icon: User }, // REMOVED
    { id: 2, title: 'หลักประกัน', description: 'Collateral', icon: Car },
    { id: 3, title: 'รายได้/อาชีพ', description: 'Income', icon: Banknote },
    { id: 4, title: 'คำนวณวงเงินและค่างวด', description: 'Loan Details', icon: Banknote },
    { id: 5, title: 'เอกสาร', description: 'Documents', icon: FileText },
    { id: 6, title: 'ตรวจสอบ', description: 'Review', icon: Check },
];

export default function NewApplicationPage() {
    const router = useRouter();

    // Phase 1: Screening (False) -> Phase 2: Application (True)
    const [isApplicationStarted, setIsApplicationStarted] = useState(false);

    // Flag to check if we skipped steps (Existing Customer)
    const [isSkipped, setIsSkipped] = useState(false);

    const [currentStep, setCurrentStep] = useState(2); // Start at 2 by default (Collateral)

    const [formData, setFormData] = useState<any>({
        // Initial empty state
        idNumber: "",
        prefix: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        addressLine1: "",
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
        income: 0,
        requestedAmount: 0,
        requestedDuration: 0,
    });

    // New State for Branching Logic
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [existingProfile, setExistingProfile] = useState<any>(null);
    const [isIdentityVerified, setIsIdentityVerified] = useState(false);

    // Mock Existing Collaterals
    const MOCK_EXISTING_COLLATERALS = [
        { id: "C001", type: "car", brand: "Toyota", model: "Camry", year: "2020", licensePlate: "9กข 9999", vin: "MR053K1923002", status: "Pledged" },
        { id: "C002", type: "moto", brand: "Honda", model: "Wave 125i", year: "2022", licensePlate: "1กค 1234", vin: "MLH32423098", status: "Free" }
    ];

    // Dynamic Steps Calculation
    const getVisibleSteps = () => {
        if (isSkipped) {
            // If skipped, hide Collateral (2) and Income (3)
            return ALL_STEPS.filter(step => step.id !== 2 && step.id !== 3);
        }
        return ALL_STEPS;
    };

    const visibleSteps = getVisibleSteps();

    const nextStep = () => {
        // Find current index in visibleSteps
        const currentIndex = visibleSteps.findIndex(s => s.id === currentStep);
        if (currentIndex < visibleSteps.length - 1) {
            setCurrentStep(visibleSteps[currentIndex + 1].id);
        }
    };

    const prevStep = () => {
        const currentIndex = visibleSteps.findIndex(s => s.id === currentStep);
        if (currentIndex > 0) {
            setCurrentStep(visibleSteps[currentIndex - 1].id);
        }
    };

    const jumpToStep = (step: number) => {
        // Allow jumping only if it's in visible steps
        if (visibleSteps.find(s => s.id === step)) {
            setCurrentStep(step);
        }
    };

    // Handler for Identity Check Completion
    const handleIdentityCheckNext = (isExisting: boolean, profile: any) => {
        setIsExistingCustomer(isExisting);
        if (isExisting) {
            setExistingProfile(profile);
            // Pre-fill form data with existing profile if needed
            setFormData((prev: any) => ({
                ...prev,
                firstName: profile.fullName.split(" ")[1] || "",
                lastName: profile.fullName.split(" ")[2] || "",
            }));
        } else {
            // "Create Profile" clicked -> Start Application (Go to Collateral)
            setIsApplicationStarted(true);
            setCurrentStep(2); // Start at Collateral
        }
        setIsIdentityVerified(true);
    };

    const startApplication = () => {
        setIsApplicationStarted(true);
        setCurrentStep(2); // Start at Collateral (Existing Customer normal flow)
        setIsSkipped(false);
    };

    // NEW: Handler to skip to Calculator for Existing Customers
    const handleSkipToCalculator = () => {
        // Pre-fill COMPLETE mock data for existing customer
        setFormData((prev: any) => ({
            ...prev,
            // Personal
            prefix: "นาย",
            birthDate: "1990-01-01",
            addressLine1: "123 หมู่ 1",
            subDistrict: "ลาดพร้าว",
            district: "ลาดพร้าว",
            province: "กรุงเทพมหานคร",
            zipCode: "10230",

            // Collateral (Use one of the existing ones as default)
            collateralType: "car",
            collateralBrand: "Honda",
            collateralModel: "Wave 125i",
            collateralYear: "2020",
            collateralLicense: "1กค 1234",

            // Income
            income: 40000,
            occupation: "พนักงานบริษัท",
            salary: 35000,
            otherIncome: 5000,
            expense: 15000,
        }));

        setIsSkipped(true);
        setIsApplicationStarted(true);
        setCurrentStep(4); // Jump to Calculator
    };

    const isStepValid = () => {
        return true;
    };

    const handleSubmit = () => {
        alert("ใบคำขอสินเชื่อถูกส่งเรียบร้อยแล้ว! (Demo)");
        router.push("/dashboard/applications");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-8 pb-32 px-4 shadow-none">
            {/* Header - Always Visible */}
            <div className="flex justify-between items-center px-2">
                <div>
                    <Button variant="ghost" onClick={() => router.back()} className="pl-0 text-muted hover:text-foreground mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้าแดชบอร์ด
                    </Button>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chaiyo-blue to-blue-800">
                        สร้างใบคำขอสินเชื่อใหม่
                    </h1>
                    <p className="text-muted mt-1">
                        {!isApplicationStarted
                            ? "ขั้นตอนการตรวจสอบตัวตนผู้ขอสินเชื่อ"
                            : "กรอกข้อมูลผู้สมัครและยื่นเอกสารเพื่อพิจารณาสินเชื่อ"
                        }
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* Save Draft Removed */}
                </div>
            </div>

            {/* PHASE 1: SCREENING (No Stepper) */}
            {!isApplicationStarted && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="min-h-[500px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardContent className="p-10">
                            {/* 1. Identity Check */}
                            {!isIdentityVerified && (
                                <IdentityCheckStep
                                    formData={formData}
                                    setFormData={setFormData}
                                    onNext={handleIdentityCheckNext}
                                />
                            )}

                            {/* 2. Existing Customer View (Still in Pre-App Phase) */}
                            {(isIdentityVerified && isExistingCustomer) && (
                                <ExistingCustomerView
                                    profile={existingProfile}
                                    onProceed={startApplication}
                                    onSkipToCalculator={handleSkipToCalculator}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* PHASE 2: APPLICATION (With Vertical Stepper) */}
            {isApplicationStarted && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* CUSTOMER HEADER INFO */}
                    <div className="mb-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    {isExistingCustomer ? existingProfile?.fullName : (formData.firstName ? `${formData.firstName} ${formData.lastName}` : "ผู้สมัครใหม่")}
                                    {isExistingCustomer ? <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">ลูกค้าเดิม</Badge> : <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">ลูกค้าใหม่</Badge>}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-muted">
                                    <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {formData.idNumber || "1234567890123"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* LEFT COLUMN: VERTICAL STEPPER */}
                        <div className="w-full lg:w-64 flex-shrink-0 sticky top-4">
                            <div className="relative pl-6 py-2">
                                {/* Vertical Track Line (Gray) */}
                                <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-gray-100"></div>

                                {/* Vertical Progress Line (Gold) */}
                                <div
                                    className="absolute left-[31px] top-0 w-[2px] bg-chaiyo-gold transition-all duration-500 ease-in-out"
                                    style={{
                                        height: `${((visibleSteps.findIndex(s => s.id === currentStep)) / (Math.max(visibleSteps.length - 1, 1))) * 100}%`,
                                        maxHeight: '100%'
                                    }}
                                ></div>

                                <div className="space-y-10 relative">
                                    {visibleSteps.map((step, index) => {
                                        const isActive = step.id === currentStep;
                                        const isCompleted = ALL_STEPS.indexOf(step) < ALL_STEPS.findIndex(s => s.id === currentStep);

                                        return (
                                            <div
                                                key={step.id}
                                                className={cn(
                                                    "relative flex items-center gap-4 group cursor-default transition-all duration-300",
                                                    isActive ? "opacity-100" : isCompleted ? "opacity-60" : "opacity-40"
                                                )}
                                            >
                                                {/* Dot/Indicator */}
                                                <div
                                                    className={cn(
                                                        "z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 relative bg-white",
                                                        isActive ? "border-chaiyo-gold ring-4 ring-chaiyo-gold/20" :
                                                            isCompleted ? "bg-chaiyo-gold border-chaiyo-gold" : "border-gray-200"
                                                    )}
                                                >
                                                    {isActive && (
                                                        <span className="absolute -inset-2 rounded-full bg-chaiyo-gold/20 animate-ping opacity-75"></span>
                                                    )}
                                                </div>

                                                <div className="space-y-0.5">
                                                    <p className={cn("text-base font-bold", isActive ? "text-chaiyo-blue" : "text-foreground")}>
                                                        {step.title}
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: MAIN CONTENT */}
                        <div className="flex-1 w-full min-w-0">
                            <Card className="min-h-[600px] border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">
                                <CardHeader className="border-b border-border-subtle px-10 py-6 bg-gray-50/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg text-foreground flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-lg bg-chaiyo-gold/10 text-chaiyo-gold flex items-center justify-center text-sm font-bold">
                                                    {/* Show functional step number (1-index in visible checklist) */}
                                                    {visibleSteps.findIndex(s => s.id === currentStep) + 1}
                                                </span>
                                                {ALL_STEPS.find(s => s.id === currentStep)?.title}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 py-8 w-full">

                                    {/* Step 2: Collateral */}
                                    {currentStep === 2 && (
                                        <CollateralStep
                                            formData={formData}
                                            setFormData={setFormData}
                                            isExistingCustomer={isExistingCustomer}
                                            existingCollaterals={isExistingCustomer ? MOCK_EXISTING_COLLATERALS : []}
                                        />
                                    )}

                                    {/* Step 3: Income */}
                                    {currentStep === 3 && <IncomeStep formData={formData} setFormData={setFormData} />}

                                    {/* Step 4: Loan Calculator */}
                                    {currentStep === 4 && (
                                        <CalculatorStep
                                            onNext={nextStep}
                                            formData={formData}
                                            setFormData={setFormData}
                                            onBack={prevStep}
                                            hideNavigation={true}
                                            readOnlyProduct={true}
                                        />
                                    )}

                                    {/* Step 5: Documents */}
                                    {currentStep === 5 && <DocumentUploadStep formData={formData} setFormData={setFormData} />}

                                    {/* Step 6: Review */}
                                    {currentStep === 6 && (
                                        <ReviewStep
                                            formData={formData}
                                            setFormData={setFormData}
                                            onSubmit={handleSubmit}
                                            onEdit={jumpToStep}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Footer / Navigation */}
                            {/* Footer / Navigation */}
                            {!(currentStep === 6) && (
                                <div className="flex justify-between items-center py-6 mt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={prevStep}
                                        disabled={currentStep === 2} // Disabled if at first visible step (Collateral)
                                        className="w-32 text-muted hover:bg-gray-100"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                                    </Button>

                                    <Button
                                        variant="default"
                                        onClick={nextStep}
                                        disabled={!isStepValid()}
                                        className="w-32 shadow-lg shadow-blue-500/20"
                                    >
                                        ถัดไป <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
