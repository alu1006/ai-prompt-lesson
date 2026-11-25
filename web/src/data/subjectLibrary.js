const GROUPS = [
  ['人物角色', '🧑', [
    ['一個男孩','a boy'], ['一個女孩','a girl'], ['一位老人','an elderly person'],
    ['一對雙胞胎','a pair of twins'], ['一位戴眼鏡的學生','a student wearing glasses'],
    ['一位背著背包的旅人','a traveler carrying a backpack'], ['一位穿雨衣的小孩','a child in a raincoat'],
    ['一位坐輪椅的探險家','an explorer using a wheelchair'], ['一位戴草帽的園丁','a gardener wearing a straw hat'],
    ['一群正在合照的朋友','a group of friends posing for a photo'],
  ]],
  ['職業生活', '🧑‍🚀', [
    ['一個太空人','an astronaut'], ['一位麵包師傅','a baker'], ['一位科學家','a scientist'],
    ['一位消防員','a firefighter'], ['一位攝影師','a photographer'], ['一位咖啡師','a barista'],
    ['一位音樂家','a musician'], ['一位醫師','a doctor'], ['一位農夫','a farmer'], ['一位海洋研究員','a marine researcher'],
  ]],
  ['陸地動物', '🐾', [
    ['一隻貓','a cat'], ['一隻狗','a dog'], ['一匹馬','a horse'], ['一頭獅子','a lion'], ['一隻兔子','a rabbit'],
    ['一隻狐狸','a fox'], ['一隻水豚','a capybara'], ['一隻小熊貓','a red panda'], ['一隻刺蝟','a hedgehog'], ['一隻長頸鹿','a giraffe'],
  ]],
  ['鳥類昆蟲', '🦋', [
    ['一隻貓頭鷹','an owl'], ['一隻烏鴉','a raven'], ['一隻翠鳥','a kingfisher'], ['一隻企鵝','a penguin'],
    ['一隻蜂鳥','a hummingbird'], ['一隻孔雀','a peacock'], ['一隻蝴蝶','a butterfly'], ['一隻蜜蜂','a bee'],
    ['一隻獨角仙','a rhinoceros beetle'], ['一隻蜻蜓','a dragonfly'],
  ]],
  ['海洋生物', '🐙', [
    ['一隻海龜','a sea turtle'], ['一隻海豚','a dolphin'], ['一頭鯨魚','a whale'], ['一隻章魚','an octopus'],
    ['一隻水母','a jellyfish'], ['一隻海馬','a seahorse'], ['一隻小丑魚','a clownfish'], ['一隻魟魚','a stingray'],
    ['一隻海獺','a sea otter'], ['一隻寄居蟹','a hermit crab'],
  ]],
  ['植物花卉', '🌿', [
    ['一棵大樹','a large tree'], ['一盆多肉植物','a pot of succulents'], ['一朵向日葵','a sunflower'],
    ['一束野花','a bouquet of wildflowers'], ['一株蕨類','a fern'], ['一棵櫻花樹','a cherry blossom tree'],
    ['一朵盛開的蓮花','a blooming lotus'], ['一叢蘑菇','a cluster of mushrooms'], ['一株仙人掌','a cactus'], ['一串紫藤花','a cascade of wisteria blossoms'],
  ]],
  ['食物飲品', '🍞', [
    ['一個可頌麵包','a croissant'], ['一碗牛肉麵','a bowl of beef noodle soup'], ['一杯珍珠奶茶','a cup of bubble tea'],
    ['一盤草莓蛋糕','a plate of strawberry cake'], ['一個飯糰','a rice ball'], ['一盤壽司','a plate of sushi'],
    ['一杯拿鐵咖啡','a cup of latte'], ['一籃新鮮水果','a basket of fresh fruit'], ['一支冰淇淋','an ice cream cone'], ['一個冒著熱氣的包子','a steaming bao bun'],
  ]],
  ['日常物件', '🎒', [
    ['一把透明雨傘','a transparent umbrella'], ['一台復古相機','a vintage camera'], ['一雙帆布鞋','a pair of canvas shoes'],
    ['一本翻開的書','an open book'], ['一個陶瓷茶壺','a ceramic teapot'], ['一盞桌燈','a desk lamp'],
    ['一把木吉他','an acoustic guitar'], ['一個旅行皮箱','a travel suitcase'], ['一個發條音樂盒','a wind-up music box'], ['一封封蠟信件','a wax-sealed letter'],
  ]],
  ['建築場所', '🏰', [
    ['一座城堡','a castle'], ['一間魔法圖書館','a magical library'], ['一座燈塔','a lighthouse'], ['一座廢墟','ancient ruins'],
    ['一間山中木屋','a mountain cabin'], ['一座玻璃溫室','a glass greenhouse'], ['一間街角咖啡店','a corner cafe'],
    ['一座老火車站','an old railway station'], ['一間深夜書店','a late-night bookstore'], ['一座天文台','an observatory'],
  ]],
  ['交通機械', '🚂', [
    ['一列蒸汽火車','a steam train'], ['一艘海盜船','a pirate ship'], ['一台復古腳踏車','a vintage bicycle'],
    ['一輛露營車','a camper van'], ['一架螺旋槳飛機','a propeller airplane'], ['一顆熱氣球','a hot air balloon'],
    ['一艘潛水艇','a submarine'], ['一台送貨機器人','a delivery robot'], ['一台機械手臂','a robotic arm'], ['一艘太空船','a spaceship'],
  ]],
  ['奇幻角色', '🐉', [
    ['一條龍','a dragon'], ['一個女巫','a witch'], ['一個海盜','a pirate'], ['一位公主','a princess'], ['一名騎士','a knight'],
    ['一名武士','a samurai'], ['一位森林精靈','a forest elf'], ['一隻獨角獸','a unicorn'], ['一個蘑菇小精靈','a mushroom sprite'], ['一隻雲朵小怪獸','a little cloud monster'],
  ]],
  ['自然想像', '🏝️', [
    ['一座漂浮島嶼','a floating island'], ['一片珊瑚礁','a coral reef'], ['一座水晶洞穴','a crystal cave'],
    ['一顆環狀行星','a ringed planet'], ['一座雲上城市','a city above the clouds'], ['一片發光森林','a bioluminescent forest'],
    ['一座冰雪山峰','a snowy mountain peak'], ['一條蜿蜒河流','a winding river'], ['一座沙漠綠洲','a desert oasis'], ['一個迷你瓶中世界','a miniature world inside a bottle'],
  ]],
]

export const SUBJECT_CATEGORIES = GROUPS.map(([label, icon, entries], categoryIndex) => ({
  label, icon, presets: entries.map(([zh, en], index) => ({ zh, en, category: label,
    img: `/subject-previews/v1/s${String(categoryIndex + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}.webp`,
  })),
}))
export const SUBJECT_PRESETS = SUBJECT_CATEGORIES.flatMap(c => c.presets)
const ENGLISH = new Map(SUBJECT_PRESETS.map(s => [s.zh, s.en]))
export const subjectEnglish = value => ENGLISH.get(value?.trim()) || value || ''

export function searchSubjects({ query = '', category = '' } = {}) {
  const term = query.trim().toLocaleLowerCase()
  return SUBJECT_PRESETS.filter(s => (!category || s.category === category) &&
    (!term || `${s.zh} ${s.en} ${s.category}`.toLocaleLowerCase().includes(term)))
}
