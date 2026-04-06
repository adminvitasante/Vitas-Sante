import { auth } from "@/lib/auth";
import { getMemberMedicalCard } from "@/lib/server/queries";
import { Icon } from "@/components/ui/icon";

export default async function MedicalCardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let enrollment: any = null;

  if (userId) {
    const data = await getMemberMedicalCard(userId);
    user = data.user;
    enrollment = data.enrollment;
  }

  const memberName = user?.name || session?.user?.name || "Member";
  const memberCode = enrollment?.member_id_code || "---";
  const planName = enrollment?.plans?.name_en || "No Plan";
  const periodEnd = enrollment?.subscriptions?.current_period_end;
  const expiry = periodEnd
    ? new Date(periodEnd).toLocaleDateString("en", { month: "2-digit", year: "numeric" })
    : "--/--";
  const enrollmentStatus = enrollment?.status || "INACTIVE";
  const region = user?.locale === "ht" ? "Haiti" : user?.locale === "fr" ? "France" : "Port-au-Prince";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
          Digital Identity
        </h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">
          Your official Vita Santé Club digital credentials. Present this card at any partner clinic or laboratory for immediate verification and {planName} benefits.
        </p>
      </div>

      {/* Bento Layout for Card and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Digital ID Card */}
        <div className="lg:col-span-8 group perspective-1000">
          <div className="medical-card-gradient rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl transition-transform duration-500 hover:rotate-y-2">
            {/* Abstract Background Texture */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDfHoqkBE0sz5TVolhhlL8pfyRd_gUZAzMYWWRyyq3HJ3zwUc4rJujjcZ3q-zI6gdGyUfItQuaFfAusS0vl4qIT4QXEB3-LYv09s-fh8h8I4e9h-Q-7TFOvhmhCOTxLUWVuSnDuZN3yWINypTistXenuimQ2Zrjmh09i76XovmmbwkC7bB6LFWqBNZvTXdnOx3JdGSWqEUFjd1-s-LPiCGLPyH2bBHbvPnnMgK8Ut_Q3CJOBMp1IM_j8FGzZMXnx9JlOLhiRk1j_zh')",
              }}
            />
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
              {/* Profile Photo Container */}
              <div className="relative">
                <div className="w-40 h-52 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Member Photo"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuClIh32BlHkr-hsqogsp7njDo8nLE8In2dwnj1z8W1aPg5Lta__YD2Vw8Zu4YfRIYfw6TpzKE066LRp_6o4jlEunl2QuyqXyB9oSeA-toHTqynTQ8e8GZHWSVnAA6gO40mLqHHhRP3pwKEmTR7RE6sTSl1zMMFzt7MHQ9zWzmEG1CrpX-JyR_6u0FB0COVYZYQl0BsB_bOFGXrpPZ7t_zwJS5l55yIvjzuf6kIWPysKzsNMGlTN7PKGZ-VMc1G8uQgioqWHb0sLVFKo"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-secondary p-2 rounded-full border-4 border-primary shadow-lg">
                  <Icon name="verified" size="sm" filled className="text-white" />
                </div>
              </div>

              {/* Identity Details */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20">
                      {planName} Member
                    </span>
                  </div>
                  <h2 className="font-headline text-3xl font-extrabold tracking-tight">
                    {memberName}
                  </h2>
                  <p className="text-primary-fixed-dim font-medium tracking-wide">
                    ID: {memberCode}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">
                      Valid Thru
                    </p>
                    <p className="font-semibold text-lg">{expiry}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">
                      Region
                    </p>
                    <p className="font-semibold text-lg">{region}</p>
                  </div>
                </div>

                {user?.phone && (
                  <div className="pt-2">
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-2">
                      Contact
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-medium">
                        {user.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Verification QR Code"
                    className="w-24 h-24"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYMpRW98rcyO5xfATp1dEdt6-VO1OPyfvn-gjPBRMhIL7Xsk1-6jrm6nbLeRaqC1qHh6EkG42DoCFCm73HVG8LMPLmqkwSgLWQv3hNwsR1cloFVVH8ZyHrJ093U5mWA_Ts5nG-Cyt5R0F7daCvfsotF3RpbATZaTx6RdfKaeEuFRgjtGBxrsMEqz42Uyv8pqkwm36D4X5S1n6vCpn6SL6uT62MQnR0dHPyXm0iWhS3LR3dWdwfD-Oq58UFvtAxCrNcstOFnT6GHuyx"
                  />
                </div>
                <p className="text-[10px] text-white/40 font-medium tracking-tighter">
                  PROVIDER SCAN ONLY
                </p>
              </div>
            </div>

            {/* Footer Decoration */}
            <div className="mt-12 flex justify-between items-end">
              <div className="flex items-center gap-2 opacity-50">
                <Icon name="ecg_heart" className="text-[32px]" />
                <span className="text-sm font-bold tracking-widest">VITA SANTÉ</span>
              </div>
              <div className="text-[10px] text-white/20 font-mono">
                ENCRYPTED PROTOCOL v2.4.0
              </div>
            </div>
          </div>
        </div>

        {/* Side Actions & Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Card */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 space-y-4">
            <h3 className="font-headline font-bold text-lg text-primary">Manage Card</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-2xl group">
                <div className="flex items-center gap-3 text-on-surface">
                  <Icon name="picture_as_pdf" className="text-primary" />
                  <span className="text-sm font-semibold">Download as PDF</span>
                </div>
                <Icon
                  name="chevron_right"
                  size="sm"
                  className="text-outline group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-[#000] text-white hover:bg-zinc-800 transition-colors rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Apple Wallet"
                  className="w-5 h-5 invert"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXFLxu_8OJ_Flnp9W_cOnDAX_boDIvZ0gFwpSu-n9j25bk-xMf4FPo-5jfnVKRePcYDAqBCg5JcyKFoGuGEyg1ULfBAkO1fXKr5PI8iPNmYUeq-NTvoVG-MWl8L48SHippZ_67CCbm5rX7NwGtvMF4Tii_HnqC8bZNUApTSUqrRerBw-llnXbTNDFFFFlPYnFTUgRKqQ5iarl34feeEU9h6YyxET9KkrZ3aMI0-FExu6g1Rt-EAaO4F9dph7bP-1fAXEEx87CPg8nN"
                />
                <span className="text-sm font-semibold">Add to Apple Wallet</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-white text-[#5f6368] border-2 border-slate-100 hover:bg-slate-50 transition-colors rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Google Wallet"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvSlCN2ldAT9C9f6MP6SEDeInfVa05zFv2A-IGbLj3Rq-njuXfIcJ8-rmhO_Fi5shQ6LsZoHhX15b7kaUl1hl5vDPN11bUwRXgz8Ut4A3c2mpE4JZDqtDXiEPN7QGnk5_7Xr-wQ9iIXnWYIl0yYQ4ohWQoVzA-8HQHi4uoFvUrweWHQ47a4nQvSsOJsfVwjviuQWo-lHBGKhMu1qnW_a0rn83im24RFpyzA9Jq1jADTDHerRHUFcdwng22wxlADsaFTME2lCJRQCU-"
                />
                <span className="text-sm font-semibold">Add to Google Wallet</span>
              </button>
            </div>
          </div>

          {/* Usage Info */}
          <div className="bg-primary/5 p-6 rounded-3xl space-y-4">
            <div className="flex items-start gap-3">
              <Icon name="info" className="text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary">Digital Card Policy</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  This digital card is a valid substitute for physical membership ID at all VSC Club health facilities and affiliated pharmacies.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                Status: {enrollmentStatus === "ACTIVE" ? "Active" : enrollmentStatus}
              </span>
              {enrollmentStatus === "ACTIVE" && (
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Health Snapshot Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-[2rem] border-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container/10 flex items-center justify-center">
              <Icon name="bloodtype" className="text-tertiary" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Blood Type</p>
              <p className="text-xl font-bold text-on-surface">O Positive</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-[2rem] border-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
              <Icon name="history_edu" className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Plan Coverage</p>
              <p className="text-xl font-bold text-on-surface">{planName}</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-[2rem] border-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 flex items-center justify-center">
              <Icon name="vaccines" className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Vaccination</p>
              <p className="text-xl font-bold text-on-surface">Up to Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
