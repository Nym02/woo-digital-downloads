/**
 * Main dashboard overview page.
 *
 * Displays unified KPI cards, 6-month revenue trend, system alerts feed,
 * and quick-jump navigation into every PureCart module.
 *
 * @file
 * @since 1.0.0
 */

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { M3 } from '@/theme';
import { getOrCreateResource } from '@/shared/suspense';
import { OutlinedButton } from '@/shared/ui/OutlinedButton';
import { fetchOverviewData } from '../api';
import { OverviewKpiStrip } from './OverviewKpiStrip';
import { OverviewRevenueChart } from './OverviewRevenueChart';
import { OverviewAlertsCard } from './OverviewAlertsCard';
import { OverviewQuickLinks } from './OverviewQuickLinks';
import type { OverviewData } from '../types';

export function OverviewPage() {
	// Suspends cleanly on initial render until the unified data resolves
	const initialData = getOrCreateResource< OverviewData >(
		'overview',
		fetchOverviewData
	).resource.read();

	const [ data, setData ] = useState< OverviewData >( initialData );
	const [ isRefreshing, setIsRefreshing ] = useState( false );

	const handleRefresh = async () => {
		setIsRefreshing( true );
		try {
			const refreshed = await fetchOverviewData();
			setData( refreshed );
		} finally {
			setIsRefreshing( false );
		}
	};

	const today = new Intl.DateTimeFormat( 'en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	} ).format( new Date() );

	return (
		<div className="space-y-6">
			{ /* Header */ }
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1
						className="text-2xl font-light tracking-tight mb-1"
						style={ {
							color: M3.onSurface,
							fontFamily: 'Roboto, sans-serif',
						} }
					>
						{ __( 'Store Overview', 'purecart' ) }
					</h1>
					<p
						className="text-xs"
						style={ {
							color: M3.onSurfaceVariant,
							fontFamily: 'Roboto, sans-serif',
						} }
					>
						{ today } &bull;{ ' ' }
						{ __(
							'Real-time performance across digital products and subscriptions.',
							'purecart'
						) }
					</p>
				</div>

				<div className="flex items-center gap-2">
					<OutlinedButton
						onClick={ handleRefresh }
						disabled={ isRefreshing }
					>
						<RefreshCw
							size={ 14 }
							className={ `mr-1.5 ${
								isRefreshing ? 'animate-spin' : ''
							}` }
						/>
						{ isRefreshing
							? __( 'Updating…', 'purecart' )
							: __( 'Refresh Data', 'purecart' ) }
					</OutlinedButton>
				</div>
			</div>

			{ /* KPI Metric Cards */ }
			<OverviewKpiStrip data={ data } />

			{ /* Mid Section: Revenue Trend & System Alerts */ }
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<OverviewRevenueChart revenue={ data.revenue } />
				</div>
				<div>
					<OverviewAlertsCard alerts={ data.alerts } />
				</div>
			</div>

			{ /* Bottom Section: Modules Navigation */ }
			<OverviewQuickLinks data={ data } />
		</div>
	);
}
