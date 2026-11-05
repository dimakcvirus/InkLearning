import React, { useEffect } from "react";
import { useState } from "react";
import { Box, Text, useInput } from 'ink';





export const Spiner = () => {
	const [spinerIndex, setSpinerIndex] = useState(0)
	const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴'];

	useEffect(() => {
		const idInterval = setInterval(() => {
			setSpinerIndex(previous => {
				if (previous < spinnerFrames.length - 1) {
					return previous + 1

				}

				return 0

			})

		}, 100)

		return () => {
			clearInterval(idInterval)

		}
	}, [])

	return (<>
		<Box>
			<Text>{spinnerFrames[spinerIndex]}</Text>
		</Box>


	</>)
}
