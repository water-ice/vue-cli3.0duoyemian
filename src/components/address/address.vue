<template>
  <mt-popup v-model="regionVisible" position="bottom" class="region-popup">
    <mt-picker :slots="myAddressSlots" valueKey="name" :visibleItemCount="5" @change="addressChange" :itemHeight="40"></mt-picker>
  </mt-popup>
</template>

<script>
import threeLevelAddress from './threeLevelAddress';

export default {
  name: 'addr',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      area: {
        province: '', // 省
        city: '', // 市
        county: '', // 县
        provinceCode: '', // 省级代码
        cityCode: '', // 市级代码
        countyCode: '', // 县级代码
      },
      regionVisible: this.visible,
      myAddressSlots: [
        {
          flex: 1,
          values: this.getProvinceArr(), // 省份数组
          className: 'slot1',
          textAlign: 'center',
        },
        {
          divider: true,
          content: '',
          className: 'slot2',
        },
        {
          flex: 1,
          values: this.getCityArr('北京市'),
          className: 'slot3',
          textAlign: 'center',
        },
        {
          divider: true,
          content: '',
          className: 'slot4',
        },
        {
          flex: 1,
          values: this.getCountyArr('北京市', '北京市'),
          className: 'slot5',
          textAlign: 'center',
        },
      ],
      values: [
        {
          code: '110000',
          name: '北京市',
          children: [
            {
              code: '110100',
              name: '北京市',
              children: [
                {
                  code: '110101',
                  name: '东城区',
                },
                {
                  code: '110102',
                  name: '西城区',
                },
                {
                  code: '110105',
                  name: '朝阳区',
                },
                {
                  code: '110106',
                  name: '丰台区',
                },
                {
                  code: '110107',
                  name: '石景山区',
                },
                {
                  code: '110108',
                  name: '海淀区',
                },
                {
                  code: '110109',
                  name: '门头沟区',
                },
                {
                  code: '110111',
                  name: '房山区',
                },
                {
                  code: '110112',
                  name: '通州区',
                },
                {
                  code: '110113',
                  name: '顺义区',
                },
                {
                  code: '110114',
                  name: '昌平区',
                },
                {
                  code: '110115',
                  name: '大兴区',
                },
                {
                  code: '110116',
                  name: '怀柔区',
                },
                {
                  code: '110117',
                  name: '平谷区',
                },
                {
                  code: '110128',
                  name: '密云县',
                },
                {
                  code: '110129',
                  name: '延庆县',
                },
              ],
            },
          ],
        },
      ],
      region: '', // 三级地址
    };
  },
  watch: {
    visible(nVal) {
      this.regionVisible = nVal;
    },
    regionVisible(nVal) {
      this.$emit('regionVisbile', nVal);
    },
  },
  methods: {
    // picker组件的change事件，进行取值赋值
    addressChange(picker, values) {
      // console.log(picker);
      // console.table(values);
      if (this.regionInit) {
        // 取值并赋值
        this.region = values[0].name + values[1].name + values[2].name;
        this.area.province = values[0].name;
        this.area.city = values[1].name;
        this.area.county = values[2].name;
        this.area.provinceCode = values[0].code;
        this.area.cityCode = values[1].code;
        this.area.countyCode = values[2].code;

        // console.log(picker.getSlotValue(0));
        // console.table(picker.getSlotValues(0));
        // console.table(picker.getValues());
        // 给市、县赋值
        picker.setSlotValues(1, this.getCityArr(values[0].name));
        picker.setSlotValues(2, this.getCountyArr(values[0].name, values[1].name));
      } else {
        this.regionInit = true;
      }
      this.$emit('myArea', this.area);
      // console.log(this.province, this.city, this.county);
    },
    // 遍历json，返回省级对象数组
    getProvinceArr() {
      const provinceArr = [];
      threeLevelAddress.forEach((item) => {
        const obj = {};
        obj.name = item.name;
        obj.code = item.code;
        provinceArr.push(obj);
      });
      return provinceArr;
    },
    // 遍历json，返回市级对象数组
    getCityArr(province) {
      // console.log("省：" + province);
      const cityArr = [];
      threeLevelAddress.forEach((item) => {
        if (item.name === province) {
          item.children.forEach((args) => {
            const obj = {};
            obj.name = args.name;
            obj.code = args.code;
            cityArr.push(obj);
          });
        }
      });
      return cityArr;
    },
    // 遍历json，返回县级对象数组
    getCountyArr(province, city) {
      const countyArr = [];
      threeLevelAddress.forEach((item) => {
        if (item.name === province) {
          item.children.forEach((args) => {
            if (args.name === city) {
              args.children.forEach((param) => {
                const obj = {};
                obj.name = param.name;
                obj.code = param.code;
                countyArr.push(obj);
              });
            }
          });
        }
      });
      // console.log(countyArr);
      return countyArr;
    },
  },
};
</script>

<style scoped>
  .region-popup {
    width: 100%;
  }
</style>
