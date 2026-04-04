import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const dependents = [
  {
    id: 1,
    name: "Sarah Valcourt",
    relation: "Spouse",
    age: 34,
    creditUsed: 1450.0,
    creditTotal: 2000.0,
    avatar: "SV",
    status: "Active",
    lastVisit: "Sep 28, 2024",
    plan: "Premium Family",
  },
  {
    id: 2,
    name: "Leo Valcourt",
    relation: "Child",
    age: 6,
    creditUsed: 850.0,
    creditTotal: 1200.0,
    avatar: "LV",
    status: "Active",
    lastVisit: "Oct 1, 2024",
    plan: "Premium Family",
  },
];

export default function DependentsPage() {
  return (
    <>
      <TopBar
        greeting="Dependents"
        subtitle="Manage your family members and their benefits."
        initials="JP"
      />

      {/* Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Dependents" value="2" icon="groups" />
        <StatCard
          label="Total Credit"
          value="€2,300.00"
          icon="account_balance_wallet"
        />
        <StatCard
          label="Annual Used"
          value="80%"
          icon="donut_large"
          trend="On track for the year"
          trendUp
        />
      </section>

      {/* Dependent Cards */}
      <section className="space-y-6 mb-8">
        {dependents.map((dep) => {
          const usagePercent = Math.round((dep.creditUsed / dep.creditTotal) * 100);
          return (
            <div
              key={dep.id}
              className="bg-surface-container-lowest rounded-2xl p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar + Info */}
                <div className="flex items-center gap-5 flex-1">
                  <div className="w-16 h-16 rounded-2xl clinical-gradient flex items-center justify-center text-white font-black text-xl font-headline">
                    {dep.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-primary tracking-tight font-headline">
                        {dep.name}
                      </h3>
                      <Badge variant="success" icon="check_circle">
                        {dep.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Icon name="family_restroom" size="sm" />
                        {dep.relation}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="cake" size="sm" />
                        {dep.age} years old
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="event" size="sm" />
                        Last visit: {dep.lastVisit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Icon name="visibility" size="sm" className="mr-1" />
                    View
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Icon name="edit" size="sm" className="mr-1" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* Credit Usage */}
              <div className="mt-6 p-5 bg-surface-container-low/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-on-surface-variant">
                    Credit Used
                  </span>
                  <span className="text-sm font-bold text-primary">
                    €{dep.creditUsed.toFixed(2)} / €{dep.creditTotal.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full clinical-gradient rounded-full transition-all"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  {usagePercent}% of annual benefit used — {dep.plan}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Add Dependent */}
      <section>
        <Button variant="primary" size="lg">
          <Icon name="person_add" size="sm" className="mr-2" />
          Add New Dependent
        </Button>
      </section>
    </>
  );
}
