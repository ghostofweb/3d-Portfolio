import Image from "next/image";

export default function Pill({ name, icon }: { name: string; icon?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-muted transition-colors hover:border-accent-cyan/60 hover:text-text">
      {icon && (
        <Image src={icon} alt="" width={14} height={14} className="opacity-80" />
      )}
      {name}
    </span>
  );
}
