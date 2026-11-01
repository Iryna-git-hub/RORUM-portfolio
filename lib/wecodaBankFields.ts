// Code-level fallback for the Community Membership donation panel's Bank
// Details list, used when Sanity has no bank rows (or a row has no label).
// Kept out of components/WecodaDonationSection.tsx because that file is
// "use client" and the page (a Server Component) reads these values too — a
// value imported from a "use client" module is only a client reference on
// the server, so `defaultBankFields[i]?.label` there would be `undefined`.

export interface BankField {
  label: string;
  value: string;
  copyable?: boolean;
}

export const defaultBankFields: BankField[] = [
  {
    label: "Beneficiary",
    value: "Women Entrepreneurs Commerce & Development Association (WECODA)",
  },
  { label: "CVR", value: "46365208" },
  { label: "Bank", value: "Danske Bank" },
  { label: "Account Type", value: "Danske Direkte Forening" },
  { label: "Account No.", value: "14165789", copyable: true },
  { label: "Reg. No.", value: "9570" },
  { label: "IBAN", value: "DK96 3000 0014 1657 89", copyable: true },
  { label: "SWIFT/BIC", value: "DABADKKK" },
  { label: "Currency", value: "DKK (Danish Krone)" },
];
