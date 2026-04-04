"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const plans = [
  {
    id: "essential",
    name: "Essential",
    price: "$120/yr",
    description: "Basic preventive care and annual check-ups",
  },
  {
    id: "advantage",
    name: "Advantage",
    price: "$280/yr",
    description: "Extended coverage with specialist visits and diagnostics",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$480/yr",
    description: "Comprehensive coverage including dental, vision, and mental health",
  },
];

const cities = ["Port-au-Prince", "Cap-Ha\u00eftien", "Gonaives", "Les Cayes", "Jacmel"];
const departments = ["Ouest", "Nord", "Artibonite", "Sud", "Sud-Est"];

const steps = ["Beneficiary Info", "Plan Selection", "Review & Confirm"];

export default function SponsorNewPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "",
    plan: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const selectedPlan = plans.find((p) => p.id === form.plan);

  return (
    <div>
      <TopBar
        greeting="Sponsor a New Member"
        subtitle="Complete the form to enroll a beneficiary"
        initials="SP"
      />

      {/* Progress Bar */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  i <= step
                    ? "clinical-gradient text-white"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {i < step ? (
                  <Icon name="check" size="sm" className="text-white" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest hidden sm:inline ${
                  i <= step ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded ${
                    i < step ? "bg-primary" : "bg-outline-variant"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step 1: Beneficiary Info */}
      {step === 0 && (
        <Card>
          <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight mb-6">
            Beneficiary Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              id="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
            <Input
              label="Last Name"
              id="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
            <Input
              label="Date of Birth"
              id="dob"
              type="date"
              value={form.dob}
              onChange={(e) => updateField("dob", e.target.value)}
            />
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <Input
              label="Phone"
              id="phone"
              type="tel"
              placeholder="+509 0000 0000"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <Input
              label="Street Address"
              id="address"
              placeholder="Enter street address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
            <div>
              <label
                htmlFor="city"
                className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
              >
                City
              </label>
              <select
                id="city"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface font-body text-sm focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="department"
                className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2"
              >
                Department
              </label>
              <select
                id="department"
                value={form.department}
                onChange={(e) => updateField("department", e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface font-body text-sm focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Plan Selection */}
      {step === 1 && (
        <Card>
          <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight mb-6">
            Select a Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => updateField("plan", plan.id)}
                className={`text-left rounded-2xl p-6 transition-all border-2 ${
                  form.plan === plan.id
                    ? "border-primary bg-primary-fixed"
                    : "border-outline-variant bg-surface-container-lowest hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-on-surface font-headline">
                    {plan.name}
                  </h4>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      form.plan === plan.id
                        ? "border-primary"
                        : "border-outline-variant"
                    }`}
                  >
                    {form.plan === plan.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
                <p className="text-2xl font-black text-primary tracking-tight mb-2">
                  {plan.price}
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {plan.description}
                </p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 2 && (
        <Card>
          <h3 className="text-lg font-bold text-on-surface font-headline tracking-tight mb-6">
            Review & Confirm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Beneficiary
              </h4>
              <p className="text-on-surface font-bold">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-sm text-on-surface-variant">{form.dob}</p>
              <p className="text-sm text-on-surface-variant">{form.email}</p>
              <p className="text-sm text-on-surface-variant">{form.phone}</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Address
              </h4>
              <p className="text-on-surface font-bold">{form.address}</p>
              <p className="text-sm text-on-surface-variant">
                {form.city}, {form.department}
              </p>
            </div>
          </div>
          {selectedPlan && (
            <div className="bg-primary-fixed rounded-2xl p-6">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                Selected Plan
              </h4>
              <div className="flex items-center gap-3">
                <p className="text-xl font-bold text-primary font-headline">
                  {selectedPlan.name}
                </p>
                <Badge variant="success">{selectedPlan.price}</Badge>
              </div>
              <p className="text-sm text-on-surface-variant mt-1">
                {selectedPlan.description}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <span className="flex items-center gap-2">
            <Icon name="arrow_back" size="sm" />
            Previous
          </span>
        </Button>
        {step < 2 ? (
          <Button
            variant="primary"
            onClick={() => setStep((s) => Math.min(2, s + 1))}
          >
            <span className="flex items-center gap-2">
              Next Step
              <Icon name="arrow_forward" size="sm" />
            </span>
          </Button>
        ) : (
          <Button variant="primary">
            <span className="flex items-center gap-2">
              <Icon name="check_circle" size="sm" />
              Confirm Sponsorship
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
