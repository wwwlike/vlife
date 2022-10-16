import React from 'react'
import { Empty } from '@douyinfe/semi-ui'
import { IllustrationNotFound, IllustrationNotFoundDark } from '@douyinfe/semi-illustrations'

const Index: React.FC = () => {
	return (
		<Empty
			title={'404'}
			image={<IllustrationNotFound style={{ width: 400, height: 400 }} />}
			darkModeImage={<IllustrationNotFoundDark style={{ width: 400, height: 400 }} />}
			description="404 页面未找到"
		></Empty>
	)
}

export default Index
