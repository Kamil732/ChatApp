import React, { useState } from 'react'

import { Routes as Switch, Route } from 'react-router-dom'
import App from './App'
import Room from './Room'

function Routes() {
	const [state, setState] = useState({
		ws: null,
	})

	return (
		<Switch>
			<Route path="/">
				<Route
					index
					element={
						<App
							setWsState={(state) =>
								setState((prev) => ({
									...prev,
									ws: state,
								}))
							}
						/>
					}
				/>
				<Route
					path=":roomId"
					element={
						<Room
							setWsState={(state) =>
								setState((prev) => ({
									...prev,
									ws: state,
								}))
							}
							ws={state.ws}
						/>
					}
				/>
			</Route>
		</Switch>
	)
}

export default Routes
