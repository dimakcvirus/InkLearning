import React from "react";
import { useState, useEffect, useRef } from "react";
import { useStdout } from 'ink';
import { getContainers, closeDocker } from './dockerApi.js'
import { Box, Text, useInput } from 'ink';
import { Spiner } from "./Spiner.jsx";

export const CommandDemo = () => {
	const [output, setOutput] = useState('');
	const [status, setStatus] = useState('Загрузка....');
	const [containers, setContainers] = useState([]);
	const { stdout } = useStdout();
	const [terminalWidh, setTerminalWidh] = useState(stdout.columns)
	const [selectedId, setSelectedId] = useState(null)


	const isLoadingRef = useRef(false);
	const [isLoading, setIsLoading] = useState(false);
	const isLoadController = useRef(null);

	const availableWidth = terminalWidh
	const widthName = availableWidth * 0.25
	const widthImage = availableWidth * 0.35
	const widthStatus = availableWidth * 0.25
	const widthState = availableWidth * 0.15

	console.log('terminalWidh', terminalWidh);


	const handleResize = () => {

		setTerminalWidh(stdout.columns)
	}


	async function load() {
		if (isLoadingRef.current) {
			return
		}
		try {
			const controller = new AbortController();
			isLoadController.current = controller
			isLoadingRef.current = true
			setIsLoading(true)
			setStatus('обновление')
			// задержка на ответ от сервр	
			//		await new Promise(resolve => setTimeout(resolve, 5000));
			const data = await getContainers(isLoadController.current.signal);
			setContainers(data)
			if (data && data.length && selectedId === null) {
				setSelectedId(data[0].ID)
			}
			const exists = data.some((element) => {
				return selectedId === element.ID

			})
			if (exists === false) {

				setSelectedId(data[0].ID)
			}
			setStatus('Готово');
		} catch (error) {
			if (error.name === 'AbortError') {

				return

			}
			setStatus("Ошибка Загрузки Docker");
			setOutput(error.message)

		} finally {
			isLoadingRef.current = false
			setIsLoading(false)

		}
	}

	useEffect(() => {

		load()

		const intervalId = setInterval(() => {
			load()

		}, 5000)

		return () => {
			clearInterval(intervalId)

			if (!isLoadController.current) {
				return
			}

			isLoadController.current.abort();
			closeDocker()
		}

	}, []);



	useEffect(() => {
		stdout.on('resize', handleResize);

		return () => {

			stdout.off('resize', handleResize);

		}
	}, [])

	useInput((input, key) => {
		if (input === 'r') {
			load()
		}
		if (key.upArrow) {
			if (selectedId !== 0) {
				setSelectedId(previous => {

					return previous - 1
				})
			}

		}
		if (key.downArrow) {
			if (selectedId < containers.length - 1) {
				setSelectedId(previous => {
					return previous + 1

				})
			}

		}
	})

	return (
		<Box flexDirection='column'>
			<Text>{status}</Text>
			<Text>{terminalWidh}</Text>
			{isLoading && <Box flexDirection="row"><Spiner /><Text>Загрузка контейнеров...</Text></Box>}
			<Text>Доступно для колонок : {availableWidth}</Text>
			<Text>
				{output}
			</Text>
			{availableWidth > 100 ? (
				<Box flexDirection="column">
					<Box flexDirection="row" gap={2}>
						<Box width={widthName} ><Text>NAME</Text></Box>
						<Box width={widthImage} ><Text>IMAGE</Text></Box>
						<Box width={widthStatus} ><Text>STATUS</Text></Box>
						<Box width={widthState} ><Text>STATE</Text></Box>
					</Box>
					<Text color='grey'>---------------------------------------------------------------------------------------------------</Text>
					{
						[...containers].sort((a, b) => {
							if (a.State === b.State) return 0;
							if (a.State === 'running') return -1;
							if (b.State === 'running') return 1;
							return 0;
						}).map((container, index) => {
							return <Box key={container.ID} flexDirection="row" gap={2}>
								<Box width={widthName} backgroundColor={index === selectIndex ? 'yellow' : ''} ><Text >Имя:{container.Name}</Text></Box>
								<Box width={widthImage} backgroundColor={index === selectIndex ? 'yellow' : ''}><Text>Образ:{container.Image}</Text></Box>
								<Box width={widthStatus} backgroundColor={index === selectIndex ? 'yellow' : ''}><Text color={container.State === 'running' ? 'green' : container.State === 'exited' ? 'red' : 'yellow'}  >Статус:{container.Status}</Text></Box>
								<Box width={widthState} backgroundColor={index === selectIndex ? 'yellow' : ''}><Text> State:{container.State}</Text></Box>
							</Box>
						})
					}
				</Box>
			) : (<Box flexDirection="column">
				{
					[...containers].sort((a, b) => {
						if (a.State === b.State) return 0;
						if (a.State === 'running') return -1;
						if (b.State === 'running') return 1;
						return 0;

					}).map(container => {
						return <Box key={container.ID} flexDirection="column" gap={1} borderStyle='round'>
							<Box width={widthName} ><Text >Имя:{container.Name}</Text></Box>
							<Box width={widthImage}><Text>Образ:{container.Image}</Text></Box>
							<Box width={widthStatus}><Text color={container.State === 'running' ? 'green' : 'red'}  >Статус:{container.Status}</Text></Box>
							<Box width={widthState}><Text> State:{container.State}</Text></Box>
						</Box>
					})
				}
			</Box>)
			}

		</Box>
	)
}








// const loadContainers = () => {
//
// 	if (processRef.current !== null) {
// 		return;
//
// 	}
// 	let stdout = '';
// 	const process = spawn('docker', ['ps', '-a', '--format', '{{json .}}']);
// 	process.stdout.on('data', (data) => {
// 		stdout += data.toString()
// 	});
//
// 	processRef.current = process;
//
// 	process.on('close', (code) => {
// 		if (processRef.current === process) {
// 			processRef.current = null;
// 		}
//
// 		if (code === 0) {
// 			setStatus('Готово');
// 			try {
// 				const
// 					parsedContainers = stdout.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line))
// 				setContainers(parsedContainers)
//
// 			} catch (error) {
// 				setStatus('Ошибка парсинга')
// 				setOutput(error.message);
// 			}
//
// 		} else {
// 			setStatus('Ошибка')
// 		}
// 		console.log('Команда заверщилась с кодом:', code);
// 	});
// 	process.on('error', (err) => {
// 		setStatus('Ошибка запуска docker');
// 		setOutput(err.message);
// 	})
// 	process.stderr.on('data', (data) => {
// 		console.log(data.toString());
// 	})
//
//
// };
