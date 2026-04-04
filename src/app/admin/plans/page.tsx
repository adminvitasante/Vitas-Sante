"use client";

import { TopBar } from "@/components/layout/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminPlansPage() {
  return (
    <>
      <TopBar greeting="Plan Configuration" subtitle="Manage membership tiers and pricing" initials="AD" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {[
            { name: "Essential", price: "$99/yr", members: "4,585", status: "Active" },
            { name: "Advantage", price: "$135/yr", members: "6,878", status: "Active" },
            { name: "Premium", price: "$200/yr", members: "3,821", status: "Active" },
          ].map((plan) => (
            <div key={plan.name} className="bg-surface-container-lowest rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="font-headline font-bold text-lg text-primary">{plan.name}</h4>
                <p className="text-sm text-on-surface-variant">{plan.price} · {plan.members} members</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">{plan.status}</Badge>
                <Button variant="secondary" size="sm">Edit</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-8">
          <h3 className="font-headline font-bold text-xl text-primary mb-6">Edit Plan Parameters</h3>
          <div className="space-y-6">
            <Input id="premium" label="Annual Premium ($)" type="number" placeholder="200" />
            <Input id="deductible" label="Deductible ($)" type="number" placeholder="50" />
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Benefit Coverage</label>
              <div className="space-y-4">
                {["Laboratory", "Pharmaceuticals", "Surgery"].map((b) => (
                  <div key={b} className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{b}</span>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="100" defaultValue="35" className="w-32 accent-primary" />
                      <span className="text-sm font-bold text-primary w-10 text-right">35%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Annual Visit Limits</label>
              <div className="grid grid-cols-2 gap-4">
                <Input id="specialist" label="Specialist Consults" type="number" placeholder="3" />
                <Input id="mental" label="Mental Health" type="number" placeholder="6" />
              </div>
            </div>
            <Button className="w-full">Save Configuration</Button>
            <div className="p-4 bg-surface-container-low rounded-xl">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Impact Forecast</p>
              <p className="text-sm text-on-surface-variant">Revenue Delta: <span className="font-bold text-secondary">+12.4%</span> · Retention Risk: <span className="font-bold text-secondary">LOW</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
