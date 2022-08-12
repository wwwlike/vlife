import React, { FC, Suspense } from 'react'
import { RouteProps } from 'react-router'
import PrivateRoute from './privateRoute'
import SuspendFallbackLoading from '@src/components/fallback-loading'

export interface WrapperRouteProps extends RouteProps {
	/** document title id */
	titleId: string
	/** authorization？ */
	auth?: boolean
}

const PublicRoute = (props) => {
	return props.element
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
	const WitchRoute = auth ? PrivateRoute : PublicRoute
	if (titleId) {
		document.title = titleId
	}
	return <WitchRoute {...props} />
}

const WrapperRouteWithOutLayoutComponent: FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
	if (titleId) {
		document.title = titleId
	}

	return <Suspense fallback={<SuspendFallbackLoading message="正在加载中" />}>{props.element}</Suspense>
}

export { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent }
