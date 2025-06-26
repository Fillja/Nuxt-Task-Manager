<script lang="ts" setup>
import type { FetchError } from "ofetch";
import type { Task } from "~/shared/types";

const errorMessage = ref("");
const loading = ref(false);
const taskName = ref("");

function generateId() {
	return Math.random().toString(36).substring(2, 10);
}

async function createTask() {
	if (!taskName.value.trim()) {
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

		if (result.status === 200) {
			const createdTask = result.data as Task;

			navigateTo({
				name: "tasks-id",
				params: {
					id: createdTask.id,
				},
			});
		}
		else {
			errorMessage.value = result.error || "Unknown error occured";
		}
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
		<article
			v-if="loading"
			aria-busy
		/>
		<article
			v-if="errorMessage"
			class="error"
		>
			{{ errorMessage }}
		</article>
		<form @submit.prevent="createTask">
			<label>
				Task
				<input
					v-model="taskName"
					name="title"
				>
			</label>
			<div class="flex-end">
				<button>Create</button>
			</div>
		</form>
	</div>
</template>
