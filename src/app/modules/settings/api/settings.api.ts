/**
 * Settings Module API Client.
 *
 * Typed wrappers for includes/API/Settings.php's admin routes
 * (GET/POST /purecart/v1/settings/modules).
 *
 * @file
 * @since 1.0.0
 */

import { purecartFetch } from '@/shared/api';

export interface ModulesResponse {
	modules: Record< string, boolean >;
}

/**
 * GET /purecart/v1/settings/modules
 *
 * @since 1.0.0
 * @return {Promise<Record<string, boolean>>}
 */
export async function fetchModulesSettings(): Promise< Record< string, boolean > > {
	const res = await purecartFetch< ModulesResponse >( '/settings/modules' );
	return res.modules;
}

/**
 * POST /purecart/v1/settings/modules
 *
 * @since 1.0.0
 * @param {Record<string, boolean>} modules Updated module flags.
 * @return {Promise<Record<string, boolean>>}
 */
export async function saveModulesSettings(
	modules: Record< string, boolean >
): Promise< Record< string, boolean > > {
	const res = await purecartFetch< ModulesResponse >( '/settings/modules', {
		method: 'POST',
		data: { modules },
	} );
	return res.modules;
}
