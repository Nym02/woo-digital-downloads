/**
 * Redux Slice for Plugin Settings & Module Activation.
 *
 * @file
 * @since 1.0.0
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getAdminConfig } from '@/shared/wp';
import type { Page } from '@/shared/types/page';
import { INITIAL_MODULES } from '../components/moduleRegistry';
import { saveModulesSettings } from '../api/settings.api';

export interface SettingsState {
	modules: Record< string, boolean >;
	isSaving: boolean;
	error: string | null;
}

const buildInitialModules = (): Record< string, boolean > => {
	const localized = getAdminConfig().enabledModules;
	if ( localized && Object.keys( localized ).length > 0 ) {
		return localized;
	}
	const defaults: Record< string, boolean > = {};
	INITIAL_MODULES.forEach( ( m ) => {
		defaults[ m.id ] = m.enabled;
	} );
	return defaults;
};

const initialState: SettingsState = {
	modules: buildInitialModules(),
	isSaving: false,
	error: null,
};

/**
 * Asynchronously set a module status and persist to the WordPress backend.
 */
export const setModuleEnabledAndPersist = createAsyncThunk<
	Record< string, boolean >,
	{ moduleId: Page; enabled: boolean },
	{ state: { settings: SettingsState } }
>( 'settings/setModuleEnabledAndPersist', async ( { moduleId, enabled }, { getState } ) => {
	const current = getState().settings.modules;
	const updated = {
		...current,
		[ moduleId ]: enabled,
	};
	await saveModulesSettings( updated );
	return updated;
} );

/**
 * Asynchronously toggle a module and persist to the WordPress backend.
 */
export const toggleModuleAndPersist = createAsyncThunk<
	Record< string, boolean >,
	Page,
	{ state: { settings: SettingsState } }
>( 'settings/toggleModuleAndPersist', async ( moduleId, { dispatch, getState } ) => {
	const currentVal = getState().settings.modules[ moduleId ] ?? true;
	const result = await dispatch(
		setModuleEnabledAndPersist( { moduleId, enabled: ! currentVal } )
	).unwrap();
	return result;
} );

export const settingsSlice = createSlice( {
	name: 'settings',
	initialState,
	reducers: {
		setModuleEnabled(
			state,
			action: PayloadAction< { moduleId: Page; enabled: boolean } >
		) {
			state.modules[ action.payload.moduleId ] = action.payload.enabled;
		},
	},
	extraReducers: ( builder ) => {
		builder
			.addCase( setModuleEnabledAndPersist.pending, ( state, action ) => {
				state.modules[ action.meta.arg.moduleId ] = action.meta.arg.enabled;
				state.isSaving = true;
				state.error = null;
			} )
			.addCase( setModuleEnabledAndPersist.fulfilled, ( state, action ) => {
				state.modules = action.payload;
				state.isSaving = false;
			} )
			.addCase( setModuleEnabledAndPersist.rejected, ( state, action ) => {
				// Revert on failure
				state.modules[ action.meta.arg.moduleId ] = ! action.meta.arg.enabled;
				state.isSaving = false;
				state.error = action.error.message ?? 'Failed to update module';
			} );
	},
} );

export const { setModuleEnabled } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;

// Selectors
export const selectEnabledModules = ( state: { settings: SettingsState } ) =>
	state.settings.modules;

export const selectIsModuleEnabled = ( moduleId: Page ) => ( state: { settings: SettingsState } ) =>
	state.settings.modules[ moduleId ] ?? true;
