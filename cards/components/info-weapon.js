const template =
	`<div class="weapon">
	<div class="access">
	    <p class="title">武器类型: </p>
	    <p class="content">{{ access }}</p>
    </div>
    <div class="data-block">
	    <img class="star-icon" :src="starIcon" alt="ERROR"/>
	    <p class="value atk">{{ baseATK }}</p>
	    <p class="title atk">基础攻击力</p>
	    <p class="value main">{{ mainValue }}</p>
	    <p class="title main">{{ mainStat }}</p>
	    <p class="level main">{{level}}级</p>
    </div>
    <p class="time">{{ ascendMaterials.time }}</p>
    <div class="materials">
	<ItemList
	title="突破材料:"
	:arr="ascendMaterials.costNames.slice(0,ascendMaterials.slice)"
	:itemInfos="ascendMaterials"
	></ItemList> 
	<ItemList
	title=""
	:arr="ascendMaterials.costNames.slice(ascendMaterials.slice,20)"
	:itemInfos="ascendMaterials"
	></ItemList> 
    </div>
    <div class="skill">
        <p class="name">{{ skillName }}<span class="r">精炼{{r}}阶</span></p>
        <div class="content">{{skillDesc}}</div>
    </div>
</div>`;

import Vue from "../public/js/vue.js";
import ItemList from "./item-list.js";

export default Vue.defineComponent({
	name: "InfoWeapon",
	template,
	components: {
		ItemList
	},
	props: {
		access: String,
		rarity: Number,
		mainStat: String,
		mainValue: String,
		baseATK: Number,
		ascendCosts: Object,
		time: String,
		skillName: String,
		skillContent: String,
		level: Number,
		r: Number,
		rdata: Array
	},
	setup(props) {


		const starIcon = Vue.computed(() => {
			return `../public/images/item/BaseStar${props.rarity}.png`;
		});

		const ascendMaterials = Vue.computed(() => {
			const res = {
				time: null,
				costNames: [],
				costs: {

				},
				slice: 5
			};

			const costs = props.ascendCosts;
			let ah = 6;
			if (props.level < 20) {
				ah = 0;
			} else if (props.level < 40) {
				ah = 1;
				res.slice = 2;
			} else if (props.level < 50) {
				ah = 2;
				res.slice = 3;
			} else if (props.level < 60) {
				ah = 3;
				res.slice = 3;
			} else if (props.level < 70) {
				ah = 4;
				res.slice = 4;
			} else if (props.level < 80) {
				res.slice = 4;
				ah = 5;
			} else {
				ah = 6
			}
			let curah = 0;
			const indexItem = [];// 用于计算物品展示排序
			for (const key in costs) {
				if (curah >= ah) {
					break;
				}
				curah++
				const cost = costs[key];
				let index = 0;
				for (const itemCost of cost) {

					const itemName = itemCost.name;
					const itemCount = itemCost.count;
					const itemInfo = GenshinDB.materials(itemName)
					if (res.time === null && itemInfo.daysofweek) {
						res.time = `【${itemInfo.daysofweek.join("/")}】`
					}
					res.costs[itemInfo.name] = res.costs[itemInfo.name] || {
						count: 0
					}

					res.costs[itemInfo.name].rarity = itemInfo.rarity || 1;
					res.costs[itemInfo.name].image = itemInfo.images.fandom.replace('https://static.wikia.nocookie.net/', 'https://genshindb.neppure.vip/')
					res.costs[itemInfo.name].count += itemCount;

					indexItem[index] = indexItem[index] || [];
					indexItem[index].push(itemInfo.name);
					index++;
				}
			}

			const addedItemName = {};
			for (const itmeList of indexItem.reverse()) {
				for (const itemname of itmeList.reverse()) {
					if (addedItemName[itemname]) {
						continue;
					}
					res.costNames.push(itemname);
					addedItemName[itemname] = true;
				}
			}


			res.costNames = res.costNames.reverse();
			return res;
		});

		const skillDesc = Vue.computed(() => {
			function fmt(key, inputs) {
				for (var a = key, b = 0; b < inputs.length; b++) a = a.replace(RegExp("\\{" + (b) + "\\}", "ig"), inputs[b]);
				return a
			};

			return fmt(props.skillContent, props.rdata)
		});

		return {
			starIcon,
			ascendMaterials,
			skillDesc
		}
	}
});