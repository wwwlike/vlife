import React, { FC } from 'react'
import { Spin, Banner } from '@douyinfe/semi-ui'

interface FallbackMessageProps {
	message: string
	description?: string
}

const SuspendFallbackLoading: FC<FallbackMessageProps> = ({ message, description }) => {
	return (
		<Spin tip="正在加载中...">
			<Banner
				fullMode={false}
				type="info"
				bordered
				icon={null}
				closeIcon={null}
				description={<div>{description}</div>}
			/>
		</Spin>
	)
}

export default SuspendFallbackLoading
