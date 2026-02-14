import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex items-center gap-3">
        <Image src="/icons/logo.svg" alt="Castory" width={28} height={32} />
        <span className="text-2xl font-bold text-white">Castory</span>
      </div>

      <SignIn
        appearance={{
          layout: {
            logoImageUrl: "",
          },
          elements: {
            logoBox: { display: "none" },
            header: "text-center",
            headerTitle: "text-center",
            headerSubtitle: "text-center",
          },
        }}
      />
    </div>
  );
}
