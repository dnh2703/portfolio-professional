import { siteConfig } from "@/shared/config";
import { cn } from "@/shared/lib";

const steps = ["date", "guests", "package", "payment", "review"] as const;
const currentStep = 3;

function PackageOption({ name, selected }: { name: string; selected: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-panel border p-2.5",
        selected ? "border-accent" : "border-surface-5",
      )}
    >
      <span className="flex justify-between text-meta">
        <span>{name}</span>
        <span
          className={cn(
            "size-3.5 rounded-full",
            selected ? "bg-accent" : "border border-line-hover",
          )}
        />
      </span>
      <span className={cn("h-1.5 rounded-sm bg-surface-6", selected ? "w-7/10" : "w-11/20")} />
    </div>
  );
}

/**
 * Card 02 preview: step 3 of the bilingual booking flow on a phone. Decorative; the card hides it
 * from assistive tech. The deposit is `siteConfig.amount`.
 */
export function BookingPreview() {
  return (
    <div className="flex h-115 w-59 shrink-0 flex-col gap-3 rounded-device border-8 border-surface-1 bg-bg px-4 py-5.5">
      <div className="flex items-center justify-between">
        <span className="text-micro text-muted">
          STEP {currentStep} / {steps.length}
        </span>
        <span className="rounded-full border border-surface-7 px-2 py-1 text-micro">
          EN ·{" "}
          <span lang="ar" dir="rtl">
            عربي
          </span>
        </span>
      </div>
      <div className="flex gap-1">
        {steps.map((step, index) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full",
              index < currentStep ? "bg-accent" : "bg-surface-5",
            )}
          />
        ))}
      </div>
      <div className="text-title font-medium tracking-tight">Choose a package</div>
      <div className="flex flex-col gap-2">
        <PackageOption name="Premium" selected />
        <PackageOption name="Standard" selected={false} />
      </div>
      <div className="flex flex-col gap-1.5 rounded-panel bg-surface-2 p-2.5 text-micro text-muted">
        <span className="flex justify-between">
          <span>Deposit today</span>
          <span className="text-fg">{siteConfig.amount}</span>
        </span>
        <span className="flex justify-between">
          <span>Installments</span>
          <span className="text-fg">3 ×</span>
        </span>
      </div>
      <div className="mt-auto flex h-11 items-center justify-between rounded-full bg-accent px-4 text-caption font-semibold text-bg">
        <span>Continue</span>
        <span>→</span>
      </div>
    </div>
  );
}
