/**
 * Overview KPI Strip.
 *
 * Displays top-level store metrics: MRR, Subscriptions, Licenses, Downloads, and SaaS.
 *
 * @file
 * @since 1.0.0
 */

import {
	DollarSign,
	RefreshCw,
	KeyRound,
	DownloadCloud,
	Cloud,
} from 'lucide-react';
import { __, sprintf } from '@wordpress/i18n';
import { M3 } from '@/theme';
import { Card } from '@/shared/ui/Card';
import type { OverviewData } from '../types';

interface OverviewKpiStripProps {
	data: OverviewData;
}

export function OverviewKpiStrip( { data }: OverviewKpiStripProps ) {
	const formatCurrency = ( val: number ) =>
		new Intl.NumberFormat( 'en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		} ).format( val );

	const formatNumber = ( val: number ) =>
		new Intl.NumberFormat( 'en-US' ).format( val );

	const cards = [
		{
			id: 'mrr',
			label: __( 'Monthly Recurring Revenue', 'purecart' ),
			value: formatCurrency( data.revenue.mrr ),
			subtext: sprintf(
				/* translators: %s: formatted annual recurring revenue */
				__( 'ARR: %s', 'purecart' ),
				formatCurrency( data.revenue.arr )
			),
			icon: DollarSign,
			accentColor: M3.primary,
			iconBg: M3.primaryContainer,
		},
		{
			id: 'subscriptions',
			label: __( 'Active Subscriptions', 'purecart' ),
			value: formatNumber( data.subscriptions.activeCount ),
			subtext:
				data.subscriptions.pastDueCount > 0
					? sprintf(
							/* translators: %d: count of past due subscriptions */
							__( '%d past-due', 'purecart' ),
							data.subscriptions.pastDueCount
					  )
					: sprintf(
							/* translators: %s: churn percentage */
							__( 'Churn: %s%%', 'purecart' ),
							data.revenue.revenueChurnRate.toFixed( 1 )
					  ),
			icon: RefreshCw,
			accentColor:
				data.subscriptions.pastDueCount > 0 ? M3.error : M3.success,
			iconBg:
				data.subscriptions.pastDueCount > 0
					? M3.errorContainer
					: M3.successContainer,
		},
		{
			id: 'licenses',
			label: __( 'Active Licenses', 'purecart' ),
			value: formatNumber( data.licenses.active ),
			subtext:
				data.licenses.expiring30d > 0
					? sprintf(
							/* translators: %d: count of licenses expiring soon */
							__( '%d expiring in 30d', 'purecart' ),
							data.licenses.expiring30d
					  )
					: sprintf(
							/* translators: %d: count of total activations */
							__( '%d activations', 'purecart' ),
							data.licenses.activationsCount
					  ),
			icon: KeyRound,
			accentColor: data.licenses.expiring30d > 0 ? M3.warning : M3.info,
			iconBg:
				data.licenses.expiring30d > 0
					? M3.warningContainer
					: M3.infoContainer,
		},
		{
			id: 'downloads',
			label: __( 'Total Downloads', 'purecart' ),
			value: formatNumber( data.downloads.totalDownloads ),
			subtext: sprintf(
				/* translators: %d: count of downloads today */
				__( '%d served today', 'purecart' ),
				data.downloads.todayDownloads
			),
			icon: DownloadCloud,
			accentColor: M3.secondary,
			iconBg: M3.secondaryContainer,
		},
		{
			id: 'saas',
			label: __( 'Active SaaS Accounts', 'purecart' ),
			value: formatNumber( data.saas.active ),
			subtext: sprintf(
				/* translators: %d: count of accounts provisioned today */
				__( '%d provisioned today', 'purecart' ),
				data.saas.provisionedToday
			),
			icon: Cloud,
			accentColor: M3.primary,
			iconBg: M3.primaryContainer,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
			{ cards.map( ( c ) => {
				const Icon = c.icon;
				return (
					<Card
						key={ c.id }
						className="p-4 flex flex-col justify-between"
					>
						<div>
							<div className="flex items-center justify-between mb-2">
								<span
									className="text-xs font-semibold uppercase tracking-wider"
									style={ {
										color: M3.onSurfaceVariant,
										fontFamily: 'Roboto, sans-serif',
									} }
								>
									{ c.label }
								</span>
								<div
									className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
									style={ { backgroundColor: c.iconBg } }
								>
									<Icon size={ 16 } color={ c.accentColor } />
								</div>
							</div>
							<div
								className="text-2xl font-light mb-1 tracking-tight"
								style={ {
									color: M3.onSurface,
									fontFamily: 'Roboto, sans-serif',
								} }
							>
								{ c.value }
							</div>
						</div>
						<div
							className="text-xs font-medium mt-2"
							style={ {
								color: M3.onSurfaceVariant,
								fontFamily: 'Roboto, sans-serif',
							} }
						>
							{ c.subtext }
						</div>
					</Card>
				);
			} ) }
		</div>
	);
}
