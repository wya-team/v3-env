<script lang="js">
import { defineProps, reactive, defineComponent } from 'vue';

export default defineComponent({
	inheritAttrs: false,
	props: {
		render: Function
	},
	render(ctx) {
		return ctx.render();
	},
});
</script>
