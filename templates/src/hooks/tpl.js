import Service from './service';

export const useTpl = Service.createStore({
	key: "tplData",
	url: '_COMMON_TPL_DATA_GET',
});