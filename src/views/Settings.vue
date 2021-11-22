<template>
    <div>
        <Header />
        <div class="main">
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
                <input id="paginationItems" :value="siteData.paginationItems" :disabled="!siteData.pagination" @change="setPaginationItems" type="number" />
                <label class="settingsItemLabel" for="paginationItems">
                    {{
                        siteData.pagination ?
                            'Кол-во выводимых записей на одной странице'
                        :
                            'Для начала включите пагиницаю'
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
                pagination: true
            }
        }  
    },
    mounted() {
        let simpleSiteData = window.localStorage.getItem('lordres-site-data')
        this.siteData = JSON.parse(simpleSiteData)
    },
    methods: {
        setPaginationItems() {
            if(this.siteData.paginationItems === 5) {
                this.siteData.paginationItems = 10
            } else if(this.siteData.paginationItems === 10) {
                this.siteData.paginationItems = 15
            } else if(this.siteData.paginationItems === 15) {
                this.siteData.paginationItems = 5
            }
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

</style>