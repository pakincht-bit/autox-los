"use client";

import { useState } from "react";
import { CheckCircle, Loader2, CreditCard, User, Camera, ArrowRight, UserCheck, UserPlus, FileText, MapPin, Briefcase, Calendar, ShieldAlert, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface IdentityCheckStepProps {
    formData: any;
    setFormData: (data: any) => void;
    onNext: (isExisting: boolean, profile?: any) => void;
}

type KYCStage = 'INIT' | 'READING_CARD' | 'CHECKING_MEMBER' | 'CARD_SUCCESS' | 'FACE_VERIFY' | 'FACE_SUCCESS' | 'COMPLETE';
type VerificationStatus = 'NORMAL' | 'WATCHLIST' | 'BLACKLIST' | 'FRAUD';

export function IdentityCheckStep({ formData, setFormData, onNext }: IdentityCheckStepProps) {
    const [stage, setStage] = useState<KYCStage>('INIT');
    const [isExistingMember, setIsExistingMember] = useState<boolean>(false);
    const [existingProfile, setExistingProfile] = useState<any>(null);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('NORMAL');

    // Mock Data
    const [mockChipPhoto, setMockChipPhoto] = useState<string | null>(null);
    const [mockLivePhoto, setMockLivePhoto] = useState<string | null>(null);

    // 1. Dip Chip -> Then Check Member Immediately
    const handleReadCard = async () => {
        setStage('READING_CARD');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Data
        const mockData = {
            idNumber: "1234567890123", // Default ID
            firstName: "สมชาย",
            lastName: "รักชาติ",
            prefix: "นาย",
            birthDate: "1990-01-01",
            addressLine1: "123 หมู่ 1",
            subDistrict: "ลาดพร้าว",
            district: "ลาดพร้าว",
            province: "กรุงเทพมหานคร",
            zipCode: "10230",
            fullAddress: "123 หมู่ 1 ลาดพร้าว ลาดพร้าว กรุงเทพมหานคร 10230",
            occupation: "พนักงานบริษัท", // Default occupation
            phoneNumber: "0812345678",
            email: ""
        };

        setFormData({ ...formData, ...mockData });
        setMockChipPhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai&backgroundColor=e6e6e6");

        // Proceed to check member immediately
        checkMemberStatus(mockData.idNumber);
    };

    const checkMemberStatus = async (idNumber: string) => {
        setStage('CHECKING_MEMBER');
        setVerificationStatus('NORMAL'); // Reset

        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock Logic for Fraud/Blacklist/Watchlist
        if (idNumber.endsWith('999') || formData.idNumber.endsWith('999')) {
            setVerificationStatus('FRAUD');
            setStage('COMPLETE');
            return;
        }
        if (idNumber.endsWith('888') || formData.idNumber.endsWith('888')) {
            setVerificationStatus('BLACKLIST');
            setStage('COMPLETE');
            return;
        }
        if (idNumber.endsWith('777') || formData.idNumber.endsWith('777')) {
            setVerificationStatus('WATCHLIST');
            setStage('COMPLETE');
            return;
        }

        let isExisting = false;
        let profile = null;

        // Mock Logic: ID ends with '555' is Existing Customer who passed eKYC
        if (idNumber.endsWith('555') || formData.idNumber.endsWith('555')) {
            isExisting = true;
            profile = {
                customerId: "CUST-555001",
                fullName: "คุณสมชาย ใจดี",
                activeLoans: 2,
                lastContact: "2023-12-01",
                creditGrade: "A"
            };
            setExistingProfile(profile);
            setIsExistingMember(true);

            // For Existing Customer: Skip Face Verify -> Go to COMPLETE
            setStage('COMPLETE');
            onNext(true, profile); // Notify parent (NewApplicationPage) immediately to show ExistingCustomerView
        } else {
            // New Customer -> Must do Face Verification
            setIsExistingMember(false);
            setExistingProfile(null);
            setStage('FACE_VERIFY');
        }
    };


    // 2. Face Verification (Only for New Customers)
    const handleFaceVerify = async () => {
        setStage('FACE_VERIFY'); // Just to be sure
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMockLivePhoto("https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai&backgroundColor=ffffff");

        setStage('COMPLETE');
        // Do NOT call onNext yet. Wait for button click.
    };

    const handleCreateProfile = () => {
        onNext(false, null);
    };


    const handleManualID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, idNumber: e.target.value });
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* Stage Indicators */}
            <div className="relative flex items-center justify-between px-12 md:px-24 mb-8">
                {/* Connecting Line Container - Aligned to centers of first and last circles */}
                <div className="absolute top-[15px] left-16 right-16 md:left-28 md:right-28 h-[2px] z-0">
                    {/* Gray Background */}
                    <div className="absolute inset-0 bg-gray-300"></div>

                    {/* Progress Line */}
                    <div
                        className="absolute left-0 top-0 h-full bg-chaiyo-blue transition-all duration-500"
                        style={{
                            width: stage === 'COMPLETE' || stage === 'FACE_SUCCESS' ? '100%' :
                                stage === 'FACE_VERIFY' ? '100%' :
                                    stage === 'CHECKING_MEMBER' ? '50%' :
                                        stage === 'READING_CARD' ? '10%' : '0%'
                        }}
                    ></div>
                </div>

                <StepIndicator
                    num={1}
                    label="อ่านบัตรประชาชน"
                    active={stage === 'INIT' || stage === 'READING_CARD'}
                    completed={stage !== 'INIT' && stage !== 'READING_CARD'}
                />

                <StepIndicator
                    num={2}
                    label="ตรวจสอบสถานะ"
                    active={stage === 'CHECKING_MEMBER'}
                    completed={stage === 'COMPLETE' || stage === 'FACE_VERIFY' || stage === 'FACE_SUCCESS'}
                />

                <StepIndicator
                    num={3}
                    label="ยืนยันใบหน้า"
                    active={stage === 'FACE_VERIFY'}
                    completed={stage === 'COMPLETE' || stage === 'FACE_SUCCESS'}
                    // Dim/Hide if skipped? Or just show checked if skipped
                    skipped={isExistingMember && stage === 'COMPLETE'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* STAGE 1: CARD READER */}
                    {(stage === 'INIT' || stage === 'READING_CARD') && (
                        <Card className="border-2 border-dashed border-chaiyo-blue/20 bg-blue-50/20 shadow-none hover:bg-blue-50/40 transition-colors cursor-pointer" onClick={handleReadCard}>
                            <CardContent className="flex flex-col items-center justify-center py-20">
                                {stage === 'READING_CARD' ? (
                                    <>
                                        <Loader2 className="w-16 h-16 text-chaiyo-blue animate-spin mb-4" />
                                        <h3 className="text-xl font-bold text-chaiyo-blue">กำลังอ่านข้อมูลจากบัตร...</h3>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                            <CreditCard className="w-10 h-10 text-chaiyo-blue" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">เสียบบัตรประชาชน</h3>
                                        <p className="text-muted text-sm mt-2 mb-6">เพื่อดึงข้อมูลจากชิปการ์ด (Smart Card)</p>
                                        <Button className="pointer-events-none bg-chaiyo-blue">อ่านข้อมูลบัตร</Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* STAGE 2: MEMBER CHECKING */}
                    {stage === 'CHECKING_MEMBER' && (
                        <Card className="border-border-subtle">
                            <CardContent className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-chaiyo-blue animate-spin mb-4" />
                                <h3 className="text-lg font-bold text-foreground">กำลังตรวจสอบสถานะลูกค้า...</h3>
                            </CardContent>
                        </Card>
                    )}

                    {/* STAGE 3: FACE VERIFY */}
                    {(stage === 'FACE_VERIFY') && (
                        <Card className="border-border-subtle bg-slate-900 overflow-hidden relative">
                            <CardContent className="flex flex-col items-center justify-center py-0 px-0 h-[400px] relative">
                                <div className="flex flex-col items-center z-10">
                                    <Camera className="w-12 h-12 text-white/50 mb-4" />
                                    <Button size="lg" onClick={handleFaceVerify} className="bg-white text-chaiyo-blue hover:bg-gray-100 font-bold rounded-full px-8">
                                        ถ่ายภาพ
                                    </Button>
                                </div>
                                <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-transparent to-slate-900">
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=400&h=400" alt="Face Verification Overlay" className="w-full h-full object-cover grayscale" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {stage === 'COMPLETE' && (
                        verificationStatus !== 'NORMAL' ? (
                            <Card className={cn(
                                "border-2",
                                verificationStatus === 'FRAUD' || verificationStatus === 'BLACKLIST' ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"
                            )}>
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    {verificationStatus === 'FRAUD' && (
                                        <>
                                            <ShieldAlert className="w-16 h-16 text-red-600 mb-4" />
                                            <h3 className="text-xl font-bold text-red-800">ตรวจพบประวัติฉ้อโกง (FRAUD)</h3>
                                            <p className="text-red-700 max-w-xs mt-2">บุคคลนี้อยู่ในบัญชีรายชื่อบุคคลเฝ้าระวังพิเศษ ห้ามทำธุรกรรม</p>
                                        </>
                                    )}
                                    {verificationStatus === 'BLACKLIST' && (
                                        <>
                                            <XCircle className="w-16 h-16 text-red-600 mb-4" />
                                            <h3 className="text-xl font-bold text-red-800">ติด Blacklist</h3>
                                            <p className="text-red-700 max-w-xs mt-2">บุคคลนี้มีประวัติค้างชำระหนี้หรือผิดนัดชำระหนี้กับสถาบันการเงิน</p>
                                        </>
                                    )}
                                    {verificationStatus === 'WATCHLIST' && (
                                        <>
                                            <AlertTriangle className="w-16 h-16 text-orange-500 mb-4" />
                                            <h3 className="text-xl font-bold text-orange-800">อยู่ในกลุ่มเฝ้าระวัง (Watchlist)</h3>
                                            <p className="text-orange-700 max-w-xs mt-2">โปรดตรวจสอบเอกสารและข้อมูลเพิ่มเติมอย่างละเอียด</p>
                                        </>
                                    )}

                                    <div className="mt-6 flex gap-3 w-full px-10">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-200 hover:bg-red-100 text-red-700"
                                            onClick={() => {
                                                setStage('INIT');
                                                setVerificationStatus('NORMAL');
                                                setFormData({ ...formData, idNumber: "" });
                                            }}
                                        >
                                            ตรวจสอบใหม่
                                        </Button>
                                        {verificationStatus === 'WATCHLIST' && (
                                            <Button
                                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                                                onClick={() => {
                                                    // Allow proceed for Watchlist
                                                    setVerificationStatus('NORMAL');
                                                }}
                                            >
                                                ดำเนินการต่อ
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className={cn(
                                "border-2",
                                isExistingMember ? "bg-blue-50 border-blue-200" : "bg-emerald-50 border-emerald-200"
                            )}>
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    {isExistingMember ? (
                                        <>
                                            <UserCheck className="w-12 h-12 text-blue-600 mb-2" />
                                            <h3 className="text-xl font-bold text-blue-800">ลูกค้าเก่าในระบบ</h3>
                                            <p className="text-blue-700">สถานะปกติ ยืนยันตัวตนเรียบร้อย</p>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
                                            <h3 className="text-xl font-bold text-emerald-800">ยืนยันตัวตนเรียบร้อย</h3>
                                            <p className="text-emerald-700 mb-6">สถานะปกติ ตรวจสอบข้อมูลลูกค้าใหม่</p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>

                {/* RIGHT COLUMN: DATA PREVIEW (For Existing) or PROFILE FORM (For New when Complete) */}
                <div className="space-y-6">
                    {/* If New Customer AND Complete: Show Editable Form */}
                    {stage === 'COMPLETE' && !isExistingMember ? (
                        <Card className="border-border-subtle shadow-md bg-white">
                            <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                                <CardTitle className="text-emerald-800 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5" /> สร้างข้อมูลลูกค้าใหม่
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 space-y-2">
                                        <Label>คำนำหน้า</Label>
                                        <Select value={formData.prefix} onValueChange={(val) => handleFormChange('prefix', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือก" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="นาย">นาย</SelectItem>
                                                <SelectItem value="นาง">นาง</SelectItem>
                                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-1 space-y-2">
                                        <Label>ชื่อ</Label>
                                        <Input value={formData.firstName} onChange={(e) => handleFormChange('firstName', e.target.value)} />
                                    </div>
                                    <div className="col-span-1 space-y-2">
                                        <Label>นามสกุล</Label>
                                        <Input value={formData.lastName} onChange={(e) => handleFormChange('lastName', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>วันเกิด</Label>
                                        <div className="relative">
                                            <Input type="date" value={formData.birthDate} onChange={(e) => handleFormChange('birthDate', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>อาชีพ</Label>
                                        <Select value={formData.occupation || ""} onValueChange={(val) => handleFormChange('occupation', val)}>
                                            <SelectTrigger className="pl-9 relative">
                                                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                                <SelectValue placeholder="เลือกอาชีพ" />
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
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>เบอร์โทรศัพท์</Label>
                                        <Input value={formData.phoneNumber || ""} onChange={(e) => handleFormChange('phoneNumber', e.target.value)} placeholder="08x-xxx-xxxx" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>อีเมล (ถ้ามี)</Label>
                                        <Input value={formData.email || ""} onChange={(e) => handleFormChange('email', e.target.value)} placeholder="example@email.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>ที่อยู่อาศัย (ที่อยู่เต็ม)</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:border-chaiyo-blue focus:ring-2 focus:ring-chaiyo-blue/20 transition-all font-sans"
                                            value={formData.fullAddress || `${formData.addressLine1 || ""} ${formData.subDistrict || ""} ${formData.district || ""} ${formData.province || ""} ${formData.zipCode || ""}`.trim()}
                                            onChange={(e) => handleFormChange('fullAddress', e.target.value)}
                                            placeholder="บ้านเลขที่, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์"
                                        />
                                    </div>
                                </div>

                                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg mt-4" onClick={handleCreateProfile}>
                                    <UserPlus className="w-5 h-5 mr-2" /> สร้างข้อมูลลูกค้าและเริ่มงาน
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        // Default View (For Screening Steps & Existing Customer)
                        <Card className="h-full border-border-subtle bg-gray-50/50">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="font-bold text-muted uppercase text-xs tracking-widest">ข้อมูลที่อ่านได้</h3>

                                {/* Photos */}
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative group">
                                            {mockChipPhoto ? (
                                                <img src={mockChipPhoto} alt="Chip" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted"><User className="w-8 h-8 opacity-20" /></div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold">Smart Card</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative">
                                            {mockLivePhoto ? (
                                                <img src={mockLivePhoto} alt="Live" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted">
                                                    {isExistingMember ? <UserCheck className="w-8 h-8 opacity-20" /> : <Camera className="w-8 h-8 opacity-20" />}
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold">
                                                {isExistingMember ? 'Skipped' : 'Live Photo'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Fields */}
                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted">เลขบัตรประชาชน (พิมพ์ '555' ท้ายสุดเพื่อจำลองลูกค้าเก่า)</Label>
                                        <Input value={formData.idNumber} onChange={handleManualID} className="font-mono bg-white" placeholder="-" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted">ชื่อ</Label>
                                            <Input value={formData.firstName} readOnly className="bg-gray-100 border-none shadow-none text-muted-foreground" placeholder="-" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted">นามสกุล</Label>
                                            <Input value={formData.lastName} readOnly className="bg-gray-100 border-none shadow-none text-muted-foreground" placeholder="-" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div >
    );
}

function StepIndicator({ num, label, active, completed, skipped }: { num: number, label: string, active: boolean, completed: boolean, skipped?: boolean }) {
    if (skipped) {
        return (
            <div className="flex items-center gap-2 text-muted/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-100 bg-gray-50">
                    -
                </div>
                <span className="line-through">{label}</span>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col items-center gap-2 z-10")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                active ? "border-chaiyo-blue ring-4 ring-blue-50 text-chaiyo-blue bg-white" :
                    completed ? "bg-chaiyo-blue text-white border-chaiyo-blue" :
                        "bg-white border-gray-200 text-gray-300"
            )}>
                {completed ? <CheckCircle className="w-5 h-5" /> : num}
            </div>
            <span className={cn("text-xs font-bold absolute -bottom-6 w-32 text-center", active || completed ? "text-chaiyo-blue" : "text-muted")}>{label}</span>
        </div>
    )
}
