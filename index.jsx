import React from 'react';
import {Box, render, Text, useInput} from 'ink';
import {useState} from 'react';
import {Menu} from './Menu.jsx'
import {DockerScreen} from './DockerScreen.jsx';
import {ServiceForm} from './ServiceForm.jsx';
import {Counter} from './Counter.jsx';
import {ContextDemo} from './ContextDemo.jsx'
import {EffectDemo} from './EffectDemo.jsx';
import {CommandDemo} from './src/CommandDemo.jsx';

const App = () => {

    const [selected, setSelected] = useState(0)




    const [screen, setScreen] = useState('MainMenu');

    useInput((input, key) => {
        if (screen === 'docker') {
            if (key.escape) {
                setScreen('MainMenu')
                setSelected(0)
            }

        } else if (screen === 'CommandDemo') {
            if (key.escape) {
                setScreen('MainMenu')
                setSelected(0)
            }
        }
    })

    return(<>
    <Box flexDirection='column'  >
    { screen === 'MainMenu' &&
    <Menu selected={selected} setSelected={setSelected} onSelect={setScreen} />    }
    {screen === 'docker' && <DockerScreen/>}
    {screen === 'ServiceForm' && <ServiceForm/>}
    {screen === 'Counter' && <Counter/>}
    {screen === 'ContextDemo' && <ContextDemo/>}
    {screen === 'EffectDemo' && <EffectDemo/>}
    {screen === 'CommandDemo' && <CommandDemo/>}
    </Box>
    </>
    )
}


render(<App/>);
