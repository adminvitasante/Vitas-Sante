"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

export default function VerificationPage() {
  const [verified, setVerified] = useState(false);

  return (
    <>
      {/* Top Header / Profile Info */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">Patient Verification</h2>
          <p className="text-on-surface-variant font-medium">Scan ID or search credentials to register clinical visit.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-lowest px-4 py-2 rounded-full shadow-sm">
          <div className="text-right">
            <p className="text-sm font-bold text-primary">Dr. Jean-Baptiste L.</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">Senior Medical Officer</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Dr. Jean-Baptiste"
            className="w-12 h-12 rounded-full border-2 border-primary-fixed object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA8tjPThZdr2HoXFGguXyJJUDfRs_zRO7cIPqV-1TabL18NgaIdgSsR2L4qcCc8X-NeBYyUDfxPJEVL4tJXaAqRcLfS-fNmWwa6S9j9b0N5VG5PeVsuya151lQllSU8s33_gvl6AmhuZGDmVDc2Gu-1uzumFSLE5zSdr4IiRs9bJOp18Gucmo3Wz8D8MeKhmtI_dMJcVvDDy-wZZFizD43zZWmyOxTWJObgLRg_UVJAITorhklcmE5pN__bAMNeSGLu4x_G9Jw_mpH"
          />
        </div>
      </header>

      {/* Verification Tool Area (Bento Grid) */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        {/* Search & NFC Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Verify Member</h3>
            <div className="relative group">
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
                placeholder="NFC ID, Card Number or Name"
                type="text"
                onKeyDown={(e) => { if (e.key === "Enter") setVerified(true); }}
              />
            </div>
            <div
              className="mt-4 p-4 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:bg-primary-fixed/10 cursor-pointer transition-colors"
              onClick={() => setVerified(true)}
            >
              <Icon name="nfc" className="text-3xl" />
              <span className="text-xs font-bold">Touch NFC Card to Reader</span>
            </div>
          </section>

          <section className="bg-primary bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl text-white shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <Icon name="medical_information" className="text-4xl opacity-50" />
              <span className="bg-tertiary-fixed text-tertiary-container px-2 py-1 rounded text-[10px] font-black uppercase">System Ready</span>
            </div>
            <h4 className="font-headline text-xl font-bold mb-2">Live Network Sync</h4>
            <p className="text-primary-fixed text-sm leading-relaxed opacity-90">All verifications are processed through the global Vita Sant&eacute; ledger for instant eligibility confirmation.</p>
          </section>
        </div>

        {/* Patient Result View */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden h-full">
            {verified ? (
              <>
                <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center">
                  <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Identification Result</span>
                  <span className="flex items-center gap-1 text-secondary font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Verified Member
                  </span>
                </div>
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Patient Photo"
                      className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover shadow-lg border-4 border-white"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB6DSnU1VWOLrVlY1FgFdYFT8TsvM7SNeKiolBqxHmV1J-hdRN3U1JJ69J7dqz9WencGtn59E7mVnVvrPyKOxwp_aN2wk3Dycs_tP5i5BfT6liOGy9TSE-1RR8oy_uyJQJ0vdmUXtI5e_LKZMBFYzgZekgYfeoNV7aJzP5TQy9cKsmxmxKOsX7mUKxlhfwju2Re6Mol2qdGrKwet3haaB_IEEGyEyKzP7_tJrN40aAW4vBTXd7gvrRufMLVbw5iCsDaheKYt4FLACW"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary-container px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      Active Status
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-4">
                    <div className="col-span-2">
                      <h3 className="text-2xl font-extrabold text-blue-950">Marie-Ange Celestin</h3>
                      <p className="text-sm text-on-surface-variant font-medium">Member ID: VSC-8829-HT</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan Type</label>
                      <p className="font-headline font-bold text-primary">Global Wellness Plus</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining Credits</label>
                      <p className="font-headline font-bold text-secondary">14 Units (Consults)</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Visit</label>
                      <p className="font-medium text-on-surface text-sm">Oct 12, 2023</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Group</label>
                      <p className="font-medium text-error text-sm font-bold">O- Positive</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <Icon name="person_search" className="text-6xl text-outline-variant mb-4" />
                <h3 className="font-headline font-bold text-xl text-on-surface-variant mb-2">No Patient Selected</h3>
                <p className="text-on-surface-variant text-sm max-w-sm">Use the search field or tap an NFC card to verify a member&apos;s identity and eligibility.</p>
              </div>
            )}
          </div>
        </div>

        {/* Register Visit Form */}
        <div className="col-span-12 lg:col-span-5">
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm h-full">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">Register a Visit</h3>
            <form className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2">Service Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="py-3 px-4 rounded-xl border-2 border-primary-fixed bg-primary-fixed/20 text-primary font-bold text-xs flex items-center justify-center gap-2"
                    type="button"
                  >
                    <Icon name="medical_services" className="text-sm" /> Generalist
                  </button>
                  <button
                    className="py-3 px-4 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold text-xs flex items-center justify-center gap-2 hover:border-primary-fixed transition-colors"
                    type="button"
                  >
                    <Icon name="psychiatry" className="text-sm" /> Specialist
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">Date</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl text-sm p-3" type="date" defaultValue="2024-05-20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-2">Time</label>
                  <input className="w-full bg-surface-container-low border-none rounded-xl text-sm p-3" type="time" defaultValue="14:30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2">Visit Note</label>
                <textarea
                  className="w-full bg-surface-container-low border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-primary"
                  placeholder="Initial clinical findings or reason for visit..."
                  rows={4}
                />
              </div>
              <button
                className="w-full bg-primary text-white py-4 rounded-xl font-headline font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
                type="submit"
              >
                Confirm Visit &amp; Deduct Credit
                <Icon name="check_circle" />
              </button>
            </form>
          </section>
        </div>

        {/* Historical Consultations Table */}
        <div className="col-span-12 lg:col-span-7">
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest">Consultation History</h3>
              <button className="text-xs font-bold text-primary hover:underline">View All Records</button>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-left">
                <thead className="border-b border-outline-variant/10">
                  <tr>
                    <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinician</th>
                    <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <tr className="hover:bg-surface-container-low transition-colors group cursor-default">
                    <td className="py-4 text-xs font-medium text-on-surface">Oct 12, 2023</td>
                    <td className="py-4 text-xs font-medium text-primary">Dr. Pierre-Louis</td>
                    <td className="py-4 text-xs text-on-surface-variant">Generalist</td>
                    <td className="py-4">
                      <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-bold">Resolved</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group cursor-default">
                    <td className="py-4 text-xs font-medium text-on-surface">Aug 05, 2023</td>
                    <td className="py-4 text-xs font-medium text-primary">Dr. Jean-Baptiste</td>
                    <td className="py-4 text-xs text-on-surface-variant">Specialist</td>
                    <td className="py-4">
                      <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">Follow-up</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group cursor-default">
                    <td className="py-4 text-xs font-medium text-on-surface">May 19, 2023</td>
                    <td className="py-4 text-xs font-medium text-primary">Dr. Pierre-Louis</td>
                    <td className="py-4 text-xs text-on-surface-variant">Generalist</td>
                    <td className="py-4">
                      <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-bold">Resolved</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors group cursor-default">
                    <td className="py-4 text-xs font-medium text-on-surface">Jan 30, 2023</td>
                    <td className="py-4 text-xs font-medium text-primary">Dr. Pierre-Louis</td>
                    <td className="py-4 text-xs text-on-surface-variant">Screening</td>
                    <td className="py-4">
                      <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded-full font-bold">Clear</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full max-w-7xl mx-auto">
          <p className="text-xs text-slate-500">&copy; 2024 Vita Sant&eacute; Club. All Rights Reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Terms of Service</a>
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Compliance</a>
            <a className="text-xs text-slate-400 hover:text-blue-600 transition-colors" href="#">Global Standards</a>
          </div>
        </div>
      </footer>
    </>
  );
}
