<template>
    <div class="addItemDialogForm">
        <div class="editItemDialogFormHeader">
            <span>
                &nbsp;
            </span>
            <span class="addItemDialogHeader">
                Обновить логотип сайта
            </span>
            <span class="material-icons closeDialogBtn btn btn-danger" @click="$emit('closeEditLogoDialog')">
                close
            </span>
        </div>
        <div class="addItemDialogElement">
            <span class="addItemDialogLabel">
                Логотип сайта
            </span>
            <div class="uploadedMedia">
                <div v-for="mediaItem in media" :key="mediaItem" class="mediaItemContainer">
                    <img :class="{uploadedMediaItem: true, uploadedActiveMediaItem: logo.split('mediafile=')[1] === mediaItem}" :src="`http://localhost:4000/api/sites/media/get/?mediafile=${mediaItem}`" @click="setLogo($event)" />
                    <span class="uploadedMediaItemLabel">
                        {{ mediaItem }}
                    </span>
                </div>
            </div>
        </div>
        <button @click="editLogo" class="btn btn-primary">
            обновить
        </button>
    </div>
</template>

<script>
export default {
    name: 'EditLogoDialog',
    data() {
        return {
            logo: '',
            media: []
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
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png'
            }
        }
    },
    emits: [
        'editLogo',
        'closeEdiLogoDialog'
    ],
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
                this.media = JSON.parse(result).mediaFiles
                this.logo = this.siteData.logo
            } else {
              alert('Не удается получить медиа')
            }
        })
        
    },
    methods: {
        setLogo(event) {
            console.log(`event: ${event.target.src}`)
            this.logo = event.target.src
        },
        editLogo() {
            this.$emit('editLogo', this.logo)
        }
    }
}
</script>

<style scoped>
    
    .addItemDialogForm {
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
        background-color: rgb(0, 125, 75);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .addItemDialogHeader {
        font-weight: bolder;
        font-size: 24px;
        color: rgb(0, 200, 255);
    }

    .addItemDialogLabel {
        display: flex;
        font-weight: bolder;
        margin: 10px 0px; 
    }

    .addItemDialogElement {
        margin: 5px 0px;
    }

    .editItemDialogFormHeader {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .closeDialogBtn {
        color: rgb(255, 255, 255);
        cursor: pointer;
        font-weight: bolder;
        border-radius: 100%;
        width: 40px;
        height: 40px;
        align-self: center;
        display: flex;
        align-items: center;
        justify-content: center;
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
        cursor: pointer;
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

    .uploadedActiveMediaItem {
        box-shadow: 0px 0px 25px rgb(255, 255, 255);
    }

</style>