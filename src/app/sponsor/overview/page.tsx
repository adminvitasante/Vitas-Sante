import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

export default function SponsorOverviewPage() {
  return (
    <div>
      <TopBar
        greeting="Welcome back, Partner"
        subtitle="Your sponsorship impact at a glance"
        initials="SP"
      />

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Investment"
          value="$450,200"
          icon="payments"
          trend="+12.4% vs last quarter"
          trendUp
        />
        <StatCard
          label="Active Beneficiaries"
          value="1,284"
          icon="group"
          trend="+42 new this month"
          trendUp
        />
        <StatCard
          label="Health Outcomes"
          value="94.2%"
          icon="health_and_safety"
          trend="Above 90% target"
          trendUp
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Cardiac Health", value: "+14%", icon: "cardiology" },
          { label: "Pediatric Care", value: "892", icon: "child_care" },
          { label: "Med Adherence", value: "98%", icon: "medication" },
          { label: "Mental Wellness", value: "450", icon: "psychology" },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 p-5">
            <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center shrink-0">
              <Icon name={stat.icon} size="sm" className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-xl font-black text-primary tracking-tight">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Wellness Champion */}
      <Card className="relative overflow-hidden">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
            <Icon name="emoji_events" size="lg" className="text-primary" filled />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-primary font-headline tracking-tight">
                Wellness Champion
              </h3>
              <Badge variant="success" icon="verified">
                Elite Premium Member
              </Badge>
            </div>
            <p className="text-lg font-bold text-on-surface mb-3">
              Beatrice Saint-Jean
            </p>
            <blockquote className="text-on-surface-variant italic leading-relaxed border-l-4 border-primary pl-4">
              &ldquo;Thanks to the sponsorship program, I was able to access
              preventive cardiac screening that caught an early condition. The
              comprehensive coverage gave me peace of mind and a healthier
              future for my family. I am forever grateful.&rdquo;
            </blockquote>
          </div>
        </div>
      </Card>
    </div>
  );
}
