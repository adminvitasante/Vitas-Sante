import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const materials = [
  { name: "Digital Brochure - FR", type: "PDF", size: "2.4 MB", icon: "description" },
  { name: "Digital Brochure - EN", type: "PDF", size: "2.1 MB", icon: "description" },
  { name: "Social Media Kit", type: "ZIP", size: "15.8 MB", icon: "photo_library" },
  { name: "Email Templates", type: "HTML", size: "340 KB", icon: "mail" },
  { name: "Banner Ads Pack", type: "ZIP", size: "8.2 MB", icon: "image" },
  { name: "Presentation Deck", type: "PPTX", size: "5.6 MB", icon: "slideshow" },
];

export default function MarketingPage() {
  return (
    <>
      <TopBar greeting="Marketing Materials" subtitle="Download professional assets to grow your network" initials="MD" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m.name} className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col">
            <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
              <Icon name={m.icon} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg text-primary mb-1">{m.name}</h3>
            <p className="text-sm text-on-surface-variant mb-4">{m.type} · {m.size}</p>
            <Button variant="ghost" size="sm" className="mt-auto self-start">
              <Icon name="download" size="sm" className="mr-2" />Download
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
