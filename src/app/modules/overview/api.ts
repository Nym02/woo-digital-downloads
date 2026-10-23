/**
 * Overview Module API Client.
 *
 * Assembles a unified dashboard view by fetching aggregate signals in parallel
 * across core PureCart modules via their public APIs.
 *
 * @file
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { fetchSubscriptionReportSummary } from '@/modules/analytics';
import { fetchLicenseReportSummary } from '@/modules/licenses';
import { fetchDownloadLogs } from '@/modules/downloads';
import { fetchSaasStats } from '@/modules/saas-accounts';
import { fetchNotificationSignals } from '@/modules/notifications';
import { fetchVersions } from '@/modules/updates';
import { PAGE_PATHS } from '@/app/router/paths';
import type { OverviewData, OverviewAlertItem } from './types';

/**
 * Fetches and composes all overview dashboard metrics.
 *
 * Uses `Promise.allSettled` to guarantee that one failing endpoint will not
 * bring down the entire dashboard view.
 *
 * @since 1.0.0
 * @return {Promise<OverviewData>} Aggregated overview data.
 */
export async function fetchOverviewData(): Promise< OverviewData > {
	const [
		subSummaryResult,
		licenseSummaryResult,
		downloadsResult,
		saasStatsResult,
		signalsResult,
		versionsResult,
	] = await Promise.allSettled( [
		fetchSubscriptionReportSummary(),
		fetchLicenseReportSummary(),
		fetchDownloadLogs( { perPage: 1 } ),
		fetchSaasStats(),
		fetchNotificationSignals(),
		fetchVersions( { perPage: 1 } ),
	] );

	// 1. Subscription & Revenue Data
	const subSummary =
		subSummaryResult.status === 'fulfilled' ? subSummaryResult.value : null;

	const revenue = {
		mrr: subSummary?.mrr ?? 0,
		arr: subSummary?.arr ?? 0,
		revenueChurnRate: subSummary?.revenue_churn_rate ?? 0,
		monthlyTrend: ( subSummary?.revenue_by_month ?? [] ).map( ( m ) => ( {
			month: m.month,
			total: m.total,
			periods: m.periods,
		} ) ),
	};

	// 2. Licensing
	const licenseSummary =
		licenseSummaryResult.status === 'fulfilled'
			? licenseSummaryResult.value
			: null;

	const licenses = {
		total: licenseSummary?.stats.total ?? 0,
		active: licenseSummary?.stats.active ?? 0,
		expiring30d: licenseSummary?.stats.expiring_30d ?? 0,
		activationsCount: licenseSummary?.stats.activations_count ?? 0,
	};

	// 3. Downloads
	const downloadLogs =
		downloadsResult.status === 'fulfilled' ? downloadsResult.value : null;

	const downloads = {
		totalDownloads: downloadLogs?.stats.total_downloads ?? 0,
		todayDownloads: downloadLogs?.stats.today_downloads ?? 0,
		activeTokens: downloadLogs?.stats.active_tokens ?? 0,
	};

	// 4. SaaS Accounts
	const saasStats =
		saasStatsResult.status === 'fulfilled' ? saasStatsResult.value : null;

	const saas = {
		total: saasStats?.total ?? 0,
		active: saasStats?.active ?? 0,
		suspended: saasStats?.suspended ?? 0,
		provisionedToday: saasStats?.provisionedToday ?? 0,
	};

	// 5. Signals for alerts & subscription counts
	const signals =
		signalsResult.status === 'fulfilled'
			? signalsResult.value.signals
			: {
					pastDueSubscriptions: 0,
					pendingReauthSubscriptions: 0,
					expiringLicenses: 0,
					suspendedSaasAccounts: 0,
			  };

	// 6. Updates
	const versions =
		versionsResult.status === 'fulfilled' ? versionsResult.value : null;
	const totalReleases = versions?.total ?? 0;

	// Active subscriptions estimated from monthly trend or active license correlation
	const activeSubsEstimated =
		revenue.monthlyTrend.length > 0
			? revenue.monthlyTrend[ revenue.monthlyTrend.length - 1 ].periods
			: licenses.active;

	const subscriptions = {
		activeCount: activeSubsEstimated,
		pastDueCount: signals.pastDueSubscriptions,
		pendingReauthCount: signals.pendingReauthSubscriptions,
		totalCount:
			activeSubsEstimated +
			signals.pastDueCount +
			signals.pendingReauthCount,
	};

	// Build Actionable Alerts
	const alerts: OverviewAlertItem[] = [];

	if ( signals.pastDueSubscriptions > 0 ) {
		alerts.push( {
			id: 'past-due-subs',
			title: __( 'Past-due subscriptions', 'purecart' ),
			description: __(
				'Subscriptions failed renewal payment and require dunning or customer card update.',
				'purecart'
			),
			count: signals.pastDueSubscriptions,
			severity: 'critical',
			targetPath: PAGE_PATHS.subscriptions,
			actionLabel: __( 'View Subscriptions', 'purecart' ),
		} );
	}

	if ( signals.pendingReauthSubscriptions > 0 ) {
		alerts.push( {
			id: 'reauth-subs',
			title: __( 'Pending 3D Secure / SCA reauthorization', 'purecart' ),
			description: __(
				'Payments waiting for buyer bank authentication verification.',
				'purecart'
			),
			count: signals.pendingReauthSubscriptions,
			severity: 'warning',
			targetPath: PAGE_PATHS.subscriptions,
			actionLabel: __( 'Review Orders', 'purecart' ),
		} );
	}

	if ( signals.expiringLicenses > 0 ) {
		alerts.push( {
			id: 'expiring-licenses',
			title: __( 'Licenses expiring within 30 days', 'purecart' ),
			description: __(
				'Software licenses approaching their expiry date.',
				'purecart'
			),
			count: signals.expiringLicenses,
			severity: 'warning',
			targetPath: PAGE_PATHS.licenses,
			actionLabel: __( 'View Licenses', 'purecart' ),
		} );
	}

	if ( signals.suspendedSaasAccounts > 0 ) {
		alerts.push( {
			id: 'suspended-saas',
			title: __( 'Suspended SaaS accounts', 'purecart' ),
			description: __(
				'Accounts suspended due to billing delinquency or manual admin suspension.',
				'purecart'
			),
			count: signals.suspendedSaasAccounts,
			severity: 'info',
			targetPath: PAGE_PATHS[ 'saas-accounts' ],
			actionLabel: __( 'Manage Accounts', 'purecart' ),
		} );
	}

	return {
		revenue,
		subscriptions,
		licenses,
		downloads,
		saas,
		totalReleases,
		alerts,
	};
}
