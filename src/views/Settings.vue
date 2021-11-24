<template>
    <div>
        <Header />
        <div class="main" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(100, 100, 100)' : 'rgb(65, 40, 50)'}`">
            <span class="material-icons siteBodyAsideItem" @click="$router.push({ name: 'CPanel' })">
                logout
            </span>
            <div class="settingsItem">
                <input id="theme" @change="setTheme" type="checkbox" :checked="siteData.theme === 'light' ?
                        true
                    :
                        false" />
                <label class="settingsItemLabel" for="theme">
                    {{
                        siteData.theme === 'light' ?
                            'Сменить тему на темную'
                        :
                            'Сменить тему на светлую'
                    }}
                </label>
            </div>
            <div class="settingsItem">
                <input id="pagination" @change="setPagination" type="checkbox" :checked="siteData.pagination" />
                <label class="settingsItemLabel" for="pagination">
                    {{
                        siteData.pagination ?
                            'Использовать пагинацию'
                        :
                            'Выводить записи на одной странице'
                    }}
                </label>
            </div>
            <div class="settingsItem">
                <input id="paginationItems" v-model="paginationItems" :disabled="!siteData.pagination" @change="setPaginationItems" type="number" />
                <label class="settingsItemLabel" for="paginationItems">
                    {{
                        siteData.pagination ?
                            'Кол-во выводимых записей на одной странице'
                        :
                            'Для начала включите пагиницаю'
                    }}
                </label>
            </div>
            <div class="settingsItem">
                <input v-model="oldPassword" type="password" placeholder="Старый пароль" class="from-control" />
                <label class="settingsItemLabel" for="pagination">
                    {{
                        'Обновите пароль'
                    }}
                </label>
            </div>
            <div class="settingsItem">
                <input v-model="newPassword" type="password" placeholder="Новый пароль" class="from-control" />
                <button class="btn btn-primary m-2" @click="setPassword">
                    Сменить пароль
                </button>
            </div>
            <span class="errors">
                {{
                    passwordErrors
                }}
            </span>
            <div class="settingsItem">
                <input id="notifications" @change="setNotifications" type="checkbox" :checked="siteData.notifications" />
                <label class="settingsItemLabel" for="notifications">
                    {{
                        siteData.notifications ?
                            'Выключить уведомления'
                        :
                            'Включить уведомления'
                    }}
                </label>
            </div>
            <div class="settingsItem">
                <input id="mail" @change="setSendMail" type="checkbox" :checked="siteData.mail" />
                <label class="settingsItemLabel" for="mail">
                    {{
                        siteData.mail ?
                            'Не отправлять оповещения'
                        :
                            'Посылать оповещения'
                    }}
                </label>
            </div>

        </div>
        <Footer />
    </div>
</template>

<script>

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    name: 'Settings',
    data() {
        return {
            siteData: {
                name: 'Название_сайта',
                password: 'lordres',
                company: 'Lord Res Technologies',
                dbPrefix: '_prefix',
                items: [],
                theme: 'light',
                pagination: true,
                paginationItems: 5,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png',
                notifications: true,
                mail: true
            },
            paginationItems: 5,
            oldPassword: '',
            newPassword: '',
            passwordErrors: ''
        }  
    },
    mounted() {
        let simpleSiteData = window.localStorage.getItem('lordres-site-data')
        this.siteData = JSON.parse(simpleSiteData)
        this.paginationItems = this.siteData.paginationItems
    },
    methods: {
        setSendMail() {

        },
        setNotifications() {
            this.siteData.notifications = !this.siteData.notifications
            if (!this.siteData.notifications) {
                this.passwordErrors = ''
            }
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        setPassword() {
            if (this.siteData.password === this.oldPassword) {
                this.siteData.password = this.newPassword
                let strinableSiteData = JSON.stringify(this.siteData)
                window.localStorage.setItem('lordres-site-data', strinableSiteData)
                this.$router.push({ name: 'Home' })
            } else {
                if(this.siteData.notifications) {
                    alert('Неправильно указан пароль')
                    this.passwordErrors = 'Неправильно указан пароль'
                }
            }
        },
        setPaginationItems() {
            // if(this.siteData.paginationItems === 5) {
            //     this.siteData.paginationItems = 10
            // } else if(this.siteData.paginationItems === 10) {
            //     this.siteData.paginationItems = 15
            // } else if(this.siteData.paginationItems === 15) {
            //     this.siteData.paginationItems = 5
            // }
            this.siteData.paginationItems = this.paginationItems
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        setPagination() {
            this.siteData.pagination = !this.siteData.pagination
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        setTheme() {
            if(this.siteData.theme === 'light') {
                this.siteData.theme = 'dark'
            } else if(this.siteData.theme === 'dark') {
                this.siteData.theme = 'light'
            }
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        }
    },
    components: {
        Header,
        Footer
    }
}
</script>

<style scoped>
    
    .settingsItem {
        cursor: pointer;
        margin: 25px 0px; 
    }

    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgb(100, 100, 100);
    }

    .settingsItemLabel {
        color: rgb(255, 255, 255);
        margin: 0px 15px;
        font-weight: bolder;
    }

    .siteBodyAsideItem {
        color: rgb(75, 125, 125);
        font-size: 36px;
        cursor: pointer;
    }

    .errors {
        color: rgb(225, 0, 0);
        font-weight: bolder;
    }

</style>