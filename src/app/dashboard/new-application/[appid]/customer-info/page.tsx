"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomerInfoStep } from "../../steps/CustomerInfoStep";
import { useApplication } from "../../context/ApplicationContext";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog";
import { Loader2, CheckCircle, AlertCircle, ChevronLeft, Info } from "lucide-react";

export default function CustomerInfoPage() {
    const router = useRouter();
    const { formData, setFormData, appId, setNextOverride } = useApplication();

    // Watchlist/Blacklist Status Check State
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [statusCheckResult, setStatusCheckResult] = useState<"NORMAL" | "WATCHLIST" | "BLACKLIST" | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    // Register custom next handler
    useEffect(() => {
        setNextOverride(handleNext);
        return () => {
            setNextOverride(null);
        };
    }, [formData.idNumber, appId]);

    const handleNext = () => {
        setIsCheckingStatus(true);
        setIsStatusDialogOpen(true);
        setStatusCheckResult(null);

        setTimeout(() => {
            let result: "NORMAL" | "WATCHLIST" | "BLACKLIST" = "NORMAL";
            const idToTest = formData.idNumber || "";

            if (idToTest.endsWith('888')) {
                result = "BLACKLIST";
            } else if (idToTest.endsWith('777')) {
                result = "WATCHLIST";
            }

            setStatusCheckResult(result);
            setIsCheckingStatus(false);

            if (result === "NORMAL") {
                setTimeout(() => {
                    setIsStatusDialogOpen(false);
                    router.push(`/dashboard/new-application/${appId || 'draft'}/collateral-info`);
                }, 1000);
            }
        }, 1500);
    };

    return (
        <>
            <CustomerInfoStep
                formData={formData}
                setFormData={setFormData}
            />

            {/* Watchlist/Blacklist Status Check Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={(open) => {
                if (!open && !isCheckingStatus) {
                    setIsStatusDialogOpen(false);
                }
            }}>
                <DialogContent className="sm:max-w-xl rounded-[2rem] p-8">
                    {!statusCheckResult || isCheckingStatus ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-chaiyo-blue animate-spin mb-6" />
                            <DialogHeader className="space-y-2 flex flex-col items-center">
                                <DialogTitle className="text-xl font-bold text-gray-900">กำลังตรวจสอบสถานะลูกค้า...</DialogTitle>
                                <DialogDescription className="text-base text-gray-500 text-center">
                                    ระบบกำลังตรวจสอบข้อมูลผู้สมัครกับฐานข้อมูล<br />กรุณารอสักครู่
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                    ) : statusCheckResult === "NORMAL" ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <DialogHeader className="space-y-2 flex flex-col items-center">
                                <DialogTitle className="text-xl font-bold text-gray-900">สถานะปกติ</DialogTitle>
                                <DialogDescription className="text-base text-gray-500 text-center">
                                    ตรวจสอบสำเร็จ กำลังไปสู่ขั้นตอนถัดไป...
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <DialogHeader className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-amber-50 shrink-0">
                                    <AlertCircle className="h-10 w-10 text-amber-600" />
                                </div>
                                <div className="space-y-2 flex flex-col items-center">
                                    <DialogTitle className="text-xl font-bold text-gray-900">
                                        พบข้อมูลต้องสงสัย ({statusCheckResult})
                                    </DialogTitle>
                                    <DialogDescription className="text-base text-gray-500 text-center">
                                        ข้อมูลลูกค้าตรงกับฐานข้อมูลแจ้งเตือน กรุณาเตรียมข้อมูลหรือเอกสารสำหรับตรวจสอบเพิ่มเติม
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            <div className="bg-amber-50 p-6 rounded-2xl text-amber-800 border border-amber-100">
                                <p className="flex items-start gap-3">
                                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>
                                        <strong className="block mb-1">คำแนะนำในการดำเนินการ:</strong>
                                        ระบบจะบันทึกสถานะนี้เพื่อประกอบการพิจารณา ท่านสามารถดำเนินการต่อได้ แต่ควรเตรียมเอกสารเพิ่มเติมที่เกี่ยวข้อง
                                    </span>
                                </p>
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setIsStatusDialogOpen(false)}
                                    className="flex-1 order-2 sm:order-1 font-bold"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    กลับไปตรวจสอบ
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        setIsStatusDialogOpen(false);
                                        router.push(`/dashboard/new-application/${appId || 'draft'}/collateral-info`);
                                    }}
                                    className="flex-[2] order-1 sm:order-2 font-bold bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    รับทราบและดำเนินการต่อ
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
