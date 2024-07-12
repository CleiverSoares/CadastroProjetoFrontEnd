<template>
  <div class="container-pai">
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1200, y: 'auto' }" :locale="customLocale">
      <!-- Renderização customizada das células da tabela -->
      <template #bodyCell="{ text, record, column }">
        <!-- Renderização customizada para a coluna de operações -->
        <template v-if="column.key === 'operation'">
          <a href="#modal-example" uk-toggle @click="atualizarPessoa(record)">Atualizar</a> /
          <a @click="excluirPessoa(record)">Excluir</a>
        </template>
        <!-- Renderização de imagem para a coluna de foto -->
        <template v-else-if="column.key === 'foto'">
          <img v-if="record.foto" :src="getFotoUrl(record.foto)" :alt="'Foto de ' + record.nome"
            style="max-width: 100px; max-height: 100px; border-radius: 50%;" />
          <span v-else>Nenhuma foto disponível</span>
        </template>
        <!-- Renderização das categorias -->
        <template v-else-if="column.key === 'categorias'">
          <span v-for="(categoria, index) in record.categorias" :key="index">
            {{ categoria.nome }}
            <span v-if="index !== record.categorias.length - 1">, </span>
          </span>
        </template>
        <!-- Renderização padrão para outras colunas -->
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </div>
  <ModalPessoas :dadosPessoa="dadosPessoa"  />
</template>

<script setup>
import { ref } from 'vue';
import services from '../services';
import ModalPessoas from '../components/ModalPessoas.vue'

const columns = ref([
  {
    title: 'Foto',
    dataIndex: 'foto',
    key: 'foto',
    width: 70,
    customRender: ({ text, record }) =>
      record.foto ? `<img src="${getFotoUrl(record.foto)}" alt="Foto de ${record.nome}" style="width: 100px; height: 100px; border-radius: 50%;">`
        : 'Nenhuma foto disponível',
  },
  {
    title: 'Nome',
    dataIndex: 'nome',
    key: 'nome',
    width: 120,
    filterSearch: true,
    onFilter: (value, record) => record.nome.includes(value),
    sorter: (a, b) => a.nome.localeCompare(b.nome),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Idade',
    dataIndex: 'idade',
    key: 'idade',
    width: 50,
    sorter: (a, b) => a.idade - b.idade,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'CPF',
    dataIndex: 'cpf',
    key: 'cpf',
    width: 70,
    filterSearch: true,
  },
  {
    title: 'Telefone',
    dataIndex: 'telefone',
    key: 'telefone',
    width: 70,
  },
  {
    title: 'Data de Nascimento',
    dataIndex: 'dataNascimento',
    key: 'dataNascimento',
    width: 70,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 120,
  },
  {
    title: 'Categorias',
    dataIndex: 'categorias',
    key: 'categorias',
    width: 150,
  },
  {
    title: 'Ações',
    key: 'operation',
    fixed: 'right',
    width: 100,
  },
]);

// Dados da tabela
const data = ref([]);

// Configuração do idioma customizado para a tabela
const customLocale = {
  filterConfirm: 'Confirmar',
  filterReset: 'Resetar',
  emptyText: 'Sem dados',
};


// Função para buscar pessoas
const buscarPessoas = async () => {
  try {
    const response = await services.pessoas.getPessoas(); 
    data.value = response.data;
    // Adicionar filtros para a coluna 'Nome'
    const nomeFilters = response.data.map(item => ({ text: item.nome, value: item.nome }));
    columns.value[1].filters = nomeFilters;

    const cpfFilters = response.data.map(item => ({ text: item.cpf, value: item.cpf }));
    columns.value[3].filters = cpfFilters;

    // Atualizar todasCategorias com todas as categorias únicas encontradas nas pessoas
  } catch (error) {
    console.error('Erro ao carregar pessoas:', error);
  }
};

// Função para obter todas as categorias únicas das pessoas
const obterTodasCategorias = (pessoas) => {
  const categoriasSet = new Set();
  pessoas.forEach(pessoa => {
    pessoa.categorias.forEach(categoria => {
      categoriasSet.add(categoria.nome);
    });
  });
  return Array.from(categoriasSet).map(nome => ({ nome }));
};

const excluirPessoa = async (record) => {
  try {
    await services.pessoas.deletarPessoa(record.id);
    buscarPessoas();
  } catch (error) {
    console.error('Erro ao excluir pessoa:', error);
  }
};

let dadosPessoa = ref({});

const atualizarPessoa = (record) => {
  dadosPessoa.value = record;
};

const getFotoUrl = (fotoPath) => `${'http://127.0.0.1:8000'}/${fotoPath}`;

buscarPessoas();

setInterval(buscarPessoas, 10000);
</script>

<style scoped>
.ant-table-cell img {
  border-radius: 150px;
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.ant-table-container {
  width: 100%;
  height: 100vh;
}
</style>
