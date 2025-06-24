<template>
	<div class="container">
		<AppNavBar />
		<main class="container">
			<slot />
		</main>
	</div>
</template>

<style>
.error{
    color: red;
}

.flex-end{
	display: flex;
	justify-content: end;
	align-items: center;
}
</style>
