import React, { FC } from 'react'
import { Dropdown, Tag } from '@douyinfe/semi-ui'
import useStore from '@src/store/common/headerTag'
import { IconSetting } from '@douyinfe/semi-icons'

const Index: FC = () => {
	const [activeTagId, removeTag, removeOtherTag, removeAllTag] = useStore((state) => [
		state.activeTagId,
		state.removeTag,
		state.removeOtherTag,
		state.removeAllTag
	])

	return (
		<Dropdown
			render={
				<Dropdown.Menu>
					<Dropdown.Item>Menu Item 1</Dropdown.Item>
					<Dropdown.Item>Menu Item 2</Dropdown.Item>
					<Dropdown.Item>Menu Item 3</Dropdown.Item>
				</Dropdown.Menu>
			}
		>
			<IconSetting />
		</Dropdown>
	)
}

export default Index
