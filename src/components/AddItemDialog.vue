<template>
    <div class="addItemDialogForm">
        <div class="addItemDialogFormHeader">
            <span>
                &nbsp;
            </span>
            <span class="addItemDialogHeader">
                Добавить новый элемент
            </span>
            <span class="material-icons closeDialogBtn btn btn-danger" @click="$emit('closeAddItemDialog')">
                close
            </span>
        </div>
        <div class="addItemDialogElement">
            <span class="addItemDialogLabel">
                Название элемента
            </span>
            <input v-model="title" class="form-control" placeholder="Введите название элемента" type="text" />
        </div>
        <div class="addItemDialogElement">
            <span class="addItemDialogLabel">
                Описание элемента
            </span>
            <input v-model="desc" class="form-control" placeholder="Введите описание элемента" type="text" />
        </div>
        <button @click="createItem" class="btn btn-primary">
            добавить
        </button>
    </div>
</template>

<script>
export default {
    name: 'AddItemDialog',
    data() {
        return {
            title: '',
            desc: ''
        }
    },
    props: {
        items: {
            type: Array,
            default: []
        },
        siteData: {
            type: Object,
            default: {
                
            }
        },
    },
    emits: [
        'addItem',
        'closeAddItemDialog'
    ],
    methods: {
        createItem() {
            
            fetch(`http://localhost:4000/api/sites/articles/add/?articletitle=${this.title}&articledesc=${this.desc}&dbaccesstoken=${this.siteData.dbAccessToken}`, {
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
                    let pk = this.items.length + 1
                    let newItem = {
                        id: pk,
                        title: this.title,
                        desc: this.desc,
                        comments: []
                    }
                    this.$emit('addItem', newItem)
                } else {
                    alert('не удается добавить статью')
                }
            })
            
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

    .addItemDialogFormHeader {
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

</style>