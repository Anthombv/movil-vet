import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Importar las pantallas
import LoginScreen from '../screens/Login/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import MascotasScreen from '../screens/Mascotas/MascotasScreen';
import CitasScreen from '../screens/Citas/CitasScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configuración del Bottom Tab Navigator
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Mascotas':
            iconName = 'pets';
            break;
          case 'Citas':
            iconName = 'event';
            break;
          case 'Perfil':
            iconName = 'person';
            break;
          default:
            iconName = 'help'; // Icono predeterminado
        }

        return {
          tabBarIcon: ({color, size}) => (
            <Icon name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {height: 60, paddingBottom: 10},
        };
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Inicio'}}
      />
      <Tab.Screen
        name="Mascotas"
        component={MascotasScreen}
        options={{title: 'Mascotas'}}
      />
      <Tab.Screen
        name="Citas"
        component={CitasScreen}
        options={{title: 'Citas'}}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{title: 'Perfil'}}
      />
    </Tab.Navigator>
  );
};

// Configuración del Stack Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
