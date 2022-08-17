import React, { FC, useEffect, useMemo, useState } from 'react'
import { Layout, Nav } from '@douyinfe/semi-ui'
import { IconApps } from '@douyinfe/semi-icons'
import menuList, { MenuItem } from '@src/menu/config'
import { useLocation, useNavigate } from 'react-router'

// import { useLocale } from '@src/locales'
// import useStore from '@src/store/common/global'
import '../../index.scss'
import { useAuth } from '@src/context/auth-context'

const { Sider } = Layout

function renderIcon(icon: any) {
	if (!icon) {
		return null
	}
	return icon.render()
}

function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
	for (const menu of menus) {
		if (menu.path === path) {
			return [...keys, menu.itemKey]
		}
		if (menu.items && menu.items.length > 0) {
			const result = findMenuByPath(menu.items, path, [...keys, menu.itemKey])
			if (result.length === 0) {
				continue
			}
			return result
		}
	}
	return []
}

const Index: FC = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const [allMenuList,setMenuList]=useState(menuList);
	// const { formatMessage } = useLocale()
	const [openKeys, setOpenKeys] = useState<string[]>([])
	const [selectedKeys, setSelectedKeys] = useState<string[]>([])
	// const locale = useStore((state) => state.locale)
	const {user } =useAuth();
	const navList = useMemo(() => {
		let mList:MenuItem[]=[];
		if(user&&user.menus){
			console.log("allMenuList",allMenuList[0],allMenuList[1],allMenuList[2])
			mList=	[...allMenuList].filter((e)=>{
			//e的子菜单用户是否有权限，如果有一个，则e也能加入进去
			let subs=e.items;
			let filterSubItems;
			if(subs){
				filterSubItems=subs.filter((sub)=>{
					if(sub.code){
						console.log("权限：",user?.menus?.includes(sub.code))
						return user?.menus?.includes(sub.code);
					}
					return true
				})
			}
			if(filterSubItems&& filterSubItems.length>0){
				return true
			}else{
				return false
			}
		})
		return mList.map((e) => {
			return {
				...e,
				text: e.text,
				icon: e?.icon ? renderIcon(e.icon) : null,
				items: e?.items
					? e.items.map((m) => {
							return {
								...m,
								text:  m.text,
								icon: m.icon ? renderIcon(m.icon) : null
							}
					  })
					: []
			}
		})
	}
	}, [allMenuList])

	const onSelect = (data:any) => {
		setSelectedKeys([...data.selectedKeys])
		navigate(data.selectedItems[0].path as string)
	}
	const onOpenChange = (data:any) => {
		setOpenKeys([...data.openKeys])
	}

	// setSelectedKeys 和 path 双向绑定
	useEffect(() => {
		const keys: string[] = findMenuByPath(menuList, pathname, [])
		setSelectedKeys([keys.pop() as string])
		setOpenKeys(Array.from(new Set([...openKeys, ...keys])))
	}, [pathname])

	{console.log('navList',allMenuList)}
	return (
			<Sider className='shadow-lg'  style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
				<Nav 
					items={navList}
					openKeys={openKeys}
					selectedKeys={selectedKeys}
					onSelect={onSelect}
					onOpenChange={onOpenChange}
					style={{ maxWidth: 220, height: '100%' }}
					// header={{
					// 	logo: <IconApps style={{ fontSize: 36 }} />,
					// 	text: 'VLife Admin',
					// }}
					footer={{
						collapseButton: true
					}}
				/>

			</Sider>
	
	)
}

export default Index
