<template>
    <div class="cPanelHeader">
        <button @click="visitSite" class="btn btn-primary">
            Посмотреть сайт
        </button>
        <div @click="$router.push({ name: 'Settings' })" class="siteLogo" :style="`background-image: url('${siteData.logo}');`">
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    props: {
        siteData: {
            type: Object,
            required: false,
            default: () => ({
                name: 'Название_сайта',
                password: 'lordres',
                company: 'Lord Res Technologies',
                dbPrefix: '_prefix',
                items: [],
                theme: 'light',
                pagination: true,
                paginationItems: 5,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png'
            })
        }
    },
    methods: {
        visitSite() {
            // window.open('http://localhost:4000/api/sites/get')
            this.$router.push({ name: 'WebView' })
        }
    }
}
</script>

<style scoped>

    .cPanelHeader {
        display: flex;
        background-color: rgb(225, 225, 225);
        align-items: center;
        height: 50px;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0px 35px;
    }

    .siteLogo {
        border-radius: 100%;
        width: 35px;
        height: 35px;
        background-color: rgb(0, 150, 0);
        cursor: pointer;
    }

</style>