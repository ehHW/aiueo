<template>
    <div class="layout">
        <a-layout :style="a_layout_style">
            <Menu />
            <a-layout>
                <Header />
                <Main />
                <Footer />
            </a-layout>
        </a-layout>
    </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Main from './components/Main.vue'
import Footer from './components/Footer.vue'

const a_layout_style = {
    width: '100%',
    height: '100%',
}
</script>

<style scoped>
.layout {
    width: 100%;
    height: 100%;
}
</style>
