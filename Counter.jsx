
import React from 'react'
import {Box, render, Text, useInput} from 'ink';
import { useState, useReducer} from 'react';





export const Counter = () => {
const initialState = {
	count: 0
}
	function reducer(state, action){
			if (action.type === 'INCREMENT'){
				return { count: state.count + 1}
	
			}else if (action.type === 'DECREMENT'  && state.count > 0){
				return{ count:	state.count - 1}
			}else{
				return {count: state.count}

			}
	}

const [state, dispatch] = useReducer(reducer, initialState);

useInput((input, key) => {
    if (key.upArrow) {
        dispatch({ type: 'INCREMENT' });
    }

    if (key.downArrow) {
        dispatch({ type: 'DECREMENT' });
    }
});
return (
	<>
		<Box>
			<Text>Hello</Text>
			<Text>Count:{state.count}</Text>
		</Box>
	</>
)
}
