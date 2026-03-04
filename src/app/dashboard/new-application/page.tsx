import { redirect } from "next/navigation";

// Landing page redirects to first step (salesheet)
export default function NewApplicationPage() {
    redirect("/dashboard/new-application/salesheet");
}
