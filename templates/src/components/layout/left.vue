<template>
	<div class="c-layout-left-menu g-flex">
		<div class="_one-level">
			<div style="height: 56px" class="g-flex-cc g-m-t-10">
				<vc-popover
					trigger="click"
					placement="bottom-right"
					:arrow="false"
					portal-class-name="c-layout-popup-options"
				>
					<img :src="LOGO_IMG" class="_logo">
					<template #content>
						<div class="_line g-pointer g-flex-cc" @click="handleEditPwd">
							修改密码
						</div>
						<div class="_line g-pointer g-flex-cc" @click="handleLogOut">
							退出登录
						</div>
					</template>
				</vc-popover>
			</div>
			<template v-for="chunk in chunks" :key="chunk.path">
				<router-link
					:to="chunk.path"
					:class="currentChunk.path === chunk.path ? '__chunk-item-active' : '__chunk-item-unactive'"
					class="__chunk-item"
				>
					<div class="_item-icon">
						<vc-icon :type="chunk.icon" class="g-m-r-5" />
						<span>{{ chunk.title }}</span>
					</div>
				</router-link>
			</template>
		</div>
		<div v-if="childMenus.length" class="_two-level">
			<div class="__name">
				{{ currentChunk.title }}
			</div>
			<div style="padding: 12px">
				<template v-for="menu in childMenus" :key="menu.path">
					<router-link
						:to="menu.path"
						:class="isActiveRoute(menu.path, $route.path) ? '__menu-item-active' : '__menu-item-unactive'"
						class="__menu-item g-relative"
					>
						{{ menu.title }}
					</router-link>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from '@wya/vc';
import { Global } from '@globals/index';
// import LOGO_IMG from '@assets/images/logo.png';
import navManage from './nav-manage';
import { isActiveRoute } from '@utils'

export default {
	name: 'tpl-layout-left',
	setup(props, context) {
		const route = useRoute();

		// computed
		const chunks = computed(() => navManage.navTreeData);
		const currentChunk = computed(() => {
			return chunks.value.find(it => isActiveRoute(it.path, route.path))
		});
		// 获取二级导航菜单
		const childMenus = computed(() => currentChunk.value.children || []);
		const emitLeftMenuWidth = () => {
			Global.emit('layout-left-menu', { distance: childMenus.value.length ? 232 : 102 });
		};

		// watch
		watch(childMenus, (newVal, oldVal) => {
			if (newVal.length !== oldVal.length) {
				emitLeftMenuWidth();
			}
		});

		// methods
		const handleLogOut = () => {
			Modal.warning({
				title: '确认退出登录？',
				onOk: () => {
					// this.$request({
					// 	url: '_LOGIN_OUT_POST',
					// 	type: 'POST'
					// }).then(() => {
					// 	Global.clearLoginAuth();
					// });
				},
			});
		};
		const handleEditPwd = () => {
			// ChangePwd.popup().then(() => {
			// 	Global.clearLoginAuth();
			// });
		};

		// lifecycle
		onMounted(() => {
			emitLeftMenuWidth();
			// 防止其他组件在其发射时还没渲染
			Global.on('layout-left-menu-emit-again', emitLeftMenuWidth);
		});
		onUnmounted(() => {
			Global.emit('layout-left-menu', { distance: 0 });
			Global.off('layout-left-menu-emit-again', emitLeftMenuWidth);
		});

		return {
			LOGO_IMG: 'https://wyakc.oss-cn-hangzhou.aliyuncs.com/ykt/ykt-qtt-icon.svg',
			chunks,
			currentChunk,
			childMenus,
			isActiveRoute,
			handleLogOut,
			handleEditPwd
		};
	},
};
</script>

<style lang="scss">
.c-layout-left-menu {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 4;
	height: 100vh;
	user-select: none;
	._logo {
		width: 40px;
		height: 40px;
		// border-radius: 50%;
		cursor: pointer;
	}
	._one-level {
		height: 100%;
		width: 102px;
		background-color: var(--c444);
		.__chunk-item {
			height: 42px;
			line-height: 42px;
			display: block;
			padding-left: 23px;
			font-size: 15px;
			cursor: pointer;

			._item-icon {
				display: flex;
				align-items: center;
			}
		}
		.__chunk-item-unactive {
			color: var(--cbd);
			&:hover {
				background-color: var(--c67);
				transition: background-color 0.2s linear;
			}
		}
		.__chunk-item-active {
			background-color: var(--cf8);
			color:var(--black);
		}
	}
	._two-level {
		width: 130px;
		background-color: #ffffff;
		.__name {
			height: 56px;
			line-height: 56px;
			font-size: 14px;
			color:var(--black);
			border-bottom: 1px solid var(--cd9);
			border-right: 1px solid var(--cd9);
			text-align: center
		}
		.__menu-item {
			height: 32px;
			line-height: 32px;
			font-size: 14px;
			cursor: pointer;
			margin-bottom: 5px;
			text-align: center;
			display: block;
		}
		.__menu-item-unactive {
			color: #676767;
			&:hover {
				color: var(--main);
				transition: color 0.2s linear;
			}
		}
		.__menu-item-active {
			color:var(--black);
			background: var(--cef);
			border-radius:4px;
		}
		.__notice-dot {
			position: absolute;
			min-width: 20px;
			height: 20px;
			top: 50%;
			right: -5px;
			transform: translateY(-50%);
			background-color: #F8222D;
			color: #fff;
			border-radius: 10px;
			font-size: 12px;
			padding: 0 6px;
			box-sizing: border-box;
		}
	}
}
.c-layout-popup-options {
	.vc-popover-core__container {
		padding-left: 0;
		padding-right: 0;
	}
	._line {
		height: 30px;
		font-size: 14px;
		padding: 0 24px;
		transition: all .2s ease-in-out;
		&:hover {
			background: var(--translucent-main)
		}
	}
}
</style>
