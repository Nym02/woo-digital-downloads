/**
 * Overview Revenue & Growth Chart.
 *
 * Displays a 6-month visual revenue progression chart with active periods.
 *
 * @file
 * @since 1.0.0
 */

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { M3 } from '@/theme';
import { Card } from '@/shared/ui/Card';
import { PAGE_PATHS } from '@/app/router/paths';
import type { OverviewRevenueData } from '../types';

interface OverviewRevenueChartProps {
	revenue: OverviewRevenueData;
}

export function OverviewRevenueChart( { revenue }: OverviewRevenueChartProps ) {
	const navigate = useNavigate();

	const chartData = ( revenue.monthlyTrend || [] ).map( ( item ) => ( {
		month: item.month,
		revenue: Number( item.total ) || 0,
		periods: Number( item.periods ) || 0,
	} ) );

	const formatCurrency = ( val: number ) =>
		new Intl.NumberFormat( 'en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		} ).format( val );

	return (
		<Card className="p-5 flex flex-col justify-between h-full">
			<div className="flex items-start justify-between mb-4">
				<div>
					<h3
						className="text-base font-medium tracking-tight mb-0.5"
						style={ {
							color: M3.onSurface,
							fontFamily: 'Roboto, sans-serif',
						} }
					>
						{ __( 'Revenue Trend (6 Months)', 'purecart' ) }
					</h3>
					<p
						className="text-xs"
						style={ {
							color: M3.onSurfaceVariant,
							fontFamily: 'Roboto, sans-serif',
						} }
					>
						{ __(
							'Recognized subscription revenue and billing volumes.',
							'purecart'
						) }
					</p>
				</div>
				<button
					type="button"
					onClick={ () =>
						navigate( PAGE_PATHS[ 'subscription-analytics' ] )
					}
					className="text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
					style={ {
						color: M3.primary,
						backgroundColor: M3.surfaceContainerHigh,
						fontFamily: 'Roboto, sans-serif',
					} }
				>
					<span>{ __( 'Detailed Analytics', 'purecart' ) }</span>
					<ArrowUpRight size={ 14 } />
				</button>
			</div>

			<div className="w-full h-64 mt-2">
				{ chartData.length > 0 ? (
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={ chartData }
							margin={ {
								top: 10,
								right: 10,
								left: -15,
								bottom: 0,
							} }
						>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={ false }
								stroke={ M3.outlineVariant }
								opacity={ 0.4 }
							/>
							<XAxis
								dataKey="month"
								tick={ {
									fontSize: 11,
									fill: M3.onSurfaceVariant,
								} }
								axisLine={ false }
								tickLine={ false }
							/>
							<YAxis
								tick={ {
									fontSize: 11,
									fill: M3.onSurfaceVariant,
								} }
								axisLine={ false }
								tickLine={ false }
								tickFormatter={ ( val ) => `$${ val }` }
							/>
							<Tooltip
								formatter={ ( value: number, name: string ) => {
									if ( name === 'Revenue' ) {
										return [
											formatCurrency( value ),
											__( 'Revenue', 'purecart' ),
										];
									}
									return [
										value,
										__( 'Active Periods', 'purecart' ),
									];
								} }
								contentStyle={ {
									backgroundColor: M3.surface,
									borderColor: M3.outlineVariant,
									borderRadius: 8,
									fontSize: 12,
									boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
								} }
							/>
							<Legend
								wrapperStyle={ { fontSize: 12, paddingTop: 8 } }
							/>
							<Bar
								dataKey="revenue"
								name="Revenue"
								fill={ M3.primary }
								radius={ [ 4, 4, 0, 0 ] }
								maxBarSize={ 40 }
							/>
						</BarChart>
					</ResponsiveContainer>
				) : (
					<div
						className="h-full flex items-center justify-center text-xs"
						style={ { color: M3.onSurfaceVariant } }
					>
						{ __( 'No revenue history recorded yet.', 'purecart' ) }
					</div>
				) }
			</div>
		</Card>
	);
}
