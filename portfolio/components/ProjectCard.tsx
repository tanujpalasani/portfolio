type ProjectCardProps = {
  name: string;
  description: string;
  techStack: string[];
  href: string;
};

export default function ProjectCard({ name, description, techStack, href }: ProjectCardProps) {
  return (
    <article className="group flex h-full min-h-[178px] flex-col rounded-xl border border-white/8 bg-white/[0.025] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_12px_26px_rgba(2,6,23,0.34)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5 text-white">{name}</h3>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-slate-300/90 transition hover:text-white"
        >
          GitHub
        </a>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-300/85">{description}</p>
      <div className="mt-auto pt-3">
        <div className="flex flex-wrap gap-1.5">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium tracking-wide text-slate-200/90"
          >
            {tech}
          </span>
        ))}
        </div>
      </div>
    </article>
  );
}
