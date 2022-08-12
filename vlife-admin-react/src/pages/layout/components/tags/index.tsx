import React, { FC, useCallback, useEffect } from 'react'
import { Tabs, TabPane } from '@douyinfe/semi-ui'
import { useNavigate, useLocation } from 'react-router-dom'
import TagsViewAction from './tagAction'
import useStore from '@src/store/common/headerTag'
import menuList, { MenuItem } from '@src/menus/config'
import { useLocale } from '@src/locales'
import './index.scss'

const Index: FC = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { formatMessage } = useLocale()
	const [tags, activeTagId, addTag, removeTag, setActiveTag] = useStore((state) => [
		state.tags,
		state.activeTagId,
		state.addTag,
		state.removeTag,
		state.setActiveTag
	])

	// Tabs change
	const onChange = (key: string) => {
		const tag = tags.find((tag) => tag.id === key)
		if (tag) {
			setCurrentTag(tag.id)
			navigate(tag.path)
		}
	}
	const setCurrentTag = useCallback(
		(id?: string) => {
			const tag = tags.find((item) => {
				if (id) {
					return item.id === id
				} else {
					return item.path === location.pathname
				}
			})
			if (tag) setActiveTag(tag.id)
		},
		[location.pathname, tags]
	)

	// onRemove tag
	const onClose = (targetKey: string) => {
		removeTag(targetKey)
	}

	const findMenuByPath = (menus: MenuItem[], pathName: string): MenuItem | undefined => {
		for (const item of menus) {
			if (item.path) {
				if (item.path == pathName) return item
			}
			if (item.items) {
				const res = findMenuByPath(item.items, pathName)
				if (res) return res
			}
		}
	}

	// 页面刷新时加入 pathname 的tab
	useEffect(() => {
		if (menuList.length) {
			const { pathname } = location
			const menu = findMenuByPath(menuList, pathname)
			if (menu) {
				addTag({
					path: menu.path as string,
					label: formatMessage({ id: menu.text }),
					id: menu.itemKey,
					closable: true
				})
			}
		}
	}, [location.pathname])

	// pathname 和 tab 绑定
	useEffect(() => {
		if (tags && activeTagId) {
			const targetTab = tags.filter((e) => e.id === activeTagId)
			navigate(targetTab[0].path)
		}
	}, [tags, activeTagId])

	return (
		<div id="pageTabs" style={{ background: '#fff', marginRight: '15px' }}>
			<Tabs
				type="card"
				tabBarStyle={{ margin: 5 }}
				onChange={onChange}
				activeKey={activeTagId}
				onTabClose={(targetKey) => onClose(targetKey as string)}
				// tabBarExtraContent={<TagsViewAction />}
				className="headertabs"
			>
				{tags.map((tag) => (
					<TabPane tab={tag.label} itemKey={tag.id} key={tag.id} closable={tag.closable} />
				))}
			</Tabs>
		</div>
	)
}

export default Index
