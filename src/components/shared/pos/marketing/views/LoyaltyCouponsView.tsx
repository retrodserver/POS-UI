import { useState } from "react";
import {
  Award,
  TicketPercent,
  Plus,
  CheckCircle2,
  Copy,
} from "lucide-react";
import type { LoyaltyTier, PromoVoucher } from "@/types/posMarketing";
import { toast } from "sonner";
import { PosDataGrid } from "@/components/ui/data-grid";
import type { DataGridColumn } from "@/components/ui/data-grid/types";

type LoyaltyCouponsViewProps = {
  loyaltyTiers: LoyaltyTier[];
  promoVouchers: PromoVoucher[];
  onOpenNewVoucherModal: () => void;
};

export function LoyaltyCouponsView({
  loyaltyTiers,
  promoVouchers,
  onOpenNewVoucherModal,
}: LoyaltyCouponsViewProps) {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied promo code ${code} to clipboard`);
  };

  const voucherColumns: DataGridColumn<PromoVoucher>[] = [
    {
      id: "code",
      header: "Promo Code",
      sortable: true,
      filterable: true,
      width: 170,
      render: (val: any) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
            {val}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyCode(val);
            }}
            className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            title="Copy Code"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      ),
    },
    {
      id: "title",
      header: "Campaign Name",
      sortable: true,
      filterable: true,
      width: 220,
      render: (val: any) => <span className="font-semibold text-foreground">{val}</span>,
    },
    {
      id: "discountValue",
      header: "Discount Offer",
      sortable: true,
      width: 160,
      render: (_: any, vch: PromoVoucher) => (
        <div>
          <span className="font-bold text-primary">
            {vch.discountType === "percentage"
              ? `${vch.discountValue}% OFF`
              : `₹${vch.discountValue} FLAT`}
          </span>
          {vch.maxDiscount && (
            <span className="text-[10px] text-muted-foreground block">
              Up to ₹{vch.maxDiscount}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "minOrderValue",
      header: "Min Order",
      sortable: true,
      align: "right",
      width: 120,
      render: (val: any) => <span className="font-mono font-semibold text-foreground">₹{val}</span>,
    },
    {
      id: "validUntil",
      header: "Validity",
      sortable: true,
      width: 130,
      render: (val: any) => <span className="text-muted-foreground text-xs">{val}</span>,
    },
    {
      id: "redemptions",
      header: "Redemptions",
      sortable: true,
      width: 160,
      getValue: (vch: PromoVoucher) => `${vch.totalRedeemed} of ${vch.totalIssued}`,
      render: (_: any, vch: PromoVoucher) => {
        const redemptionPercent = Math.round((vch.totalRedeemed / Math.max(1, vch.totalIssued)) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, redemptionPercent)}%` }}
              />
            </div>
            <span className="font-bold text-foreground text-xs">
              {vch.totalRedeemed} / {vch.totalIssued}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      align: "center",
      width: 120,
      render: (val: any) => (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. VIP Loyalty Program Tiers Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-600" />
              <span>Tiered VIP Loyalty Club Configurator</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Automatic tier upgrades based on lifetime dine-in spend and visits
            </p>
          </div>
          <span className="text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
            1,480 Enrolled Diners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loyaltyTiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-surface rounded-2xl border border-border p-4 shadow-xs flex flex-col justify-between hover:border-border/80 transition"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tier.badgeBg}`}>
                    {tier.name}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {tier.memberCount} Members
                  </span>
                </div>

                <div className="text-xs font-semibold text-muted-foreground mt-1">
                  Threshold:{" "}
                  <strong className="text-foreground font-bold">
                    {tier.minPoints > 0 ? `${tier.minPoints} Pts` : "Entry Level"}
                  </strong>
                </div>

                <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md mt-2 border border-primary/20 inline-block">
                  Earn Rate: {tier.earnMultiplier}
                </div>

                {/* Benefits List */}
                <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Privileges:
                  </div>
                  {tier.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Promo Coupons & Discount Vouchers Data Grid */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TicketPercent className="h-4 w-4 text-primary" />
              <span>Active Promo Codes & Discount Vouchers</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Coupons applied at POS billing checkout or sent via automated campaigns
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNewVoucherModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold transition shadow-xs cursor-pointer hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span>Create Promo Code</span>
          </button>
        </div>

        <PosDataGrid
          data={promoVouchers}
          columns={voucherColumns}
          keyField="id"
          title="Promo Vouchers"
          subtitle="Search campaign names or filter by discount percentage"
          showToolbar
          selectable
          storageKey="pos-marketing-promo-vouchers"
          themeVariant="primary"
          pageSize={10}
        />
      </div>
    </div>
  );
}
