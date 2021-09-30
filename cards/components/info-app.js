const template =
	`<div class="info">
	<InfoBase
		:rarity="data.rarity"
		:name="data.name"
		:id="data.id"
		:title="data.title"
		:type="data.type"
		:introduce="data.description"
		:cover="data.cover"
		:level="data.level"
	></InfoBase>
	<InfoCharacter v-if="data.type=== 'character'"
		:birthday="data.birthday"
		:element="data.element"
		:constellationName="data.constellationName"
		:cv="data.cv"
		:rarity="data.rarity"
		:mainStat="data.substat"
		:mainValue="data.mainValue"
		:baseATK="data.baseATK"
		:ascendCosts="data.ascendCosts"
		:talentCosts="data.talentCosts"
		:constellation="data.constellation"
		:level="data.level"
		:talent="data.talent"
	></InfoCharacter>
	<InfoWeapon v-if="data.type === 'weapon'"
		:access="data.weapontype"
		:rarity="data.rarity"
		:mainStat="data.substat"
		:mainValue="data.mainValue"
		:baseATK="data.baseATK"
		:ascendCosts="data.ascendCosts"
		:time="data.time"
		:skillName="data.effectname"
		:skillContent="data.effect"
		:level="data.level"
		:r="data.r"
		:rdata="data.rdata"
	></InfoWeapon>
</div>`;

import Vue from "../public/js/vue.js";
import { parseURL } from "../public/js/src.js";
import InfoBase from "./info-base.js";
import InfoWeapon from "./info-weapon.js";
import InfoCharacter from "./info-character.js";

export default Vue.defineComponent({
	name: "InfoApp",
	template,
	components: {
		InfoBase,
		InfoWeapon,
		InfoCharacter
	},
	setup() {
		const urlParams = parseURL(location.search);
		const name = decodeURIComponent(urlParams.name);
		let level = parseInt(decodeURIComponent(urlParams.level)) || 90;
		if (level < 1) {
			level = 1;
		} else if (level > 90) {
			level = 90
		}
		let r = parseInt(decodeURIComponent(urlParams.r)) || 1;
		if (r < 1) {
			r = 1;
		} else if (r > 5) {
			r = 5;
		}

		let talent = parseInt(decodeURIComponent(urlParams.talent)) || 10;
		if (talent < 1) {
			talent = 1;
		} else if (r > 10) {
			talent = 10;
		}

		let data = GenshinDB.character(name);

		if (data) {
			data.type = 'character';
		} else {
			data = GenshinDB.weapon(name);
			if (data) {
				data.type = 'weapon';
			}
		}

		if (!data) {
			location.href = '../404.html';
			return data;
		}

		// 通用属性
		data.r = r;
		data.level = level;
		data.talent = talent;
		data.ascendCosts = data.costs;
		data.cover = '../public/images/item/unknown.png';
		data.rarity = parseInt(data.rarity);
		if (data.rarity < 3) {
			location.href = '../404.html';
			return data;
		}
		const stats = data.stats(level);
		const stats1 = data.stats(1);
		data.baseATK = parseInt(stats.attack.toFixed(0));

		if (data.type === 'character') {
			const talents = GenshinDB.talents(name);
			const constellation = GenshinDB.constellations(name);

			//处理基础信息
			if (data.images.cover1) {
				data.cover = data.images.cover1.replace('https://uploadstatic-sea.mihoyo.com/', 'https://genshindb.neppure.vip/');
			}
			data.cv = `${data.cv.chinese} | ${data.cv.japanese}`;
			data.constellationName = data.constellation;

			// 养成材料
			data.talentCosts = talents.costs;
			data.time = "";//【周二/五/日】

			//命之座
			data.constellation = constellation;

			//处理数值信息
			if (stats.specialized > 1) {
				data.mainValue = stats.specialized.toFixed(0);
			} else {
				//使用百分比展示
				data.mainValue = `${((stats.specialized - stats1.specialized) * 100).toFixed(1)}%`;
			}
		} else {
			if (data.images.namegacha) {
				data.cover = `https://genshindb.neppure.vip/genshin/image/upload/2.1/${data.images.namegacha}.png`;
			}
			data.rdata = data[`r${r}`];

			//处理数值信息
			if (stats.specialized > 1) {
				data.mainValue = stats.specialized.toFixed(0);
			} else {
				//使用百分比展示
				data.mainValue = `${(stats.specialized * 100).toFixed(1)}%`;
			}
		}

		function setStyle(colorList) {
			document.documentElement.style.setProperty("--styleInfoColor", colorList[0]);
			document.documentElement.style.setProperty("--backgroundColor", colorList[2]);
			document.documentElement.style.setProperty("--dottedColor", colorList[1]);
		}

		switch (data.rarity) {
			case 5: setStyle([
				"rgb(205, 167, 101)",
				"rgb(211, 200, 187)",
				"rgb(198, 156, 80)"
			]); break;
			case 4: setStyle([
				"rgb(142, 115, 170)",
				"rgb(211, 211, 212)",
				"rgb(72, 83, 101)"
			]); break;
			case 3: setStyle([
				"rgb(98, 191, 218)",
				"rgb(210, 212, 225)",
				"rgb(3, 149, 166)"
			]);
		}

		return {
			data
		}
	}
});