"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    PlusSquare,
    Users,
    Files,
    CheckSquare,
    Car,
    LogOut,
    Settings,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    UserCircle,
    HelpCircle,
    Calculator,
    ChevronsUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";

type UserRole = 'Maker' | 'Checker' | 'Approver';

const mockUser = {
    name: 'สมหญิง จริงใจ',
    role: 'Maker' as UserRole,
    branch: 'สาขาลาดพร้าว'
};

const navigationGroups = [
    {
        title: "ทั่วไป",
        items: [
            { name: "รายการคำขอ", href: "/dashboard/applications", icon: Files, allowedRoles: ['Maker', 'Checker', 'Approver'] as UserRole[] },
        ]
    },
    {
        title: "จัดการ",
        items: [
            { name: "ลูกค้า", href: "/dashboard/customers", icon: Users, allowedRoles: ['Maker', 'Checker', 'Approver'] as UserRole[] },
        ]
    },
    {
        title: "ตั้งค่า",
        items: [
            { name: "บัญชี", href: "/dashboard/profile", icon: UserCircle, allowedRoles: ['Maker', 'Checker', 'Approver'] as UserRole[] },
            { name: "การตั้งค่า", href: "/dashboard/settings", icon: Settings, allowedRoles: ['Approver'] as UserRole[] }, // Example restriction
        ]
    }
];

export function Sidebar() {
    // Main sidebar component
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const filteredGroups = navigationGroups.map(group => ({
        ...group,
        items: group.items.filter(item => !item.allowedRoles || item.allowedRoles.includes(mockUser.role))
    })).filter(group => group.items.length > 0);

    return (
        <div className={cn(
            "relative flex flex-col h-full bg-background border-r border-border-subtle transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Brand Header */}
            <div className={cn("p-5 border-b border-border-subtle flex items-center gap-3 h-20", isCollapsed && "justify-center px-0")}>
                <div className="min-w-8 w-8 h-8 rounded bg-chaiyo-blue flex items-center justify-center text-white font-bold text-lg shrink-0">
                    ช
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <h1 className="font-semibold text-base leading-none truncate underline decoration-chaiyo-blue decoration-2 underline-offset-4">เงินไชโย</h1>
                        <span className="text-[10px] text-muted tracking-widest uppercase mt-1 block truncate">Branch Portal</span>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-17 w-6 h-6 rounded-full bg-white border border-border-color flex items-center justify-center hover:bg-gray-50 transition-colors z-50 shadow-sm"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto no-scrollbar">
                {filteredGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!isCollapsed && (
                            <p className="px-3 text-[10px] font-semibold text-muted/60 uppercase tracking-widest mb-2">
                                {group.title}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md transition-all group border border-transparent",
                                            isActive
                                                ? "bg-white border-border-subtle text-foreground font-medium shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                                                : "text-muted hover:text-foreground hover:bg-white/50",
                                            isCollapsed && "justify-center px-0"
                                        )}
                                        title={isCollapsed ? item.name : ""}
                                    >
                                        <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-chaiyo-blue" : "text-muted group-hover:text-foreground")} />
                                        {!isCollapsed && (
                                            <span className="text-[13px]">{item.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Footer */}
            <div className={cn("p-4", isCollapsed && "px-2")}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer group hover:bg-white border border-transparent hover:border-border-subtle outline-none",
                            isCollapsed && "justify-center p-1"
                        )}>
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs border border-purple-200 shrink-0">
                                JS
                            </div>
                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 overflow-hidden text-left">
                                        <p className="text-xs font-semibold text-foreground truncate">{mockUser.name}</p>
                                        <p className="text-[10px] text-muted truncate">{mockUser.role}</p>
                                    </div>
                                    <ChevronsUpDown className="w-4 h-4 text-muted" />
                                </>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                        <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsAccountOpen(true)}>
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>ข้อมูลผู้ใช้</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => console.log("Logout")}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>ออกจากระบบ</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>ข้อมูลผู้ใช้</DialogTitle>
                        <DialogDescription>
                            ข้อมูลส่วนตัวและข้อมูลสาขาของคุณ
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">รหัสสาขา</Label>
                            <div className="col-span-3 font-medium">108</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">ชื่อสาขา</Label>
                            <div className="col-span-3 font-medium">สาขาลาดพร้าว</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">สนง.เขต</Label>
                            <div className="col-span-3 font-medium">สำนักงานเขตจตุจักร</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">ภาค</Label>
                            <div className="col-span-3 font-medium">กรุงเทพมหานคร 2</div>
                        </div>
                        <div className="border-t border-border-subtle my-2" />
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">รหัสพนง.</Label>
                            <div className="col-span-3 font-medium">1234567</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">ชื่อ-สกุล</Label>
                            <div className="col-span-3 font-medium">นางสาวสมหญิง จริงใจ</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right text-muted-foreground">ตำแหน่ง</Label>
                            <div className="col-span-3 font-medium">เจ้าหน้าที่สินเชื่อสาขา</div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
