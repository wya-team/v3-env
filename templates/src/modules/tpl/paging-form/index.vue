<template>
	<vcc-set-title title="" class="v-tpl-paging-form-form" style="padding: 24px">
		<!-- 表单 -->
		<div class="g-m-b-32">
			<h3 class="g-m-b-24">
				表单样式
			</h3>
			<!-- 96位所有label中最宽的长度 -->
			<vc-form 
				ref="formRef" 
				:model="formValidate" 
				:rules="ruleValidate" 
				:label-width="96"
				class="g-pd-l-56 g-m-t-21"
				position="left"
			>
				<vc-form-item label="商品名称：" prop="product_name">
					<vc-input 
						v-model="formValidate.product_name"
						class="v-input" 
						placeholder="请输入" 
						style="width: 300px"
					/>
				</vc-form-item>
				
				<vc-form-item label="商品主图：" prop="original_img">
					<vc-upload-picker class="g-m-t-26" />
				</vc-form-item>
				<vc-form-item label="商品分类：" prop="my_company">
					<vc-select 
						v-model="formValidate.my_company"
						clearable 
						transfer
						placeholder="请选择我方合同公司"
						style="width: 300px"
					>
						<vc-option 
							v-for="(item, $index) in company" 
							:key="$index" 
							value="item"
						>
							{{ item }}
						</vc-option>
					</vc-select>
				</vc-form-item>
			</vc-form>
		</div>
		<!-- 展示 -->
		<div class="g-m-b-32">
			<h3 class="g-m-b-24">
				弹框内上下边距16px
			</h3>
			<!-- 小弹框居中 |  中弹框距离左侧120 | 大弹框24，有进度条的距离左侧24-->
			<div class="g-pd-l-56">
				<div class="g-flex g-m-b-16">
					<div class="g-c-333">
						商品名称：
					</div>
					<div class="g-c-51">
						安徽省电话费
					</div>
				</div>
				<div class="g-flex g-m-b-16">
					<div class="g-c-333">
						商品名称：
					</div>
					<div class="g-c-51">
						安徽省电话费
					</div>
				</div>
				<div class="g-flex g-m-b-16">
					<div class="g-c-333">
						商品名称：
					</div>
					<div class="g-c-51">
						安徽省电话费
					</div>
				</div>
				<div class="g-flex g-m-b-16">
					<div class="g-c-333">
						商品名称：
					</div>
					<div class="g-c-51">
						安徽省电话费
					</div>
				</div>
				<div class="g-flex g-m-b-16">
					<div class="g-c-333">
						商品名称：
					</div>
					<div class="g-c-51">
						安徽省电话费
					</div>
				</div>
			</div>
		</div>
		<vc-button @click="$router.back()">
			取消
		</vc-button>
		<vc-button type="primary" @click="handleSubmit">
			确定
		</vc-button>
	</vcc-set-title>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
	name: 'chyy-tpl-paging-form',
	setup(props) {
		const formRef = ref(null);
		const company = reactive(['阿里', '有赞', '网易', '滴滴']);
		const formValidate = reactive({
			product_name: 'xxxxx',
			original_img: ''
		});
		const ruleValidate = reactive({
			product_name: [
				{ 
					required: true, 
					message: '商品名称必须填写，最多100个字' 
				}
			],
			original_img: [
				{ 
					required: true, 
					message: '最少添加一张商品图片' 
				}
			],
		});
		const handleSubmit = () => {
			formRef.value.validate().then((res) => {
				// ..
			}).catch((res) => {
				console.log(res);
			});
		};
		return {
			formRef,
			company,
			formValidate,
			ruleValidate,
			handleSubmit
		};
	}
};
</script>

<style lang="scss">
.v-tpl-paging-form-form {
	padding-bottom: 70px
}
</style>