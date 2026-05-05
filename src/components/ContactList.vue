<script>
export default {
    props: {
        contacts: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        },
    },
};
</script>

<template>
    <ul class="list-group">
        <li
    class="list-group-item d-flex justify-content-between align-items-center"
    v-for="(contact, index) in contacts"
    :key="contact._id"
    :class="{ active: index === activeIndex }"
    @click="updateActiveIndex(index)"
>
    {{ contact.name }}
    
    <span @click.stop="$emit('toggle:favorite', contact)">
        <i v-if="contact.favorite" class="fas fa-star text-warning"></i>
        <i v-else class="far fa-star"></i>
    </span>
</li>
    </ul>
</template>