"use client";

import { DocumentUploadStep } from "../../steps/DocumentUploadStep";
import { useApplication } from "../../context/ApplicationContext";

export default function DocumentsPage() {
    const { formData, setFormData } = useApplication();

    return (
        <DocumentUploadStep
            formData={formData}
            setFormData={setFormData}
        />
    );
}
