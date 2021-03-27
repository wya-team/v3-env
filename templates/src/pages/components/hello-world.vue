<template>
	<vc-customer :render="renderHeader" @click="handleClick" />
	<h1>{{ msg }}</h1>

	<p class="hello">
		<a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a> |
		<a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
	</p>

	<button @click="state.count++">
		count is: {{ state.count }}
	</button>
	<p>
		Edit
		<code>components/HelloWorld.vue</code> to test hot module replacement.
	</p>
</template>

<script lang="jsx">
import { defineProps, reactive, defineComponent } from 'vue';
import createHttpClient, { ajax } from '@wya/http';
import { URL } from '@wya/utils';
import Customer from './customer.vue';

export default defineComponent({
	components: {
		'vc-customer': Customer
	},
	props: {
		msg: String
	},
	setup() {
		const state = reactive({ count: 0 });
    
		const renderHeader = (...rest) => {
			return (
				<h1 class="g-flex-cc">Hello  world!</h1>
			);
		};
		return {
			state,
			renderHeader,
			handleClick: () => {
				console.log('click');
			}
		};
	},
});
</script>

<style lang="scss">
@include block('hello') {
	a {
		color: #42b983;
	}
}
</style>