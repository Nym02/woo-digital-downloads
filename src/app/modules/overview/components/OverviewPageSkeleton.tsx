/**
 * OverviewPageSkeleton UI component.
 *
 * Pulsing placeholder layout mirroring OverviewPage while the initial
 * metrics payload is resolving through React Suspense.
 *
 * @file
 * @since 1.0.0
 */

import { M3 } from '@/theme';
import { Card } from '@/shared/ui/Card';
import { Skeleton } from '@/shared/ui/Skeleton';

export function OverviewPageSkeleton() {
	return (
		<div className="space-y-6">
			{ /* Header */ }
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<Skeleton width={ 240 } height={ 28 } className="mb-2" />
					<Skeleton width={ 360 } height={ 16 } />
				</div>
				<Skeleton width={ 120 } height={ 36 } radius={ 12 } />
			</div>

			{ /* 5 KPI Cards */ }
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				{ Array.from( { length: 5 } ).map( ( _, i ) => (
					<Card
						key={ i }
						className="p-4 flex flex-col justify-between"
					>
						<div className="flex items-center justify-between mb-3">
							<Skeleton width="60%" height={ 12 } />
							<Skeleton width={ 32 } height={ 32 } radius={ 8 } />
						</div>
						<Skeleton width="50%" height={ 28 } className="mb-2" />
						<Skeleton width="40%" height={ 12 } />
					</Card>
				) ) }
			</div>

			{ /* 2 Columns: Chart & Alerts */ }
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<Card className="p-5 h-80 flex flex-col justify-between">
						<div className="flex items-center justify-between mb-4">
							<div className="space-y-1.5">
								<Skeleton width={ 200 } height={ 18 } />
								<Skeleton width={ 260 } height={ 12 } />
							</div>
							<Skeleton
								width={ 100 }
								height={ 28 }
								radius={ 8 }
							/>
						</div>
						<div className="flex-1 flex items-end gap-4 pt-8">
							{ Array.from( { length: 6 } ).map( ( _, idx ) => (
								<div
									key={ idx }
									className="flex-1 flex flex-col items-center gap-2"
								>
									<Skeleton
										width="100%"
										height={ 60 + ( idx % 3 ) * 35 }
										radius={ 4 }
									/>
									<Skeleton width="60%" height={ 10 } />
								</div>
							) ) }
						</div>
					</Card>
				</div>

				<div>
					<Card className="p-5 h-80 flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between mb-4">
								<Skeleton width={ 140 } height={ 18 } />
								<Skeleton
									width={ 80 }
									height={ 20 }
									radius={ 12 }
								/>
							</div>
							<div className="space-y-3">
								{ Array.from( { length: 3 } ).map(
									( _, idx ) => (
										<div
											key={ idx }
											className="p-3 rounded-xl border flex items-center justify-between gap-3"
											style={ {
												borderColor: M3.outlineVariant,
											} }
										>
											<div className="flex items-center gap-3 flex-1">
												<Skeleton
													width={ 32 }
													height={ 32 }
													radius={ 8 }
												/>
												<div className="space-y-1.5 flex-1">
													<Skeleton
														width="50%"
														height={ 12 }
													/>
													<Skeleton
														width="80%"
														height={ 10 }
													/>
												</div>
											</div>
											<Skeleton
												width={ 60 }
												height={ 12 }
											/>
										</div>
									)
								) }
							</div>
						</div>
					</Card>
				</div>
			</div>

			{ /* Modules Grid */ }
			<div>
				<Skeleton width={ 160 } height={ 18 } className="mb-4" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{ Array.from( { length: 7 } ).map( ( _, idx ) => (
						<Card
							key={ idx }
							className="p-4 flex flex-col justify-between h-44"
						>
							<div>
								<div className="flex items-center justify-between mb-3">
									<Skeleton
										width={ 36 }
										height={ 36 }
										radius={ 12 }
									/>
									<Skeleton
										width={ 60 }
										height={ 16 }
										radius={ 12 }
									/>
								</div>
								<Skeleton
									width="70%"
									height={ 16 }
									className="mb-2"
								/>
								<Skeleton
									width="90%"
									height={ 12 }
									className="mb-1"
								/>
								<Skeleton width="50%" height={ 12 } />
							</div>
							<div
								className="pt-3 border-t flex justify-between"
								style={ { borderColor: M3.outlineVariant } }
							>
								<Skeleton width={ 70 } height={ 12 } />
								<Skeleton width={ 16 } height={ 12 } />
							</div>
						</Card>
					) ) }
				</div>
			</div>
		</div>
	);
}
