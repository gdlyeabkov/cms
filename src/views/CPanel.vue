<template>
    <div v-if=" isAuth && !isDetailItem">
        <div class="main">
            <Header />
            <div class="mainBody">
                <div class="aside">
                    <span class="material-icons asideItem" @click="$router.push({ name: 'Settings' })">
                        settings
                    </span>
                </div>
                <div class="site">
                    <div class="siteHeader">
                        <span class="siteHeaderItem siteHeaderLabel">
                            {{
                                siteData.name
                            }}
                        </span>
                        <img class="siteHeaderItem siteHeaderLogo" src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png" alt="" />
                    </div>
                    <div class="siteBody">
                        <div class="siteBodyAside">
                            <span class="material-icons siteBodyAsideItem">
                                settings
                            </span>
                        </div>
                        <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                            <div>
                                <div v-for="item in items" :key="item.id" class="siteBodyArticleItem">
                                    <span class="siteBodyArticleItemHeader">
                                        {{
                                            item.title
                                        }}
                                    </span>
                                    <div class="siteBodyArticleSubitem">
                                        <span class="siteBodyArticleItemDesc siteBodyArticleSubitemElement">
                                            {{
                                                item.desc
                                            }}
                                        </span>
                                        <span class="readItemMore siteBodyArticleSubitemElement" @click="readItem(item)">
                                            Читать полностью
                                        </span>
                                    </div>
                                </div>
                                <div class="siteBodyArticleItem">
                                    <span class="siteBodyArticleItemHeader markupElement">
                                        {{
                                            `Новость ${items.length + 1}`
                                        }}
                                    </span>
                                    <div class="siteBodyArticleSubitem">
                                        <span class="siteBodyArticleItemDesc siteBodyArticleSubitemElement markupElement">
                                            {{
                                                `Описание новости ${items.length + 1}`
                                            }}
                                        </span>
                                        <span class="readItemMore siteBodyArticleSubitemElement markupElement">
                                            Читать полностью
                                        </span>
                                        <span class="material-icons addItemBtn btn btn-primary" @click="isAddItemDialog = !isAddItemDialog">
                                            add
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="siteFooter">
                        <span>
                            &copy;
                        </span>
                        <span>
                            {{
                                siteData.company
                            }}
                        </span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        <AddItemDialog v-if="isAddItemDialog" :items="items" @addItem="addItemHandler" @closeAddItemDialog="closeAddItemDialogHandler" />
    </div>
    <div v-else-if="isAuth && isDetailItem">
        <div class="main">
            <Header />
            <div class="mainBody">
                <div class="aside">

                </div>
                <div class="site">
                    <div class="siteHeader">
                        <span class="siteHeaderItem siteHeaderLabel">
                            {{
                                activeItem.title
                            }}
                        </span>
                        <img class="siteHeaderItem siteHeaderLogo" src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png" alt="" />
                    </div>
                    <div class="siteBody">
                        <div class="siteBodyAside">
                            <span class="material-icons siteBodyAsideItem" @click="isDetailItem = false">
                                logout
                            </span>
                            <span class="material-icons siteBodyAsideItem">
                                settings
                            </span>
                        </div>
                        <div class="siteBodyArticle">
                            <div>
                                <div class="siteBodyArticleItem">
                                    <div class="siteBodyArticleSubitem">
                                        <span class="siteBodyArticleItemHeader">
                                            {{
                                                activeItem.desc
                                            }}
                                        </span>    
                                        <span class="material-icons addItemBtn btn btn-primary" @click="isEditItemDialog = !isEditItemDialog">
                                            edit
                                        </span>
                                        <span class="material-icons addItemBtn btn btn-primary" @click="removeItem">
                                            close
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="siteFooter">
                        <span>
                            &copy;
                        </span>
                        <span>
                            {{
                                siteData.company
                            }}
                        </span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        <EditItemDialog v-if="isEditItemDialog" :activeItem="activeItem" @editItem="editItemHandler" @closeEditItemDialog="closeEditItemDialogHandler" />
    </div>
    <Auth v-else :siteData="siteData" @setAuth="setAuthHandler" />    
</template>

<script>

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Auth from '@/components/Auth.vue'
import AddItemDialog from '@/components/AddItemDialog.vue'
import EditItemDialog from '@/components/EditItemDialog.vue'

export default {
    name: 'CPanel',
    data() {
        return {
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
                paginationItems: 5
            },
            isAddItemDialog: false,
            isDetailItem: false,
            activeItem: {
                id: '',
                title: 'Новость № 1',
                desc: 'Описание новости № 1'
            },
            isEditItemDialog: false
        }
    },
    mounted() {
        let simpleSiteData = window.localStorage.getItem('lordres-site-data')
        this.siteData = JSON.parse(simpleSiteData)
        this.items = this.siteData.items
    },
    methods: {
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
        setAuthHandler(authToggler) {
            this.isAuth = authToggler
        }
    },
    components: {
        Header,
        Footer,
        Auth,
        AddItemDialog,
        EditItemDialog,
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
        width: 80%;
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
    }

</style>