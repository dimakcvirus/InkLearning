import React from "react";
import { spawn } from 'node:child_process';
import { useState, useEffect, useRef } from "react";
import { useStdout } from 'ink';
import { getContainers, closeDocker } from './dockerApi.js'
import { Box, Text, useInput } from 'ink';

export const CommandDemo = () => {
	const [output, setOutput] = useState('');
	const [status, setStatus] = useState('Загрузка....');
	const [containers, setContainers] = useState([]);
	const { stdout } = useStdout();
	const [terminalWidh, setTerminalWidh] = useState(stdout.columns)


	const isLoadingRef = useRef(false);

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
			isLoadingRef.current = true
			const data = await getContainers();
			setContainers(data)
			setStatus('Готово');
			console.log(data)

		} catch (error) {
			setStatus("Ошибка Загрузки Docker");
			setOutput(error.message)

		} finally {
			isLoadingRef.current = false

		}
	}

	useEffect(() => {
		load()

		const intervalId = setInterval(() => {
			load()

		}, 5000)

		return () => {

			clearInterval(intervalId)
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
	})

	return (
		<Box flexDirection='column'>
			<Text>{status}</Text>
			<Text>{terminalWidh}</Text>
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
							console.log("a.State", a.State.localeCompare(), "b.State", b.State.localeCompare())
							if (a.State === b.State) return 0;
							if (a.State === 'running') return -1;
							if (b.State === 'running') return 1;
							return 0;
						}).map(container => {
							return <Box key={container.ID} flexDirection="row" gap={2}>
								<Box width={widthName} ><Text >Имя:{container.Name}</Text></Box>
								<Box width={widthImage}><Text>Образ:{container.Image}</Text></Box>
								<Box width={widthStatus}><Text color={container.State === 'running' ? 'green' : container.State === 'exited' ? 'red' : 'yellow'}  >Статус:{container.Status}</Text></Box>
								<Box width={widthState}><Text> State:{container.State}</Text></Box>
							</Box>
						})
					}
				</Box>
			) : (<Box flexDirection="column">
				{
					containers.map(container => {
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
