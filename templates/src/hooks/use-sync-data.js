import { ref, reactive, watch, getCurrentInstance, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/**
 * 解决无法直接修改props的问题, 操作同一个对象
 * <component :info="xxxx" />
 *
 * // 如 const [formData] = useSyncData()
 */
export const useSyncData = (key = 'info', useInject = false) => {
	const instance = getCurrentInstance();
	const { props, emit } = instance;
	const currentValue = ref({});

	if (useInject === true) {
		let v = inject(key);
		v && (currentValue.value = v);
	} else {
		watch(
			() => props[key],
			(v) => {
				if (v !== currentValue.value) {
					currentValue.value = v;
				}
			},
			{
				immediate: true
			}
		);
	}
	
	return [currentValue];
};