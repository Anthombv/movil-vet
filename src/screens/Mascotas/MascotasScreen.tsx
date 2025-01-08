import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MascotasScreen = ({navigation}: any) => {
  const {user, logout} = useAuth(); // Usamos `user` solo para obtener el ID del cliente
  const [cliente, setCliente] = useState<any>(null); // Estado local para almacenar los datos del cliente
  const [loading, setLoading] = useState(true); // Estado para mostrar indicador de carga
  const [selectedMascota, setSelectedMascota] = useState<any>(null); // Mascota seleccionada para editar
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Modal para editar mascota
  const [isAdding, setIsAdding] = useState(false); // Modal para agregar mascota

  useEffect(() => {
    fetchCliente(); // Obtiene los datos del cliente al montar la pantalla
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
        const data = result.data; // Accede al cliente dentro de la propiedad `data`
        console.log('Datos del cliente obtenidos:', data);
        setCliente(data); // Actualiza el estado local con los datos del cliente
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los datos del cliente:', error);
        setLoading(false);
      });
  };

  const handleEdit = (mascota: any) => {
    setSelectedMascota(mascota); // Guarda la mascota seleccionada
    setNombre(mascota.nombre);
    setTipo(mascota.tipo);
    setRaza(mascota.raza);
    setFechaNacimiento(mascota.fechaNacimiento);
    setIsEditing(true); // Activa el modal de edición
  };

  const handleSaveEdit = () => {
    const mascotaActualizada = {
      ...selectedMascota,
      nombre,
      tipo,
      raza,
      fechaNacimiento,
    };

    const mascotasActualizadas = cliente.mascotas.map((m: any) =>
      m._id === mascotaActualizada._id ? mascotaActualizada : m,
    );

    const clienteActualizado = {...cliente, mascotas: mascotasActualizadas};

    fetch('https://site-back-web-vet.vercel.app/api/client', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteActualizado),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la actualización: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Cliente actualizado exitosamente:', data);
        fetchCliente(); // Refresca los datos desde la API
      })
      .catch(error => {
        console.error('Error al actualizar el cliente:', error);
      });

    setIsEditing(false);
    setSelectedMascota(null);
  };

  const handleAddMascota = () => {
    const nuevaMascota = {
      nombre,
      tipo,
      raza,
      fechaNacimiento,
    };

    const mascotasActualizadas = [...cliente.mascotas, nuevaMascota];
    const clienteActualizado = {...cliente, mascotas: mascotasActualizadas};

    fetch('https://site-back-web-vet.vercel.app/api/client', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteActualizado),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al agregar la mascota: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Mascota agregada exitosamente:', data);
        fetchCliente(); // Refresca los datos desde la API
      })
      .catch(error => {
        console.error('Error al agregar la mascota:', error);
      });

    setIsAdding(false);
    setNombre('');
    setTipo('');
    setRaza('');
    setFechaNacimiento('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.title}>Cargando datos del cliente...</Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontraron datos del cliente.</Text>
      </View>
    );
  }

  const renderMascotaCard = ({item}: any) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardDetail}>Tipo: {item.tipo}</Text>
          <Text style={styles.cardDetail}>Raza: {item.raza}</Text>
          <Text style={styles.cardDetail}>
            Nacimiento: {item.fechaNacimiento}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.iconButton}>
            <Icon name="edit" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Mascotas de {cliente.nombre} {cliente.apellidos}
      </Text>
      <FlatList
        data={cliente.mascotas}
        renderItem={renderMascotaCard}
        keyExtractor={item => item._id || item.id}
        contentContainerStyle={styles.list}
      />

      <Button
        title="Agregar Mascota"
        onPress={() => setIsAdding(true)}
        color="#4CAF50"
      />

      {/* Modal de edición */}
      {isEditing && (
        <Modal visible={isEditing} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Mascota</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
              />
              <TextInput
                style={styles.input}
                placeholder="Tipo"
                value={tipo}
                onChangeText={setTipo}
              />
              <TextInput
                style={styles.input}
                placeholder="Raza"
                value={raza}
                onChangeText={setRaza}
              />
              <TextInput
                style={styles.input}
                placeholder="Fecha de Nacimiento"
                value={fechaNacimiento}
                onChangeText={setFechaNacimiento}
              />
              <View style={styles.modalActions}>
                <Button title="Guardar" onPress={handleSaveEdit} />
                <Button
                  title="Cancelar"
                  onPress={() => setIsEditing(false)}
                  color="#F44336"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de agregar mascota */}
      {isAdding && (
        <Modal visible={isAdding} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Agregar Mascota</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
              />
              <TextInput
                style={styles.input}
                placeholder="Tipo"
                value={tipo}
                onChangeText={setTipo}
              />
              <TextInput
                style={styles.input}
                placeholder="Raza"
                value={raza}
                onChangeText={setRaza}
              />
              <TextInput
                style={styles.input}
                placeholder="Fecha de Nacimiento"
                value={fechaNacimiento}
                onChangeText={setFechaNacimiento}
              />
              <View style={styles.modalActions}>
                <Button title="Agregar" onPress={handleAddMascota} />
                <Button
                  title="Cancelar"
                  onPress={() => setIsAdding(false)}
                  color="#F44336"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
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
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MascotasScreen;
