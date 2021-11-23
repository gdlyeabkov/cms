<template>
    <div class="site" v-if="!isDetailItem">
        <div class="siteHeader">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    siteData.name
                }}
            </span>
            <span v-if="isAdmin" class="material-icons addItemBtn btn btn-primary" @click="setIsEditNameDialog">
                edit
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
            <span v-if="isAdmin" class="material-icons addItemBtn btn btn-primary" @click="setIsEditLogoDialog">
                edit
            </span>
        </div>
        <div class="siteBody">
            <div class="siteBodyAside">
                <span class="material-icons siteBodyAsideItem">
                    settings
                </span>
            </div>
            <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                <div>
                    <div v-for="item in items.filter((item, itemIdx) => !siteData.pagination || (itemIdx >= siteData.paginationItems * currentPage - siteData.paginationItems && itemIdx < currentPage * siteData.paginationItems))" :key="item.id" class="siteBodyArticleItem">
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
                            <span v-if="isAdmin" class="material-icons addItemBtn btn btn-primary" @click="setIsAddItemDialog">
                                add
                            </span>
                        </div>
                    </div>
                    <div v-if="siteData.pagination" class="pagination">
                        <span v-for="page in Math.ceil(items.length / siteData.paginationItems)" :key="page" class="page" @click="currentPage = page">
                            {{
                                page
                            }}
                        </span>
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
    <div class="site" v-else-if="isDetailItem">
        <div class="siteHeader">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    activeItem.title
                }}
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
        </div>
        <div class="siteBody">
            <div class="siteBodyAside">
                <span class="material-icons siteBodyAsideItem" @click="fromDetailToMain">
                    logout
                </span>
                <span class="material-icons siteBodyAsideItem">
                    settings
                </span>
            </div>
            <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                <div>
                    <div class="siteBodyArticleItem">
                        <div class="siteBodyArticleSubitem">
                            <span class="siteBodyArticleItemHeader">
                                {{
                                    activeItem.desc
                                }}
                            </span>    
                            <span v-if="isAdmin" class="material-icons addItemBtn btn btn-primary" @click="setIsEditItemDialog">
                                edit
                            </span>
                            <span v-if="isAdmin" class="material-icons addItemBtn btn btn-primary" @click="removeItem">
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
</template>

<script>
export default {
    name: 'Site',
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
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png'
            }
        },
        items: {
            type: Array,
            default: [
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
            ]
        },
        isDetailItem: {
            type: Boolean,
            defult: false
        },
        activeItem: {
            type: Object,
            default: {
                id: 1,
                title: '',
                desc: ''
            }
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentPage: 1
        }
    },
    emits: [
        'readItem',
        'setIsAddItemDialog',
        'setIsEditItemDialog',
        'removeItem',
        'fromDetailToMain',
        'setIsEditNameDialog',
        'setIsEditLogoDialog'
    ],
    methods: {
        setIsEditLogoDialog() {
            this.$emit('setIsEditLogoDialog')
        },
        setIsEditNameDialog() {
            this.$emit('setIsEditNameDialog')
        },
        fromDetailToMain() {
            this.$emit('fromDetailToMain')
        },
        removeItem() {
            this.$emit('removeItem')
        },
        setIsEditItemDialog() {
            this.$emit('setIsEditItemDialog')
        },
        setIsAddItemDialog() {
            this.$emit('setIsAddItemDialog')
        },
        readItem(item) {
            this.$emit('readItem', item)
        }
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
        width: 100px;
        border-radius: 15px;
        /* height: 100px; */
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
        margin: 15px 0px;
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