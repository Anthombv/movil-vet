import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {getUsers} from '../../services/login/api';
import {useAuth} from '../../context/AuthContext';

const LoginScreen = ({navigation}: any) => {
  const [cedula, setcedula] = useState('');
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();
  
  const handleLogin = async () => {
    if (!cedula) {
      Alert.alert('Error', 'Por favor, ingresa tu nombre de usuario');
      return;
    }

    setLoading(true);
    try {
      const users = await getUsers(); // Obtén todos los usuarios
      const user = users.find((u: any) => u.cedula === cedula); // Busca el usuario por nombre de usuario

      if (user) {
        login(user); // Guarda al usuario en el contexto
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Usuario no encontrado');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={cedula}
        onChangeText={setcedula}
      />
      <Button
        title={loading ? 'Cargando...' : 'Ingresar'}
        onPress={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 4,
  },
});

export default LoginScreen;
