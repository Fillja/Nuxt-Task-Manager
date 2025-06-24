<script lang="ts" setup>
import { FetchError } from "ofetch"

const route = useRoute();
const errorMessage = ref("");
const { data: task, error, status  } = await useFetch(`/api/tasks/${route.params.id}`, {
    lazy: true,
});

async function removeTask(taskId: string){
    try{
        console.log("Removing task with ID:", taskId);
        errorMessage.value = "";
        const result = await $fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });
        if(result.success) {
            navigateTo({
                name: 'index',
            });
        }
    }
    catch(error){
        const fetchError = error as FetchError;
        errorMessage.value = fetchError.statusMessage || "Unknown error occurred";
    }

}
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

    <article
        v-else-if="errorMessage"
        class="error"
    >
        {{ errorMessage }}
    </article>

    <article v-else-if="task">
        {{ task?.title }}
        <div class="flex-end">
            <button @click="removeTask(task.id)">Remove</button>
        </div>
    </article>
</template>