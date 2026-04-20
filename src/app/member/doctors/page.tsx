import { redirect } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getSessionUser } from "@/lib/server/authz";
import { getVerifiedDoctors } from "@/lib/server/doctors";

// Member-facing doctor directory. Shows the verified network and lets members
// see who they can book with. Booking itself happens through the doctor's
// patient-care flow (doctor enters the member code).
export default async function MemberDoctorsPage({
  searchParams,
}: {
  searchParams?: { specialty?: string; region?: string };
}) {
  const me = await getSessionUser();
  if (!me) redirect("/auth/signin");

  const specialty = searchParams?.specialty || "";
  const region = searchParams?.region || "";

  const doctors = await getVerifiedDoctors({ specialty, region });

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <TopBar
        greeting="Annuaire médecins"
        subtitle="Réseau Vita Santé vérifié"
        initials={initials}
      />

      <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm mb-6">
        <form className="flex flex-wrap items-end gap-4" method="get">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="specialty" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Spécialité
            </label>
            <input
              id="specialty"
              name="specialty"
              defaultValue={specialty}
              placeholder="e.g. Cardiologie, Médecine générale"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="region" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Région
            </label>
            <input
              id="region"
              name="region"
              defaultValue={region}
              placeholder="e.g. Ouest, Sud, Artibonite"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary text-on-primary px-5 py-2.5 text-sm font-bold"
          >
            Rechercher
          </button>
        </form>
      </section>

      {doctors.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm">
          <Icon name="search_off" className="text-outline !text-4xl mb-3" />
          <p className="text-on-surface-variant">Aucun médecin ne correspond à votre recherche.</p>
          <p className="text-sm text-on-surface-variant mt-2">
            Essayez sans filtres ou élargissez votre zone.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => {
            const user = d.users as unknown as { name: string };
            return (
              <article
                key={d.id}
                className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon name="medical_services" size="sm" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-on-surface">
                      {user?.name ?? "Médecin"}
                    </h3>
                    <p className="text-sm text-on-surface-variant">{d.specialty}</p>
                  </div>
                </div>
                {d.clinic_name && (
                  <p className="text-sm font-semibold text-on-surface mb-1">{d.clinic_name}</p>
                )}
                {d.clinic_address && (
                  <p className="text-xs text-on-surface-variant mb-3">{d.clinic_address}</p>
                )}
                {d.region && (
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed text-xs font-bold text-secondary">
                    {d.region}
                  </span>
                )}
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-on-surface-variant">
        <Link href="/member/medical-card" className="underline underline-offset-4">
          Votre code membre
        </Link>{" "}
        est demandé par le médecin lors de votre visite.
      </p>
    </>
  );
}
