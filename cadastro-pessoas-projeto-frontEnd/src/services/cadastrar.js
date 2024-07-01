export default (httpClient) => ({

    criarCadastro: async (cadastrar) => {
      const response = await httpClient.post("/cadastrar", cadastrar)
  
      return {
        data: response.data,
      }
    },
  })
  