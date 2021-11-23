<template>
    <div>
        <Header />
        <div class="main">
            <span class="material-icons siteBodyAsideItem" @click="$router.push({ name: 'CPanel' })">
                logout
            </span>
            <div class="settingsItem">
                <form action="http://localhost:4000/api/sites/media/upload" method="POST" enctype="multipart/form-data">
                    <input name="myFile" accept="image/png" type="file" class="form-control inputField" />
                    <div class="uploadedMedia">
                        <!-- <div class="uploadedMediaItem">
                            
                        </div> -->
                        <div v-for="mediaItem in media" :key="mediaItem" class="mediaItemContainer">
                            <img class="uploadedMediaItem" :src="`http://localhost:4000/api/sites/media/get/?mediafile=${mediaItem}`" />
                            <span class="uploadedMediaItemLabel">
                                {{ mediaItem }}
                            </span>
                        </div>
                    </div>
                    <div class="saveMediaBtnContainer">
                        <button class="btn btn-danger saveMediaBtn" type="submit">
                            Сохранить медиа
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    name: 'Media',
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
            },
            media: []
        }  
    },
    mounted() {
        
        fetch(`http://localhost:4000/api/sites/media/info/`, {
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
                let simpleSiteData = window.localStorage.getItem('lordres-site-data')
                this.siteData = JSON.parse(simpleSiteData)
                this.media = JSON.parse(result).mediaFiles
            } else {
              alert('Не удается получить медиа')
            }
        })

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

    .siteBodyAsideItem {
        color: rgb(75, 125, 125);
        font-size: 36px;
        cursor: pointer;
    }

    .inputField {
        margin: 25px 0px;
    }
    
    .saveMediaBtnContainer {
        display: flex;
        /* align-self: center; */
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 25px 0px;
    }

    .uploadedMedia {
        display: flex;
    }

    .uploadedMediaItem {
        width: 75px;
        height: 75px;
        border-radius: 8px;
    }

    .uploadedMediaItemLabel {
        font-weight: bolder;
        margin: 10px 0px;
    }

    .mediaItemContainer {
        align-items: center;
        margin: 0px 10px;
        display: flex;
        flex-direction: column;
    }

</style>