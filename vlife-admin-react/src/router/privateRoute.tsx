import React, { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { RouteProps, useLocation } from 'react-router'
import Empty from '@src/components/empty'
// import useStore from '@src/stores/user'
import { useAuth } from '@src/context/auth-context'
const PrivateRoute= ({...props}) => {
// const PrivateRoute: FC< RouteProps> = (props) => {
	const { user } = useAuth();
	const location = useLocation()
	const { pathname } = location
  // const logged = useStore((state) => state.logged)
	const logged = user?.name?true:false // 这里做登录验证

	return logged ? (
		pathname === '/' ? (
			<Navigate to={{ pathname: `/dashboard/workbeach` }} replace />
		) : (
			props.element
		)
	) : (
	 <Empty title="没有权限" description="您还没有登录，请先去登录" type="403" />
	)
}

export default PrivateRoute
