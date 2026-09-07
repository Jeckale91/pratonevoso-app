import Image from "next/image";
import { LoginForm } from "@/components/auth/AuthForm";
import { Card } from "@/components/ui/Card";
import { signIn } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; errore?: string }>;
}) {
  const params = await searchParams;

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
          <h1 className="text-2xl font-bold">Scuola Sci Pratonevoso</h1>
          <p className="mt-1 text-sm text-white/85">
            Accedi all&apos;area allievi e maestri
          </p>
        </div>
        {params.errore ? (
          <div
            className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="alert"
          >
            {params.errore}
          </div>
        ) : null}
        <Card>
          <LoginForm action={signIn} nextPath={params.next} />
        </Card>
      </div>
    </div>
  );
}
