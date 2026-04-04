import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const emergencyContacts = [
  { name: "Marie Valcourt", relation: "Spouse", phone: "+509 3712-4400" },
  { name: "Dr. Marie Laurent", relation: "Primary Physician", phone: "+509 2941-8800" },
  { name: "Hôpital du Canapé Vert", relation: "Emergency", phone: "+509 2245-5050" },
];

export default function MedicalCardPage() {
  return (
    <>
      <TopBar
        greeting="Medical Card"
        subtitle="Your digital health ID — always accessible."
        initials="JP"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Card */}
        <div className="lg:col-span-2">
          <div className="clinical-gradient rounded-3xl p-10 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-70 mb-1">
                    Vita Sante Club
                  </h3>
                  <p className="text-xs opacity-50">Digital Health Card</p>
                </div>
                <Icon name="contactless" size="lg" className="opacity-40" />
              </div>

              {/* Member Info */}
              <div className="mb-10">
                <p className="text-xs uppercase opacity-60 tracking-widest mb-1">Member Name</p>
                <h2 className="text-2xl font-black tracking-tight font-headline">
                  Jean-Pierre Valcourt
                </h2>
              </div>

              {/* Card Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div>
                  <p className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Member ID</p>
                  <p className="font-mono text-sm font-bold tracking-widest">VSC-88291-HT</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Blood Type</p>
                  <p className="font-mono text-sm font-bold">O Positive</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Region</p>
                  <p className="font-mono text-sm font-bold">Port-au-Prince</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-60 tracking-widest mb-1">Valid Thru</p>
                  <p className="font-mono text-sm font-bold">12/2026</p>
                </div>
              </div>

              {/* QR Code + Actions */}
              <div className="flex items-end justify-between">
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Icon name="phone_iphone" size="sm" className="mr-2" />
                    Apple Wallet
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Icon name="wallet" size="sm" className="mr-2" />
                    Google Wallet
                  </Button>
                </div>
                {/* QR Placeholder */}
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <Icon name="qr_code_2" size="xl" className="opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Print / Share row */}
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" size="sm">
              <Icon name="print" size="sm" className="mr-2" />
              Print Card
            </Button>
            <Button variant="secondary" size="sm">
              <Icon name="share" size="sm" className="mr-2" />
              Share
            </Button>
            <Button variant="secondary" size="sm">
              <Icon name="download" size="sm" className="mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Sidebar Panels */}
        <div className="space-y-6">
          {/* Emergency Contacts */}
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-5">
              Emergency Contacts
            </h4>
            <div className="space-y-4">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/50"
                >
                  <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
                    <Icon name="emergency" size="sm" className="text-on-error-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface font-headline truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">{contact.relation}</p>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary hover:text-primary/80 flex-shrink-0"
                  >
                    <Icon name="call" size="sm" />
                  </a>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4">
              <Icon name="edit" size="sm" className="mr-2" />
              Edit Contacts
            </Button>
          </div>

          {/* Card Status */}
          <div className="bg-surface-container-lowest rounded-2xl p-6">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-5">
              Card Status
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Status</span>
                <Badge variant="success" icon="check_circle">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Plan</span>
                <Badge variant="info" icon="workspace_premium">Premium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Issued</span>
                <span className="text-sm font-bold text-on-surface">Jan 15, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Expires</span>
                <span className="text-sm font-bold text-on-surface">Dec 31, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Last Verified</span>
                <span className="text-sm font-bold text-on-surface">Oct 3, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
