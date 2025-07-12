<template>
    <a-layout-content :style="a_layout_content_style">
        <RouterView></RouterView>
    </a-layout-content>
</template>

<script lang="ts" setup>

const a_layout_content_style = {
    width: '100%',
    height: '100%',
    padding: '10px',
    background: 'var(--layout-content-bg-color)',
    // minHeight: '280px',
    color: 'skyblue'
}

</script>

<style scoped>
.btn {
    width: 100px;
    height: 40px;
    background-color: var(--primary-btn-bg-color);
    color: var(--primary-btn-text-color);
    border: 1px solid var(--primary-btn-text-color);
    border-radius: 5px;
    transition: all 0.3s;
    cursor: default;
    font-weight: 500;
}

.btn:hover {
    background-color: var(--primary-btn-hover-bg-color);
    color: var(--primary-btn-hover-text-color);
}
</style>
