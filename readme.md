# genshin-card

* 数据来自Fork，合并上游后由Github Action 完成之后的事情，比如生成所有角色、武器的资料图（TODO）
* 设计来自https://github.com/SilveryStar/Adachi-BOT

感谢大佬们！

* Data comes from Fork
* Design comes from https://github.com/SilveryStar/Adachi-BOT

Thank you guys!

**完全不会设计！只会缝合！**

## 路线

- [x] 基础角色静态图生成
- [ ] i18n
- [ ] 角色别名
- [ ] 经验值摩拉信息
- [ ] 指定等级、天赋查询
- [ ] 武器信息
- [ ] 料理信息
- [ ] 清单查询

## Hoshino 使用

需要装selenium和chrome的webdriver，自行研究

```py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import base64
from hoshino import Service, aiorequests, MessageSegment

sv = Service(
    name='原神养成',  # 功能名
    visible=True,  # 可见性
    enable_on_default=True,  # 默认启用
    # bundle = '娱乐', #分组归类
    help_='原神养成角色或武器 等级 技能等级或精炼等级'  # 帮助说明
)

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument("user-data-dir=D:\cache\profile")
driver = webdriver.Chrome(options=options)
driver.set_window_size(1920, 1080)

def getpic(url):
    driver.get(url)
    element = driver.find_element_by_id("app")
    return element.screenshot_as_base64


@sv.on_rex(r'^原神养成\s*([^\x00-\xff]+)\s*(\d+)?\s*(\d+)?')
async def main(bot, ev):
    try:
        name = ev['match'].group(1)
        level=90
        talent=10
        r=1
        if ev['match'].group(2):
            level=int(ev['match'].group(2))
        if ev['match'].group(3):
            talent=int(ev['match'].group(3))
            r=talent
        
        res = getpic(f'https://genshin-card.neptunia.vip/cards/views/info.html?name={name}&level={level}&talent={talent}&r={r}')
    except Exception as e:
        return

    img = 'base64://' + res
    await bot.send(ev, MessageSegment.image(img))

```


