import { Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { selectEnabledModules } from '@/modules/settings';
import type { Page } from '@/shared/types/page';
import {
	SubscriptionsPage,
	SubscriptionsPageSkeleton,
	SubscriptionDetailPage,
	SubscriptionDetailPageSkeleton,
} from '@/modules/subscriptions';
import {
	SubscriptionAnalyticsPage,
	SubscriptionAnalyticsPageSkeleton,
	AnalyticsPage,
} from '@/modules/analytics';
import { SettingsPage } from '@/modules/settings';
import {
	PAGE_PATHS,
	SUBSCRIPTION_DETAIL_PATH,
	LICENSE_DETAIL_PATH,
	SETTINGS_TAB_PATH,
} from './paths';

// Overview
import { OverviewPage } from '@/modules/overview';

// Downloads
import { DownloadsPage, DownloadsPageSkeleton } from '@/modules/downloads';

// Licenses
import {
	LicensesPage,
	LicensesPageSkeleton,
	LicenseDetailPage,
	LicenseDetailPageSkeleton,
	LicenseSummaryPage,
} from '@/modules/licenses';

import {
	UpdatesPage,
	UpdatesPageSkeleton,
	UpdateAnalyticsPage,
} from '@/modules/updates';
// SaaS Accounts
import { SaasAccountsPage, SaasAccountsPageSkeleton } from '@/modules/saas-accounts';

// Module stubs
import { AffiliatesPage } from '@/modules/affiliates';
import { AbandonedCartPage } from '@/modules/abandoned-cart';
import { SecurityPage } from '@/modules/security';

/**
 * All routes for the app.
 *
 * Kept here rather than inline in App.tsx so route definitions, and the
 * components they map to, live in one place. React Router v6 ranks static
 * path segments above dynamic ones, so `/subscriptions/analytics` always
 * matches its own route rather than being swallowed by `/subscriptions/:id`,
 * regardless of declaration order.
 */
export function AppRoutes() {
	const navigate = useNavigate();
	const enabledModules = useAppSelector( selectEnabledModules );

	/** Guard route: if module is disabled, redirect to Overview */
	const guard = ( moduleId: Page, element: JSX.Element ) => {
		if ( enabledModules && enabledModules[ moduleId ] === false ) {
			return <Navigate to={ PAGE_PATHS.overview } replace />;
		}
		return element;
	};

	return (
		<Routes>
			{ /* Default redirect to Overview */ }
			<Route
				path="/"
				element={ <Navigate to={ PAGE_PATHS.overview } replace /> }
			/>

			{ /* Overview */ }
			<Route
				path={ PAGE_PATHS.overview }
				element={ <OverviewPage /> }
			/>

			{ /* Licenses */ }
			<Route
				path={ PAGE_PATHS.licenses }
				element={ guard(
					'licenses',
					<Suspense
						key="licenses"
						fallback={ <LicensesPageSkeleton /> }
					>
						<LicensesPage />
					</Suspense>
				) }
			/>
			<Route
				path={ PAGE_PATHS[ 'license-summary' ] }
				element={ guard( 'licenses', <LicenseSummaryPage /> ) }
			/>
			<Route
				path={ LICENSE_DETAIL_PATH }
				element={ guard(
					'licenses',
					<Suspense
						key="license-detail"
						fallback={ <LicenseDetailPageSkeleton /> }
					>
						<LicenseDetailPage />
					</Suspense>
				) }
			/>

			{ /* Downloads */ }
			<Route
				path={ PAGE_PATHS.downloads }
				element={ guard(
					'downloads',
					<Suspense key="downloads" fallback={ <DownloadsPageSkeleton /> }>
						<DownloadsPage />
					</Suspense>
				) }
			/>

			{ /* Updates */ }
			<Route
				path={ PAGE_PATHS.updates }
				element={ guard(
					'updates',
					<Suspense
						key="updates"
						fallback={ <UpdatesPageSkeleton /> }
					>
						<UpdatesPage />
					</Suspense>
				) }
			/>
			<Route
				path="/updates/analytics"
				element={ guard( 'updates', <UpdateAnalyticsPage /> ) }
			/>

			{ /* Subscriptions */ }
			<Route
				path={ PAGE_PATHS.subscriptions }
				element={ guard(
					'subscriptions',
					<Suspense
						key="subscriptions"
						fallback={ <SubscriptionsPageSkeleton /> }
					>
						<SubscriptionsPage />
					</Suspense>
				) }
			/>
			<Route
				path={ SUBSCRIPTION_DETAIL_PATH }
				element={ guard(
					'subscriptions',
					<Suspense
						key="subscription-detail"
						fallback={ <SubscriptionDetailPageSkeleton /> }
					>
						<SubscriptionDetailPage />
					</Suspense>
				) }
			/>
			<Route
				path={ PAGE_PATHS[ 'subscription-analytics' ] }
				element={ guard(
					'subscriptions',
					<Suspense
						key="subscription-analytics"
						fallback={ <SubscriptionAnalyticsPageSkeleton /> }
					>
						<SubscriptionAnalyticsPage />
					</Suspense>
				) }
			/>

			{ /* SaaS Accounts */ }
			<Route
				path={ PAGE_PATHS[ 'saas-accounts' ] }
				element={ guard(
					'saas-accounts',
					<Suspense
						key="saas-accounts"
						fallback={ <SaasAccountsPageSkeleton /> }
					>
						<SaasAccountsPage />
					</Suspense>
				) }
			/>

			{ /* Affiliates */ }
			<Route
				path={ PAGE_PATHS.affiliates }
				element={ guard( 'affiliates', <AffiliatesPage /> ) }
			/>

			{ /* Abandoned Cart */ }
			<Route
				path={ PAGE_PATHS[ 'abandoned-cart' ] }
				element={ guard( 'abandoned-cart', <AbandonedCartPage /> ) }
			/>

			{ /* Security */ }
			<Route path={ PAGE_PATHS.security } element={ guard( 'security', <SecurityPage /> ) } />

			{ /* Analytics */ }
			<Route
				path={ PAGE_PATHS.analytics }
				element={ guard( 'analytics', <AnalyticsPage /> ) }
			/>

			{ /* Settings */ }
			<Route path={ PAGE_PATHS.settings } element={ <SettingsPage /> } />
			<Route path={ SETTINGS_TAB_PATH } element={ <SettingsPage /> } />
		</Routes>
	);
}
