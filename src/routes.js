import React from 'react';
// Substitui o  createAppContainer
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import Profile from './pages/Profile';
// Variavel para pegar parametros passados no return
const Stack = createStackNavigator();

function Routes() {
	return (
			<NavigationContainer>
					<Stack.Navigator 
					// Informa a tela inicial
					initialRouteName="Main"
					// Aqui é o estilo global de telas
					screenOptions={{
							headerStyle: {
									backgroundColor:'#7D40E7'
							},
							headerTitleAlign: 'center',
							headerBackTitleVisible: false,
							headerTintColor: '#FFF',
					}}
					>
							<Stack.Screen 
							// Nome da tela
							name="Main" 
							component={Main} 
							// Titulo que vai aparecer na tela
							options={{title:'DevRadar'}}
							/>
							<Stack.Screen
							name="Profile"
							component={Profile}
							options = {{
								title:'Perfil do Github'
							}}
							/>
					</Stack.Navigator>
			</NavigationContainer>
			
	)
}

export default Routes;