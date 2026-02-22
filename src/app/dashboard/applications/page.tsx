"use client";

import { useState } from "react";
import { Search, Filter, Calculator } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { Application, ApplicationStatus } from "@/components/applications/types";
import { DashboardPageHeader } from "@/components/layout/DashboardPageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

// Mock Data
const MOCK_DATA: Application[] = [
    {
        id: "1",
        applicationNo: "APP-2023001",
        applicantName: "สมชาย ใจดี",
        makerName: "สมหญิง ใจดี",
        submissionDate: "01/10/2023",
        requestedAmount: 500000,
        status: "Approved",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์"
    },
    {
        id: "2",
        applicationNo: "APP-2023002",
        applicantName: "วิภาวดี รักษ์ไทย",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "02/10/2023",
        requestedAmount: 120000,
        status: "In Review",
        productType: "สินเชื่อโฉนดที่ดิน"
    },
    {
        id: "3",
        applicationNo: "APP-2023003",
        applicantName: "กมล คนขยัน",
        makerName: "สมหญิง ใจดี",
        submissionDate: "03/10/2023",
        requestedAmount: 35000,
        status: "In Review",
        productType: "สินเชื่อนาโนไฟแนนซ์"
    },
    {
        id: "4",
        applicationNo: "APP-2023004",
        applicantName: "ดาริน สวยงาม",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "04/10/2023",
        requestedAmount: 850000,
        status: "Draft",
        productType: "สินเชื่อจำนำทะเบียนรถบรรทุก"
    },
    {
        id: "5",
        applicationNo: "APP-2023005",
        applicantName: "เอกชัย มั่นคง",
        makerName: "สมหญิง ใจดี",
        submissionDate: "05/10/2023",
        requestedAmount: 45000,
        status: "Rejected",
        productType: "สินเชื่อส่วนบุคคล"
    },
    {
        id: "6",
        applicationNo: "APP-2023006",
        applicantName: "มานะ อดทน",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "06/10/2023",
        requestedAmount: 200000,
        status: "In Review",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์"
    },
    {
        id: "7",
        applicationNo: "APP-2023007",
        applicantName: "ประภาส เจริญดี",
        makerName: "สมหญิง ใจดี",
        submissionDate: "07/10/2023",
        requestedAmount: 350000,
        status: "Sent Back",
        productType: "สินเชื่อจำนำทะเบียนรถยนต์"
    },
    {
        id: "8",
        applicationNo: "APP-2023008",
        applicantName: "สุนีย์ แสงทอง",
        makerName: "กานต์ สว่างใจ",
        submissionDate: "08/10/2023",
        requestedAmount: 180000,
        status: "Sent Back",
        productType: "สินเชื่อโฉนดที่ดิน"
    },
];

import { motion } from "framer-motion";

export default function ApplicationsPage() {
    const [currentTab, setCurrentTab] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const tabs = [
        { label: "ทั้งหมด", value: "all" },
        { label: "แบบร่าง", value: "Draft" },
        { label: "รอพิจารณา", value: "In Review" },
        { label: "ส่งกลับ", value: "Sent Back" },
        { label: "อนุมัติ", value: "Approved" },
        { label: "ถูกปฎิเสธ", value: "Rejected" },
        { label: "ยกเลิกคำขอ", value: "Cancelled" },
    ];

    const filteredData = MOCK_DATA.filter((app) => {
        const matchesTab = currentTab === "all" || app.status === currentTab;
        const matchesSearch =
            app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6 p-6 lg:p-8">
                {/* Page Title Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">รายการคำขอ</h1>
                    <p className="text-sm text-muted-foreground">จัดการและตรวจสอบรายการคำขอสินเชื่อทั้งหมดของคุณ</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <Tabs
                        value={currentTab}
                        onValueChange={(value) => { setCurrentTab(value); setCurrentPage(1); }}
                    >
                        <TabsList className="h-auto p-1 bg-gray-50/50 border border-border-subtle rounded-xl relative">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="relative px-4 py-1.5 text-xs font-bold rounded-lg data-[state=active]:bg-transparent data-[state=active]:text-chaiyo-blue data-[state=active]:shadow-none z-10"
                                >
                                    {currentTab === tab.value && (
                                        <motion.div
                                            layoutId="active-tab-pill"
                                            className="absolute inset-0 bg-white border border-chaiyo-blue rounded-lg shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                    <span className="relative z-20">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อ หรือเลขที่คำขอ..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-chaiyo-blue/50 transition-all shadow-sm"
                            />
                        </div>

                        <Link href="/dashboard/pre-question" className="w-full sm:w-auto mt-2 sm:mt-0">
                            <Button className="w-full bg-chaiyo-blue hover:bg-chaiyo-blue/90 font-semibold shadow-md active:scale-95 transition-transform text-xs h-10 rounded-lg">

                                แนะนำผลิตภัณฑ์
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Application List Table */}
                <ApplicationTable data={paginatedData} />

                <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-muted">
                        แสดง {filteredData.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredData.length)} จาก {filteredData.length} รายการ
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage <= 1}
                            className="text-xs h-8"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            ก่อนหน้า
                        </Button>
                        <span className="text-xs text-muted px-2">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            className="text-xs h-8"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        >
                            ถัดไป
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
