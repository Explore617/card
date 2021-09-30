const template =
	`<div class="info-base">
	<img class="background" :src="infoBackground" alt="ERROR"/>
	<img :class="type === 'character' ? 'character' : 'weapon'" :src="mainImage" onerror="javascript:this.src='../public/images/item/unknown.png';"/>
	<div class="content">
        <p class="title-and-name" v-if="type === 'character'">「{{ title }}·{{ name }}」</p>
        <p class="title-and-name" v-if="type === 'weapon'">「{{ name }}」</p>
        <p class="introduce">{{ introduce }}</p>
    </div>
    <div class="dotted"></div>
</div>`;

import Vue from "../public/js/vue.js";

export default Vue.defineComponent({
	name: "InfoApp",
	template,
	props: {
		rarity: Number,
		name: String,
		id: Number,
		type: String,
		title: String,
		introduce: String,
		cover: String
	},
	setup(props) {
		const infoBackground = Vue.computed(() => {
			return `../public/images/item/BaseBackground${props.rarity}.png`
		});
		const mainImage = Vue.computed(() => {
			const link = props.cover;
			return link;
		});

		return {
			infoBackground,
			mainImage
		}
	}
});