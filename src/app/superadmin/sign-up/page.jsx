export const dynamic = "force-dynamic";

import Notfoundcomponent from "@/app/utils/basecomponents/Notfoundcomponent";
import SignupForm from "@/app/utils/basecomponents/SignupForm";

export default async function Page() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-signup-access`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch access data");

    const data = await res.json();

    if (!data.signupAccess) {
      return <Notfoundcomponent />;
    }

    return <SignupForm />;
  } catch (err) {
    console.error("Error fetching signup access:", err);
    return <p className="text-center text-red-500 mt-10">Unable to load signup access.</p>;
  }
}
