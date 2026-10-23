/**
 * Overview Alerts Card.
 *
 * Highlights operational alerts requiring merchant attention (past-due renewals,
 * expiring licenses, suspended accounts).
 *
 * @file
 * @since 1.0.0
 */

import {
	AlertTriangle,
	AlertCircle,
	Info,
	CheckCircle2,
	ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import { M3 } from '@/theme';
import { Card } from '@/shared/ui/Card';
import type { OverviewAlertItem } from '../types';

interface OverviewAlertsCardProps {
	alerts: OverviewAlertItem[];
}

export function OverviewAlertsCard( { alerts }: OverviewAlertsCardProps ) {
	const navigate = useNavigate();

	const getSeverityStyle = ( severity: OverviewAlertItem[ 'severity' ] ) => {
		switch ( severity ) {
			case 'critical':
				return {
					border: M3.error,
					bg: M3.errorContainer,
					icon: AlertTriangle,
					iconColor: M3.error,
				};
			case 'warning':
				return {
					border: M3.warning,
					bg: M3.warningContainer,
					icon: AlertCircle,
					iconColor: M3.warning,
				};
			case 'info':
			default:
				return {
					border: M3.info,
					bg: M3.infoContainer,
					icon: Info,
					iconColor: M3.info,
				};
		}
	};

	return (
		<Card className="p-5 flex flex-col justify-between h-full">
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3
						className="text-base font-medium tracking-tight"
						style={ {
							color: M3.onSurface,
							fontFamily: 'Roboto, sans-serif',
						} }
					>
						{ __( 'Action Items & Alerts', 'purecart' ) }
					</h3>
					<span
						className="text-xs px-2 py-0.5 rounded-full font-medium"
						style={ {
							backgroundColor:
								alerts.length > 0
									? M3.errorContainer
									: M3.successContainer,
							color: alerts.length > 0 ? M3.error : M3.success,
						} }
					>
						{ alerts.length > 0
							? `${ alerts.length } ${ __(
									'Attention Needed',
									'purecart'
							  ) }`
							: __( 'All Healthy', 'purecart' ) }
					</span>
				</div>

				{ alerts.length > 0 ? (
					<div className="space-y-3">
						{ alerts.map( ( alert ) => {
							const style = getSeverityStyle( alert.severity );
							const Icon = style.icon;

							return (
								<div
									key={ alert.id }
									className="p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors hover:shadow-xs cursor-pointer"
									style={ {
										backgroundColor: M3.surface,
										borderColor: M3.outlineVariant,
									} }
									onClick={ () =>
										navigate( alert.targetPath )
									}
									role="button"
									tabIndex={ 0 }
									onKeyDown={ ( e ) => {
										if (
											e.key === 'Enter' ||
											e.key === ' '
										) {
											navigate( alert.targetPath );
										}
									} }
								>
									<div className="flex items-start gap-3">
										<div
											className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
											style={ {
												backgroundColor: style.bg,
											} }
										>
											<Icon
												size={ 16 }
												color={ style.iconColor }
											/>
										</div>
										<div>
											<div className="flex items-center gap-2">
												<span
													className="text-xs font-semibold"
													style={ {
														color: M3.onSurface,
													} }
												>
													{ alert.title }
												</span>
												<span
													className="text-[10px] px-1.5 py-0.2 rounded font-bold"
													style={ {
														backgroundColor:
															style.bg,
														color: style.iconColor,
													} }
												>
													{ alert.count }
												</span>
											</div>
											<p
												className="text-xs mt-0.5 line-clamp-1"
												style={ {
													color: M3.onSurfaceVariant,
												} }
											>
												{ alert.description }
											</p>
										</div>
									</div>

									<button
										type="button"
										className="text-xs font-medium flex items-center gap-0.5 flex-shrink-0 mt-1 cursor-pointer"
										style={ { color: M3.primary } }
									>
										<span>{ alert.actionLabel }</span>
										<ChevronRight size={ 14 } />
									</button>
								</div>
							);
						} ) }
					</div>
				) : (
					<div className="py-8 flex flex-col items-center justify-center text-center">
						<div
							className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
							style={ { backgroundColor: M3.successContainer } }
						>
							<CheckCircle2 size={ 24 } color={ M3.success } />
						</div>
						<h4
							className="text-sm font-medium mb-1"
							style={ { color: M3.onSurface } }
						>
							{ __( 'Everything looks great', 'purecart' ) }
						</h4>
						<p
							className="text-xs max-w-xs"
							style={ { color: M3.onSurfaceVariant } }
						>
							{ __(
								'No active payment failures, expiring licenses, or suspended customer accounts.',
								'purecart'
							) }
						</p>
					</div>
				) }
			</div>
		</Card>
	);
}
