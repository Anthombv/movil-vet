import React from 'react';
import {View, Text, Button, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MascotasScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const handleEdit = (mascotaId: string) => {
    console.log(`Editar mascota con ID: ${mascotaId}`);
  };

  const handleDelete = (mascotaId: string) => {
    console.log(`Eliminar mascota con ID: ${mascotaId}`);
  };

  const renderMascotaCard = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardDetail}>Tipo: {item.tipo}</Text>
          <Text style={styles.cardDetail}>Raza: {item.raza}</Text>
          <Text style={styles.cardDetail}>Nacimiento: {item.fechaNacimiento}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.iconButton}>
            <Icon name="edit" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
            <Icon name="delete" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Mascotas de {user.nombre} {user.apellidos}
      </Text>
      <FlatList
        data={user.mascotas}
        renderItem={renderMascotaCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
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
    shadowOffset: { width: 0, height: 2 },
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
});
export default MascotasScreen;
