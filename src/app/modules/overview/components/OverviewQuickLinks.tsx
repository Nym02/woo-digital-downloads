/**
 * Overview Quick Links.
 *
 * Provides fast navigation cards to each PureCart management module.
 *
 * @file
 * @since 1.0.0
 */

import {
	KeyRound,
	DownloadCloud,
	UploadCloud,
	RefreshCw,
	Cloud,
	BarChart3,
	Settings,
	ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { __, sprintf } from '@wordpress/i18n';
import { M3 } from '@/theme';
import { Card } from '@/shared/ui/Card';
import { PAGE_PATHS } from '@/app/router/paths';
import type { OverviewData } from '../types';

interface OverviewQuickLinksProps {
	data: OverviewData;
}

export function OverviewQuickLinks( { data }: OverviewQuickLinksProps ) {
	const navigate = useNavigate();

	const modules = [
		{
			id: 'subscriptions',
			title: __( 'Subscriptions', 'purecart' ),
			description: __(
				'Manage recurring plans, dunning retries, and customer retention.',
				'purecart'
			),
			path: PAGE_PATHS.subscriptions,
			badge: sprintf(
				/* translators: %d: active count */
				__( '%d active', 'purecart' ),
				data.subscriptions.activeCount
			),
			icon: RefreshCw,
			iconBg: M3.primaryContainer,
			iconColor: M3.primary,
		},
		{
			id: 'licenses',
			title: __( 'Software Licenses', 'purecart' ),
			description: __(
				'Generate keys, monitor domain activations, and revoke tokens.',
				'purecart'
			),
			path: PAGE_PATHS.licenses,
			badge: sprintf(
				/* translators: %d: total count */
				__( '%d keys', 'purecart' ),
				data.licenses.total
			),
			icon: KeyRound,
			iconBg: M3.secondaryContainer,
			iconColor: M3.secondary,
		},
		{
			id: 'downloads',
			title: __( 'Secure Downloads', 'purecart' ),
			description: __(
				'Stream protected files through PHP, audit IPs, and revoke tokens.',
				'purecart'
			),
			path: PAGE_PATHS.downloads,
			badge: sprintf(
				/* translators: %d: total downloads */
				__( '%d total', 'purecart' ),
				data.downloads.totalDownloads
			),
			icon: DownloadCloud,
			iconBg: M3.infoContainer,
			iconColor: M3.info,
		},
		{
			id: 'updates',
			title: __( 'Plugin & Software Updates', 'purecart' ),
			description: __(
				'Host ZIP packages, configure channels, and track client adoption.',
				'purecart'
			),
			path: PAGE_PATHS.updates,
			badge: sprintf(
				/* translators: %d: releases count */
				__( '%d releases', 'purecart' ),
				data.totalReleases
			),
			icon: UploadCloud,
			iconBg: M3.successContainer,
			iconColor: M3.success,
		},
		{
			id: 'saas-accounts',
			title: __( 'SaaS Provisioning', 'purecart' ),
			description: __(
				'Issue client API keys, rotate tokens, and inspect remote usage.',
				'purecart'
			),
			path: PAGE_PATHS[ 'saas-accounts' ],
			badge: sprintf(
				/* translators: %d: active count */
				__( '%d accounts', 'purecart' ),
				data.saas.active
			),
			icon: Cloud,
			iconBg: M3.primaryContainer,
			iconColor: M3.primary,
		},
		{
			id: 'analytics',
			title: __( 'Analytics & Reports', 'purecart' ),
			description: __(
				'Review churn risk scores, revenue goals, and export metrics.',
				'purecart'
			),
			path: PAGE_PATHS.analytics,
			badge: __( 'Explore', 'purecart' ),
			icon: BarChart3,
			iconBg: M3.warningContainer,
			iconColor: M3.warning,
		},
		{
			id: 'settings',
			title: __( 'Settings & Integration', 'purecart' ),
			description: __(
				'Enable feature modules, configure webhooks, and billing options.',
				'purecart'
			),
			path: PAGE_PATHS.settings,
			badge: __( 'Configure', 'purecart' ),
			icon: Settings,
			iconBg: M3.surfaceContainerHigh,
			iconColor: M3.onSurfaceVariant,
		},
	];

	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<h3
					className="text-base font-medium tracking-tight"
					style={ {
						color: M3.onSurface,
						fontFamily: 'Roboto, sans-serif',
					} }
				>
					{ __( 'PureCart Modules', 'purecart' ) }
				</h3>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{ modules.map( ( mod ) => {
					const Icon = mod.icon;
					return (
						<Card
							key={ mod.id }
							className="p-4 flex flex-col justify-between hover:shadow-xs transition-shadow cursor-pointer group"
							onClick={ () => navigate( mod.path ) }
							role="button"
							tabIndex={ 0 }
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' || e.key === ' ' ) {
									navigate( mod.path );
								}
							} }
						>
							<div>
								<div className="flex items-start justify-between mb-3">
									<div
										className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
										style={ {
											backgroundColor: mod.iconBg,
										} }
									>
										<Icon
											size={ 18 }
											color={ mod.iconColor }
										/>
									</div>
									<span
										className="text-[11px] font-medium px-2 py-0.5 rounded-full"
										style={ {
											backgroundColor:
												M3.surfaceContainerHigh,
											color: M3.onSurfaceVariant,
										} }
									>
										{ mod.badge }
									</span>
								</div>

								<h4
									className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors"
									style={ { color: M3.onSurface } }
								>
									{ mod.title }
								</h4>
								<p
									className="text-xs line-clamp-2 leading-relaxed"
									style={ { color: M3.onSurfaceVariant } }
								>
									{ mod.description }
								</p>
							</div>

							<div
								className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium"
								style={ {
									borderColor: M3.outlineVariant,
									color: M3.primary,
								} }
							>
								<span>{ __( 'Open module', 'purecart' ) }</span>
								<ChevronRight
									size={ 14 }
									className="group-hover:translate-x-0.5 transition-transform"
								/>
							</div>
						</Card>
					);
				} ) }
			</div>
		</div>
	);
}
