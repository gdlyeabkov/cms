<template>
    <div class="authForm">
        <span class="authFormHeader">
            Войдите на свой сайт        
        </span>
        <div class="authFormElement">
            <span class="authFormLabel">
                Логин
            </span>
            <input v-model="login" class="form-control" placeholder="Введите имя пользователя" type="text" />
        </div>
        <div class="authFormElement">
            <span class="authFormLabel">
                Пароль
            </span>
            <input v-model="password" class="form-control" placeholder="Введите пароль администратора" type="password" />
        </div>
        <button @click="loginToSite" class="btn btn-primary">
            Вход
        </button>
    </div>
</template>

<script>
export default {
    name: 'Auth',
    data() {
        return {
            login: 'admin',
            password: ''
        }
    },
    props: {
        siteData: {
            default: {
                type: Object,
                default: {
                    name: 'Название_сайта',
                    password: 'lordres',
                    company: 'Lord Res Technologies'
                }
            }
        }
    },
    emits: [
        'setAuth'
    ],
    methods: {
        loginToSite() {
            if (this.login === 'admin' && this.password === this.siteData.password) {
                this.$emit('setAuth', true)
            }
        }
    }
}
</script>

<style scoped>
    
    .authForm {
        border-radius: 8px;
        box-sizing: border-box;
        padding: 25px;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: calc(60% / 2 - 15%);
        left: calc(60% / 2 - 15%);
        width: 60%;
        height: 60%;
        background-color: rgb(215, 215, 215);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .authFormHeader {
        font-weight: bolder;
        font-size: 24px;
        color: rgb(0, 200, 255);
    }

    .authFormLabel {
        display: flex;
        font-weight: bolder;
        margin: 10px 0px; 
    }

    .authFormElement {
        margin: 5px 0px;
    }

</style>