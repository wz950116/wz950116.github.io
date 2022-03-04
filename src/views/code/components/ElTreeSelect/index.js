import ElTreeSelect from './src/SelectTree.vue';
// import ElTreeSelect from './src/PopoverTree.vue';
/* istanbul ignore next */
ElTreeSelect.install = function(Vue) {
  Vue.component(ElTreeSelect.name, ElTreeSelect);
};
export default ElTreeSelect;
