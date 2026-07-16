import {
  Activity,
  BarChart3,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageCircle,
  Newspaper,
  PlusCircle,
  Radar,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Activity,
  BarChart3,
  ClipboardList,
  FolderOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageCircle,
  Newspaper,
  PlusCircle,
  Radar,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCircle,
  Users,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Home;
  return <Icon className={className} aria-hidden="true" />;
}
