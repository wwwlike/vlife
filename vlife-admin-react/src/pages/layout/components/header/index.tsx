import React, { FC } from 'react'
import { Layout, Nav, Button, Avatar, Badge, Dropdown, RadioGroup, Radio, Empty } from '@douyinfe/semi-ui'
import { IconDesktop , IconGithubLogo } from '@douyinfe/semi-icons'
import logo from '@src/logo.png'
// import Breadcrumb from '../breadcrumb'
// import useStore from '@src/store/common/global'
// import Tags from '../tags'
import '../../index.scss'
import { useAuth } from '@src/context/auth-context'
import { IconApps } from '@douyinfe/semi-icons'

const { Header } = Layout

const Index: FC = () => {
	const {loginOut,user} =useAuth(); 
	// const locale = useStore((state) => state.locale)
	// const changeLocale = useStore((state) => state.changeLocale)

	// const selectLocale = (locale: 'zh_CN' | 'en_GB') => {
	// 	changeLocale(locale)
	// 	localStorage.setItem('semi_locale', locale)
	// }

	const question = () => {
		window.open('https://github.com/xieyezi/semi-design-pro/issues')
	}
	return (
		<Header className="layout-header shadow" >
			<Nav mode="horizontal" header={
				<Empty image={<img src={logo} style={{ width: 30, height: 30,top:10 }} />}></Empty>}
				footer={
					<>
						<Button
							theme="borderless"
							icon={<IconDesktop size="large" />}
							style={{
								color: 'var(--semi-color-text-2)',
								marginRight: '12px'
							}}
						 onClick={()=>{
							window.open("http://vlife.cc")
						 }}
						>使用指南</Button>
						<Button
							theme="borderless"
							icon={<IconGithubLogo size="large" />}
							style={{
								color: 'var(--semi-color-text-2)',
								marginRight: '12px'
							}}
						 onClick={()=>{
							window.open("https://github.com/wwwlike/vlife")
						 }}
						>GITHUB</Button>
						{/* <Badge count={5} type="danger">
							<Button
								theme="borderless"
								icon={<IconBell />}
								style={{
									color: 'var(--semi-color-text-2)',
									marginRight: '12px'
								}}
							/>
						</Badge> */}

						<Dropdown
							render={
								<Dropdown.Menu>
									{/* <Dropdown.Item >个人中心</Dropdown.Item>
									<Dropdown.Item>个人设置</Dropdown.Item> */}
									<Dropdown.Item onClick={loginOut}>退出登录</Dropdown.Item>
								</Dropdown.Menu>
							}
						>
							<Avatar color="orange" size="small">
								{user&&user.name.length>3?user?.name:user?.name[0]}
							</Avatar>
						</Dropdown>

						{/* <RadioGroup type="button" defaultValue={locale} style={{ marginLeft: '20px' }}>
							<Radio value={'zh_CN'} onChange={() => selectLocale('zh_CN')}>
								中文
							</Radio>
							<Radio value={'en_GB'} onChange={() => selectLocale('en_GB')}>
								EN
							</Radio>
						</RadioGroup> */}
					</>
				}
			></Nav>
			{/* <Tags /> */}
		</Header>
	)
}

export default Index
