<template>
    <div>
        <Header />
        <div>
            <div class="settingsItem">
                <input type="radio" />
                <span>
                    Сменить тему
                </span>
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
    methods: {
        setTheme() {

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
    }

</style>