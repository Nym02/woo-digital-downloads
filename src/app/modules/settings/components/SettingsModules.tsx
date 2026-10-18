/**
 * SettingsModules - the "Modules" settings tab.
 *
 * Enable/disable list for the plugin's feature modules, matching docs/app's
 * SettingsPage "Modules" tab layout.
 *
 * @file
 * @since 1.0.0
 */
import { useState } from 'react';
import { M3 } from '@/theme';
import { Card } from '@/shared/ui/Card';
import { Toggle } from '@/shared/ui/Toggle';
import { Toast } from '@/shared/ui/Toast';
import type { ToastProps } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { selectEnabledModules, setModuleEnabledAndPersist } from '../store/settings.slice';
import { INITIAL_MODULES } from './moduleRegistry';
import type { Page } from '@/shared/types/page';

/**
 * Renders the Modules settings tab.
 *
 * @since 1.0.0
 *
 * @return {JSX.Element} The Modules settings tab.
 */
export function SettingsModules() {
	const dispatch = useAppDispatch();
	const enabledModules = useAppSelector( selectEnabledModules );
	const [ toast, setToast ] = useState< ToastProps >( {
		message: '',
		type: 'success',
		visible: false,
	} );

	const showToast = ( msg: string, type: ToastProps[ 'type' ] = 'success' ) => {
		setToast( { message: msg, type, visible: true } );
		setTimeout( () => setToast( ( t ) => ( { ...t, visible: false } ) ), 3000 );
	};

	const toggleModule = ( moduleId: Page, name: string, nextValue: boolean ) => {
		dispatch( setModuleEnabledAndPersist( { moduleId, enabled: nextValue } ) )
			.unwrap()
			.then( () => {
				showToast( `${ name } ${ nextValue ? 'enabled' : 'disabled' }`, 'success' );
			} )
			.catch( () => {
				showToast( `Failed to update ${ name }`, 'error' );
			} );
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="mb-4">
				<h2
					className="font-medium text-lg"
					style={ {
						color: M3.onSurface,
						fontFamily: 'Roboto, sans-serif',
					} }
				>
					Plugin Modules
				</h2>
				<p
					className="text-sm mt-1"
					style={ {
						color: M3.onSurfaceVariant,
						fontFamily: 'Roboto, sans-serif',
					} }
				>
					Enable or disable modules. Enabled modules appear in the
					sidebar and unlock their analytics.
				</p>
			</div>
			{ INITIAL_MODULES.map( ( mod ) => {
				const isEnabled = enabledModules[ mod.id ] ?? mod.enabled;
				return (
					<Card
						key={ mod.name }
						className="flex items-center gap-4 px-5 py-4"
					>
						<div
							className="w-2.5 h-2.5 rounded-full flex-shrink-0"
							style={ {
								backgroundColor: isEnabled
									? M3.success
									: M3.outlineVariant,
							} }
						/>
						<div className="flex-1 min-w-0">
							<div
								className="text-sm font-medium"
								style={ {
									color: M3.onSurface,
									fontFamily: 'Roboto, sans-serif',
								} }
							>
								{ mod.name }
							</div>
							<div
								className="text-xs mt-0.5"
								style={ {
									color: M3.onSurfaceVariant,
									fontFamily: 'Roboto, sans-serif',
								} }
							>
								{ mod.desc }
							</div>
						</div>
						<div className="flex items-center gap-3 flex-shrink-0">
							<span
								className="text-xs px-2 py-0.5 rounded-full"
								style={ {
									border: `1px solid ${ M3.outlineVariant }`,
									color: M3.onSurfaceVariant,
									fontFamily: 'Roboto, sans-serif',
								} }
							>
								{ mod.phase }
							</span>
							<span
								className="text-xs px-2 py-0.5 rounded-full"
								style={ {
									backgroundColor: isEnabled
										? M3.successContainer
										: M3.surfaceContainerHigh,
									color: isEnabled
										? M3.success
										: M3.onSurfaceVariant,
									fontFamily: 'Roboto, sans-serif',
								} }
							>
								{ isEnabled ? 'Active' : 'Disabled' }
							</span>
							<Toggle
								checked={ isEnabled }
								onChange={ ( nextVal ) => toggleModule( mod.id, mod.name, nextVal ) }
							/>
						</div>
					</Card>
				);
			} ) }
			<Toast
				message={ toast.message }
				type={ toast.type }
				visible={ toast.visible }
			/>
		</div>
	);
}
