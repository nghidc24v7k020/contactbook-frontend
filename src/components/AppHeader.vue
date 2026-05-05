<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-between px-3">
        <div class="d-flex align-items-center">
            <a href="/" class="navbar-brand">Ứng dụng Quản lý danh bạ</a>
            <div class="navbar-nav">
                <li class="nav-item">
                    <router-link :to="{ name: 'contactbook' }" class="nav-link">
                        Danh bạ
                        <i class="fas fa-address-book"></i>
                    </router-link>
                </li>
            </div>
        </div>

        <div v-if="isLoggedIn" class="navbar-nav">
            <li class="nav-item">
                <button class="btn btn-outline-danger btn-sm" @click="handleLogout">
                    Đăng xuất
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </li>
        </div>
    </nav>
</template>

<script>
export default {
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem("userToken");
        }
    },
    methods: {
        handleLogout() {
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                localStorage.removeItem("userToken");               
                this.$router.push({ name: "login" });
            }
        }
    }
}
</script>

<style scoped>
.nav-link {
    cursor: pointer;
}
</style>