export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import SignupForm from "@/app/utils/basecomponents/SignupForm";

export default async function Page({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-signup-access`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch access data");
    }

    const data = await res.json();
    console.log("Signup Access Response:", data);

    if (!data.signupAccess) {
      notFound();
    }

    return <SignupForm />;
  } catch (err) {
    console.error("Error fetching signup access:", err);
    notFound();
  }
}
