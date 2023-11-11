import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useNavigate, useParams } from 'react-router-dom'

function Room({ ws, setWsState }) {
	const [state, setState] = useState({
		message: '',
		messages: [],
	})
	const { roomId } = useParams()
	const navigate = useNavigate()

	const onChange = (e) =>
		setState((prev) => ({ ...prev, [e.target.name]: e.target.value }))

	useEffect(() => {
		if (!ws) navigate('/', { replace: true })
	}, [navigate, ws])

	const wsOnMessage = useCallback((data) => {
		data = JSON.parse(data)

		switch (data.event) {
			case 'SEND_MESSAGE':
				setState((prev) => ({
					...prev,
					messages: [
						...prev.messages,
						{
							date: data.payload.date,
							text: data.payload.message,
						},
					],
				}))

				break
			default:
				break
		}
	}, [])

	useEffect(() => {
		if (ws) ws.onmessage = (e) => wsOnMessage(e.data)
	}, [ws, wsOnMessage])

	const onSubmit = (e) => {
		e.preventDefault()

		const checkTime = (i) => {
			if (i < 10) {
				i = '0' + i
			}
			return i
		}

		const today = new Date()
		const h = checkTime(today.getHours())
		const m = checkTime(today.getMinutes())
		const s = checkTime(today.getSeconds())

		const formattedToday = `${h}:${m}:${s}`

		const data = {
			event: 'SEND_MESSAGE',
			payload: {
				message: state.message,
				date: formattedToday,
			},
		}

		ws.send(JSON.stringify(data))
		setState((prev) => ({ ...prev, message: '' }))
	}

	const closeRoom = () => {
		ws.destroy()
		setWsState(null)
		navigate('/', { replace: true })
	}

	return (
		<>
			<h1>Room Id: {roomId}</h1>
			<button onClick={closeRoom}>Wybierz inny pokoj</button>

			<form onSubmit={onSubmit}>
				<label htmlFor="message">Wiadomość: </label>
				<textarea
					id="message"
					name="message"
					value={state.message}
					onChange={onChange}
				></textarea>
				<button type="submit">Wyslij</button>
			</form>

			{state.messages.map((message, idx) => (
				<p key={idx}>
					{message.date} - {message.text}
				</p>
			))}
		</>
	)
}

Room.prototype.propTypes = {
	ws: PropTypes.object,
	setWsState: PropTypes.func.isRequired,
}

export default Room
