import React from 'react';
import { createContext, useContext, useState } from 'react';
import { Box, Text, useInput } from 'ink';



const MessageContext = createContext();

const MessageDisplay = () => {
	const message = useContext(MessageContext);


	return <Text>Сообщение: {message}</Text>
}

const ServerStatusDisplay = () => {

	const message = useContext(MessageContext);

	return <Text>статус сервера: {message}</Text>
}

export const ContextDemo = () => {
	const [message, setMessage] = useState('Сервер остановлен');
	useInput((input, key) => {
		if (key.return) {
			console.log('Enter нажат');
			setMessage(previous => {
				return previous === 'Сервер остановлен' ? 'сервер запущен' : 'Сервер остановлен'


			})

		}

	})

	return (
		<Box>
			<MessageContext.Provider value={message}>
				<MessageDisplay />
				<ServerStatusDisplay />
			</MessageContext.Provider>
		</Box>
	);
};
