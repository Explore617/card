const template =
	`<div class="character">
	<div class="base-info">
		<div class="birthday">
		    <p class="title">生日: </p>
		    <p class="content">{{ birthday }}</p>
	    </div>
	    <div class="element">
		    <p class="title">神之眼: </p>
		    <p class="content">{{ element }}</p>
	    </div>
	    <div class="cv">
		    <p class="title">声优:</p>
		    <p class="content">{{ cv }}</p>
	    </div>
	    <div class="constellation-name">
		    <p class="title">命之座: </p>
		    <p class="content">{{ constellationName }}</p>
	    </div>
	</div>
	<div class="data-block">
	    <img class="star-icon" :src="starIcon" alt="ERROR"/>
	    <p class="value atk">{{ baseATK }}</p>
	    <p class="title atk">基础攻击力</p>
	    <p class="value main">{{ mainValue }}</p>
	    <p class="title main">{{ mainStat }}</p>
	    <p class="level main">{{level}}级</p>
    </div>
    <p class="time">{{ talentMaterials.time }}</p>
	<div class="materials">
	<ItemList
	title="突破材料:"
	:arr="ascendMaterials.costNames"
	:itemInfos="ascendMaterials"
	></ItemList>
	<ItemList
		title="天赋材料:"
		:arr="talentMaterials.costNames"
		:itemInfos="talentMaterials"
	></ItemList>
</div>
<div class="constellation">
	<div class="box" v-for="i in 4">
		<p class="level">
		<span>{{numCN[i-1]}}</span>	
		</p>
		<p class="content">{{ constellations[i-1] }}</p>
	</div>
 </div>
</div>`;

import Vue from "../public/js/vue.js";
import ItemList from "./item-list.js";

export default Vue.defineComponent({
	name: "InfoCharacter",
	template,
	props: {
		birthday: String,
		element: String,
		cv: String,
		constellationName: String,
		rarity: Number,
		mainStat: String,
		mainValue: String,
		baseATK: Number,
		level: Number,
		constellation: Object,
		ascendCosts: Object,
		talentCosts: Object,
		talent: Number
	},
	components: {
		ItemList
	},
	setup(props) {
		const starIcon = Vue.computed(() => {
			return `../public/images/item/BaseStar${props.rarity}.png`;
		});
		const numCN = ["壹", "贰", "肆", "陆"];

		const constellations = Vue.computed(() => {

			const replace = (text) => {
				return text.replaceAll('*', '');
			}

			const constellation = props.constellation;
			const res = [
				replace(constellation.c1.effect),
				replace(constellation.c2.effect),
				replace(constellation.c4.effect),
				replace(constellation.c6.effect)
			];
			return res;

		});

		const constellationImages = Vue.computed(() => {
			const replace = (text) => {
				return text.replace('https://upload-os-bbs.mihoyo.com/', 'https://genshindb.neppure.vip/');
			}
			const constellation = props.constellation;
			const res = [
				replace(constellation.images.c1),
				replace(constellation.images.c2),
				replace(constellation.images.c4),
				replace(constellation.images.c6)
			];
			return res;
		});

		const ascension = [];
		const levelUp = [];
		const talent = [];

		const ascendMaterials = Vue.computed(() => {
			const res = {
				time: null,
				costNames: [],
				costs: {

				}
			};
			let ah = 6;
			if (props.level < 20) {
				ah = 0;
			} else if (props.level < 40) {
				ah = 1;
			} else if (props.level < 50) {
				ah = 2;
			} else if (props.level < 60) {
				ah = 3;
			} else if (props.level < 70) {
				ah = 4;
			} else if (props.level < 80) {
				ah = 5;
			} else {
				ah = 6
			}
			let curah = 0;
			const costs = props.ascendCosts;
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

		const talentMaterials = Vue.computed(() => {
			const res = {
				time: null,
				costNames: [],
				costs: {

				}
			};

			const costs = props.talentCosts;
			const indexItem = [];// 用于计算物品展示排序
			let curtalent = 1;
			for (const key in costs) {
				if (curtalent >= props.talent) {
					break;
				}
				curtalent++;
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
						count: 0,
						image: ''
					}

					res.costs[itemInfo.name].rarity = itemInfo.rarity || 1;
					res.costs[itemInfo.name].image = itemInfo.images.fandom.replace('https://static.wikia.nocookie.net/', 'https://genshindb.neppure.vip/')
					res.costs[itemInfo.name].count += itemCount * 3;

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



		return {
			starIcon,
			constellations,
			constellationImages,
			numCN,
			ascendMaterials,
			talentMaterials,
			ascension,
			levelUp,
			talent
		}
	}
});