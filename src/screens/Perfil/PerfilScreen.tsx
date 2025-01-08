import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';

const PerfilScreen = ({navigation}: any) => {
  const {user} = useAuth();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchCliente();
  }, []);

  const fetchCliente = () => {
    setLoading(true);
    fetch(`https://site-back-web-vet.vercel.app/api/client/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `Error al obtener datos del cliente: ${response.status}`,
          );
        }
        return response.json();
      })
      .then(result => {
        const data = result.data;
        setCliente(data);
        setFormData(data); // Inicializa los datos del formulario con los datos actuales
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos del cliente:', error);
        setLoading(false);
      });
  };

  const handleSave = () => {
    setLoading(true);
    fetch(`https://site-back-web-vet.vercel.app/api/client`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `Error al actualizar los datos del cliente: ${response.status}`,
          );
        }
        return response.json();
      })
      .then(result => {
        console.log('Perfil editado exitosamente:', result);
        fetchCliente();
        setEditing(false);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al actualizar los datos del cliente:', error);
        setLoading(false);
      });
  };

  const handleChange = (key: string, value: string) => {
    setFormData({...formData, [key]: value});
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.title}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Perfil de {cliente?.nombre} {cliente?.apellidos}
      </Text>

      {editing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={value => handleChange('nombre', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            value={formData.apellidos}
            onChangeText={value => handleChange('apellidos', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={formData.correo}
            onChangeText={value => handleChange('correo', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={formData.telefono}
            onChangeText={value => handleChange('telefono', value)}
          />
          <Button title="Guardar Cambios" onPress={handleSave} />
        </>
      ) : (
        <>
          <Text style={styles.detail}>Nombre: {cliente?.nombre}</Text>
          <Text style={styles.detail}>Apellidos: {cliente?.apellidos}</Text>
          <Text style={styles.detail}>Correo: {cliente?.correo}</Text>
          <Text style={styles.detail}>Teléfono: {cliente?.telefono}</Text>
          <Button title="Editar Perfil" onPress={() => setEditing(true)} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PerfilScreen;
