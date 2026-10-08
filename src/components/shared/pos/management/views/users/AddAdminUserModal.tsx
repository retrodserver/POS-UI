import { useState, useEffect, useId } from "react";
import { X, User, Mail, ShieldCheck, Building2, Phone, AlertCircle, Check } from "lucide-react";

export interface AdminUserFormData {
  id?: string;
  name: string;
  email: string;
  type: string;
  outlet: string;
  phone?: string;
  status: "Active" | "Inactive";
}

interface AddAdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AdminUserFormData) => void;
  initialData?: AdminUserFormData | null;
  existingEmails?: string[];
}

const ROLE_OPTIONS = [
  "Restaurant User",
  "Franchise Owner",
  "General Store Manager",
  "Operations Director",
  "System Auditor",
];

const OUTLET_OPTIONS = [
  "HIGHWAY INN BAR & RESTAURANT",
  "All Outlets",
  "Outlet #2 - Downtown Lounge",
  "Outlet #3 - Express Counter",
  "Main Kitchen & Commissary",
];

export function AddAdminUserModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingEmails = [],
}: AddAdminUserModalProps) {
  const isEditMode = Boolean(initialData?.id);
  const formId = useId();

  const [formData, setFormData] = useState<AdminUserFormData>({
    name: "",
    email: "",
    type: "Restaurant User",
    outlet: "HIGHWAY INN BAR & RESTAURANT",
    phone: "",
    status: "Active",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        email: initialData.email || "",
        type: initialData.type || "Restaurant User",
        outlet: initialData.outlet || "HIGHWAY INN BAR & RESTAURANT",
        phone: initialData.phone || "",
        status: initialData.status || "Active",
      });
      setTouched({});
      setErrors({});
    } else {
      setFormData({
        name: "",
        email: "",
        type: "Restaurant User",
        outlet: "HIGHWAY INN BAR & RESTAURANT",
        phone: "",
        status: "Active",
      });
      setTouched({});
      setErrors({});
    }
  }, [initialData, isOpen]);

  // Validation engine
  const validate = (data: AdminUserFormData) => {
    const newErrors: Record<string, string> = {};

    // 1. Name validation (MANDATORY): Alphabets and spaces only
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      newErrors.name = "Admin User Name is mandatory";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      newErrors.name = "Name can only contain alphabets and spaces (no numbers or symbols)";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // 2. Email Address (MANDATORY): Valid email & unique
    const trimmedEmail = data.email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email Address is mandatory";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address (e.g. name@domain.com)";
    } else {
      const lower = trimmedEmail.toLowerCase();
      const isDuplicate = existingEmails.some(
        (e) => e.toLowerCase() === lower && (!initialData || initialData.email.toLowerCase() !== lower),
      );
      if (isDuplicate) {
        newErrors.email = "This email address is already assigned to another admin account";
      }
    }

    // 3. Role / Access Level (MANDATORY)
    if (!data.type.trim()) {
      newErrors.type = "Role / Access Level is mandatory";
    }

    // 4. Outlet Assignment (MANDATORY)
    if (!data.outlet.trim()) {
      newErrors.outlet = "Outlet Assignment is mandatory";
    }

    // 5. Mobile Phone (OPTIONAL): If provided, must be exactly 10 digits
    const trimmedPhone = data.phone ? data.phone.trim() : "";
    if (trimmedPhone) {
      if (!/^\d{10}$/.test(trimmedPhone)) {
        newErrors.phone = "Mobile number must contain exactly 10 digits";
      }
    }

    return newErrors;
  };

  const currentErrors = validate(formData);
  const isFormValid = Object.keys(currentErrors).length === 0;

  const handleBlur = (field: keyof AdminUserFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleNameChange = (val: string) => {
    const updated = { ...formData, name: val };
    setFormData(updated);
    if (touched.name) {
      setErrors(validate(updated));
    }
  };

  const handleEmailChange = (val: string) => {
    const updated = { ...formData, email: val.trim() };
    setFormData(updated);
    if (touched.email) {
      setErrors(validate(updated));
    }
  };

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 10);
    const updated = { ...formData, phone: digitsOnly };
    setFormData(updated);
    if (touched.phone) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      type: true,
      outlet: true,
      phone: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">
                {isEditMode ? "Edit Admin User" : "Add New Admin User"}
              </h3>
              <p className="text-[12px] text-slate-500">
                Grant management portal access, role privileges, and outlet scopes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mandatory notice */}
          <div className="rounded-lg bg-teal-50/60 border border-teal-200/80 px-3.5 py-2 text-[12px] text-teal-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-teal-600" />
            <span>
              Fields marked with <strong className="text-rose-600">*</strong> are mandatory. You cannot proceed without filling them.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Admin Name (MANDATORY) */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`${formId}-name`}
                className="block text-[12.5px] font-semibold text-slate-800 mb-1"
              >
                Admin User Name <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-3.5 w-3.5" />
                </div>
                <input
                  id={`${formId}-name`}
                  type="text"
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`w-full rounded-lg border bg-white pl-9 pr-3.5 py-2 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    touched.name && currentErrors.name
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-teal-600 focus:ring-teal-100"
                  }`}
                />
              </div>
              {touched.name && currentErrors.name ? (
                <p className="mt-1 text-[11.5px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {currentErrors.name}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">Alphabets and spaces only</p>
              )}
            </div>

            {/* 2. Email Address (MANDATORY) */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`${formId}-email`}
                className="block text-[12.5px] font-semibold text-slate-800 mb-1"
              >
                Email Address <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  id={`${formId}-email`}
                  type="email"
                  placeholder="admin@retrodpos.com"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full rounded-lg border bg-white pl-9 pr-3.5 py-2 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    touched.email && currentErrors.email
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-teal-600 focus:ring-teal-100"
                  }`}
                />
              </div>
              {touched.email && currentErrors.email ? (
                <p className="mt-1 text-[11.5px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {currentErrors.email}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">Used for executive portal credentials</p>
              )}
            </div>

            {/* 3. Role / Access Level (MANDATORY) */}
            <div>
              <label
                htmlFor={`${formId}-type`}
                className="block text-[12.5px] font-semibold text-slate-800 mb-1"
              >
                Role / Access Level <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  id={`${formId}-type`}
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 cursor-pointer"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">System authorization level</p>
            </div>

            {/* 4. Outlet Assignment (MANDATORY) */}
            <div>
              <label
                htmlFor={`${formId}-outlet`}
                className="block text-[12.5px] font-semibold text-slate-800 mb-1"
              >
                Outlet Assignment <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  id={`${formId}-outlet`}
                  value={formData.outlet}
                  onChange={(e) => setFormData((prev) => ({ ...prev, outlet: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 cursor-pointer"
                >
                  {OUTLET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Target branch or all outlets</p>
            </div>

            {/* 5. Mobile Number (OPTIONAL - marked with nothing) */}
            <div>
              <label
                htmlFor={`${formId}-phone`}
                className="block text-[12.5px] font-medium text-slate-700 mb-1"
              >
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  inputMode="numeric"
                  placeholder="10 digit number"
                  maxLength={10}
                  value={formData.phone || ""}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={`w-full rounded-lg border bg-white pl-9 pr-3.5 py-2 text-[13px] font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    touched.phone && currentErrors.phone
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-teal-600 focus:ring-teal-100"
                  }`}
                />
              </div>
              {touched.phone && currentErrors.phone ? (
                <p className="mt-1 text-[11.5px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {currentErrors.phone}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">Optional 10-digit mobile number</p>
              )}
            </div>

            {/* 6. Account Status (OPTIONAL - marked with nothing) */}
            <div className="flex flex-col justify-center">
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1">
                Account Status
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      status: prev.status === "Active" ? "Inactive" : "Active",
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.status === "Active" ? "bg-teal-600" : "bg-slate-300"
                  }`}
                  aria-pressed={formData.status === "Active"}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.status === "Active" ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-[13px] font-medium text-slate-700">
                  {formData.status === "Active" ? (
                    <span className="text-teal-700 font-semibold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-slate-500">Inactive</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-slate-200 pt-4 mt-6 flex items-center justify-between gap-3">
            <div className="text-[12px] text-slate-500">
              {!isFormValid && (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Fill mandatory fields to proceed
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-[12.5px] font-semibold text-white shadow-xs hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title={!isFormValid ? "Fill all mandatory fields with valid data" : undefined}
              >
                {isEditMode ? "Save Changes" : "Add Admin User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
