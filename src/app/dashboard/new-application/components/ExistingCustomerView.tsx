import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { User, Car, ArrowRight, Wallet, History, Calculator, Calendar, PieChart } from "lucide-react";
import { ActiveLoansList } from "./ActiveLoansList";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ExistingCustomerViewProps {
    profile: any;
    onProceed: () => void;
    onSkipToCalculator?: () => void;
}

export function ExistingCustomerView({ profile, onProceed, onSkipToCalculator }: ExistingCustomerViewProps) {
    const router = useRouter();

    // Mock Active Loans - Expanded to demonstrate scrolling
    const activeLoans = [
        { id: "L-2566001", type: "สินเชื่อจำนำทะเบียนรถ", amount: 150000, balance: 45000, status: "Normal", installment: 4500, totalMonths: 36, paidMonths: 24, totalAmount: 162000 },
        { id: "L-2565089", type: "สินเชื่อส่วนบุคคล", amount: 50000, balance: 12000, status: "Normal", installment: 2100, totalMonths: 24, paidMonths: 18, totalAmount: 50400 },
        { id: "L-2564022", type: "สินเชื่อบ้านแลกเงิน", amount: 1200000, balance: 950000, status: "Normal", installment: 12500, totalMonths: 120, paidMonths: 24, totalAmount: 1500000 },
        { id: "L-2566110", type: "สินเชื่อนาโนไฟแนนซ์", amount: 20000, balance: 8500, status: "Normal", installment: 1200, totalMonths: 18, paidMonths: 10, totalAmount: 21600 },
        { id: "L-2563055", type: "สินเชื่อรถบรรทุก", amount: 800000, balance: 250000, status: "Normal", installment: 18000, totalMonths: 48, paidMonths: 36, totalAmount: 864000 },
        { id: "L-2565099", type: "สินเชื่อส่วนบุคคล", amount: 30000, balance: 5000, status: "Normal", installment: 1500, totalMonths: 24, paidMonths: 21, totalAmount: 36000 },
    ];

    // Mock Collateral
    const collateral = [
        { id: "A-001", type: "Toyota Camry 2020", plate: "9กข 9999", status: "Pledged", estimatedValue: 350000 },
        { id: "A-002", type: "Honda Wave 125i", plate: "1กค 1234", status: "Free", estimatedValue: 25000 }
    ];

    // Mock Income Info
    const incomeInfo = {
        salary: 35000,
        otherIncome: 5000,
        totalIncome: 40000
    };

    // Calculate Summaries
    const totalBalance = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
    const totalInstallment = activeLoans.reduce((sum, loan) => sum + loan.installment, 0);
    const totalLimit = activeLoans.reduce((sum, loan) => sum + loan.totalAmount, 0);
    const dsr = (totalInstallment / incomeInfo.totalIncome) * 100;
    const estimatedCapacity = 450000; // Mock capacity based on collateral

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* 1. Simplified Customer Header (No Card) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md text-chaiyo-blue relative">
                        <User className="w-10 h-10" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            {profile?.fullName || "คุณสมชาย ใจดี"}
                            <Badge className="bg-chaiyo-gold/20 text-blue-900 border-chaiyo-gold/50 pointer-events-none">Credit Grade: {profile?.creditGrade || "A"}</Badge>
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-muted mt-1">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {profile?.customerId || "CUST-555001"}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>ลูกค้าตั้งแต่: 12/05/2021 (3 ปี)</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* View History Removed */}
                </div>
            </div>

            {/* 2. Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryStat
                    title="ยอดหนี้สินเชื่อปัจจุบัน"
                    value={totalBalance}
                    icon={<Wallet className="w-5 h-5 text-chaiyo-blue" />}
                    subtext={`/ ${totalLimit.toLocaleString()}`}
                    subtextLabel="จากวงเงิน"
                    valueClassName="text-chaiyo-blue"
                />
                <SummaryStat
                    title="ภาระผ่อนต่อเดือน"
                    value={totalInstallment}
                    icon={<Calendar className="w-5 h-5 text-orange-500" />}
                    subtext="/ เดือน"
                />
                <SummaryStat
                    title="ภาระหนี้ต่อรายได้ (DSR)"
                    value={dsr}
                    icon={<PieChart className="w-5 h-5 text-purple-600" />}
                    isCurrency={false}
                    suffix="%"
                    status={dsr > 70 ? "สูงเกินเกณฑ์" : "อยู่ในเกณฑ์ดี"}
                    statusColor={dsr > 70 ? "bg-red-100 text-red-700 border-red-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}
                />
            </div>

            {/* Main Content Grid: Active Loans (Left/Big) vs Collateral+Income (Right/Stack) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* 1. Active Loans via Component - Spans 2 columns and takes full height of the row */}
                <div className="lg:col-span-2 h-full">
                    <ActiveLoansList loans={activeLoans} className="h-full" />
                </div>

                {/* Right Column: Stacked Info */}
                <div className="space-y-6 lg:col-span-1">
                    {/* 2. Collateral (Moved to Top) */}
                    <Card className="border-border-subtle shadow-sm">
                        <CardHeader className="border-b border-border-subtle bg-gray-50/50 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Car className="w-5 h-5 text-chaiyo-blue" />
                                    <CardTitle className="text-base">หลักประกัน</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {collateral.map((item, index) => (
                                <div key={item.id} className="p-4 flex items-center justify-between border-b border-border-subtle last:border-0 hover:bg-gray-50 transition-colors">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                            <Car className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm">{item.type}</p>
                                            <p className="text-xs text-muted mt-1">{item.plate}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-chaiyo-blue">฿{item.estimatedValue.toLocaleString()}</p>
                                        <div className="mt-1">
                                            {item.status === 'Free' ? (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">ปลอดภาระ</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 text-[10px]">ติดจำนำ</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 3. Income Info (Moved Below Collateral) */}
                    <Card className="border-border-subtle shadow-sm">
                        <CardHeader className="border-b border-border-subtle bg-gray-50/50 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-green-600" />
                                    <CardTitle className="text-base">ข้อมูลรายได้</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                                <span className="text-sm text-muted">เงินเดือนพื้นฐาน</span>
                                <span className="font-bold">฿{incomeInfo.salary.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-100">
                                <span className="text-sm text-muted">รายได้อื่นๆ</span>
                                <span className="font-bold">฿{incomeInfo.otherIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-bold text-foreground">รายได้รวมสุทธิ</span>
                                <span className="font-bold text-lg text-green-700">฿{incomeInfo.totalIncome.toLocaleString()}</span>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 mt-4 text-xs text-green-800 border border-green-100">
                                * อัปเดตล่าสุด: 01/01/2026
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 pt-4 border-t border-border-subtle">
                <Button
                    variant="outline"
                    size="lg"
                    className="w-full md:w-auto min-w-[200px]"
                    onClick={() => router.push(`/dashboard/customers/${profile?.customerId || 'CUST-001'}`)}
                >
                    <History className="w-4 h-4 mr-2" /> ดูข้อมูลลูกค้าทั้งหมด
                </Button>
                <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] bg-chaiyo-blue text-white shadow-lg hover:bg-chaiyo-blue/90"
                    onClick={onProceed}
                >
                    ขอสินเชื่อใหม่ <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

interface SummaryStatProps {
    title: string;
    value: number;
    icon: any;
    trend?: string;
    subtext?: string;
    subtextLabel?: string;
    highlight?: boolean;
    valueClassName?: string;
    isCurrency?: boolean;
    suffix?: string;
    status?: string;
    statusColor?: string;
}

function SummaryStat({ title, value, icon, trend, subtext, subtextLabel, highlight, valueClassName, isCurrency = true, suffix, status, statusColor }: SummaryStatProps) {
    return (
        <Card className={`border-border-subtle shadow-sm ${highlight ? 'bg-gradient-to-br from-white to-blue-50 border-blue-100 ring-2 ring-blue-100/50' : ''}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted">{title}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <h4 className={cn("text-2xl font-bold", valueClassName ? valueClassName : "text-foreground")}>
                                {isCurrency && "฿"}{value.toLocaleString(undefined, { minimumFractionDigits: isCurrency ? 0 : 2, maximumFractionDigits: 2 })}{suffix}
                            </h4>
                            {status && (
                                <Badge variant="outline" className={cn("text-xs font-bold border", statusColor)}>
                                    {status}
                                </Badge>
                            )}
                            {subtext && (
                                <span className="text-xs text-muted flex items-baseline">
                                    {subtextLabel} <span className="font-medium ml-1">{isCurrency && "฿"}{subtext.replace('/', '').trim()}</span>
                                </span>
                            )}
                        </div>
                    </div>

                </div>
                {trend && (
                    <div className="mt-2 flex items-center text-xs text-muted">
                        <span className="text-red-500 font-medium mr-1">{trend}</span>
                    </div>
                )}

            </CardContent>
        </Card>
    )
}
