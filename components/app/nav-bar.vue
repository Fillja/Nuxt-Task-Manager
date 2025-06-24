<template>
	<nav>
		<ul>
			<li>
				<NuxtLink to="/"><strong>Tasks app</strong></NuxtLink>
			</li>
		</ul>
		<ul>
			<li>
				<NuxtLink :to="{ name: 'create' }">Create Task</NuxtLink>
			</li>
		</ul>
	</nav>
</template>
