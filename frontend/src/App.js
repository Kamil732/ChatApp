import { useState } from 'react'
import PropTypes from 'prop-types'

import { useNavigate } from 'react-router-dom'

function App({ setWsState }) {
	const [room_name, setRoomName] = useState('')
	const navigate = useNavigate()

	const onSubmit = (e) => {
		e.preventDefault()

		const connectWs = (timeout = 250) => {
			const ws = new WebSocket(
				`ws://192.168.1.31:8000/room/${room_name}/`
			)
			setWsState(ws)
			let connectInterval = null
			let shouldAttemptReconnect = true

			// Check if websocket instance is closed, if so call `connect` function.
			const checkIsWebSocketClosed = () => {
				if (!ws || ws.readyState === WebSocket.CLOSED)
					connectWs(timeout)
			}

			// websocket onopen event listener
			ws.onopen = () => {
				console.log('connected websocket')

				timeout = 250 // reset timer to 250 on open of websocket connection
				clearTimeout(connectInterval) // clear Interval on on open of websocket connection
				connectInterval = null

				navigate(`/${room_name}`)
			}

			ws.onclose = (e) => {
				if (shouldAttemptReconnect) {
					console.log(
						`Notification socket is closed. Reconnect will be attempted in ${Math.min(
							10000 / 1000,
							(timeout + timeout) / 1000
						)} second.`,
						e.reason
					)

					timeout += timeout //increment retry interval
					connectInterval = setTimeout(
						checkIsWebSocketClosed,
						Math.min(10000, timeout)
					) // Call checkIsWebSocketClosed function after timeout
				} else console.log('Closed notification websocket')
			}

			ws.destroy = () => {
				shouldAttemptReconnect = false
				ws.close()
			}

			ws.onerror = (err) => {
				console.error(
					'Notification socket encountered error: ',
					err.message,
					'Closing socket'
				)

				ws.close()
			}
		}

		connectWs()
	}

	return (
		<>
			<h1>Chat App</h1>
			<form onSubmit={onSubmit}>
				<label htmlFor="room_name">Wprowadź numer pokoju</label>
				<input
					id="room_name"
					value={room_name}
					type="text"
					onChange={(e) => setRoomName(e.target.value)}
				/>

				<button type="submit">Dalej</button>
			</form>
		</>
	)
}

App.prototype.propTypes = {
	setWsState: PropTypes.func.isRequired,
}

export default App
