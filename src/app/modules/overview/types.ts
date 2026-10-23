/**
 * Overview Module Types.
 *
 * Domain types for store-wide KPI aggregates, revenue trends, alerts,
 * and quick-navigation cards.
 *
 * @file
 * @since 1.0.0
 */

export interface OverviewRevenueData {
	mrr: number;
	arr: number;
	revenueChurnRate: number;
	monthlyTrend: Array< {
		month: string;
		total: number;
		periods: number;
	} >;
}

export interface OverviewSubscriptionStats {
	activeCount: number;
	pastDueCount: number;
	pendingReauthCount: number;
	totalCount: number;
}

export interface OverviewLicenseStats {
	total: number;
	active: number;
	expiring30d: number;
	activationsCount: number;
}

export interface OverviewDownloadStats {
	totalDownloads: number;
	todayDownloads: number;
	activeTokens: number;
}

export interface OverviewSaasStats {
	total: number;
	active: number;
	suspended: number;
	provisionedToday: number;
}

export interface OverviewAlertItem {
	id: string;
	title: string;
	description: string;
	count: number;
	severity: 'critical' | 'warning' | 'info';
	targetPath: string;
	actionLabel: string;
}

export interface OverviewQuickLink {
	id: string;
	title: string;
	description: string;
	path: string;
	countLabel?: string;
	badgeVariant?: 'primary' | 'secondary' | 'success';
}

export interface OverviewData {
	revenue: OverviewRevenueData;
	subscriptions: OverviewSubscriptionStats;
	licenses: OverviewLicenseStats;
	downloads: OverviewDownloadStats;
	saas: OverviewSaasStats;
	totalReleases: number;
	alerts: OverviewAlertItem[];
}
