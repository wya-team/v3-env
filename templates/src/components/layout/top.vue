<template>
	<div :style="{left: `${leftMenuWidth}px`}" class="v-layout-top">
		<div v-if="typeof topMenus === 'string'" class="_name">
			{{ topMenus }}
		</div>
		<div v-else-if="(topMenus instanceof Array)" class="g-flex-ac g-fw-w">
			<router-link 
				v-for="menu in topMenus"
				:key="menu.path"
				:to="menu.path"
				:class="isActiveRoute(menu.path, $route.path) ? '_menu-item-active' : '_menu-item-unactive'" 
				class="_menu-item"
			>
				{{ menu.title }}
			</router-link>
		</div>
	</div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Global } from '@globals/index';
import navManage from './nav-manage';
import { isActiveRoute } from '@utils';

export default {
	name: 'tpl-layout-top',
	setup(props) {
		let leftMenuWidth = ref(0);
		const route = useRoute();

		// computed
		const chunkPath = computed(() => {
			let routeArray = route.path.split('/');
			return `/${routeArray[1]}`;
		});
		const topMenus = computed(() => {
			return findTopMenu(navManage.navTreeData); // eslint-disable-line
		});

		// methods
		const setLeftDistance = ({ distance }) => {
			leftMenuWidth.value !== distance && (leftMenuWidth.value = distance);
		};

		const findTopMenu = (data) => {
			return data.reduce((pre, cur) => {
				const { path, children } = cur;
				const hasChildren = children && children.length > 0;
				if (path === chunkPath.value) { // 一级导航
					if (hasChildren) {
						const index = children.findIndex((it) => route.path.indexOf(it.path) === 0);
						const secdMenus = children[index]; // 二级导航
						if (secdMenus.children && secdMenus.children.length) {
							pre = secdMenus.children; // 三级导航
						} else {
							pre = secdMenus.title;
						}
					} else {
						pre = cur.title;
					}
				}
				return pre;
			}, []);
		};

		// lifecycle
		onBeforeMount(() => {
			Global.on('layout-left-menu', setLeftDistance);
		});
		onMounted(() => {
			// 让left-menu 再次告知它自己当前的宽度
			Global.emit('layout-top-menu', { distance: 55 });
			Global.emit('layout-left-menu-emit-again', { emit: true });
		});
		onBeforeUnmount(() => {
			Global.emit('layout-top-menu', { distance: 0 });
			Global.off('layout-left-menu', setLeftDistance);
		});

		return {
			leftMenuWidth,
			chunkPath,
			topMenus,
			isActiveRoute
		};
	},
};
</script>

<style lang="scss">
.v-layout-top {
	position: fixed;
	top: 0px;
	right: 0;
	z-index: 999;
	background-color: var(--white);
	padding: 0 15px;
	border-bottom: 1px solid var(--cd9);
	height: 56px;
	._name {
		font-size:14px;
		color: var(--black);
		height: 56px;
		line-height: 56px;
		padding-left: 21px;
	}
	._menu-item {
		height: 56px;
		line-height: 56px;
		font-size: 14px;
		margin-right: 48px;
		cursor: pointer;
	}
	._menu-item-unactive {
		color: var(--black);
		opacity: 0.8;
		&:hover {
			opacity: 1;			
			will-change: opacity;
			transition: opacity 0.2s ease-in-out;
		}
	}
	._menu-item-active {
		color: var(--main);
		border-bottom: 2px solid var(--main);
		box-sizing: border-box
	}
}
</style>
