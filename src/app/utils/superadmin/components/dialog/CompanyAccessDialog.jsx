"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X, Building2, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

/**
 * CompanyAccessDialog
 * SuperAdmin can toggle which companies are visible to a specific admin member.
 * "Hidden" companies are stored in the admin's `hiddenCompanies[]` field in Firestore.
 */
const CompanyAccessDialog = ({ open, onClose, member }) => {
  const [companies,       setCompanies]       = useState([]);
  const [hiddenIds,       setHiddenIds]       = useState(new Set());
  const [loading,         setLoading]         = useState(false);
  const [saving,          setSaving]          = useState(false);

  useEffect(() => {
    if (!open || !member?.uid) return;
    setLoading(true);
    axios.get(`/api/admin/company-access?uid=${member.uid}`)
      .then((res) => {
        setCompanies(res.data.companies || []);
        setHiddenIds(new Set(res.data.hiddenCompanies || []));
      })
      .catch(() => toast.error("Failed to load companies"))
      .finally(() => setLoading(false));
  }, [open, member?.uid]);

  const toggleCompany = (id) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch("/api/admin/company-access", {
        uid: member.uid,
        hiddenCompanies: [...hiddenIds],
      });
      toast.success("Company access updated");
      onClose();
    } catch {
      toast.error("Failed to update company access");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const visibleCount = companies.length - hiddenIds.size;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "88vh" }}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">Company Access</h2>
              <p className="text-xs text-slate-400 mt-1 truncate">
                Manage visible companies for <span className="font-semibold text-slate-600">{member?.name || member?.email}</span>
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Summary bar */}
          {!loading && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-300"
                  style={{ width: companies.length ? `${(visibleCount / companies.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 shrink-0">
                {visibleCount} / {companies.length} visible
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-5 py-4 space-y-2 bg-slate-50/40">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 size={22} className="animate-spin text-violet-400" />
              <p className="text-xs text-slate-400">Loading companies…</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Building2 size={24} className="text-slate-300" />
              <p className="text-sm text-slate-400 font-semibold">No companies found</p>
            </div>
          ) : (
            companies.map((co) => {
              const isHidden = hiddenIds.has(co.id);
              return (
                <button
                  key={co.id}
                  type="button"
                  onClick={() => toggleCompany(co.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                    isHidden
                      ? "bg-white border-slate-200 opacity-60"
                      : "bg-white border-violet-200 shadow-sm"
                  }`}
                >
                  {/* Logo or initials */}
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {co.companyLogo || co.companylogo ? (
                      <img src={co.companyLogo || co.companylogo} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 size={15} className="text-slate-400" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isHidden ? "text-slate-400 line-through" : "text-slate-800"}`}>
                      {co.name || "Unnamed Company"}
                    </p>
                    {co.companyAddress && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{co.companyAddress}</p>
                    )}
                  </div>

                  {/* Toggle indicator */}
                  <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    isHidden
                      ? "bg-slate-100 text-slate-400 border-slate-200"
                      : "bg-violet-50 text-violet-600 border-violet-200"
                  }`}>
                    {isHidden
                      ? <><EyeOff size={11} /> Hidden</>
                      : <><Eye size={11} /> Visible</>}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} className="text-violet-400" />
            Only affects this admin's view
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              {saving ? "Saving…" : "Save Access"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAccessDialog;
