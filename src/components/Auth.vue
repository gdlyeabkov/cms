<template>
    <div class="authFormGround" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(235, 235, 235)' : 'rgb(35, 35, 75)'}`">
        <div class="authForm" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(215, 215, 215)' : 'rgb(15, 35, 25)'}`">
            <div class="modeToggler">
                <button class="btn btn-primary modeTogglerBtn" @click="$route.path === '/cpanel/webview' ? $router.push({ name: 'CPanel' }) : $router.push({ name: 'WebView' })">
                    {{
                        $route.path === '/cpanel/webview' ?
                            'Редактор'
                        :
                            'Сайт'
                    }}
                </button>
            </div>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" width="100px" :alt="siteData.logo" />
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
            <button @click="loginToSite" class="w-25 btn btn-primary">
                Вход
            </button>
            <span class="errors">
                {{
                    authErrors
                }}
            </span>
        </div>
    </div>
</template>

<script>

// const bcrypt = require('bcrypt')

export default {
    name: 'Auth',
    data() {
        return {
            login: 'admin',
            password: '',
            authErrors: ''
        }
    },
    props: {
        siteData: {
            type: Object,
            default: {
                name: 'Название_сайта',
                password: 'lordres',
                company: 'Lord Res Technologies',
                dbPrefix: '_prefix',
                items: [],
                theme: 'light',
                pagination: true,
                paginationItems: 5,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png',
                admin: {
                    login: 'admin'
                },
                notifications: true
            }
        }
    },
    emits: [
        'setAuth'
    ],
    methods: {
        loginToSite() {
            
            // if ((this.login === 'admin' && this.password === this.siteData.password) || this.login !== 'admin') {
            //     this.$emit('setAuth', true, this.login)
            // } else {
            //     alert('не удается войти')
            // }

            fetch(`http://localhost:4000/api/sites/users/check/?userlogin=${this.login}&userpassword=${this.password}`, {
            
            // fetch(`http://localhost:4000/api/sites/users/get/`, {
                mode: 'cors',
                method: 'GET'
            }).then(response => response.body).then(rb  => {
                const reader = rb.getReader()
                return new ReadableStream({
                start(controller) {
                    function push() {
                    reader.read().then( ({done, value}) => {
                        if (done) {
                        console.log('done', done);
                        controller.close();
                        return;
                        }
                        controller.enqueue(value);
                        console.log(done, value);
                        push();
                    })
                    }
                    push();
                }
                });
            }).then(stream => {
                return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
            })
            .then(async result => {
                
                // if ((this.login === 'admin' && this.password === this.siteData.password) || JSON.parse(result).db[0].users.filter(user => user.login === this.login && bcrypt.compareSync(this.password, user.password))) {
                
                if ((this.login === this.siteData.admin.login && this.password === this.siteData.password) || (JSON.parse(result).status === 'OK' && this.login !== 'admin')) {
                // if ((this.login === 'admin' && this.password === this.siteData.password) || JSON.parse(result).db[0].users.map(user => user.login).includes(this.login)) {
                    this.$emit('setAuth', true, this.login)
                } else {
                    if(this.siteData.notifications) {
                        alert('Не удается войти')
                        this.authErrors = 'Не удается войти'
                    }
                }

            })
            
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
        top: calc(65% / 2 - 16%);
        left: calc(60% / 2 - 10%);
        width: 50%;
        height: 65%;
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
        margin: 4px 0px; 
    }

    .authFormElement {
        margin: 10px 0px;
    }

    .authFormGround {
        position: fixed;
        top: 0px;
        left: 0px;
        background-color: rgb(235, 235, 235);
        width: 100%;
        height: 100%;
    }

    .errors {
        color: rgb(225, 0, 0);
        font-weight: bolder;
    }

    .modeToggler {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    .modeTogglerBtn {
        width: 150px;
    }

</style>