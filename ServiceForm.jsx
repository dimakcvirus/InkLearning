import React from 'react';
import {Box, render, Text, useInput} from 'ink';
import { useState, useReducer} from 'react';
import{Menu} from './Menu.jsx'


export const ServiceForm = () =>{
const [inputValue, setInputValue] = useState('');
const [confirmed, setConfirmed]	= useState({});
const [portValue, setPortValue] = useState('');
const [activeField, setActiveField] = useState('name');
const [error, setError] = useState('');

useInput((input,key) =>{

	if (key.backspace){
		if( activeField === 'name'){
			setInputValue(previous =>{
				return previous.slice(0,-1)

			})
		}
		if( activeField === 'port'){
			setPortValue(previous =>{
				return previous.slice(0,-1)
			})
		}
	
	} else if(key.return){
	
			if(activeField === 'name'){
				if(inputValue === ''){
					setError('Service name is required')
				}else{
					setConfirmed( prev=>( {...prev, name:inputValue}))
					setError('')
				}
			}
			if (activeField === 'port'){
				if(portValue === ''){
					setError('Port is required')
				}else{
				setConfirmed(prev => ({...prev, port:portValue}))
					setError('')
				}
			}
			if(activeField === 'submit'){
				if(inputValue === ''){
					setError('Service name is required')
				}else if( portValue === ''){
					setError('Port is required')
				}else{
					setConfirmed(prev =>({...prev, name:inputValue, port:portValue}))	
					setError('')}
			}

		
	}else if (key.tab){
		setActiveField(previous =>{
			if(previous === 'name'){
				return 'port'
			} else if(previous === 'port'){
				return 'submit'
			 }else{
				return 'name'
			 }
		})

	} else {
		if(activeField === 'name'){
			setInputValue( previous => {
				return previous + input
			})
		}
		if(activeField === 'port'){
			setPortValue( previous => {
				return previous + input
			})
		}
	}

})



return(<>
	<Box flexDirection='column'>
	{activeField ==='name'?  <Text>ServiceForm:_{inputValue}</Text>:<Text>ServiceForm:{inputValue}</Text>}
	{activeField ==='port'? <Text>Port:_{portValue}</Text>:<Text>Port:{portValue}</Text>}
		<Text>Confirmed:{confirmed.name}{confirmed.port} </Text>
	{ activeField === 'submit'?	<Text>[submit]</Text> :<Text>submit </Text>}
	</Box>
	<Box><Text>{error}</Text></Box>
	</>
)
}
