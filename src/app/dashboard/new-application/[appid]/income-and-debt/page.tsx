"use client";

import { IncomeAndDebtStep } from "../../steps/IncomeAndDebtStep";
import { useApplication } from "../../context/ApplicationContext";

export default function IncomeAndDebtPage() {
    const { formData, setFormData, isExistingCustomer } = useApplication();

    return (
        <IncomeAndDebtStep
            formData={formData}
            setFormData={setFormData}
            isExistingCustomer={isExistingCustomer}
        />
    );
}
