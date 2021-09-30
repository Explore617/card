const template =
	`<div class="item-list">
    <p class="title">{{ title }}</p>
    <div class="list">
		<div class="card_container" v-for="itemName in arr">
		<img alt="Rarity background" :src="background(itemInfos.costs[itemName].rarity)">
		<div class="card_image">
			<img :alt="itemName" :src="itemInfos.costs[itemName].image">
		</div>
		<div class="card_text">
			<span class="card_font">{{itemInfos.costs[itemName].count}}</span>
		</div>
	</div>
    </div>
</div>`;

import Vue from "../public/js/vue.js";

export default Vue.defineComponent({
	name: "ItemList",
	template,
	props: {
		title: String,
		arr: Array,
		itemInfos: Object
	},
	setup() {
		function background(rarity) {
			return `../public/images/item/Rarity_${rarity}_background.png`
		}

		return {
			background
		}
	}
});