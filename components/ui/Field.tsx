import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--text)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--text-secondary)]">{hint}</p>}
      {error && (
        <p className="text-xs text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const baseControlClasses =
  "w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={cn(baseControlClasses, invalid ? "border-[var(--danger)]" : "border-[var(--border)]", className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(baseControlClasses, "min-h-[100px] resize-y", invalid ? "border-[var(--danger)]" : "border-[var(--border)]", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      className={cn(baseControlClasses, "cursor-pointer", invalid ? "border-[var(--danger)]" : "border-[var(--border)]", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-2.5 text-sm text-[var(--text)]", className)}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent-soft)]"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

export function RadioCard({
  label,
  description,
  selected,
  onSelect,
  icon,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition",
        selected
          ? "border-[var(--accent)] bg-[var(--accent-soft)]/40 ring-1 ring-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/60 hover:bg-[var(--surface-soft)]"
      )}
    >
      {icon && <span className="mt-0.5 text-[var(--accent)]">{icon}</span>}
      <span>
        <span className="block text-sm font-medium text-[var(--text)]">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">{description}</span>}
      </span>
    </button>
  );
}
