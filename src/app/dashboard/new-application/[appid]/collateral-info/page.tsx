"use client";

import { CollateralStep } from "../../steps/CollateralStepNew";
import { useApplication } from "../../context/ApplicationContext";

export default function CollateralInfoPage() {
    const {
        formData,
        setFormData,
        isExistingCustomer,
        mockExistingCollaterals,
    } = useApplication();

    return (
        <CollateralStep
            formData={formData}
            setFormData={setFormData}
            isExistingCustomer={isExistingCustomer}
            existingCollaterals={isExistingCustomer ? mockExistingCollaterals : []}
        />
    );
}
