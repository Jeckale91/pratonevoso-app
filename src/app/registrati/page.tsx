import Image from "next/image";
import { SignUpForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { signUp } from "@/app/actions/auth";

export default function RegistratiPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-ski-blue to-ski-blue-dark px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center text-white">
          <Image
            src="/brand/LOGO_WHITE.svg"
            alt="Scuola Sci Pratonevoso"
            width={72}
            height={72}
            className="mb-3"
            priority
          />
          <h1 className="text-2xl font-bold">Crea il tuo account</h1>
          <p className="mt-1 text-sm text-white/85">
            Registrati come allievo o maestro della scuola
          </p>
        </div>
        <Card>
          <SignUpForm action={signUp} />
        </Card>
      </div>
    </div>
  );
}
