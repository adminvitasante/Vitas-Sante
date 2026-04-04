"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

export default function VerificationPage() {
  const [verified, setVerified] = useState(false);

  return (
    <>
      <TopBar greeting="Patient Verification" subtitle="Verify member eligibility before consultation" initials="JB" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-2xl p-8">
            <h3 className="font-headline font-bold text-xl text-primary mb-6">Search Patient</h3>
            <div className="space-y-4">
              <Input id="memberId" label="Member ID or NFC" placeholder="VSC-XXXXX-HT" />
              <Button className="w-full" onClick={() => setVerified(true)}>
                <Icon name="search" size="sm" className="mr-2" />Verify Member
              </Button>
            </div>
          </div>
        </section>
        <section className="lg:col-span-7">
          {verified ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xl">MC</div>
                  <div>
                    <h3 className="font-headline font-bold text-2xl text-primary">Marie-Ange Celestin</h3>
                    <p className="font-mono text-sm text-on-surface-variant">VSC-8829-HT</p>
                  </div>
                </div>
                <Badge variant="success" icon="check_circle">Verified Member</Badge>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Plan</p><p className="font-bold text-primary">Global Wellness Plus</p></div>
                <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Status</p><Badge variant="success">Active</Badge></div>
                <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Remaining Credits</p><p className="font-bold text-primary">14 Units</p></div>
                <div><p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Specialist</p><p className="font-bold text-primary">2/3 Available</p></div>
              </div>
              <div className="border-t border-outline-variant/20 pt-6">
                <h4 className="font-headline font-bold text-lg text-primary mb-4">Register Encounter</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Service Type</label>
                    <select className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface text-sm focus:ring-2 focus:ring-primary">
                      <option>Generalist Consultation</option><option>Specialist Consultation</option><option>Televisit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Visit Notes</label>
                    <textarea rows={3} className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface text-sm resize-none focus:ring-2 focus:ring-primary" placeholder="Clinical observations..." />
                  </div>
                  <Button className="w-full"><Icon name="check" size="sm" className="mr-2" />Confirm Visit &amp; Deduct Credit</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl p-16 flex flex-col items-center justify-center text-center">
              <Icon name="search" size="xl" className="text-outline mb-4" />
              <h3 className="font-headline font-bold text-xl text-on-surface-variant mb-2">Search for a Patient</h3>
              <p className="text-on-surface-variant text-sm">Enter a Member ID or use NFC to verify eligibility.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
