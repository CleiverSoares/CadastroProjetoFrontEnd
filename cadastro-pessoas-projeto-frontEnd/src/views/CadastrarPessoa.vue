<template>
  <div class="uk-container uk-margin-large-top">
    <div class="uk-text-center uk-margin">
      <img src="https://projetodoar.cloud/images/novas-img/logo-doar.png" alt="Logo" class="logo">
    </div>
    <div class="uk-card uk-card-default uk-card-body uk-box-shadow-medium">
      <form @submit.prevent="handleSubmit" class="uk-form-stacked">
        <legend class="uk-legend uk-text-primary">Cadastro de Pessoa</legend>

        <div class="uk-margin">
          <label class="uk-form-label" for="nome">Nome:</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="text" id="nome" v-model="form.nome" required>
          </div>
        </div>

        <div class="uk-margin">
          <label class="uk-form-label" for="telefone">Telefone:</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="text" id="telefone" v-model="form.telefone" required>
          </div>
        </div>

        <div class="uk-margin">
          <label class="uk-form-label" for="email">Email:</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="email" id="email" v-model="form.email" required>
          </div>
        </div>

        <div class="uk-margin">
          <label class="uk-form-label" for="cpf">CPF:</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="text" id="cpf" v-model="form.cpf" required>
          </div>
        </div>

        <div class="uk-margin">
          <label class="uk-form-label" for="foto">Foto:</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="file" id="foto" @change="handleFileUpload" required>
          </div>
          <div v-if="form.fotoPreview" class="uk-margin-small div-foto">
            <img :src="form.fotoPreview" alt="Preview da Foto" class="preview-image">
          </div>
        </div>

        <div class="uk-margin">
          <label class="uk-form-label" for="data_nasc_pessoa">Data de Nascimento:</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="date" id="data_nasc_pessoa" v-model="form.data_nasc_pessoa" required>
          </div>
        </div>

        <div class="uk-margin">
          <label class="uk-form-label" for="categoria_esporte">Categoria de Esporte:</label>
          <div class="uk-form-controls">
            <div v-for="categoria in categorias" :key="categoria.id_categoria" class="uk-margin-small">
              <label>
                <input class="uk-checkbox" type="checkbox" :value="categoria.id_categoria" v-model="form.categoria_esporte">
                {{ categoria.nome_categoria }}
              </label>
            </div>
          </div>
        </div>

        <div class="uk-margin">
          <button class="uk-button uk-button-primary" type="submit">Salvar</button>
        </div>
      </form>
    </div>
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
  fotoPreview: null, // Campo para a prévia da imagem
  data_nasc_pessoa: null,
  categoria_esporte: [],
});

const categorias = reactive([]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: 800,
      maxHeight: 600,
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = () => {
          form.foto = reader.result.split(',')[1];
          form.fotoPreview = reader.result; // Atualiza a prévia da imagem
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
    const dataNascimento = typeof form.data_nasc_pessoa === 'string' ? new Date(form.data_nasc_pessoa) : form.data_nasc_pessoa;
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
  } catch (error) {
    console.error('Erro ao cadastrar pessoa:', error);
  }
};
</script>

<style scoped>
.uk-container {
  max-width: 600px;
  background-color: #f7f9fc;
  border-radius: 10px;
  padding: 20px;
}

.logo {
  max-width: 150px;
  margin: 0 auto;
}

.header-image {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
}

.uk-legend {
  font-size: 24px;
  color: #007BFF;
}

.uk-form-label {
  font-size: 16px;
  color: #333;
}

.uk-input, .uk-select, .uk-checkbox {
  border-radius: 5px;
}

.uk-button-primary {
  background-color: #007BFF;
  border-color: #007BFF;
  color: white;
}

.uk-button-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.uk-card {
  background-color: white;
  border-radius: 10px;
}

.preview-image {
  max-width: 100%;
  height: 150px;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.div-foto{
  display: flex;
}
.uk-checkbox:checked{
  border-radius: 150px;;
}
</style>
