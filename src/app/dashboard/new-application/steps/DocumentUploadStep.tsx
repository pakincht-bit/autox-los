"use client";

import { useState } from "react";
import { FileText, CheckCircle, Upload, AlertCircle, Image as ImageIcon, Check, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

interface DocumentUploadStepProps {
    formData: any;
    setFormData: (data: any) => void;
}

const getRequiredDocs = (collateralType: string) => {
    const commonDocs = [
        { id: "id_card", name: "สำเนาบัตรประจำตัวประชาชน", req: true },
    ];

    if (collateralType === 'land') {
        return [
            ...commonDocs,
            { id: "land_deed", name: "โฉนดที่ดินตัวจริง", req: true },
            { id: "appraisal", name: "ใบประเมินราคาที่ดิน", req: true },
        ];
    } else if (collateralType === 'truck') {
        return [
            ...commonDocs,
            { id: "car_reg", name: "เล่มทะเบียนรถตัวจริง", req: true },
            { id: "transport_license", name: "สำเนาใบอนุญาตประกอบการขนส่ง", req: true },
        ];
    } else {
        // Car, Moto, Agri
        return [
            ...commonDocs,
            { id: "car_reg", name: "เล่มทะเบียนรถตัวจริง", req: true },
        ];
    }
};

export function DocumentUploadStep({ formData, setFormData }: DocumentUploadStepProps) {
    const [uploads, setUploads] = useState<Record<string, boolean>>({});

    const handleUpload = (id: string) => {
        // Simulate upload
        setUploads(prev => ({ ...prev, [id]: true }));
    };

    const requiredDocs = getRequiredDocs(formData.collateralType || 'car');

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">


            <div className="space-y-4">
                {requiredDocs.map((doc) => (
                    <div
                        key={doc.id}
                        className={cn(
                            "flex items-center justify-between p-6 rounded-[1.5rem] border transition-all duration-300",
                            uploads[doc.id]
                                ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                                : "bg-white border-border-subtle hover:border-chaiyo-blue/30 hover:shadow-md hover:shadow-gray-200/50"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                uploads[doc.id] ? "bg-emerald-100 text-emerald-600" : "bg-gray-100/80 text-gray-500/80"
                            )}>
                                <FileText className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h4 className={cn("text-base font-bold", uploads[doc.id] ? "text-emerald-900" : "text-foreground")}>
                                    {doc.name}
                                </h4>
                                {doc.req && !uploads[doc.id] && (
                                    <span className="text-[10px] bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-red-100">
                                        จำเป็น
                                    </span>
                                )}
                            </div>
                        </div>

                        {uploads[doc.id] ? (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <span className="text-sm font-medium">แนบไฟล์แล้ว</span>
                                <CheckCircle className="w-5 h-5" />
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted hover:text-red-500" onClick={() => setUploads(prev => ({ ...prev, [doc.id]: false }))}>
                                    ลบ
                                </Button>
                            </div>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => handleUpload(doc.id)}>
                                <Upload className="w-4 h-4 mr-2" /> อัปโหลด
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Collateral Photos Section */}
            <div className="pt-10 border-t border-dashed border-border-subtle">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-chaiyo-gold/10 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-chaiyo-gold" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">รูปถ่ายหลักประกัน</h3>
                        <p className="text-xs text-muted">กรุณาแนบรูปถ่ายหลักประกันให้ครบทุกมุม</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {(formData.collateralType === 'land') ? (
                        // Land Uploads
                        [
                            { key: "deed_front", label: "โฉนดหน้า" },
                            { key: "deed_back", label: "โฉนดหลัง" },
                            { key: "land_photo", label: "รูปที่ดิน" },
                        ].map((item) => (
                            <UploadBox key={item.key} item={item} uploaded={uploads[item.key]} onUpload={() => handleUpload(item.key)} />
                        ))
                    ) : (
                        // Vehicle Uploads (Car, Moto, Truck, Agri)
                        [
                            { key: "front", label: "ด้านหน้า" },
                            { key: "side", label: "ด้านข้าง" },
                            { key: "back", label: "ด้านหลัง" },
                            { key: "interior", label: "ภายใน" },
                            { key: "plate", label: "ป้ายภาษี" },
                        ].map((item) => (
                            <UploadBox key={item.key} item={item} uploaded={uploads[item.key]} onUpload={() => handleUpload(item.key)} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function UploadBox({ item, uploaded, onUpload }: { item: any, uploaded: boolean, onUpload: () => void }) {
    return (
        <div
            onClick={onUpload}
            className={cn(
                "aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                uploaded ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-chaiyo-blue hover:bg-blue-50"
            )}
        >
            {uploaded ? (
                <>
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-[10px] py-1 text-center font-medium">
                        อัปโหลดแล้ว
                    </div>
                    <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                </>
            ) : (
                <>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors mb-2">
                        <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-chaiyo-blue" />
                    </div>
                    <span className="text-xs text-muted font-medium group-hover:text-chaiyo-blue text-center leading-tight px-1">{item.label}</span>
                </>
            )}
        </div>
    )
}
