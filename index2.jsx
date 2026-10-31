import React from 'react';
import {Box, render, Text, useInput} from 'ink';
import { useState} from 'react';
const App = () => {

	const [selected, setSelected] = useState(0);
	const [menuSelect, setMenuSelect] = useState(0);
	useInput((input, key) => {

		if (key.downArrow) {
			setSelected(previous =>{
				if(previous < 2){
					return previous+1
				}
				return previous
			})	
		}

		if (key.upArrow) {
			setSelected(previous => {
				if(previous >0){
					return previous -1
				}
				return previous
			})	
		}

	})
	useInput((input, key) =>{
		if (key.downArrow){
			setMenuSelect(previous =>{
				if(previous < 2){
					return previous+1
				}
				return previous
			})
		}

		if  (key.upArrow){
			setMenuSelect(previous => {
				if(previous >0){

					return previous -1
				}
				return previous
			})


		}


	} )

   return(
	   <>
			<Box width={50} borderStyle='round' flexDirection='column'>
				<Box borderStyle='single'
					justifyContent='center'
					borderTop={false}
					borderLeft={false}
					borderRight={false}
					borderBottom>

					<Text>SERVER MANAGER</Text>
				</Box>
				<Box justifyContent='space-between' marginBottom={1} marginTop={1} paddingLeft={5} paddingRight={5}  >
					<Box flexDirection='column'>
						<Text>{selected === 0 ? '>':' '}CPU</Text>
						<Text>{selected === 1 ? '>':' '}RAM:</Text>
						<Text>{selected === 2 ? '>':' '}DISK:</Text>
					</Box>
					<Box flexDirection='column'>
						<Text>23%</Text>
						<Text>12%</Text>
						<Text>11%</Text>
					</Box>
					<Box flexDirection='column' >
						<Text>
							Selected:{selected}
						</Text>
						<Text>{menuSelect === 0 ? '>' : ' '}Start</Text>
						<Text>{menuSelect === 1 ? '>' : ' '}Settings</Text>
						<Text>{menuSelect === 2 ? '>' : ' '}Exit</Text>
					</Box>
					
				</Box>
				<Box borderStyle='single' 
					justifyContent='center'
					borderTop 
					borderLeft={false}
					borderRight={false}
					borderBottom={false}>
					<Text> -Navigation Q  - Quit </Text>
				</Box>
			</Box>		
	   </>
	 )
};

render(<App />);
