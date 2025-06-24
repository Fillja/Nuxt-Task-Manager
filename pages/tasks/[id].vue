<script lang="ts" setup>

const route = useRoute();
const { data: task, error, status  } = await useFetch(`/api/tasks/${route.params.id}`, {
    lazy: true,
});
</script>

<template>
    <article
    v-if="status === 'pending'"
    aria-busy="true"
    />

    <article
        v-else-if="error"
        class="error"
    >
        {{ error.statusMessage }}
    </article>

    <article v-else-if="task">
        {{ task?.title }}
    </article>
</template>