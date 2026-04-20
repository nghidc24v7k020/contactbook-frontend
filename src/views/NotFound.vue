<template>
    <div class="page text-center mt-5">
        <h1 class="display-4">404</h1>
        <p>
            Oops, không thể tìm thấy trang. Trở về
            <router-link to="/">trang chủ.</router-link>
        </p>
    </div>
</template>

<style scoped>
.page {
    text-align: center;
}

h1 {
    font-weight: bold;
    color: #dc3545; 
}
</style>