<template>
    <Site v-if="isAuth && !isDetailItem" :isAdmin="false" :siteData="siteData" :items="items" :isDetailItem="isDetailItem" :activeItem="activeItem" :webmaster="webmaster" @readItem="readItem" @setIsAddItemDialog="setIsAddItemDialogHandler" @setIsEditItemDialog="setIsEditItemDialogHandler" @removeItem="removeItem" @fromDetailToMain="fromDetailToMainHandler" @setIsEditNameDialog="setIsEditNameDialogHandler" @setIsEditLogoDialog="setIsEditLogoDialogHandler" @setIsEditTaglineDialog="setIsEditTaglineDialogHandler" @setIsEditBusinessDialog="setIsEditBusinessDialogHandler" @setIsEditResidentDialog="setIsEditResidentDialogHandler" @setWebmaster="setWebmasterHandler" />
    <Site v-else-if="isAuth && isDetailItem" :isAdmin="false" :siteData="siteData" :items="items" :isDetailItem="isDetailItem" :activeItem="activeItem" :webmaster="webmaster" @readItem="readItem" @setIsAddItemDialog="setIsAddItemDialogHandler" @setIsEditItemDialog="setIsEditItemDialogHandler" @removeItem="removeItem" @fromDetailToMain="fromDetailToMainHandler" @setIsEditNameDialog="setIsEditNameDialogHandler" @setIsEditLogoDialog="setIsEditLogoDialogHandler" @setIsEditTaglineDialog="setIsEditTaglineDialogHandler" @setIsEditBusinessDialog="setIsEditBusinessDialogHandler" @setIsEditResidentDialog="setIsEditResidentDialogHandler" @setWebmaster="setWebmasterHandler" />
    <Auth v-else :siteData="siteData" @setAuth="setAuthHandler" />    
</template>

<script>

import Auth  from '@/components/Auth.vue'
import Site  from '@/components/Site.vue'
// import AddItemDialog from '@/components/AddItemDialog.vue'
// import EditItemDialog from '@/components/EditItemDialog.vue'

import * as jwt from 'jsonwebtoken'

