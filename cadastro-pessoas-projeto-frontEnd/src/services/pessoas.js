import { reactive } from "vue";

export default (httpClient) => ({
  getPessoas: async () => {
    const response = await httpClient.get("buscar-todos");

    let pessoas = reactive([]);

    response.data.forEach((pessoa) => {
      let dadosPessoa = reactive({
        id: pessoa.id_pessoa,
        nome: pessoa.nome_pessoa,
        telefone: pessoa.telefone_pessoa,
        cpf: pessoa.cpf_pessoa,
        idade: pessoa.idade,
        dataNascimento: pessoa.data_nasc_pessoa,
        email: pessoa.email_pessoa,
        foto: pessoa.foto_pessoa,
        categorias: pessoa.categorias?.map((cat) => ({
          nome: cat.nome_categoria ? "teste" : "teste",
        })),
      });
      pessoas.push(dadosPessoa);
    });

    return {
      data: pessoas,
    };
  },
  criarPessoa: async (pessoa) => {
    const response = await httpClient.post("cadastrar", pessoa);
    return {
      data: response.data,
    };
  },
  // updatePessoa: async (pessoa) => {
  //   const response = await httpClient.put(`/treino/${pessoa.id}`, pessoa);
  //   return {
  //     data: response.data,
  //   };
  // },
  deletarPessoa: async (id) => {
    console.log(id);
    try {
      const response = await httpClient.delete(`/excluir/${id}`);
      if (response && response.data) {
        console.log('Pessoa excluída com sucesso:', response.data.message);
        // Lógica adicional após exclusão, como atualizar a lista de pessoas
      } else {
        console.error('Resposta inválida ao excluir pessoa:', response);
      }
    } catch (error) {
      console.error('Erro ao excluir pessoa de:', error);
      // Tratar erro, se necessário
    }
  }
  
});
