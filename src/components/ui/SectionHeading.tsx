export default function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-mono text-2xl font-medium tracking-tight text-text sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
