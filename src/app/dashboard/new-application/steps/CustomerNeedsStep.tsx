"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { MessageSquare, Target, Banknote, Car, Bike, Truck, Tractor, Map, HelpCircle } from "lucide-react";

interface CustomerNeedsStepProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function CustomerNeedsStep({ formData, setFormData }: CustomerNeedsStepProps) {

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const formatNumber = (num: number | string) => {
        if (!num && num !== 0) return "";
        const parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (rawValue === "" || /^\d+$/.test(rawValue)) {
            handleChange('requestedAmount', rawValue === "" ? 0 : Number(rawValue));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Purpose */}
                <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-chaiyo-gold/10 flex items-center justify-center text-chaiyo-gold">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <Label className="text-base font-bold text-foreground">วัตถุประสงค์การใช้เงิน</Label>
                                <p className="text-xs text-muted">ลูกค้าต้องการนำเงินไปใช้ทำอะไร?</p>
                            </div>
                        </div>

                        <Select value={formData.loanPurpose || ""} onValueChange={(val) => handleChange('loanPurpose', val)}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="เลือกวัตถุประสงค์" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="business">ลงทุน/หมุนเวียนธุรกิจ</SelectItem>
                                <SelectItem value="personal">ใช้จ่ายส่วนตัว/ครอบครัว</SelectItem>
                                <SelectItem value="debt">ชำระหนี้สิน</SelectItem>
                                <SelectItem value="medical">รักษาพยาบาล</SelectItem>
                                <SelectItem value="agriculture">การเกษตร</SelectItem>
                                <SelectItem value="other">อื่นๆ</SelectItem>
                            </SelectContent>
                        </Select>

                        {formData.loanPurpose === 'other' && (
                            <Input
                                placeholder="ระบุรายละเอียดเพิ่มเติม"
                                value={formData.loanPurposeOther || ""}
                                onChange={(e) => handleChange('loanPurposeOther', e.target.value)}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* 2. Amount */}
                <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-chaiyo-blue">
                                <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                                <Label className="text-base font-bold text-foreground">วงเงินที่ต้องการ</Label>
                                <p className="text-xs text-muted">ลูกค้าต้องการวงเงินประมาณเท่าไหร่?</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Input
                                type="text"
                                className="pl-4 pr-12 text-lg font-bold text-chaiyo-blue"
                                value={formData.requestedAmount ? formatNumber(formData.requestedAmount) : ""}
                                onChange={handleAmountChange}
                                placeholder="0"
                            />
                            <span className="absolute right-4 top-2.5 text-muted font-bold text-sm">บาท</span>
                        </div>
                        <p className="text-xs text-muted/80 text-right">
                            * เป็นเพียงการประเมินเบื้องต้น
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Collateral Check */}
                <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden md:col-span-2">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Car className="w-5 h-5" />
                            </div>
                            <div>
                                <Label className="text-base font-bold text-foreground">ทรัพย์สินค้ำประกัน</Label>
                                <p className="text-xs text-muted">ลูกค้ามีทรัพย์สินประเภทใดมาค้ำประกัน?</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { id: 'car', label: 'รถเก๋ง/กระบะ', icon: Car },
                                { id: 'moto', label: 'มอเตอร์ไซค์', icon: Bike },
                                { id: 'truck', label: 'รถบรรทุก', icon: Truck },
                                { id: 'agriculture_car', label: 'รถไถ/การเกษตร', icon: Tractor },
                                { id: 'land', label: 'โฉนดที่ดิน', icon: Map },
                                { id: 'none', label: 'ไม่มี/ไม่แน่ใจ', icon: HelpCircle },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleChange('collateralType', item.id)}
                                    className={`
                                        cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-gray-50
                                        ${formData.collateralType === item.id
                                            ? 'border-chaiyo-blue bg-blue-50/50 text-chaiyo-blue'
                                            : 'border-gray-100 bg-white text-muted'}
                                    `}
                                >
                                    <item.icon className={`w-10 h-10 mb-2 ${formData.collateralType === item.id ? 'text-chaiyo-blue' : 'text-gray-300'}`} />
                                    <span className="font-bold text-sm text-center">{item.label}</span>

                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
