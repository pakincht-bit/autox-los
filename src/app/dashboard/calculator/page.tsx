"use client";

import { useRouter } from "next/navigation";
import { CalculatorStep } from "../new-application/steps/CalculatorStep";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default function CalculatorPage() {
    const router = useRouter();

    const handleNext = (data: any) => {
        // In a real app, we might save this data to a store or pass via URL params
        // For now, just navigate to the registration form
        router.push("/dashboard/new-application");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard")}
                    className="text-muted hover:text-foreground -ml-2"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    กลับไปที่แผงควบคุม
                </Button>
            </div>

            <div className="max-w-5xl mx-auto">
                <CalculatorStep onNext={handleNext} />
            </div>
        </div>
    );
}
