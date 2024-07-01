import axios from "axios";
import pessoasService from "./pessoas";
import casdatrarService from "./cadastrar";
import categoriasEsporte from "./categoriasEsporte";

export const httpClient = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});
export default {
  pessoas: pessoasService(httpClient),
  cadastrar: casdatrarService(httpClient),
  categoriasEsporte: categoriasEsporte(httpClient),
};
