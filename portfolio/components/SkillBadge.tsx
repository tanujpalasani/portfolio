type SkillBadgeProps = {
  label: string;
};

export default function SkillBadge({ label }: SkillBadgeProps) {
  return (
    <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-100/90 transition hover:border-white/20 hover:bg-white/[0.06]">
      {label}
    </span>
  );
}
