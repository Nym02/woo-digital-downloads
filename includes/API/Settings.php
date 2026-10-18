<?php
declare( strict_types=1 );
/**
 * REST API controller for plugin settings and module activation management.
 *
 * @package PureCart\API
 */

namespace PureCart\API;

defined( 'ABSPATH' ) || exit;

use PureCart\Settings\OptionKeys;
use PureCart\Settings\Settings as PluginSettings;

/**
 * Settings and module management REST controller.
 *
 * @since 1.0.0
 */
class Settings extends PureCartApi {

	/**
	 * Default modules status map.
	 *
	 * @since 1.0.0
	 * @var array<string, bool>
	 */
	public const DEFAULT_MODULES = array(
		'downloads'      => true,
		'licenses'       => true,
		'updates'        => true,
		'subscriptions'  => true,
		'saas-accounts'  => true,
		'affiliates'     => true,
		'abandoned-cart' => true,
		'analytics'      => true,
		'security'       => true,
	);

	/**
	 * Register REST routes for plugin settings.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_routes(): void {
		$ns   = PURECART_API_NAMESPACE;
		$base = '/settings';

		register_rest_route(
			$ns,
			$base . '/modules',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_modules' ),
					'permission_callback' => array( $this, 'permission_admin' ),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_modules' ),
					'permission_callback' => array( $this, 'permission_admin' ),
					'args'                => array(
						'modules' => array(
							'type'        => 'object',
							'required'    => true,
							'description' => 'Key-value map of module ID to enabled boolean status.',
						),
					),
				),
			)
		);
	}

	/**
	 * GET /settings/modules
	 *
	 * @since 1.0.0
	 * @return \WP_REST_Response
	 */
	public function get_modules(): \WP_REST_Response {
		$modules = self::get_enabled_modules();
		return rest_ensure_response( array( 'modules' => $modules ) );
	}

	/**
	 * POST /settings/modules
	 *
	 * @since 1.0.0
	 * @param \WP_REST_Request $request REST request.
	 * @return \WP_REST_Response
	 */
	public function save_modules( \WP_REST_Request $request ): \WP_REST_Response {
		$new_modules = $request->get_param( 'modules' );

		if ( ! is_array( $new_modules ) ) {
			return new \WP_REST_Response( array( 'message' => 'Invalid modules payload' ), 400 );
		}

		$current   = self::get_enabled_modules();
		$sanitized = array();

		foreach ( self::DEFAULT_MODULES as $key => $default_val ) {
			if ( array_key_exists( $key, $new_modules ) ) {
				$sanitized[ $key ] = (bool) $new_modules[ $key ];
			} else {
				$sanitized[ $key ] = $current[ $key ] ?? $default_val;
			}
		}

		PluginSettings::set( OptionKeys::ENABLED_MODULES, $sanitized );

		// Keep Subscriptions module flag in sync with OptionKeys::SUB_ENABLED.
		if ( isset( $sanitized['subscriptions'] ) ) {
			PluginSettings::set( OptionKeys::SUB_ENABLED, $sanitized['subscriptions'] );
		}

		return rest_ensure_response(
			array(
				'success' => true,
				'modules' => $sanitized,
			)
		);
	}

	/**
	 * Helper to get enabled modules with defaults.
	 *
	 * @since 1.0.0
	 * @return array<string, bool>
	 */
	public static function get_enabled_modules(): array {
		$saved = PluginSettings::get( OptionKeys::ENABLED_MODULES, array() );
		if ( ! is_array( $saved ) ) {
			$saved = array();
		}
		return array_merge( self::DEFAULT_MODULES, $saved );
	}

	/**
	 * Permission check: current user can manage_woocommerce or manage_options.
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	public function permission_admin(): bool {
		return current_user_can( 'manage_woocommerce' ) || current_user_can( 'manage_options' );
	}
}
