import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';




export const EffectDemo = () =>{
const [count, setCount]= useState(0)
const [serverStatus, setServerStatus] = useState('загружен');	
const [containers, setContainers] = useState([])	
const [checks, setChecks] = useState(0);



useInput((input, key) =>{
	if(key.upArrow){
		setCount(previous =>{
			return previous + 1
		})
	}else if(key.downArrow){
		setCount(previous =>{
			return previous - 1
		})
	}
})

	useEffect(()=>{
	console.log('компонент загружен')
	const controller  = new AbortController();
	let isFetching =false;
	getContainers()

	const timer	=	setInterval(()=>{
			setChecks(previous =>{
			
				return previous + 1
				
			})
			getContainers()
	
		},5000);

		async function getContainers(){
			
			try{
				if(isFetching) return
				isFetching = true
				setServerStatus('Загрузка')
				const response = await fetch('http://localhost:3000/api/containers', {signal:controller.signal})
				if(!response.ok){
					throw new Error(`Ошибка HTTP: ${response.status}`)	
				}
				const data = await response.json()	
				setContainers(data)
				setServerStatus('сервер работает')	
			}catch(error){
				if(error.name === 'AbortError'){
					return

				}
				console.log(error)

				setServerStatus('сервер не работает')
			}finally{
				isFetching= false
				


			}
			
	
		}
		return ()=>{
			clearInterval(timer)
			controller.abort()
		}
		}, [])


	return(
			<Box>
				<Text>{count}</Text>
				<Text>{serverStatus}</Text>
         {
			 containers.map((containers)=>{
				return <Text key={containers.name}>{containers.name}:{containers.status}</Text>
			 })
		 }
				<Text>{checks}</Text>
			</Box>
		)

}
