import { Agent, request } from 'undici';
import os from 'node:os'



const platform = os.platform()
let platformOs = ""
if(platform === "darwin"){

	platformOs =  '/Users/dimakcvirus/.docker/run/docker.sock'
}else{
	platformOs = '/var/run/docker.sock'


}
const agent = new Agent({
    connect: {
        socketPath: platformOs,
    },
});
console.log("OS", platform) 


export const closeDocker = () =>{

agent.close()
}
export const getContainers = async () => {
try{
const response = await request(
		'http://localhost/v1.40/containers/json?all=true',
		{
			dispatcher: agent,
		},
	);
	const containers = await response.body.json();
	const formattedContainers = containers.map((container) => {

		return { ID: container.Id, Name: container.Names[0].replace('/', ''), Image: container.Image, Status: container.Status, State: container.State }
	})
	return formattedContainers

}catch(error){

	console.error(error.message)
	return[]

}

}

