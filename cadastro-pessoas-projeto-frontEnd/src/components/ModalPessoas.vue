<template>
    <div>
        <!-- This is a button toggling the modal -->

        <!-- This is the modal -->
        <div id="modal-example" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <h2 class="uk-modal-title">Atualizar Pessoa</h2>
                <form @submit.prevent="submitForm" enctype="multipart/form-data">
                    <div class="uk-margin">
                        <label class="uk-form-label" for="nome">Nome:</label>
                        <input class="uk-input" type="text" id="nome" v-model="formData.nome">
                    </div>
                    <div class="uk-margin">
                        <label class="uk-form-label" for="telefone">Telefone:</label>
                        <input class="uk-input" type="text" id="telefone" v-model="formData.telefone">
                    </div>
                    <div class="uk-margin">
                        <label class="uk-form-label" for="cpf">CPF:</label>
                        <input class="uk-input" type="text" id="cpf" v-model="formData.cpf">
                    </div>
                    <div class="uk-margin">
                        <label class="uk-form-label" for="idade">Idade:</label>
                        <input class="uk-input" type="number" id="idade" v-model="formData.idade">
                    </div>
                    <div class="uk-margin">
                        <label class="uk-form-label" for="dataNascimento">Data de Nascimento:</label>
                        <input class="uk-input" type="date" id="dataNascimento" v-model="formData.dataNascimento">
                    </div>
                    <div class="uk-margin">
                        <label class="uk-form-label" for="email">Email:</label>
                        <input class="uk-input" type="email" id="email" v-model="formData.email">
                    </div>
                    <div class="uk-margin">
                        <div>
                            <label class="uk-form-label" for="foto">Foto:</label>
                            <img :src="foto.url" alt="Foto da Pessoa" v-if="foto.url" class="uk-margin-bottom"
                                width="150">
                        </div>
                        <input class="uk-input" type="file" id="foto" @change="onFileChange">
                    </div>
                    <div class="uk-margin">
                        <label class="uk-form-label">Categorias:</label>
                        <div v-for="(categoria, index) in formData.categorias" :key="index">
                            <input type="text" class="uk-input" v-model="categoria.nome">
                        </div>
                    </div>
                    <p class="uk-text-right">
                        <button class="uk-button uk-button-default uk-modal-close" type="button"
                            @click="limparDados">Cancel</button>
                        <button class="uk-button uk-button-primary" type="submit">Save</button>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, reactive, watch, watchEffect } from 'vue'
import services from '../services';
import Compressor from 'compressorjs';

const props = defineProps({
    dadosPessoa: {
        type: Object,
        required: true
    }
})

// Criar uma cópia reativa dos dadosPessoa para o formulário
const formData = reactive({ ...props.dadosPessoa })
const foto = reactive({ file: null, url: props.dadosPessoa.foto })

// Preencher categorias no formulário
formData.categorias = props.dadosPessoa.categorias || [];

// Atualizar formData quando dadosPessoa mudar
watch(() => props.dadosPessoa, (newData) => {
    Object.assign(formData, newData)
    foto.url = newData.foto ? `http://127.0.0.1:8000/${newData.foto}` : ''
    // Atualizar categorias também se necessário
    formData.categorias = newData.categorias || [];
}, { immediate: true })

function limparDados() {
    Object.assign(formData, {
        nome: '',
        telefone: '',
        cpf: '',
        idade: 0,
        dataNascimento: '',
        email: '',
        foto: '',
        categorias: []
    })
    foto.file = null
    foto.url = ''
}

function onFileChange(event) {
    const file = event.target.files[0]
    if (file) {
        new Compressor(file, {
            quality: 0.6,
            maxWidth: 800,
            maxHeight: 600,
            success(result) {
                const reader = new FileReader();
                reader.readAsDataURL(result);
                reader.onload = () => {
                    foto.file = result;
                    foto.url = reader.result;
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
}

function submitForm() {
    // Crie uma cópia dos dados para evitar a mutação reativa durante a operação assíncrona
    let pessoa = {
        nome: formData.nome,
        telefone: formData.telefone,
        cpf: formData.cpf,
        idade: formData.idade,
        dataNascimento: formData.dataNascimento,
        email: formData.email,
        foto: foto.file,
        categorias: formData.categorias.map(categoria => ({ nome: categoria.nome }))
    }

    // Lógica para enviar os dados para o servidor ou processar a atualização
    services.pessoas.updatePessoa(pessoa, props.dadosPessoa.id)
}
</script>

<style scoped></style>
