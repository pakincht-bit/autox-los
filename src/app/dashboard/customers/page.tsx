"use client";

import React, { useEffect } from "react";
import { Users, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function CustomersPage() {
    const { setBreadcrumbs, setRightContent } = useSidebar();

    useEffect(() => {
        setBreadcrumbs([
            { label: "รายชื่อลูกค้า", isActive: true }
        ]);
        setRightContent(null);
    }, [setBreadcrumbs, setRightContent]);

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 lg:p-8 animate-in fade-in duration-500">
            <Card className="max-w-md w-full border-border-subtle bg-white">
                <CardContent className="pt-12 pb-12 flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                            <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                            <Construction className="w-4 h-4 text-amber-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">ระบบจัดการลูกค้ารายบุคคล</h2>
                        <p className="text-sm text-gray-500 max-w-[280px] mx-auto">
                            เรากำลังพัฒนาส่วนการบริหารจัดการข้อมูลลูกค้าให้ดียิ่งขึ้น
                            และจะเปิดให้ใช้งานเร็วๆ นี้
                        </p>
                    </div>


                </CardContent>
            </Card>
        </div>
    );
}
