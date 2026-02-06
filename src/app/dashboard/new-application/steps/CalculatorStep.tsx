"use client";

import { useState, useEffect } from "react";
import { Calculator, Banknote, Calendar, ChevronRight, ChevronLeft, Car, Bike, Truck, Sprout, MapIcon, Tractor, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

interface CalculatorStepProps {
    onNext: (data: any) => void;
    formData?: any;
    setFormData?: (data: any) => void;
    onBack?: () => void;
    hideNavigation?: boolean;
    readOnlyProduct?: boolean;
}

export function CalculatorStep({ onNext, formData, setFormData, onBack, hideNavigation, readOnlyProduct }: CalculatorStepProps) {
    const [amount, setAmount] = useState<number>(Number(formData?.requestedAmount) || 100000);
    const [months, setMonths] = useState<number>(formData?.requestedDuration || 24);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<string>("car");

    // New State for Max Loan Logic
    const [maxLoanAmount, setMaxLoanAmount] = useState<number>(1000000);

    // Mock Interest Rates per product
    const INTEREST_RATES: Record<string, number> = {
        car: 0.2399,
        moto: 0.2399,
        truck: 0.2399,
        agri: 0.2399,
        land: 0.2399,
    };

    // Calculate Max Loan based on formData (if available)
    // Sync collateral type if read-only
    useEffect(() => {
        if (readOnlyProduct && formData?.collateralType && selectedProduct !== formData.collateralType) {
            setSelectedProduct(formData.collateralType);
        }
    }, [formData?.collateralType, readOnlyProduct]);

    // Calculate Max Loan based on formData (if available)
    useEffect(() => {
        let calculatedMax = 1000000; // Default Max Loan

        // Priority 1: Appraisal Price (from AI/Collateral Step) - 90% LTV
        if (formData && formData.appraisalPrice > 0) {
            calculatedMax = Math.floor(formData.appraisalPrice * 0.90);
        }
        // Priority 2: Income Multiplier (Fallback)
        else if (formData && formData.income > 0) {
            // Mock Logic: Max Loan = Income * Multiplier
            // Multiplier varies by collateral type
            let multiplier = 20; // Default
            if (selectedProduct === 'land') multiplier = 50;
            if (selectedProduct === 'car') multiplier = 30;
            if (selectedProduct === 'truck') multiplier = 35;
            if (selectedProduct === 'moto') multiplier = 10;

            calculatedMax = Math.floor(formData.income * multiplier);
        }

        setMaxLoanAmount(calculatedMax);

        // Adjust current amount if it exceeds max
        if (amount > calculatedMax) {
            setAmount(calculatedMax);
        }
    }, [formData?.income, formData?.appraisalPrice, selectedProduct]);

    useEffect(() => {
        calculateLoan();
    }, [amount, months, selectedProduct]);

    // Sync state to formData continuously to support external navigation
    useEffect(() => {
        if (setFormData && hideNavigation) {
            const data: any = {
                requestedAmount: amount,
                requestedDuration: months,
                estimatedMonthlyPayment: monthlyPayment,
                totalInterest: totalInterest,
                interestRate: INTEREST_RATES[selectedProduct] || 0.2399
            };

            // Only sync collateralType if NOT in read-only mode
            if (!readOnlyProduct) {
                data.collateralType = selectedProduct;
            }

            setFormData((prev: any) => ({ ...prev, ...data }));
        }
    }, [amount, months, monthlyPayment, totalInterest, selectedProduct, hideNavigation, readOnlyProduct]);

    const calculateLoan = () => {
        if (amount <= 0 || months <= 0) {
            setMonthlyPayment(0);
            return;
        }

        const rate = INTEREST_RATES[selectedProduct] || 0.2399;
        const years = months / 12;
        const totalInt = amount * rate * years;
        const total = amount + totalInt;
        const monthly = total / months;

        setMonthlyPayment(monthly);
        setTotalInterest(totalInt);
    };

    const handleNext = () => {
        const data = {
            requestedAmount: amount,
            requestedDuration: months,
            estimatedMonthlyPayment: monthlyPayment,
            totalInterest: totalInterest,
            interestRate: INTEREST_RATES[selectedProduct] || 0.2399,
            collateralType: selectedProduct
        };

        // If part of the main flow (formData present), update it
        if (setFormData) {
            setFormData((prev: any) => ({ ...prev, ...data }));
        }

        onNext(data);
    };

    const PRODUCTS = [
        { id: "car", label: "รถเก๋ง / กระบะ", icon: Car },
        { id: "moto", label: "รถมอเตอร์ไซค์", icon: Bike },
        { id: "truck", label: "รถบรรทุก", icon: Truck },
        { id: "agri", label: "รถเพื่อการเกษตร", icon: Tractor },
        { id: "land", label: "โฉนดที่ดิน", icon: MapIcon },
    ];

    const LOAN_DURATIONS_BY_PRODUCT: Record<string, number[]> = {
        moto: [6, 12, 18, 24, 30, 36],
        land: [12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84],
        car: [12, 18, 24, 30, 36, 42, 48, 54, 60],
        truck: [12, 18, 24, 30, 36, 42, 48, 54, 60],
        agri: [12, 18, 24, 30, 36, 42, 48, 54, 60]
    };

    const COMPARISON_DURATIONS = LOAN_DURATIONS_BY_PRODUCT[selectedProduct] || LOAN_DURATIONS_BY_PRODUCT['car'];

    const getMonthlyForDuration = (m: number) => {
        const rate = INTEREST_RATES[selectedProduct] || 0.2399;
        const years = m / 12;
        const totalInt = amount * rate * years;
        return (amount + totalInt) / m;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Removed as per request */}

            <div className="grid lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
                {/* Input Section - Minimal Styling */}
                <div className="lg:col-span-5 space-y-6 lg:order-2">
                    {/* Product Selection */}
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Show Summary if ReadOnly OR if we already have a collateral type from previous steps */}
                        {(readOnlyProduct || (formData && formData.collateralType)) ? (
                            // Read-Only Info Mode
                            <div className="space-y-4">
                                <Label className="text-sm font-bold">ข้อมูลการประเมินและการเงิน</Label>
                                <div className="space-y-2">
                                    {/* 1. Collateral & Appraisal Card */}
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-chaiyo-blue">
                                                {PRODUCTS.find(p => p.id === selectedProduct)?.icon ?
                                                    (() => { const Icon = PRODUCTS.find(p => p.id === selectedProduct)!.icon; return <Icon className="w-5 h-5" /> })() : <Car className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-foreground text-sm">
                                                    {PRODUCTS.find(p => p.id === selectedProduct)?.label}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {selectedProduct === 'land'
                                                        ? `โฉนดเลขที่: ${formData.deedNumber || '-'}`
                                                        : `${formData.brand || ''} ${formData.model || ''} ${formData.year ? `(${formData.year})` : ''}`
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200/60" />

                                        <div className="flex justify-between items-center pl-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                <span className="text-xs font-bold text-muted-foreground">ราคาประเมิน (บาท)</span>
                                            </div>
                                            <span className="text-sm font-mono font-bold text-emerald-700">
                                                {formData.appraisalPrice ? Number(formData.appraisalPrice).toLocaleString() : '0'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. Net Income Card (Same Style) */}
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-blue-600">
                                                <Banknote className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-foreground text-sm">รายได้สุทธิ</p>
                                                <p className="text-xs text-muted">เกณฑ์พิจารณาสินเชื่อ</p>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-200/60" />

                                        <div className="flex justify-between items-center pl-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                <span className="text-xs font-bold text-muted-foreground">รายได้ต่อเดือนสุทธิ (บาท)</span>
                                            </div>
                                            <span className="text-sm font-mono font-bold text-blue-700">
                                                {formData.income ? Number(formData.income).toLocaleString() : '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Selector Mode
                            <>
                                <Label className="text-sm font-bold text-muted uppercase tracking-wider">เลือกประเภทหลักประกัน</Label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {PRODUCTS.map((prod) => (
                                        <div
                                            key={prod.id}
                                            onClick={() => setSelectedProduct(prod.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 group relative",
                                                selectedProduct === prod.id
                                                    ? "border-chaiyo-blue bg-blue-50/50 shadow-sm"
                                                    : "border-border-subtle text-muted hover:border-chaiyo-blue/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                                                selectedProduct === prod.id ? "bg-white text-chaiyo-blue shadow-sm" : "bg-gray-50 text-muted group-hover:bg-white"
                                            )}>
                                                <prod.icon className="w-5 h-5" />
                                            </div>
                                            <span className={cn("text-center text-[10px] font-bold leading-tight", selectedProduct === prod.id ? "text-chaiyo-blue" : "text-muted")}>{prod.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <Label className="text-sm font-bold">สินเชื่อที่ต้องการ (บาท)</Label>
                                {formData && (
                                    <div className="inline-flex items-center px-2 py-0.5 gap-1 bg-blue-50 text-blue-700 rounded-full text-[9px] font-bold">
                                        <AlertCircle className="w-2.5 h-2.5" />
                                        วงเงินสูงสุด: {maxLoanAmount.toLocaleString()}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={amount.toLocaleString()}
                                    onChange={(e) => {
                                        const numericValue = Number(e.target.value.replace(/,/g, ''));
                                        if (!isNaN(numericValue) && numericValue <= maxLoanAmount) setAmount(numericValue);
                                    }}
                                    className="pl-9 pr-4 text-lg font-semibold font-mono h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-right"
                                />
                            </div>
                            <Slider
                                value={[amount]}
                                min={10000}
                                max={maxLoanAmount}
                                step={5000}
                                onValueChange={(val) => setAmount(val[0])}
                                className="w-full py-4"
                            />
                            <div className="flex justify-between text-[10px] text-muted">
                                <span>10,000</span>
                                <span>{maxLoanAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-bold">ระยะเวลาผ่อนชำระ (เดือน)</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {COMPARISON_DURATIONS.map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMonths(m)}
                                        className={cn(
                                            "py-2 px-1 rounded-lg text-[11px] font-bold border transition-all duration-200",
                                            months === m
                                                ? "bg-chaiyo-blue text-white border-chaiyo-blue shadow-md"
                                                : "bg-white text-foreground border-border-subtle hover:border-chaiyo-blue/50 hover:bg-blue-50/30"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output Container with Chart */}
                <Card className="lg:col-span-7 bg-[#001080] text-white border-none shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col h-full lg:sticky lg:top-6 lg:order-1">
                    <CardContent className="p-8 flex flex-col h-full relative items-center">
                        {/* 1. Main Payment Display (Replacing Header & Separator) */}
                        {/* 1. Header: Title Left, Result Right */}
                        <div className="flex justify-between items-start w-full mb-6 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Calculator className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">เปรียบเทียบระยะเวลาผ่อน</p>
                                    <p className="text-[10px] text-white/50">(บาท/เดือน)</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-white/70 text-xs font-medium mb-1">ค่างวดต่อเดือน ({months} งวด)</p>
                                <h3 className="text-4xl font-bold tracking-tight text-white">
                                    ฿{Math.ceil(monthlyPayment).toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        {/* 2. Chart Comparison */}
                        <div className="w-full">
                            <div className="flex justify-between items-end h-[220px] gap-2 px-1">
                                {COMPARISON_DURATIONS.map(m => {
                                    const mPayment = getMonthlyForDuration(m);
                                    const maxPayment = getMonthlyForDuration(Math.min(...COMPARISON_DURATIONS));
                                    const heightPercentage = (mPayment / maxPayment) * 100;
                                    const isSelected = m === months;

                                    return (
                                        <div
                                            key={m}
                                            onClick={() => setMonths(m)}
                                            className="flex flex-col items-center h-full flex-1 group cursor-pointer relative"
                                        >
                                            {/* Bar Area */}
                                            <div className="relative flex-1 w-full flex flex-col justify-end items-center gap-2 pb-1">
                                                {/* The Actual Bar */}
                                                <div
                                                    className={cn(
                                                        "w-full rounded-t-lg transition-all duration-500 relative",
                                                        isSelected
                                                            ? "bg-chaiyo-gold shadow-[0_0_25px_rgba(255,193,7,0.6)]"
                                                            : "bg-white/10 group-hover:bg-white/20"
                                                    )}
                                                    style={{ height: `${heightPercentage}%` }}
                                                >
                                                    {/* Tooltip on Hover (Inside Bar for local positioning) */}
                                                    <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-white text-[#001080] text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-2xl z-20 transform translate-y-2 group-hover:translate-y-0">
                                                        ฿{Math.ceil(mPayment).toLocaleString()}
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                                                    </div>

                                                    {isSelected && (
                                                        <div className="absolute top-0 left-0 w-full h-[3px] bg-white/40 rounded-t-lg"></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Duration Label Below Bar */}
                                            <div className="flex flex-col items-center pt-2 border-t border-white/5 w-full">
                                                <span className={cn(
                                                    "text-[11px] font-black transition-all duration-300",
                                                    isSelected ? "text-chaiyo-gold scale-125" : "text-white/40 group-hover:text-white/70"
                                                )}>
                                                    {m}
                                                </span>
                                                <span className="text-[7px] text-white/20 uppercase font-bold tracking-tighter">งวด</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Extra White Space (Gap) */}
                        <div className="h-10 w-full" />

                        {/* Summary Content */}
                        <div className="w-full space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full transition-opacity"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/60">วงเงินกู้ (เงินต้น):</span>
                                <span className="text-xl font-bold font-mono text-white">฿{amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/60">ดอกเบี้ยรวมทั้งหมด:</span>
                                <span className="text-xl font-bold font-mono text-chaiyo-gold">+{Math.ceil(totalInterest).toLocaleString()}</span>
                            </div>
                            <div className="h-[1px] bg-white/10"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-white/80">ยอดชำระทั้งหมด:</span>
                                <span className="text-3xl font-bold font-mono text-white">฿{(amount + totalInterest).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4 pt-4">
                            <p className="text-[10px] text-white/40 italic">
                                *คำนวณจากอัตราดอกเบี้ยเบื้องต้น {((INTEREST_RATES[selectedProduct] || 0.2399) * 100).toFixed(2)}% ต่อปี ดอกเบี้ยจริงขึ้นอยู่กับการพิจารณาของบริษัท
                            </p>
                            {!hideNavigation && (
                                <div className="flex gap-4">
                                    {onBack && (
                                        <Button
                                            onClick={onBack}
                                            variant="ghost"
                                            className="h-14 flex-1 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                                        >
                                            <ChevronLeft className="w-5 h-5 mr-2" /> ย้อนกลับ
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleNext}
                                        className={cn(
                                            "h-14 text-lg font-bold bg-chaiyo-gold hover:bg-chaiyo-gold/90 text-[#001080] rounded-xl shadow-xl transition-all transform hover:scale-[1.02]",
                                            onBack ? "flex-[2]" : "w-full"
                                        )}
                                    >
                                        {formData ? "ยืนยันและถัดไป" : "สรุปยอดสินเชื่อ"} <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
