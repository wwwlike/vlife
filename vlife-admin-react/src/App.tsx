import './App.css'
// tailwindcss样式引入放在最上面，避免覆盖组件样式
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RenderRouter from './router'
import './App.scss'

import { AppProviders } from '@src/context';
function App() {
	return (
		<BrowserRouter>
				<RenderRouter />
		</BrowserRouter>
	)
}
export default App
