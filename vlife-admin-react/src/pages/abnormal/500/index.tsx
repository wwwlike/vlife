import React from 'react'
import { Empty } from '@douyinfe/semi-ui'
import { IllustrationFailure, IllustrationFailureDark } from '@douyinfe/semi-illustrations'

const Index: React.FC = () => {
	return (
		<Empty
			title={'500'}
			image={<IllustrationFailure style={{ width: 400, height: 400 }} />}
			darkModeImage={<IllustrationFailureDark style={{ width: 400, height: 400 }} />}
			description="500 服务器异常"
		></Empty>
	)
}

export default Index
