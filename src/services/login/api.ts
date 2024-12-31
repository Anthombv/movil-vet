import axios from 'axios';

const API_URL = 'https://site-back-web-vet.vercel.app/api/client';

// Obtiene todos los usuarios de la API
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data; // Devuelve solo la lista de usuarios
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};
