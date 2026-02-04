"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Banknote, FileText } from "lucide-react";

interface ActiveLoan {
    id: string;
    type: string;
    amount: number;
    balance: number;
    status: string;
    installment: number;
    totalMonths: number;
    paidMonths: number;
    totalAmount: number;
}

interface ActiveLoansListProps {
    loans: ActiveLoan[];
    className?: string;
}

export function ActiveLoansList({ loans, className }: ActiveLoansListProps) {
    return (
        <Card className={`border-border-subtle shadow-sm flex flex-col ${className}`}>
            <CardHeader className="border-b border-border-subtle bg-gray-50/50 py-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-chaiyo-gold" />
                        <CardTitle className="text-base">สินเชื่อปัจจุบัน ({loans.length})</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {loans.map((loan, index) => {
                    const paidAmount = loan.totalAmount - loan.balance;
                    const progress = (paidAmount / loan.totalAmount) * 100;

                    return (
                        <div
                            key={loan.id}
                            className="p-5 space-y-4 border-b border-border-subtle last:border-0 hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-foreground text-sm group-hover:text-chaiyo-blue transition-colors">
                                            {loan.type}
                                        </p>
                                        {loan.status === 'Normal' && (
                                            <Badge variant="success" className="h-4 text-[10px] px-1 py-0">ปกติ</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-muted">
                                        <FileText className="w-3 h-3" />
                                        <span>{loan.id}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-chaiyo-blue">
                                        ฿{loan.balance.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-muted font-medium">ผ่อน ฿{loan.installment.toLocaleString()}/ด</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <div className="flex gap-1.5 items-center">
                                        <span className="text-emerald-600">ชำระแล้ว ฿{paidAmount.toLocaleString()}</span>
                                        <span className="text-muted/40 text-[8px]">/</span>
                                        <span className="text-muted">ทั้งหมด ฿{loan.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <span className="text-chaiyo-blue">เหลือ {loan.totalMonths - loan.paidMonths} จาก {loan.totalMonths} งวด</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {loans.length === 0 && (
                    <div className="p-8 text-center text-muted text-sm">
                        ไม่มีสินเชื่อที่ใช้งานอยู่
                    </div>
                )}
            </CardContent>

            {/* Footer gradient for scroll hint if needed, or just a simple border top if list is long */}
            {loans.length > 5 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-muted">
                    เลื่อนเพื่อดูทั้งหมด
                </div>
            )}
        </Card>
    );
}
