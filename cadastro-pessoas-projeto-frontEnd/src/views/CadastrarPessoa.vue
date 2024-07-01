<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="nome">Nome:</label>
        <input type="text" id="nome" v-model="form.nome" required>
      </div>
      <div>
        <label for="telefone">Telefone:</label>
        <input type="text" id="telefone" v-model="form.telefone" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required>
      </div>
      <div>
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" v-model="form.cpf" required>
      </div>
      <div>
        <label for="foto">Foto:</label>
        <input type="file" id="foto" @change="handleFileUpload" required>
      </div>
      <div>
        <label for="data_nasc_pessoa">Data de Nascimento:</label>
        <input type="date" id="data_nasc_pessoa" v-model="form.data_nasc_pessoa" required>
      </div>
      <div>
        <label for="categoria_esporte">Categoria de Esporte:</label>
        <select id="categoria_esporte" v-model="form.categoria_esporte" multiple required>
          <option v-for="categoria in categorias" :key="categoria.id_categoria" :value="categoria.id_categoria">
            {{ categoria.nome_categoria }}
          </option>
        </select>
      </div>
      <div>
        <button type="submit">Salvar</button>
      </div>
    </form>
  </div>
</template>


<script setup>
import { reactive, onMounted } from 'vue';
import services from '../services';
import Compressor from 'compressorjs';

const form = reactive({
  nome: '',
  telefone: '',
  email: '',
  cpf: '',
  foto: null,
  data_nasc_pessoa: null, // Inicializado como null para evitar erro inicial
  categoria_esporte: [],
});

const categorias = reactive([]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    new Compressor(file, {
      quality: 0.6, // Ajuste a qualidade de 0 a 1 (opcional)
      maxWidth: 800, // Largura máxima da imagem (opcional)
      maxHeight: 600, // Altura máxima da imagem (opcional)
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = () => {
          form.foto = reader.result.split(',')[1]; // Base64 sem o prefixo
        };
        reader.onerror = (error) => {
          console.error('Erro ao converter arquivo para Base64:', error);
        };
      },
      error(error) {
        console.error('Erro ao comprimir imagem:', error.message);
      },
    });
  }
};


onMounted(async () => {
  try {
    const response = await services.categoriasEsporte.getCategorias();
    categorias.push(...response.data);
  } catch (error) {
    console.error('Erro ao carregar categorias de esporte:', error);
  }
});

const handleSubmit = async () => {
  try {
    // Verifica se form.data_nasc_pessoa é uma string (vindo diretamente do input type="date")
    // Se sim, converte para Date
    const dataNascimento = typeof form.data_nasc_pessoa === 'string' ? new Date(form.data_nasc_pessoa) : form.data_nasc_pessoa;

    // Formata a data no formato YYYY-MM-DD antes de enviar
    const dataNascimentoISO = dataNascimento.toISOString().split('T')[0];

    const response = await services.pessoas.criarPessoa({
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      cpf: form.cpf,
      data: dataNascimentoISO,
      categoria: form.categoria_esporte,
      foto: form.foto,
    });

    console.log('Registro criado:', response.data);

    // Redirecionar para outra página após o cadastro
    // Exemplo: router.push('/lista-pessoas');
  } catch (error) {
    console.error('Erro ao cadastrar pessoa:', error);
  }
};
</script>


<style scoped>
/* Estilos opcionais para o componente */
label {
  display: block;
  margin-bottom: 0.5rem;
}
input, select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>








