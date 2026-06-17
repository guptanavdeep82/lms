"use client";

import { useEffect, useState } from "react";
import { Loader2, User } from "lucide-react";
import { loginStudent, saveStudentProfile } from "@/lib/student-auth";
import { fetchStates, type StateOption } from "@/lib/student-registration";
import { fetchStudentProfile, updateStudentProfile, type StudentProfileResponse } from "@/lib/student-dashboard";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

export function StudentProfilePanel() {
  const email = useStudentEmail();
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: "", mobile: "", state_id: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    Promise.all([fetchStudentProfile(email), fetchStates()])
      .then(([profileData, stateList]) => {
        if (profileData) {
          setProfile(profileData);
          setProfileForm({
            name: profileData.name,
            mobile: profileData.mobile || "",
            state_id: profileData.state?.id ? String(profileData.state.id) : "",
          });
        }
        setStates(stateList);
      })
      .finally(() => setLoading(false));
  }, [email]);

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setProfileSaving(true);
    setProfileMessage("");
    try {
      const updated = await updateStudentProfile({
        email,
        name: profileForm.name.trim(),
        mobile: profileForm.mobile.trim() || undefined,
        state_id: profileForm.state_id ? Number(profileForm.state_id) : undefined,
      });
      if (updated) {
        setProfile(updated);
        saveStudentProfile({
          name: updated.name,
          email: updated.email,
          mobile: updated.mobile || undefined,
          stateId: updated.state?.id,
          stateName: updated.state?.name,
        });
        loginStudent({
          email: updated.email,
          name: updated.name,
          mobile: updated.mobile || undefined,
          stateId: updated.state?.id,
          stateName: updated.state?.name,
        });
      }
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <StudentSectionCard eyebrow="Account" title="My Profile">
      <form onSubmit={handleProfileSave} className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#667085]">Full Name</span>
          <input className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#667085]">Email</span>
          <input className="h-12 w-full rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 text-[#667085]" value={email} readOnly />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#667085]">Mobile</span>
          <input className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={profileForm.mobile} onChange={(e) => setProfileForm((f) => ({ ...f, mobile: e.target.value }))} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#667085]">State</span>
          <select className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={profileForm.state_id} onChange={(e) => setProfileForm((f) => ({ ...f, state_id: e.target.value }))}>
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
        </label>
        {profile?.custom_discount_percent ? (
          <p className="md:col-span-2 rounded-2xl bg-[#eef2ff] px-4 py-3 text-sm font-semibold text-[#172a69]">
            Your admin discount: {profile.custom_discount_percent}% on eligible purchases.
          </p>
        ) : null}
        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={profileSaving} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#172a69] px-5 text-sm font-extrabold text-white disabled:opacity-60">
            {profileSaving ? <Loader2 className="animate-spin" size={16} /> : <User size={16} />}
            Save Profile
          </button>
          {profileMessage ? <span className="text-sm font-semibold text-[#0f9f78]">{profileMessage}</span> : null}
        </div>
      </form>
    </StudentSectionCard>
  );
}
