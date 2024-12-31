import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Citas = ({navigation}: any) => {
  const {logout, user} = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Citas de {user.nombre} {user.apellidos}
      </Text>
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

export default Citas;
