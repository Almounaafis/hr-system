import { SectionIcon } from "./SectionIcon";

export function SectionHeader({ icon, tone, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <SectionIcon icon={icon} tone={tone} />
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-foreground leading-none mb-1.5">{title}</h3>
        {description && <p className="text-[12px] md:text-lg text-muted-foreground leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}
