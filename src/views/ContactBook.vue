<template>
    <div class="page row">
        <div class="col-md-10">
            <InputSearch v-model="searchText" />
        </div>

        <div class="col-md-10 mt-2 d-flex align-items-center">
            <div class="btn-group btn-group-toggle mr-3" data-toggle="buttons">
                <label class="btn btn-outline-secondary btn-sm" :class="{ active: filterFavorite === 'all' }">
                    <input type="radio" v-model="filterFavorite" value="all"> Tất cả
                </label>
                <label class="btn btn-outline-primary btn-sm" :class="{ active: filterFavorite === 'yes' }">
                    <input type="radio" v-model="filterFavorite" value="yes"> 
                    <i class="fas fa-star text-warning"></i> Yêu thích
                </label>
                <label class="btn btn-outline-dark btn-sm" :class="{ active: filterFavorite === 'no' }">
                    <input type="radio" v-model="filterFavorite" value="no"> Không yêu thích
                </label>
            </div>

            <button class="btn btn-outline-info btn-sm" @click="toggleSort">
                <i class="fas" :class="sortIcon"></i> 
                Sắp xếp {{ sortText }}
            </button>
        </div>

        <div class="mt-3 col-md-6">
            <h4>
                Danh bạ
                <i class="fas fa-address-book"></i>
            </h4>
            
            <ContactList
                v-if="filteredContactsCount > 0"
                :contacts="paginatedContacts"
                v-model:activeIndex="activeIndex"
                @toggle:favorite="toggleFavorite" 
            />
            <p v-else>Không có liên hệ nào.</p>

            <div v-if="totalPages > 1" class="mt-3 d-flex justify-content-center align-items-center">
                <button 
                    class="btn btn-outline-secondary btn-sm mr-2" 
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                >
                    <i class="fas fa-chevron-left"></i> Trước
                </button>
                
                <span>Trang {{ currentPage }} / {{ totalPages }}</span>
                
                <button 
                    class="btn btn-outline-secondary btn-sm ml-2" 
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                >
                    Sau <i class="fas fa-chevron-right"></i>
                </button>
            </div>

            <div class="mt-3 row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    <i class="fas fa-redo"></i> Làm mới
                </button>

                <button class="btn btn-sm btn-success" @click="goToAddContact">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>

                <button class="btn btn-sm btn-danger" @click="removeAllContacts">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>

        <div class="mt-3 col-md-6">
            <div v-if="activeContact">
                <h4>
                    Chi tiết Liên hệ
                    <i class="fas fa-address-card"></i>
                </h4>
                <ContactCard :contact="activeContact" />

                <router-link
                    :to="{
                        name: 'contact.edit',
                        params: { id: activeContact._id },
                    }"
                >
                    <span class="mt-2 badge badge-warning text-dark">
                        <i class="fas fa-edit"></i> Hiệu chỉnh
                    </span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
    components: {
        ContactCard,
        InputSearch,
        ContactList,
    },
    data() {
        return {
            contacts: [],
            activeIndex: -1,
            searchText: "",
            filterFavorite: "all", 
            sortOrder: "none",
            currentPage: 1,
            pageSize: 5,
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
            this.currentPage = 1; 
        },
        filterFavorite() {
            this.activeIndex = -1;
            this.currentPage = 1; 
        },
        sortOrder() {
            this.activeIndex = -1;
            this.currentPage = 1; 
        }
    },
    computed: {
        contactStrings() {
            return this.contacts.map((contact) => {
                const { name, email, address, phone } = contact;
                return [name, email, address, phone].join("").toLowerCase();
            });
        },
        filteredContacts() {
            let result = this.contacts;

            if (this.searchText) {
                result = result.filter((contact, index) =>
                    this.contactStrings[index].includes(this.searchText.toLowerCase())
                );
            }

            if (this.filterFavorite === "yes") {
                result = result.filter(contact => contact.favorite === true);
            } else if (this.filterFavorite === "no") {
                result = result.filter(contact => !contact.favorite);
            }

            if (this.sortOrder !== "none") {
                result = [...result].sort((a, b) => {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    return this.sortOrder === "asc" 
                        ? nameA.localeCompare(nameB) 
                        : nameB.localeCompare(nameA);
                });
            }

            return result;
        },
        paginatedContacts() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredContacts.slice(start, end);
        },
        activeContact() {
            if (this.activeIndex < 0) return null;
            return this.paginatedContacts[this.activeIndex];
        },
        filteredContactsCount() {
            return this.filteredContacts.length;
        },
        totalPages() {
            return Math.ceil(this.filteredContactsCount / this.pageSize);
        },
        sortIcon() {
            if (this.sortOrder === 'asc') return 'fa-sort-alpha-down';
            if (this.sortOrder === 'desc') return 'fa-sort-alpha-up';
            return 'fa-sort';
        },
        sortText() {
            if (this.sortOrder === 'asc') return 'A-Z';
            if (this.sortOrder === 'desc') return 'Z-A';
            return '';
        },
    },
    methods: {
        async retrieveContacts() {
            try {
                this.contacts = await ContactService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveContacts();
            this.activeIndex = -1;
            this.currentPage = 1;
        },
        async removeAllContacts() {
            if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
                try {
                    await ContactService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        async toggleFavorite(contact) {
            try {
                const updatedFavorite = !contact.favorite;
                await ContactService.update(contact._id, {
                    favorite: updatedFavorite,
                });
                contact.favorite = updatedFavorite;
            } catch (error) {
                console.log("Lỗi khi cập nhật trạng thái yêu thích:", error);
            }
        },
        toggleSort() {
            this.sortOrder = (this.sortOrder === 'none' || this.sortOrder === 'desc') ? 'asc' : 'desc';
            this.activeIndex = -1; 
        },
        goToAddContact() {
            this.$router.push({ name: "contact.add" });
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>

<style scoped>
.page {
    text-align: left;
    max-width: 750px;
}
.btn-group-toggle input[type="radio"] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    pointer-events: none;
}
</style>