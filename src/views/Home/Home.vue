<template>
    <div class="main-container">
        <el-carousel :interval="4000" type="card" height="270px">
            <el-carousel-item>
                <img src="@/assets/img/lunbo/lunbo1.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item>
                <img src="@/assets/img/lunbo/lunbo2.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item>
                <img src="@/assets/img/lunbo/lunbo3.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item>
                <img src="@/assets/img/lunbo/lunbo4.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item>
                <img src="@/assets/img/lunbo/lunbo5.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item>
                <img src="@/assets/img/lunbo/lunbo6.jpg" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.main-container {
    width: 100%;
    height: 100%;
}

img {
    width: 100%;
    height: 100%;
    background-size: cover;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>
