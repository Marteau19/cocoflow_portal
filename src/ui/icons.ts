/**
 * ui/icons.ts
 *
 * The icon budget: fourteen. Adding a fifteenth requires removing one.
 *
 * Icon overload is a symptom of not deciding what matters, so the budget is
 * enforced by the type below rather than left to judgement at the call site.
 * Add a name to `IconName` and the map fails to compile until it is filled in;
 * add a key to the map that is not in `IconName` and that fails too.
 *
 * Icons render inline at text size in `currentColor`, and never inside a
 * tinted rounded square. See DESIGN.md sections 8 and 9.
 */

import {
  AlertTriangle,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  Info,
  MapPin,
  MessageSquare,
  Package,
  Search,
  User,
  type LucideIcon,
} from 'lucide-react';

export type IconName =
  | 'home'
  | 'calendar'
  | 'file-text'
  | 'package'
  | 'message-square'
  | 'user'
  | 'map-pin'
  | 'camera'
  | 'check'
  | 'chevron-right'
  | 'chevron-down'
  | 'search'
  | 'alert-triangle'
  | 'info';

export const icons: Record<IconName, LucideIcon> = {
  home: Home,
  calendar: Calendar,
  'file-text': FileText,
  package: Package,
  'message-square': MessageSquare,
  user: User,
  'map-pin': MapPin,
  camera: Camera,
  check: Check,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  search: Search,
  'alert-triangle': AlertTriangle,
  info: Info,
};