export default {
    name: 'WebView',
    data() {
        return {
            webmaster: 'admin',
            items: [
                {
                    id: 1,
                    title: 'Новость 1',
                    desc: 'Описание новости 1...'
                },
                {
                    id: 2,
                    title: 'Новость 2',
                    desc: 'Описание новости 2...'
                },
                {
                    id: 3,
                    title: 'Новость 3',
                    desc: 'Описание новости 3...'
                },
                {
                    id: 4,
                    title: 'Новость 4',
                    desc: 'Описание новости 4...'
                },
                {
                    id: 5,
                    title: 'Новость 5',
                    desc: 'Описание новости 5...'
                }
            ],
            isAuth: false,
            siteData: {
                name: 'Название_сайта',
                password: 'lordres',
                company: 'Lord Res Technologies',
                dbPrefix: '_prefix',
                items: [],
                theme: 'light',
                pagination: true,
                paginationItems: 5,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png'
            },
            isAddItemDialog: false,
            isDetailItem: false,
            activeItem: {
                id: '',
                title: 'Новость № 1',
                desc: 'Описание новости № 1'
            },
            isEditItemDialog: false,
            currentPage: 1,
            token: window.localStorage.getItem('lordrestoken')
        }
    },
    mounted() {
        // this.isAuth = true
        let simpleSiteData = window.localStorage.getItem('lordres-site-data')
        this.siteData = JSON.parse(simpleSiteData)
        this.items = this.siteData.items
    },
    methods: {
        editResidentHandler(resident) {
            this.isEditResidentDialog = false
            
            this.siteData.about.resident = resident
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        closeEditResidentDialogHandler() {
            this.isEditResidentDialog = false
        },
        setIsEditResidentDialogHandler() {
            this.isEditResidentDialog = !this.isEditResidentDialog
        },
        editBusinessHandler(business) {
            this.isEditBusinessDialog = false
            
            this.siteData.about.business = business
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        closeEditBusinessDialogHandler() {
            this.isEditBusinessDialog = false
        },
        setIsEditBusinessDialogHandler() {
            this.isEditBusinessDialog = !this.isEditBusinessDialog
        },
        editTaglineHandler(tagline) {
            this.isEditTaglineDialog = false
            
            this.siteData.about.tagline = tagline
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        closeEditTaglineDialogHandler() {
            this.isEditTaglineDialog = false
        },
        setIsEditTaglineDialogHandler() {
            this.isEditTaglineDialog = !this.isEditTaglineDialog
        },
        editLogoHandler(siteLogo) {
            this.isEditLogoDialog = false
            
            this.siteData.logo = siteLogo
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        closeEditLogoDialogHandler() {
            this.isEditLogoDialog = false
        },
        setIsEditLogoDialogHandler() {
            this.isEditLogoDialog = !this.isEditLogoDialog
        },
        closeEditNameDialogHandler() {
            this.isEditNameDialog = false
        },
        setIsEditNameDialogHandler() {
            this.isEditNameDialog = !this.isEditNameDialog
        },
        editNameHandler(siteName) {
            this.isEditNameDialog = false
            
            this.siteData.name = siteName
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        setWebmasterHandler(user) {
            this.webmaster = user
        },
        fromDetailToMainHandler() {
            this.isDetailItem = false
        },
        setIsEditItemDialogHandler() {
            this.isEditItemDialog = !this.isEditItemDialog
        },
        setIsAddItemDialogHandler() {
            this.isAddItemDialog = !this.isAddItemDialog
        },
        closeEditItemDialogHandler() {
            this.isEditItemDialog = false
        },
        closeAddItemDialogHandler() {
            this.isAddItemDialog = false
        },
        removeItem() {
            this.items = this.items.filter(someItem => someItem.id !== this.activeItem.id)
            this.isDetailItem = false
            this.siteData.items = this.items
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
            this.activeItem = null
        },
        editItemHandler(item) {
            this.activeItem = item
            this.items = this.items.map(someItem => someItem.id === item.id ? item : someItem)
            this.isEditItemDialog = false
            
            this.siteData.items = this.items
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)

        },
        readItem(item) {
            this.isDetailItem = true
            this.activeItem = item
        },
        addItemHandler(item) {
            this.items.push(item)
            this.isAddItemDialog = false
            
            this.siteData.items = this.items
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)

        },
        setAuthHandler(authToggler, webmaster) {
            console.log(`выключаю вход`)
            this.isAuth = authToggler
            this.webmaster = webmaster
            this.token = jwt.sign({
                webmaster: webmaster
            }, 'lordressecret', { expiresIn: '5m' })
            window.localStorage.setItem('lordrestoken', this.token)
        }
    },
    components: {
        Site,
        Auth
        // AddItemDialog,
        // EditItemDialog
    }
}
</script>

<style scoped>
    
    .main {
        
    }

    .mainBody {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
    }

    .aside {
        width: 20%;
        background-color: rgb(200, 200, 200);
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding: 25px;
    }
    
    .site {
        width: 100%;
        height: 100%;
        background-color: rgb(100, 100, 100);
    }

    .siteHeader {
        align-items: center;
        height: 135px;
        background-color: rgb(0, 0, 0);
        width: 100%;
        display: flex;
        box-sizing: border-box;
        padding: 25px;
    }

    .siteHeaderLabel {
        color: rgb(255, 255, 255);
        font-weight: bolder;
        font-size: 24px;
    }

    .siteHeaderLogo {
        width: 200px;
        
    }

    .siteHeaderItem {
        margin: 0px 15px;
    }

    .siteBody {
        min-height: 500px;
        display: flex;
        background-color: rgb(0, 150, 150);
    }

    .siteBodyAside {
        width: 20%;
        background-color: rgb(240, 240, 240);
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding: 25px;
    }

    .siteBodyArticle {
        box-sizing: border-box;
        padding: 25px;
        color: rgb(215, 215, 215);
        width: 80%;
        background-color: rgb(170, 170, 100);
        display: flex;
        flex-direction: column;
    }

    .siteFooter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 25px;
        height: 125px;
    }

    .siteBodyArticleItem {
        display: flex;
        flex-direction: column;
        margin: 25px 0px;
    }
    
    .siteBodyArticleItemHeader {
        font-weight: bolder;
        font-size: 20px;
        color: rgb(255, 255, 255);
    }
    
    .siteBodyArticleItemDesc {
        color: rgb(75, 75, 75);
    }

    .readItemMore {
        color: rgb(0, 100, 255);
        cursor: pointer;
        font-size: 10px;
    }
    
    .siteBodyArticleSubitem {
        margin-left: 35px;
        display: flex;
        align-items: center;
    }

    .siteBodyArticleSubitemElement {
        margin: 0px 5px;
        font-weight: bolder;
    }

    .siteBodyAsideItem {
        color: rgb(75, 75, 175);
        font-size: 36px;
        cursor: pointer;
    }

    .markupElement {
        opacity: 0.4;
        cursor: default;
    }
    .addItemBtn {
        margin: 0px 25px;
        opacity: 0.4;
        border-radius: 100%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        /* color: rgb(0, 0, 255); */
        font-weight: bolder;
        cursor: pointer;
        font-size: 24px;
    }

    .asideItem {
        color: rgb(75, 75, 175);
        font-size: 36px;
        cursor: pointer;
        margin: 25px 0px;
    }

    .pagination {
        display: flex;
    }

    .page {
        cursor: pointer;
        opacity: 1.0;
        margin: 0px 10px;
    }

</style>