export default (httpClient) => ({
  getCategorias: async () => {
    const response = await httpClient.get("categorias");
    return {
      data: response.data,
    };
  },
  getCategoriasSelecionadas: async () => {
    const response = await httpClient.get("categorias-selecionadas");
    return {
      data: response.data,
    };
  },
});
