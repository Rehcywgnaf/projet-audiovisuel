// Core exports
export { TeamManager } from './core/TeamManager';
export type { Team, TeamMember, TeamState, TeamAction } from './core/types';

// UI exports
export { Dashboard } from './ui/dashboard';
export { KPIs } from './ui/dashboard/KPIs';
export { Navigation } from './ui/dashboard/Navigation';
export { TeamTracking } from './ui/tracking/TeamTracking';
export { MemberForm } from './ui/tracking/MemberForm';

// Utilities
export { ValidationError } from './ui/common/ValidationError';
export { useTeamTracking, useTeamMetrics } from './ui/tracking/hooks';