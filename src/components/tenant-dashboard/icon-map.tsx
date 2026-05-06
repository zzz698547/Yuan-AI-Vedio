import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  Clock3,
  Film,
  Play,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type DashboardIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const tenantDashboardIconMap: Record<string, DashboardIcon> = {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  Clock3,
  Film,
  Play,
  Sparkles,
  UploadCloud,
};
