import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";

export default function SupportPage() {
  return (
    <>
      <TopBar
        greeting="Support"
        subtitle="We're here to help you with anything you need."
        initials="JP"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Options */}
        <section className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Live Chat", desc: "Chat with a care coordinator in real time.", icon: "chat_bubble", action: "Start Chat", available: true },
              { title: "Phone Support", desc: "Call us at +509 2222 0000 (Mon-Sat 8am-6pm)", icon: "phone", action: "Call Now", available: true },
              { title: "Email Support", desc: "Send us a message and we'll respond within 24h.", icon: "email", action: "Send Email", available: true },
              { title: "WhatsApp", desc: "Message us on WhatsApp for quick help.", icon: "forum", action: "Open WhatsApp", available: true },
            ].map((opt) => (
              <div key={opt.title} className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-4">
                  <Icon name={opt.icon} />
                </div>
                <h3 className="font-headline font-bold text-on-surface mb-1">{opt.title}</h3>
                <p className="text-xs text-on-surface-variant flex-1 mb-4">{opt.desc}</p>
                <button className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-shadow">
                  {opt.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Common Questions</h3>
            <div className="space-y-4">
              {[
                "How do I add a dependent?",
                "What does my plan cover?",
                "How do I schedule a televisit?",
                "Where can I find my medical card?",
                "How do I update my payment method?",
              ].map((q) => (
                <button key={q} className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-left">
                  <span className="text-sm font-medium text-on-surface">{q}</span>
                  <Icon name="chevron_right" size="sm" className="text-on-surface-variant shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
