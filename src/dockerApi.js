import { Agent, request } from 'undici';






const agent = new Agent({
	connect: {
		socketPath: '/var/run/docker.sock',
	},
});






export const getContainers = async () => {

	const response = await request(
		'http://localhost/v1.40/containers/json?all=true',
		{
			dispatcher: agent,
		},
	);

	const containers = await response.body.json();
	console.log(containers)
	const formattedContainers = containers.map((container) => {

		return { ID: container.Id, Name: container.Names[0].replace('/', ''), Image: container.Image, Status: container.Status, State: container.State }
	})
	await agent.close();
	return formattedContainers

}

