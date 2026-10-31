import React from 'react'
import { Box, Text, useInput} from "ink"


export const Menu = ({selected, setSelected,onSelect,}) => {
const menu = [
	{ name:'Start',
	  value: 'Start'
	},	
	{ name:'Setting',
	  value: 'Setting'
	},
	{name:'docker',
	 value:'docker'
	},		
	{ name:'Exit',
	  value: 'Exit'
	},
	{
		name:'ServiceForm',
		value:'ServiceForm'
	},
	{
		name:'Counter',
		value:'Counter'
	},
	{
		name: 'ContextDemo',
		value: 'ContextDemo'
	},
	{
		name: 'EffectDemo' ,
		value: 'EffectDemo' 
	},
	{
		name: 'CommandDemo',
		value: 'CommandDemo'
	},
]

useInput((input, key)=>{
		if(key.downArrow){
			setSelected(previous =>{
				if(previous <  menu.length - 1) {
					return previous + 1
				}
				return previous
			})
		}
		if (key.upArrow) {
			setSelected(previous => {
				if (previous > 0) {
					return previous - 1
				}
				return previous
			})
		}
		if (key.return){
			onSelect(menu[selected].value) 
		}
	})

	return(
		<Box flexDirection='column'>
			{ menu.map((item,index) => (
				<Text key={item.name}>
					{selected === index ? '>' : ' '} {item.name}
				</Text>
			))}

		</Box>
	)
}
