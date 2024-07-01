<template>
  <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }" :locale="customLocale">
    <!-- Renderização customizada das células da tabela -->
    <template #bodyCell="{ text, record, column }">
      <!-- Renderização customizada para a coluna de operações -->
      <template v-if="column.key === 'operation'">
        <a @click="atualizarPessoa(record)">Atualizar</a> /
        <a @click="excluirPessoa(record)">Excluir</a>
      </template>
      <!-- Renderização de imagem para a coluna de foto -->
      <template v-else-if="column.key === 'foto'">
        <img v-if="record.foto" :src="getFotoUrl(record.foto)" :alt="'Foto de ' + record.nome"
          style="max-width: 100px; max-height: 100px;" />
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
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { Table, Tag } from 'ant-design-vue';
import services from '../services'; // Importe seus serviços aqui

// Declaração das colunas da tabela
const columns = ref([
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
    width: 90,
    filterSearch: true,
  },
  {
    title: 'Telefone',
    dataIndex: 'telefone',
    key: 'telefone',
    width: 100,
  },
  {
    title: 'Data de Nascimento',
    dataIndex: 'dataNascimento',
    key: 'dataNascimento',
    width: 120,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 120,
  },
  {
    title: 'Foto',
    dataIndex: 'foto',
    key: 'foto',
    width: 120,
    customRender: ({ text, record }) =>
      record.foto
        ? `<img src="${getFotoUrl(record.foto)}" alt="Foto de ${record.nome}" style="width: 100px; height: 100px; border-radius: 50%;">`
        : 'Nenhuma foto disponível',
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
    const response = await services.pessoas.getPessoas(); // Substitua com seu serviço de busca de pessoas
    data.value = response.data;

    // Adicionar filtros para a coluna 'Nome'
    const nomeFilters = response.data.map(item => ({ text: item.nome, value: item.nome }));
    columns.value[0].filters = nomeFilters;

    const cpfFilters = response.data.map(item => ({ text: item.cpf, value: item.cpf }));
    columns.value[2].filters = cpfFilters;
  } catch (error) {
    console.error('Erro ao carregar pessoas:', error);
  }
};


const excluirPessoa = async (record) => {
  try {
    await services.pessoas.deletarPessoa(record.id);
    buscarPessoas(); 
  } catch (error) {
    console.error('Erro ao excluir pessoa:', error);
  }
};


const atualizarPessoa = (record) => {
  console.log('Atualizar pessoa:', record);

};


const getFotoUrl = (fotoPath) => `${'http://127.0.0.1:8000'}/${fotoPath}`;


buscarPessoas();

setInterval(buscarPessoas, 10000); // Intervalo de 5 segundos (ajuste conforme necessário)
</script>

<style scoped>
.ant-table-cell img {
  border-radius: 150px;
  width: 200px;
  height: 200px;
  object-fit: cover;
}
</style>
