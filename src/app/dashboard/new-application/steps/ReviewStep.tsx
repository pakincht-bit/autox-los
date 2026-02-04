"use client";

import { useState } from "react";
import { Check, ShieldCheck, User, Banknote, Car, FileText, X, Phone, Briefcase, MessageSquare, RefreshCcw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ReviewStepProps {
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: () => void;
    onEdit: (step: number) => void;
}

export function ReviewStep({ formData, setFormData, onSubmit, onEdit }: ReviewStepProps) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...formData });
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval: any;
        if (showOTP && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [showOTP, timer]);

    const handleTermsChange = (checked: boolean) => {
        setAcceptedTerms(checked);
        setFormData((prev: any) => ({ ...prev, consentTerms: checked }));
    };

    const handleSaveEdit = () => {
        setFormData({ ...formData, ...editData });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditData({ ...formData });
        setIsEditing(false);
    };

    const handleConfirmSubmission = () => {
        setShowOTP(true);
        setTimer(60);
        setCanResend(false);
    };

    const handleVerifyOTP = async () => {
        setIsVerifying(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsVerifying(false);
        if (otp === "123456") {
            onSubmit();
        } else {
            alert("รหัส OTP ไม่ถูกต้อง (ใช้ 123456)");
        }
    };

    const handleResendOTP = () => {
        setTimer(60);
        setCanResend(false);
        // Simulate resend
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">

            <div className="text-center space-y-3 mb-6">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-100">
                    <ShieldCheck className="w-10 h-10 text-chaiyo-gold" />
                </div>
                <h3 className="text-2xl font-bold">ตรวจสอบข้อมูลและยืนยัน</h3>
                <p className="text-muted text-sm max-w-md mx-auto">กรุณาตรวจสอบความถูกต้องของข้อมูลและยอมรับเงื่อนไขก่อนยื่นใบคำขอ</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Info Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">ข้อมูลส่วนตัว</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => setIsEditing(true)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted">ชื่อ-นามสกุล</span>
                            <span className="font-medium text-right">{formData.prefix} {formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">เลขบัตรประชาชน</span>
                            <span className="font-medium text-right">{formData.idNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">วันเกิด</span>
                            <span className="font-medium text-right">{formData.birthDate || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">เบอร์โทรศัพท์</span>
                            <span className="font-medium text-right">{formData.phoneNumber || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">อาชีพ</span>
                            <span className="font-medium text-right">{formData.occupation || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">อีเมล</span>
                            <span className="font-medium text-right">{formData.email || "-"}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-muted shrink-0">ที่อยู่</span>
                            <span className="font-medium text-right">
                                {formData.fullAddress ||
                                    `${formData.addressLine1 || ""} ${formData.subDistrict || ""} ${formData.district || ""} ${formData.province || ""} ${formData.zipCode || ""}`.trim()}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Loan Details Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">รายละเอียดสินเชื่อ</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => onEdit(4)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted">วงเงินที่ขอสินเชื่อ</span>
                            <span className="font-bold text-chaiyo-blue text-lg text-right">฿{formData.requestedAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">ระยะเวลาผ่อน</span>
                            <span className="font-medium text-right">{formData.requestedDuration} งวด</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">ดอกเบี้ย ({((formData.interestRate || 0.08) * 100).toFixed(0)}% ต่อปี)</span>
                            <span className="font-medium text-right text-chaiyo-gold">฿{Math.ceil(formData.totalInterest || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dashed border-border-subtle my-2 pt-2 flex justify-between">
                            <span className="text-muted font-bold">รวมยอดชำระทั้งสิ้น</span>
                            <span className="font-bold text-right">฿{((formData.requestedAmount || 0) + (formData.totalInterest || 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">ค่างวดโดยประมาณ</span>
                            <span className="font-bold text-right text-emerald-600">฿{Math.ceil(formData.estimatedMonthlyPayment || 0).toLocaleString()} / เดือน</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Collateral Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">หลักประกัน</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => onEdit(2)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted">ประเภท</span>
                            <span className="font-medium text-right capitalize">
                                {formData.collateralType === 'land' ? 'ที่ดิน (โฉนด)' :
                                    formData.collateralType === 'truck' ? 'รถบรรทุก' :
                                        formData.collateralType === 'moto' ? 'รถมอเตอร์ไซค์' :
                                            formData.collateralType === 'car' ? 'รถยนต์' : formData.collateralType}
                            </span>
                        </div>
                        {formData.collateralType === 'land' ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขที่โฉนด</span>
                                    <span className="font-medium text-right">{formData.deedNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขที่ดิน / ระวาง</span>
                                    <span className="font-medium text-right">{formData.parcelNumber || "-"} / {formData.gridNumber || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เนื้อที่ (ไร่-งาน-วา)</span>
                                    <span className="font-medium text-right">{formData.rai || 0}-{formData.ngan || 0}-{formData.wah || 0}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-muted">ยี่ห้อ / รุ่น</span>
                                    <span className="font-medium text-right">{formData.brand} {formData.model}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">ปี / ทะเบียน</span>
                                    <span className="font-medium text-right">{formData.year || "-"} / {formData.licensePlate || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">เลขตัวถัง (VIN)</span>
                                    <span className="font-medium text-right font-mono text-[10px]">{formData.vin || "-"}</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Income Summary */}
                <Card className="border-border-subtle shadow-sm bg-white rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-muted" />
                            <h4 className="font-bold text-sm text-foreground">รายได้</h4>
                        </div>
                        <Button variant="link" size="sm" onClick={() => onEdit(3)} className="text-chaiyo-blue h-auto p-0">แก้ไข</Button>
                    </div>
                    <CardContent className="p-6 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted">รายได้หลัก</span>
                            <span className="font-medium text-right">฿{(formData.baseSalary || 0).toLocaleString()}</span>
                        </div>
                        {formData.otherIncome > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted">รายได้อื่นๆ</span>
                                <span className="font-medium text-right">฿{formData.otherIncome.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted">ภาระหนี้สิน</span>
                            <span className="font-medium text-right text-red-500">฿{(formData.expenses || 0).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-dashed border-border-subtle my-2 pt-2 flex justify-between">
                            <span className="text-muted font-bold">รายได้รวมสุทธิ</span>
                            <span className="font-bold text-right text-emerald-600">฿{formData.income?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted">อัตราส่วนหนี้สิน (DSR)</span>
                            <span className="font-medium text-right">{formData.dsr || 0}%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Terms and Conditions Section */}
            <div className="space-y-4">
                <h4 className="font-bold text-lg">ข้าพเจ้าขอรับรองและยินยอมตามข้อตกลงตังต่อไปนี้</h4>

                <Card className="border-border-subtle shadow-inner bg-gray-50 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="h-[200px] p-6 overflow-y-auto w-full text-xs text-foreground/70 leading-relaxed scrollbar-thin scrollbar-thumb-gray-200">
                            <p className="mb-2 font-bold">1. การเปิดเผยข้อมูลส่วนบุคคล</p>
                            <p className="mb-4">ข้าพเจ้าตกลงยินยอมให้บริษัท เงินไชโย จำกัด ("บริษัท") และพนักงานของบริษัท เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า เพื่อประโยชน์ในการพิจารณาสินเชื่อ การติดต่อสื่อสาร การวิเคราะห์ข้อมูล และการนำเสนอผลิตภัณฑ์...</p>

                            <p className="mb-2 font-bold">2. ความถูกต้องของข้อมูล</p>
                            <p className="mb-4">ข้าพเจ้ารับรองว่าข้อมูลและเอกสารทั้งหมดที่ได้ให้ไว้กับบริษัท ในการสมัครสินเชื่อนี้ เป็นความจริงทุกประการ หากปรากฏว่าข้อมูลใดเป็นเท็จ ข้าพเจ้ายินยอมให้บริษัทระงับการพิจารณาหรือยกเลิกวงเงินสินเชื่อได้ทันที...</p>

                            <p className="mb-2 font-bold">3. การตรวจสอบข้อมูล</p>
                            <p className="mb-4">ข้าพเจ้ายินยอมให้บริษัทดำเนินการตรวจสอบข้อมูลของข้าพเจ้าจากแหล่งข้อมูลต่างๆ ที่บริษัทเห็นสมควร เพื่อประโยชน์ในการพิจารณาสินเชื่อ...</p>
                        </div>
                    </CardContent>
                </Card>

                <div
                    className="flex items-start space-x-4 p-4 rounded-xl border border-border-subtle hover:bg-blue-50/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-chaiyo-blue/50"
                    onClick={() => handleTermsChange(!acceptedTerms)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleTermsChange(!acceptedTerms);
                        }
                    }}
                >
                    <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={handleTermsChange}
                        className="mt-1"
                        tabIndex={-1} // Prevent double tab stop since parent is interactive
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor="terms"
                            className="text-sm font-medium text-foreground leading-snug cursor-pointer"
                        >
                            ข้าพเจ้าได้อ่าน เข้าใจ และตกลงยินยอมปฏิบัติตามข้อตกลงและเงื่อนไขข้างต้นทุกประการ และขอรับรองว่าข้อมูลที่ให้ไว้เป็นความจริง
                        </Label>
                    </div>
                </div>
            </div>

            <div className="pt-4 pb-8 flex justify-center">
                <Button
                    size="lg"
                    className="w-full max-w-sm h-14 text-lg font-bold bg-chaiyo-gold hover:bg-chaiyo-gold/90 text-[#001080] shadow-xl"
                    disabled={!acceptedTerms}
                    onClick={handleConfirmSubmission}
                >
                    <Check className="w-5 h-5 mr-2" /> ยืนยันการสมัครสินเชื่อ
                </Button>
            </div>

            {/* Edit Personal Info Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCancelEdit} />
                    <Card className="relative w-full max-w-lg bg-white shadow-2xl rounded-[2rem] border-none overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-foreground">แก้ไขข้อมูลส่วนตัว</h3>
                                <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="rounded-full">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-5">


                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>เบอร์โทรศัพท์</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9" value={editData.phoneNumber} onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })} placeholder="08x-xxx-xxxx" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>อีเมล (ถ้ามี)</Label>
                                        <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="example@email.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>อาชีพ</Label>
                                    <Select value={editData.occupation} onValueChange={(val) => setEditData({ ...editData, occupation: val })}>
                                        <SelectTrigger className="pl-9 relative">
                                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="พนักงานบริษัท">พนักงานบริษัท</SelectItem>
                                            <SelectItem value="เจ้าของกิจการ">เจ้าของกิจการ</SelectItem>
                                            <SelectItem value="รับจ้างอิสระ">รับจ้างอิสระ</SelectItem>
                                            <SelectItem value="ข้าราชการ/รัฐวิสาหกิจ">ข้าราชการ/รัฐวิสาหกิจ</SelectItem>
                                            <SelectItem value="เกษตรกร">เกษตรกร</SelectItem>
                                            <SelectItem value="พ่อบ้าน/แม่บ้าน">พ่อบ้าน/แม่บ้าน</SelectItem>
                                            <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>ที่อยู่ (ตามทะเบียนบ้าน/ที่อยู่ปัจจุบัน)</Label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:border-chaiyo-blue focus:ring-2 focus:ring-chaiyo-blue/20 transition-all"
                                        value={editData.fullAddress || `${editData.addressLine1 || ""} ${editData.subDistrict || ""} ${editData.district || ""} ${editData.province || ""} ${editData.zipCode || ""}`.trim()}
                                        onChange={(e) => setEditData({ ...editData, fullAddress: e.target.value, addressLine1: e.target.value })}
                                        placeholder="บ้านเลขที่, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={handleCancelEdit}>ยกเลิก</Button>
                                <Button className="flex-1 h-12 rounded-xl bg-chaiyo-blue text-white hover:bg-chaiyo-blue/90" onClick={handleSaveEdit}>บันทึกข้อมูล</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* OTP Verification Modal */}
            {showOTP && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#001080]/80 backdrop-blur-md" />
                    <Card className="relative w-full max-w-md bg-white shadow-2xl rounded-[2.5rem] border-none overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                    <MessageSquare className="w-10 h-10 text-chaiyo-blue" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-foreground">ยืนยันตัวตน</h3>
                                <p className="text-sm text-muted">
                                    ระบบได้ส่งรหัส OTP ไปยัง <span className="font-bold text-foreground">{formData.phoneNumber}</span>
                                </p>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-900">
                                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-xs leading-relaxed">
                                    <p className="font-bold mb-1 underline">คำแนะนำสำหรับพนักงาน</p>
                                    <p>กรุณาแจ้งให้ลูกค้าทราบว่าจะได้รับรหัสยืนยัน ให้พนักงานรับรหัสจากลูกค้าเพื่อนำมากรอกข้อมูลในหน้าจอนี้</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="เลข 6 หลัก"
                                        className="h-16 text-center text-3xl font-bold tracking-[0.5em] rounded-2xl border-2 focus:border-chaiyo-blue font-mono"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="text-center">
                                    {canResend ? (
                                        <button
                                            onClick={handleResendOTP}
                                            className="text-sm font-bold text-chaiyo-blue hover:underline flex items-center justify-center mx-auto gap-2"
                                        >
                                            <RefreshCcw className="w-4 h-4" /> ส่งรหัสอีกครั้ง
                                        </button>
                                    ) : (
                                        <p className="text-sm text-muted">ส่งรหัสอีกครั้งได้ใน {timer} วินาที</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl text-base font-bold border-gray-200"
                                    onClick={() => setShowOTP(false)}
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    className="flex-[2] h-14 rounded-2xl text-base font-bold bg-chaiyo-blue hover:bg-chaiyo-blue/90"
                                    disabled={otp.length !== 6 || isVerifying}
                                    onClick={handleVerifyOTP}
                                >
                                    {isVerifying ? (
                                        <Loader2 className="w-5 h-5 animate-spin p-0" />
                                    ) : (
                                        "ยืนยันรหัส"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
