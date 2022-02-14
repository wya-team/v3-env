<template>
	<div class="c-layout">
		<!-- top和left顺序不要动，关系到emit和on的监听问题 -->
		<router-view name="top" />
		<router-view name="left" />
		<div :style="{ paddingTop, paddingLeft }">
			<div
				:style="{
					minHeight,
					marginTop: !paddingTop ? '0px' : '12px',
					marginLeft: !paddingLeft ? '0px' : '12px',
					marginRight: !paddingLeft ? '0px' : '12px',
				}"
				class="v-router"
			>
				<router-view
					:style="{
						minWidth: `${minWidth}px`,
						overflowX: 'auto'
					}"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { onUnmounted, ref, onBeforeMount } from 'vue';
import { Global } from '@globals';

export default {
	name: 'tpl-layout',
	setup(props, context) {
		// data
		let paddingTop = ref(0);
		let paddingLeft = ref(0);
		let minHeight = ref('');
		let minWidth = ref(1024);
		
		// methods
		const setContentPaddingTop = ({ distance }) => {
			paddingTop.value = distance ? `${distance}px` : 0;
			minHeight.value = `calc(100vh - ${distance + 12}px)`;
		};
		const setContentPaddingLeft = ({ distance }) => {
			let marginLR = 24;
			paddingLeft.value = distance ? `${distance}px` : 0;
			minWidth.value = 1024 - distance - marginLR;
		};

		// lifecycle
		onBeforeMount(() => {
			Global.on('layout-top-menu', setContentPaddingTop);
			Global.on('layout-left-menu', setContentPaddingLeft);
		});
		onUnmounted(() => {
			Global.off('layout-top-menu', setContentPaddingTop);
			Global.off('layout-left-menu', setContentPaddingLeft);
		});

		return {
			paddingTop,
			paddingLeft,
			minHeight,
			minWidth,
		};
	}
	
};
</script>

<style lang="scss">
.c-layout{
	position: relative;
	overflow: hidden;
	._content {
		padding-left: 232px;
	}
	.v-router {
		overflow-x: auto;
		margin: 12px 12px 0 16px;
		background-color: #ffffff;
	}
}
</style>
