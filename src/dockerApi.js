import { Agent, request } from 'undici';
import os from 'node:os'



const platform = os.platform()
let platformOs = ""
if (platform === "darwin") {

	platformOs = '/Users/dimakcvirus/.docker/run/docker.sock'
} else {
	platformOs = '/var/run/docker.sock'


}
const agent = new Agent({
	connect: {
		socketPath: platformOs,
	},
});
console.log("OS", platform)


// закрытие агента при закрытии странички
export const closeDocker = () => {

	agent.close()
}
// получение всех контейнеров
export const getContainers = async (signal) => {
	try {
		const response = await request(
			'http://localhost/v1.40/containers/json?all=true',
			{
				dispatcher: agent,
				signal: signal
			},
		);
		const containers = await response.body.json();
		const formattedContainers = containers.map((container) => {

			return { ID: container.Id, Name: container.Names[0].replace('/', ''), Image: container.Image, Status: container.Status, State: container.State }
		})
		return formattedContainers

	} catch (error) {

		console.error(error.message)
		// проверка на на завершения сеанса и вывод в строку состояния
		throw error

	}

}

export const StartContainer = async (id) => {
	try {
		const response = await request(
			`http://localhost/v1.40/containers/${id}/start`,
			{
				method: 'POST',
				dispatcher: agent
			},
		);
		if (response.statusCode !== 204) {

			throw new Error(`Не удалось запустить контейнер. Код: ${response.statusCode}`)
		}
		return response.statusCode

	} catch (error) {

		console.error(error.message)
		// проверка на на завершения сеанса и вывод в строку состояния
		throw error

	}
}
export const StopContainer = async (id) => {


	try {
		const response = await request(
			`http://localhost/v1.40/containers/${id}/stop`,
			{
				method: 'POST',
				dispatcher: agent
			},
		);
		if (response.statusCode !== 204) {

			throw new Error(`Не удалось остановить контейнер. Код: ${response.statusCode}`)
		}
		return response.statusCode

	} catch (error) {

		console.error(error.message)
		// проверка на на завершения сеанса и вывод в строку состояния
		throw error

	}
}
