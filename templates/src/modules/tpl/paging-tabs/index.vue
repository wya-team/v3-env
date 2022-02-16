<template>
	<vcc-set-title title="" class="v-tpl-paging-tabs" style="padding: 24px">
		<vcc-paging-group
			ref="pagingGroup"
			:history="true"
			:router="true"
			:footer="true"
			:filters="filters"
			:load-data="loadData"
		>
			<vc-tabs 
				:model-value="type" 
				:animated="true" 
				type="card"
				@click="handleChange"
			>
				<vc-tabs-pane 
					v-for="(item) in tabs"
					:key="item.value"
					:label="item.label" 
					:name="item.value"
				>
					<vcc-paging
						:disabled="item.value != type" 
						:table-options="tableOptions"
						style="width: 100%;"
						@sort-change="handleSortChange"
					>
						<vc-table-column
							prop="id"
							label="ID"
							width="180"
							sortable
						/>
						<vc-table-column
							prop="name"
							label="姓名"
							width="180"
						/>
						<vc-table-column
							prop="status"
							label="状态"
						/>
					</vcc-paging>
				</vc-tabs-pane>
			</vc-tabs>
		</vcc-paging-group>
	</vcc-set-title>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Tabs, Table } from '@wya/vc';
import { URL } from '@wya/utils';
import { Network } from '@globals';

const getFakeData = (page, pageSize, type) => {
	let fakeData = [];
	for (let i = 0; i < pageSize; i++) {
		fakeData.push({
			id: `${page}_${i}`,
			name: `page: ${page}, type: ${type}, sort: ${i}`,
			status: Math.floor(Math.random() * 3 + 1),
			opt: Math.floor(Math.random() * 3 + 1)
		});
	}
	return fakeData;
};

const route = useRoute();
const router = useRouter();
const pagingGroup = ref(null);
const type = ref(String(route?.query?.type || 1));
const tabs = ref([
	{ label: '标签一', value: '1' }, 
	{ label: '标签二', value: '2' }, 
	{ label: '标签三', value: '3' }
]);

const tableOptions = reactive({
	defaultSort: {
		prop: 'date',
		order: 'descending'
	}
});

const filters = ref([
	{
		type: 'input',
		label: '关键词',
		field: 'input',
		placeholder: '请输入关键词进行搜索'
	},
	{
		type: 'select',
		label: '下拉选择项',
		field: 'select',
		dataSource: [
			{ label: '选项一', value: 1 },
			{ label: '选项二', value: 2 }
		]
	},
	{
		type: 'cascader',
		label: '级联选择',
		field: 'cascader',
		dataSource: [
			{ label: '选项一', value: 1 },
			{ label: '选项二', value: 2 },
			{ 
				label: '选项三',
				value: 3,
				children: [
					{ label: '选项三 - 1', value: 31 },
					{ label: '选项三 - 2', value: 32 }    
				]
			}
		]
	}
]);

const handleChange = (v) => {
	type.value = v;
	router.replace(URL.merge({
		path: route.path.value,
		query: {
			...route.query.value,
			type: v
		}
	}));
};

const loadData = async ($page, pageSize) => {
	try {
		const res = await Network.request({
			url: 'TPL_PAGING_TABS_GET',
			localData: {
				status: 1,
				data: {
					page: {
						current: $page,
						total: 100,
						count: pageSize * 100,
					},
					list: getFakeData($page, pageSize, type.value)
				}

			}
		});
		console.log(`page: ${$page}-type: ${type.value}@success`);

		return res;
	} catch (e) {
		// throw e;
		console.log(e);
	}
};

const handleSortChange = (e) => {
	pagingGroup.value.reset(1);
};

</script>