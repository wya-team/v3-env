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
					<img :src="LOGO" class="_logo">
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
			<router-link
				v-for="chunk in visibleChunks"
				:key="chunk.path"
				:to="chunk.path"
				:class="activeChain[0].path === chunk.path ? '__chunk-item-active' : '__chunk-item-unactive'"
				class="__chunk-item"
			>
				<div class="_item-icon">
					<vc-icon :type="chunk.icon" :inherit="chunk.inherit" class="g-m-r-5" />
					<span>{{ chunk.title }}</span>
				</div>
			</router-link>
		</div>
		<div v-if="showChildMenus" class="_two-level">
			<div class="__name">
				{{ realOneLevelChunk.title }}
			</div>
			<div style="padding: 12px">
				<router-link
					v-for="menu in visibleChildMenus"
					:key="menu.path"
					:to="menu.path"
					:class="activeChain[1].path === menu.path ? '__menu-item-active' : '__menu-item-unactive'"
					class="__menu-item g-relative"
				>
					{{ menu.title }}
				</router-link>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Modal } from '@wya/vc';
import { Global, Network } from '@globals';
import LOGO from '@assets/image/logo.png';
import navManage from './nav-manage';
import { useMenus } from './hooks';

const route = useRoute();
const router = useRouter();

const { activeChain } = useMenus();

const visibleChunks = computed(() => {
	return navManage.navTreeData.value.filter(it => !it.proxy);
});

// 真实模块归属关系上的一级导航模块
const realOneLevelChunk = computed(() => {
	return activeChain.value[1]?.shadowParent || activeChain.value[1]?.parent;
});

// 可见的二级导航菜单
const visibleChildMenus = computed(() => {
	const childMenus = realOneLevelChunk.value?.children || [];
	return childMenus.filter(menu => {
		return typeof menu.hide === 'function' ? !menu.hide() : !menu.hide;
	});
});
// 是否展示二级导航菜单
const showChildMenus = computed(() => {
	// 当前路由没有要求隐藏二级导航菜单，且存在有效的二级导航菜单
	return !route.meta.hiddenNavigations.includes(2) && visibleChildMenus.value.length;
});

const emitLeftMenuWidth = () => {
	Global.emit('layout-left-menu', { distance: showChildMenus.value ? 250 : 120 });
};

// 二级导航展示状态变化时，派发宽度变化事件
watch(showChildMenus, emitLeftMenuWidth);

// methods
const handleLogOut = () => {
	Modal.info({
		title: '提示',
		content: '确定退出登录？',
		onOk: async (e) => {
			await Network.request({
				url: '_COMMON_LOGIN_OUT_POST',
			});
			Global.clearLoginAuth();
		}
	});
};
const handleEditPwd = async () => {

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
		width: 120px;
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
