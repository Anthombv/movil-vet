import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';

const Citas = ({navigation}: any) => {
  const {user} = useAuth();
  const [cliente, setCliente] = useState<any>(null);
  const [citas, setCitas] = useState<any>(null);
  const [especialidades, setEspecialidades] = useState<any>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCita, setEditingCita] = useState<any>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState<any[]>([]);
  const [modalType, setModalType] = useState<
    'especialidad' | 'hora' | 'mascota'
  >('especialidad');

  const [selectedMascota, setSelectedMascota] = useState<any>(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [selectedFecha, setSelectedFecha] = useState('');
  const [selectedHora, setSelectedHora] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCliente();
    fetchCitas();
    fetchEspecialidades();
  }, []);

  const fetchCliente = () => {
    fetch(`https://site-back-web-vet.vercel.app/api/client/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => setCliente(result.data))
      .catch(error => console.error('Error al obtener el cliente:', error));
  };

  const fetchCitas = () => {
    setLoading(true);
    fetch(`https://site-back-web-vet.vercel.app/api/cita/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => setCitas(result.data))
      .catch(error => console.error('Error al obtener las citas:', error));
    setLoading(false);
  };

  const fetchEspecialidades = () => {
    fetch(`https://site-back-web-vet.vercel.app/api/especialidades`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => setEspecialidades(result.data))
      .catch(error =>
        console.error('Error al obtener las especialidades:', error),
      );
  };

  const calcularHorariosDisponibles = (fecha: string, especialidad: string) => {
    const horariosTotales =
      especialidad === 'Vacunacion'
        ? [
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
          ]
        : [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
          ];

    const horariosOcupados = citas
      ?.filter(
        (cita: any) =>
          cita.fecha === fecha && cita.especialidad.nombre === especialidad,
      )
      .map((cita: any) => cita.hora);

    const horariosDisponibles = horariosTotales.filter(
      hora => !horariosOcupados?.includes(hora),
    );
    setHorariosDisponibles(horariosDisponibles);
  };

  const openModal = (type: 'especialidad' | 'hora' | 'mascota') => {
    setModalType(type);
    if (type === 'mascota') {
      setModalOptions(cliente?.mascotas || []);
    } else if (type === 'especialidad') {
      setModalOptions(especialidades.map((e: any) => e.nombre));
    } else {
      setModalOptions(horariosDisponibles);
    }
    setIsModalVisible(true);
  };

  const renderModalOption = ({item}: any) => (
    <TouchableOpacity
      style={styles.modalOption}
      onPress={() => {
        if (modalType === 'mascota') {
          setSelectedMascota(item);
        } else if (modalType === 'especialidad') {
          setSelectedEspecialidad(item);
          calcularHorariosDisponibles(selectedFecha, item);
        } else {
          setSelectedHora(item);
        }
        setIsModalVisible(false);
      }}>
      <Text style={styles.modalOptionText}>
        {modalType === 'mascota' ? item.nombre : item}
      </Text>
    </TouchableOpacity>
  );

  const handleAddCita = () => {
    if (
      !selectedMascota ||
      !selectedEspecialidad ||
      !selectedFecha ||
      !selectedHora
    ) {
      console.log('Por favor completa todos los campos.');
      return;
    }

    const nuevaCita = {
      cliente: cliente,
      mascota: selectedMascota,
      especialidad: selectedEspecialidad,
      fecha: selectedFecha,
      hora: selectedHora,
      number: 0,
      diagnostico: '',
      medico: null,
      tratamiento: '',
      detalle: '',
      valor: 0,
    };

    console.log(nuevaCita);
    console.log(JSON.stringify(nuevaCita));

    fetch(`https://site-back-web-vet.vercel.app/api/cita/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaCita),
    })
      .then(response => response.json())
      .then(() => {
        console.log(JSON.stringify(nuevaCita));
        fetchCitas();
        setIsAdding(false);
      })
      .catch(error => console.error('Error al agregar la cita:', error));
  };

  const handleEditCita = () => {
    const citaEditada = {
      ...editingCita,
      fecha: selectedFecha,
      hora: selectedHora,
    };

    fetch(`https://site-back-web-vet.vercel.app/api/cita/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(citaEditada),
    })
      .then(response => response.json())
      .then(() => {
        fetchCitas();
        setIsEditing(false);
      })
      .catch(error => console.error('Error al editar la cita:', error));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.title}>Cargando datos del cliente...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Citas de {cliente?.nombre} {cliente?.apellidos}
      </Text>
      <FlatList
        data={citas}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text>Mascota: {item.mascota.nombre}</Text>
            <Text>Especialidad: {item.especialidad.nombre}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Hora: {item.hora}</Text>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => {
                setEditingCita(item);
                setSelectedFecha(item.fecha);
                setSelectedHora(item.hora);
                setIsEditing(true);
              }}>
              <Text style={styles.buttonPrimaryText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => setIsAdding(true)}>
        <Text style={styles.buttonPrimaryText}>Agregar Cita</Text>
      </TouchableOpacity>

      {/* Modal para seleccionar opciones */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={modalOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderModalOption}
          />
        </View>
      </Modal>

      {/* Modal para agregar citas */}
      {isAdding && (
        <Modal visible={isAdding} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Cita</Text>
              <Text>
                Mascota: {selectedMascota?.nombre || 'Seleccionar Mascota'}
              </Text>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => openModal('mascota')}>
                <Text style={styles.buttonPrimaryText}>
                  Seleccionar Mascota
                </Text>
              </TouchableOpacity>
              <Text>
                Especialidad:{' '}
                {selectedEspecialidad || 'Seleccionar Especialidad'}
              </Text>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => openModal('especialidad')}>
                <Text style={styles.buttonPrimaryText}>
                  Seleccionar Especialidad
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Fecha (YYYY-MM-DD)"
                value={selectedFecha}
                onChangeText={value => {
                  setSelectedFecha(value);
                  calcularHorariosDisponibles(value, selectedEspecialidad);
                }}
              />
              <Text>Hora: {selectedHora || 'Seleccionar Hora'}</Text>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => openModal('hora')}>
                <Text style={styles.buttonPrimaryText}>Seleccionar Hora</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleAddCita}>
                <Text style={styles.buttonPrimaryText}>Crear Cita</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setIsAdding(false)}>
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para editar citas */}
      {isEditing && (
        <Modal visible={isEditing} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Cita</Text>
              <TextInput
                style={styles.input}
                placeholder="Fecha (YYYY-MM-DD)"
                value={selectedFecha}
                onChangeText={value => {
                  setSelectedFecha(value);
                  calcularHorariosDisponibles(
                    value,
                    editingCita.especialidad.nombre,
                  );
                }}
              />
              <Text>Hora: {selectedHora || 'Seleccionar Hora'}</Text>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => openModal('hora')}>
                <Text style={styles.buttonPrimaryText}>Seleccionar Hora</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleEditCita}>
                <Text style={styles.buttonPrimaryText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setIsEditing(false)}>
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 20, textAlign: 'center', marginBottom: 16},
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {backgroundColor: '#fff', padding: 20, borderRadius: 8},
  modalTitle: {fontSize: 20, fontWeight: 'bold', marginBottom: 16},
  input: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonPrimaryText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
  buttonSecondary: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonSecondaryText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
  modalOption: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 4,
    borderRadius: 8,
  },
  modalOptionText: {fontSize: 16, textAlign: 'center'},
});

export default Citas;
