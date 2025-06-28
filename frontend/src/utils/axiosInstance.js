import axios from "axios"

export const myAxios = axios.create({
  baseURL: 'https://ch.api.masenko.dev',
    withCredentials: true,
});