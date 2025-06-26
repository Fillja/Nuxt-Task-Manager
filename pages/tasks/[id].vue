<script lang="ts" setup>
import type { FetchError } from "ofetch";
import type { ResponseResult, Task } from "~/shared/types";

const route = useRoute();
const errorMessage = ref("");
const taskForm = ref<Task>({
	id: "",
	title: "",
});

const { data: task, error, status } = await useFetch<Task>(`/api/tasks/${route.params.id}`, {
	lazy: true,
});

watchEffect(() => {
	if (task.value) {
		taskForm.value = { ...task.value };
	}
});

async function removeTask(taskId: string) {
	try {
		errorMessage.value = "";

		const result = await $fetch<ResponseResult>(`/api/tasks/${taskId}`, {
			method: "DELETE",
		});

		console.log(result);

		if (result.status === 200) {
			navigateTo({
				name: "index",
			});
		}
		else {
			errorMessage.value = result.error || "Unknown error occurred";
		}
	}
	catch (error) {
		const fetchError = error as FetchError;
		errorMessage.value = fetchError.statusMessage || "Unknown error occurred";
	}
}

async function updateTask() {
	if (!taskForm.value.title.trim() || !taskForm.value.id.trim()) {
		errorMessage.value = "Task is required.";
		return;
	}

	try {
		errorMessage.value = "";

		const result = await $fetch<ResponseResult>(`/api/tasks/${taskForm.value.id}`, {
			method: "PUT",
			body: {
				title: taskForm.value.title,
			},
		});

		if (result.status === 200) {
			refreshNuxtData();
		}
		else {
			errorMessage.value = result.error || "Unknown error occurred";
		}
	}
	catch (error) {
		const fetchError = error as FetchError;
		errorMessage.value = fetchError.statusMessage || "Unknown error occurred";
	}
}
</script>

<template>
	<div>
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
				<button @click="removeTask(task.id)">
					Remove
				</button>
			</div>
		</article>

		<form
			v-if="status === 'success'"
			@submit.prevent="updateTask"
		>
			<input
				v-model="taskForm.id"
				type="hidden"
			>
			<label>
				Task title
				<input
					v-model="taskForm.title"
					:placeholder="task?.title"
				>
			</label>
			<button>Update</button>
		</form>
	</div>
</template>
