<template>
    <div class="page d-flex flex-column align-items-center justify-content-center" style="min-height: 60vh;">
        <h4 class="mb-4">Chào mừng bạn đến với Quản lý danh bạ</h4>
        <p class="text-muted mb-4">Vui lòng đăng nhập bằng tài khoản Google để tiếp tục</p>
        
        <GoogleSignInButton
            @success="handleLoginSuccess"
            @error="handleLoginError"
        />
    </div>
</template>

<script>
import { GoogleSignInButton } from "vue3-google-signin";

export default {
    components: {
        GoogleSignInButton,
    },
    methods: {
        handleLoginSuccess(response) {
            const { credential } = response;
            localStorage.setItem("userToken", credential);
            
            alert("Đăng nhập thành công!");
            this.$router.push({ name: "contactbook" });
        },
        handleLoginError() {
            alert("Đăng nhập thất bại. Vui lòng thử lại!");
        },
    },
};
</script>