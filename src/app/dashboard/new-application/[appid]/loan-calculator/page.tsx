"use client";

import { CalculatorStep } from "../../steps/CalculatorStep";
import { useApplication } from "../../context/ApplicationContext";

export default function LoanCalculatorPage() {
    const { formData, setFormData, navigateNext, navigatePrev } = useApplication();

    return (
        <CalculatorStep
            onNext={navigateNext}
            formData={formData}
            setFormData={setFormData}
            onBack={navigatePrev}
            hideNavigation={true}
            readOnlyProduct={false}
        />
    );
}
