import axios from 'axios';

const api = axios.create({
    // Mude para o seu ip dado pelo expo adicionando :3333
    baseURL:'http://192.168.0.6:3333'
})

export default api;