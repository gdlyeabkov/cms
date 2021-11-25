<template>
    <div class="site" v-if="!isDetailItem && activeTab === 'main'">
        <div class="siteHeader" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(50, 50, 150)' : 'rgb(0, 0, 0)'}`">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    siteData.name
                }}
            </span>
            <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditNameDialog">
                edit
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
            <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditLogoDialog">
                edit
            </span>
            <span class="siteHeaderItem webmaster siteHeaderLabel">
                {{
                    webmaster
                }}
            </span>
            <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditAdminLoginDialog">
                edit
            </span>
        </div>
        <div class="siteBody">
            <div class="siteBodyAside" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(225, 225, 225)' : 'rgb(175, 175, 175)'}`">
                <span class="material-icons siteBodyAsideItem" @click="activeTab = 'about'">
                    menu_book
                </span>
                <span class="material-icons siteBodyAsideItem" @click="activeTab = 'location'">
                    location_on
                </span>
                <span class="material-icons siteBodyAsideItem" @click="activeTab = 'feedback'">
                    contact_support
                </span>
                <span class="material-icons siteBodyAsideItem" @click="setAuthenticate">
                    {{
                        webmaster.length >= 1 ?
                            'logout'
                        :
                            'add'
                    }}
                </span>
            </div>
            <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                <div>
                    <div v-if="items.length >= 1">
                        <span class="material-icons sortToggler" @click="sortToggler = !sortToggler">
                            {{
                                sortToggler ?
                                    'expand_more'
                                :
                                    'expand_less'
                            }}
                        </span>
                        <div v-for="item in !sortToggler ? items.filter((item, itemIdx) => !siteData.pagination || (itemIdx >= siteData.paginationItems * currentPage - siteData.paginationItems && itemIdx < currentPage * siteData.paginationItems)) : items.filter((item, itemIdx) => !siteData.pagination || (itemIdx >= siteData.paginationItems * currentPage - siteData.paginationItems && itemIdx < currentPage * siteData.paginationItems)).reverse()" :key="item.id" class="siteBodyArticleItem">
                            <span class="siteBodyArticleItemHeader">
                                {{
                                    item.title
                                }}
                            </span>
                            <div class="siteBodyArticleSubitem">
                                <span class="siteBodyArticleItemDesc siteBodyArticleSubitemElement" :style="`color: ${siteData.theme === 'light' ? 'rgb(75, 75, 75)' : 'rgb(255, 255, 255)'};`">
                                    {{
                                        item.desc
                                    }}
                                </span>
                                <span class="readItemMore siteBodyArticleSubitemElement" @click="readItem(item)">
                                    Читать полностью
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <span>
                            Еще не опубликована ни 1 запись...
                        </span>
                    </div>
                    <div class="siteBodyArticleItem" v-if="isAdmin && siteData.admin.login === webmaster">
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
                            <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsAddItemDialog">
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
    <div class="site" v-else-if="isDetailItem && activeTab === 'main'">
        <div class="siteHeader" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(50, 50, 150)' : 'rgb(0, 0, 0)'}`">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    activeItem.title
                }}
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
            <span class="siteHeaderItem webmaster siteHeaderLabel">
                {{
                    webmaster
                }}
            </span>
        </div>
        <div class="siteBody">
            <div class="siteBodyAside">
                <span class="material-icons siteBodyAsideItem" @click="fromDetailToMain">
                    logout
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
                            <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditItemDialog">
                                edit
                            </span>
                            <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="removeItem">
                                close
                            </span>
                            <span v-if="webmaster.length >= 1" :title="`${activeItem.likes} лайков`" class="material-icons addItemBtn btn btn-primary" @click="likeItem">
                                favorite
                            </span>
                            <span class="m-5">
                                Сообщений: 
                                {{
                                    activeItem.comments.length        
                                }}
                            </span>
                        </div>
                        <div class="comments">
                            <div class="comment" v-for="comment in activeItem.comments" :key="comment">
                                <span class="author">
                                    {{
                                        comment.author
                                    }}
                                </span>
                                <span>
                                    {{
                                        comment.message
                                    }}
                                </span>
                            </div>
                        </div>
                        <textarea class="form-control" placeholder="Введите сообщение" v-model="message"></textarea>
                        <div class="sendMessageBtnContainer ">
                            <button :disabled="webmaster.length <= 0"  class="btn btn-primary w-25" @click="sendMessage">
                                Отправить
                            </button>
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
    <div class="site" v-else-if="activeTab === 'about'">
        <div class="siteHeader" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(50, 50, 150)' : 'rgb(0, 0, 0)'}`">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    'О нас'
                }}
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
        </div>
        <div class="siteBody">
            <div class="siteBodyAside">
                <span class="material-icons siteBodyAsideItem" @click="activeTab = 'main'">
                    logout
                </span>
            </div>
            <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                <div>
                    <div class="siteBodyArticleItem">
                        <div class="siteBodyArticleSubitemColumn">
                            <div class="siteBodyArticleSubitem">
                                <span class="siteBodyArticleItemHeader">
                                    {{
                                        siteData.name
                                    }}
                                </span>
                            </div>
                            <div class="siteBodyArticleSubitem">
                                <span class="siteBodyArticleItemContent">
                                    {{
                                        siteData.about.tagline
                                    }}
                                </span>
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditTaglineDialog">
                                    edit
                                </span>
                            </div>    
                            <div class="siteBodyArticleSubitem">
                                <span class="siteBodyArticleItemContent">
                                    {{
                                        siteData.about.business
                                    }}
                                </span>
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditBusinessDialog">
                                    edit
                                </span>
                            </div>
                            <div class="siteBodyArticleSubitem">
                                <span class="siteBodyArticleItemContent">
                                    {{
                                        siteData.about.resident
                                    }}
                                </span>
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditResidentDialog">
                                    edit
                                </span>
                            </div>
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
    <div class="site" v-else-if="activeTab === 'register'">
        <div class="siteHeader" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(50, 50, 150)' : 'rgb(0, 0, 0)'}`">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    'Регистрация'
                }}
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
        </div>
        <div class="siteBody">
            <div class="siteBodyAside">
                <span class="material-icons siteBodyAsideItem" @click="activeTab = 'main'">
                    logout
                </span>
            </div>
            <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                <div>
                    <div class="siteBodyArticleItem">
                        <div class="siteBodyArticleSubitemColumn">
                            <div class="siteBodyArticleSubitem">
                                <span class="siteBodyArticleItemHeader">
                                    {{
                                        'Пройдите регистрацию'
                                    }}
                                </span>
                            </div>
                            <div class="siteBodyArticleSubitem">
                                <input placeholder="Введите email" v-model="login" type="text" class="form-control w-50 m-3">
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditTaglineDialog">
                                    edit
                                </span>
                            </div>    
                            <div class="siteBodyArticleSubitem">
                                <input placeholder="Введите пароль" v-model="password" type="password" class="form-control w-50 m-3">
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditBusinessDialog">
                                    edit
                                </span>
                            </div>
                            <div class="siteBodyArticleSubitem">
                                <button class="btn btn-primary w-25 m-3" @click="createUser">
                                    Зарегестрироваться
                                </button>
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditResidentDialog">
                                    edit
                                </span>
                            </div>
                            <span class="errors m-3">
                                {{
                                    createUserErrors
                                }}
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
    <div class="site" v-else-if="activeTab === 'location'">
        <div class="siteHeader" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(50, 50, 150)' : 'rgb(0, 0, 0)'}`">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    'Найти нас на карте'
                }}
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
        </div>
        <div class="siteBody">
            <div class="siteBodyAside">
                <span class="material-icons siteBodyAsideItem" @click="activeTab = 'main'">
                    logout
                </span>
            </div>
            <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                <div>
                    <div class="siteBodyArticleItem">
                        <div class="siteBodyArticleSubitemColumn">
                            <div class="siteBodyArticleSubitem">
                                <div class="map">

                                </div>
                            </div>
                            <div class="siteBodyArticleSubitem">
                                <span>
                                    Мы находимся: {{
                                        siteData.about.resident
                                    }}
                                </span>
                            </div>
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
    <div class="site" v-else-if="activeTab === 'feedback'">
        <div class="siteHeader" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(50, 50, 150)' : 'rgb(0, 0, 0)'}`">
            <span class="siteHeaderItem siteHeaderLabel">
                {{
                    'Задайте на вопрос'
                }}
            </span>
            <img class="siteHeaderItem siteHeaderLogo" :src="siteData.logo" :alt="siteData.logo" />
        </div>
        <div class="siteBody">
            <div class="siteBodyAside">
                <span class="material-icons siteBodyAsideItem" @click="activeTab = 'main'">
                    logout
                </span>
            </div>
            <div class="siteBodyArticle" :style="`background-color: ${siteData.theme === 'light' ? 'rgb(170, 170, 100)' : 'rgb(70, 70, 70)'}`">
                <div>
                    <div class="siteBodyArticleItem">
                        <div class="siteBodyArticleSubitemColumn">
                            <div class="siteBodyArticleSubitem">
                                <input :placeholder="siteData.feedback.inputFieldPlaceholder" v-model="feedback" type="text" class="form-control w-50 m-3">
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditFeedbackPlaceholderDialog">
                                    edit
                                </span>
                            </div>
                            <div class="siteBodyArticleSubitem">
                                <button class="btn btn-primary w-25 m-3" @click="askQuestion">
                                    {{
                                        siteData.feedback.sendlabelBtn
                                    }}
                                </button>
                                <span v-if="isAdmin && siteData.admin.login === webmaster" class="material-icons addItemBtn btn btn-primary" @click="setIsEditFeedbackLabelBtnDialog">
                                    edit
                                </span>
                            </div>
                            <div v-if="isAdmin && siteData.admin.login === webmaster">
                                <div v-if="siteData.feedback.questions.length >= 1" class="question" v-for="question in siteData.feedback.questions" :key="question">
                                    <span >
                                        {{
                                            question.question
                                        }}
                                    </span>
                                    <span class="questionAuthor">
                                        (Спрашивает {{
                                            question.asker
                                        }})
                                    </span>
                                </div>
                                <div v-else>
                                    <span>
                                        Вопросов к вам нет.
                                    </span>
                                </div>
                            </div>
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
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png',
                notifications: true
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
                desc: '',
                comments: []
            }
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        webmaster: {
            type: String,
            default: 'admin'
        }
    },
    data() {
        return {
            currentPage: 1,
            message: '',
            activeTab: 'main',
            login: '',
            password: '',
            feedback: '',
            sortToggler: false,
            createUserErrors: ''
        }
    },
    emits: [
        'readItem',
        'setIsAddItemDialog',
        'setIsEditItemDialog',
        'removeItem',
        'fromDetailToMain',
        'setIsEditNameDialog',
        'setIsEditLogoDialog',
        'setIsEditTaglineDialog',
        'setIsEditBusinessDialog',
        'setIsEditResidentDialog',
        'setIsEditFeedbackLabelBtnDialog',
        'setIsEditFeedbackPlaceholderDialog',
        'setIsEditAdminLoginDialog',
        'setAuth'
    ],
    methods: {
        likeItem() {
            this.activeItem.likes++
            this.siteData.items = this.items
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        setIsEditAdminLoginDialog() {
            this.$emit('setIsEditAdminLoginDialog')
        },
        setIsEditFeedbackLabelBtnDialog() {
            this.$emit('setIsEditFeedbackLabelBtnDialog')
        },
        setIsEditFeedbackPlaceholderDialog() {
            this.$emit('setIsEditFeedbackPlaceholderDialog')
        },
        askQuestion() {
            this.siteData.feedback.questions.push({
                asker: this.webmaster,
                question: this.feedback
            })
            this.feedback = ''
            let strinableSiteData = JSON.stringify(this.siteData)
            this.activeTab = 'main'
            window.localStorage.setItem('lordres-site-data', strinableSiteData)
        },
        setAuthenticate() {
            if(this.webmaster.length <= 0) {
                this.activeTab = 'register'
            } else {
                this.$emit('setWebmaster', '')
                // this.webmaster = ''
                if(this.siteData.notifications) {
                    alert('Вы покидаете сайт')
                }
            }
        },
        createUser() {
            
            fetch(`http://localhost:4000/api/sites/users/add/?userlogin=${this.login}&userpassword=${this.password}`, {
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
                if(JSON.parse(result).status === 'OK') {
                    this.activeTab = 'main'
                    this.$emit('setAuth', false, '')
                } else {
                    if(this.siteData.notifications) {
                        alert('Не удается добавить пользователя')
                        this.createUserErrors = 'Не удается добавить пользователя'
                    }
                }

            })

        },
        setIsEditResidentDialog() {
            this.$emit('setIsEditResidentDialog')
        },
        setIsEditBusinessDialog() {
            this.$emit('setIsEditBusinessDialog')
        },
        setIsEditTaglineDialog() {
            this.$emit('setIsEditTaglineDialog')
        },
        sendMessage() {
            
            // this.activeItem.comments.push({
            //     author: 'Admin',
            //     message: this.message
            // })
            this.activeItem.comments.push({
                author: this.webmaster,
                message: this.message
            })
            this.message = ''
            this.siteData.items = this.items
            let strinableSiteData = JSON.stringify(this.siteData)
            window.localStorage.setItem('lordres-site-data', strinableSiteData)

        },
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
    },
    watch: {
        webmaster(user) {
            console.log(`webmaster: ${user}`)
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

    .comment {
        margin: 5px 0px;
        border-radius: 8px;
        width: 75%;
        min-height: 50px;
        background-color: rgb(255, 255, 255);
        color: rgb(0, 0, 0);
        font-weight: bolder;
        box-sizing: border-box;
        padding: 5px 15px;
        display: flex;
        flex-direction: column;
    }

    .comments {
        margin: 25px 0px;
        display: flex;
        flex-direction: column;
    }

    .sendMessageBtnContainer {
        display: flex;
        justify-content: center;
        margin: 15px;
    }

    .siteBodyArticleSubitemColumn {
        flex-direction: column;
        display: flex;
    }

    .siteBodyArticleItemContent {
        color: rgb(0, 0, 0);
        font-weight: bolder;
        margin: 15px 0px;
    }

    .map {
        width: 85%;
        margin: auto;
        height: 300px;
        background-color: rgb(255, 255, 255);
    }

    .webmaster {
        /* align-self: flex-end; */
        display: flex;
        width: 100%;
        justify-content: flex-end;
        flex-direction: row;
    }

    .author {
        font-size: 10px;
        align-self: flex-end;
    }

    .sortToggler {
        cursor: pointer;
    }

    .errors {
        color: rgb(225, 0, 0);
        font-weight: bolder;
    }

    .question {
        display: flex;
        flex-direction: column;
        font-weight: bolder;
        margin: 10px 0px;
    }

    .questionAuthor {
        color: rgb(235, 0, 0);
    }

</style>