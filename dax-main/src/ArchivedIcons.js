// src/archivedIcons.js

// — your automation components —
import AggressiveAccelerator from "./automation/AggressiveAccelerator";
import ContentManager         from "./automation/ContentManager";
import EmergencyMonetization  from "./automation/EmergencyMonetization";
import GrowthAccelerator      from "./automation/GrowthAccelerator";
import WorkFlowStatus         from "./automation/WorkFlowStatus";

// — outline‐style Heroicons —
import {
  MoonIcon,
  StarIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FunnelIcon,
  BoltIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";

// bundle them all under one object, no duplicates:
export const ArchivedIcons = {
  // automation widgets
  AggressiveAccelerator,
  ContentManager,
  EmergencyMonetization,
  GrowthAccelerator,
  WorkFlowStatus,

  // icons
  MoonIcon,
  StarIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FunnelIcon,
  BoltIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon
};