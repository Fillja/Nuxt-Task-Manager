<script lang="ts" setup>
import { FetchError } from "ofetch"

const errorMessage = ref("");
const loading = ref(false);
const taskName = ref("");

function generateId() {
	return Math.random().toString(36).substring(2, 10);
}

async function createTask() {
	if(!taskName.value.trim()){
		errorMessage.value = "Task is required.";
		return;
	}

	const newId = generateId();

	try {
		loading.value = true;
		errorMessage.value = "";
		const result = await $fetch("/api/tasks", {
			method: "POST",
			body: {
				id: newId,
				title: taskName.value,
			},
		});
		
		navigateTo({
			name: 'tasks-id',
			params: {
				id: result.task.id
			}
		});

	}
	catch (e) {
		const error = e as FetchError;
		errorMessage.value = error.statusMessage || "Unknown error occured";
	}

	loading.value = false;
}

</script>

<template>
	<div>
		<article v-if="loading" aria-busy />
		<article class="error" v-if="errorMessage">{{ errorMessage }}</article>
		<form @submit.prevent="createTask">
			<label>
				Task
				<input v-model="taskName" name="title">
			</label>
			<div class="flex-end">
				<button>Create</button>
			</div>
		</form>
	</div>
</template>
