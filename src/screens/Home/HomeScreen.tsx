import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }: any) => {
  const { logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

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

  const renderPaginator = () => {
    const totalPages = Math.ceil(user.mascotas.length / itemsPerPage);
    return (
      <View style={styles.paginator}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageButton,
              currentPage === index && styles.activePageButton,
            ]}
            onPress={() => setCurrentPage(index)}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === index && styles.activePageButtonText,
              ]}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getPaginatedData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return user.mascotas.slice(startIndex, endIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Mascotas de {user.nombre} {user.apellidos}
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={getPaginatedData()}
          renderItem={renderMascotaCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
      {renderPaginator()}
      <Text style={styles.sectionTitle}>Citas</Text>
      {/* Aquí iría tu sección de citas */}
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
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  listContainer: {
    maxHeight: 200, // Ajusta la altura máxima del listado (2 tarjetas)
    marginBottom: 16,
  },
  list: {
    flexGrow: 0, // Evita que ocupe todo el espacio disponible
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
  paginator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  activePageButton: {
    backgroundColor: '#4CAF50',
  },
  pageButtonText: {
    color: '#000',
  },
  activePageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
