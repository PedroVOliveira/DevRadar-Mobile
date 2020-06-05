import React, { useState, useEffect } from 'react';
import { StyleSheet, Image,View, Text,TextInput, TouchableOpacity } from 'react-native';
// Mostra o mapa na tela
// Marker serve para mostrar a marcação do dev no mapa
// Callout é referente as informações do usuário
import MapView, { Marker,Callout } from 'react-native-maps';
// Pede a  permissão do usuário e  get pega a localização
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';


function Main({ navigation }) {
	
	const [devs,setDevs] = useState([]);
	const [currentRegion, setCurrentRegion] = useState(null);
	const [techs,setTechs] = useState('');
  
	useEffect(() => {
		async function loadInitialPosition() {
			
			const { granted } = await requestPermissionsAsync();
			// Se granted for true, ele permite a coleta da informação
			if(granted) {
				const { coords } = await getCurrentPositionAsync({
					enableHighAccuracy:true,
				});
				// Desestrutura a as cordenadas fazendo latitude e longitude receber as cordenadas de coords
				const { latitude, longitude } = coords;

				setCurrentRegion({
					latitude,
					longitude,
					// Delta está relacionado com o zoom do mapa
					latitudeDelta: 0.10,
					longitudeDelta: 0.10,
				})
			}
		}

		loadInitialPosition();
	}, []);
	 
	async function loadDevs() {
		 const { latitude, longitude } = currentRegion;
		//  Pega do listar devs api
		 const response = await api.get('/search', {
			
			params: {
				latitude,
				longitude,
				techs,
			}
				
		 });
		 setDevs(response.data.devs);
	}
	// Muda a localização do mapa quando um dev é buscado
	function handleRegionChanged(region) {
		setCurrentRegion(region);
		
	}
	// Aqui é algo bem simples. Quando o usuário não permite a localização, nada é mostrado na tela.
	if(!currentRegion) {
		return null;
	}
	// initialRegion pega o estado inicial da região setada na variavel currentRegion
  return (
	  <>
			<MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map} >
				{/* Maker(marcação do mapa é necessário passar um parametro de coordinates passando latitude e longidute) */}
				{devs.map(dev=> (
					<Marker 
					 key={dev._id}
					 coordinate={{
						longitude:dev.location.coordinates[0],
						latitude: dev.location.coordinates[1] 
					
						}} >
						<Image 
						 style={styles.avatar} 
						 source={{uri: dev.avatar_url}} 
						/>
						<Callout onPress={() => {
							navigation.navigate('Profile', { github_username: dev.github_username });
						}}>
							<View style={styles.callout}>
								<Text style={styles.devName}>{dev.name}</Text>
								<Text style={styles.devBio}>{dev.bio}</Text>
								<Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
							</View>
						</Callout>
					</Marker>
				))}
			</MapView>
			<View style={styles.searchForm}>
				<TextInput 
					style={styles.searchInput}
					placeholder="Buscar devs por techs..."
					autoCapitalize="words"
					autoCorrect={false}
					value={techs}
					onChangeText={text => setTechs(text)}
				/>
				<TouchableOpacity  onPress={loadDevs} style={styles.loadButton}>
						<MaterialIcons  name="my-location" size={20} color="#fff" />
				</TouchableOpacity>
			</View>
	</>
	)
}

const styles = StyleSheet.create({
    map: {
        flex:1,
		},
		avatar: {
			width:54,
			height:54,
			borderRadius:4,
			borderWidth:4,
			borderColor:'#fff'
		},
		callout: {
			width:260,
		},
		devName: {
			fontWeight: 'bold',
			fontSize:16,
		},
		devBio: {
			color: '#666',
			marginTop: 5,	
		},

		devTechs: {
			marginTop:5,
		},
		searchForm: {
			position:'absolute',
			bottom:20,
			left:20,
			right:20,
			zIndex:5,
			flexDirection: 'row'
		},
		searchInput: {
			flex: 1,
			height:50,
			backgroundColor:'#fff',
			color:'#333',
			borderRadius:25,
			paddingHorizontal: 20,
			fontSize: 16,
			elevation: 5
		},
		loadButton: {
			width:50,
			height:50,
			backgroundColor:'#8E4Dff',
			borderRadius:25,
			justifyContent:'center',
			alignItems: 'center',
			marginLeft: 15,
		}


})
export default Main;