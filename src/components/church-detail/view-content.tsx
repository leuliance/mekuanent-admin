import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Building,
  Calendar,
  Check,
  X,
} from "lucide-react";
import { getLocalizedText, type Locale } from "@/stores/locale-store";
import type { TypedChurch } from "./types";
import { SectionCard } from "./section-card";
import { InfoRow } from "./info-row";

export function ViewContent({
  typedChurch,
  locale,
}: {
  typedChurch: TypedChurch;
  locale: Locale;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Contact Information">
          <div className="divide-y divide-border">
            <InfoRow
              icon={Phone}
              label="Phone"
              value={typedChurch.phone_number}
            />
            <InfoRow icon={Mail} label="Email" value={typedChurch.email} />
            <InfoRow icon={Globe} label="Website" value={typedChurch.website} />
          </div>
        </SectionCard>

        <SectionCard title="Location">
          <div className="divide-y divide-border">
            <InfoRow
              icon={MapPin}
              label="Address"
              value={getLocalizedText(typedChurch.address, locale)}
            />
            <InfoRow
              icon={Building}
              label="City"
              value={getLocalizedText(typedChurch.city, locale)}
            />
            <InfoRow
              icon={MapPin}
              label="Country"
              value={getLocalizedText(typedChurch.country, locale)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Description" className="md:col-span-2">
          {getLocalizedText(typedChurch.description, locale) ? (
            <div
              className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text HTML content
              dangerouslySetInnerHTML={{
                __html: getLocalizedText(typedChurch.description, locale),
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No description provided.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Registration Details">
          <div className="divide-y divide-border">
            <InfoRow
              icon={Calendar}
              label="Registered"
              value={new Date(typedChurch.created_at).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            />
            {typedChurch.verified_at && (
              <InfoRow
                icon={Check}
                label="Verified"
                value={new Date(typedChurch.verified_at).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              />
            )}
            {typedChurch.rejected_reason && (
              <InfoRow
                icon={X}
                label="Rejection Reason"
                value={typedChurch.rejected_reason}
              />
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
