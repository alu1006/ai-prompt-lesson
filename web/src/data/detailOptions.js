// Each option has zh (Chinese label), en (English for prompt), and preview image path
const ORIGINAL_CATEGORIES = [
  {
    key: 'action',
    label: '動作',
    icon: '🏃',
    options: [
      { zh: '站立', en: 'standing', img: '/tag-previews/站立.png' },
      { zh: '坐著', en: 'sitting', img: '/tag-previews/坐著.png' },
      { zh: '行走', en: 'walking', img: '/tag-previews/行走.png' },
      { zh: '奔跑', en: 'running', img: '/tag-previews/奔跑.png' },
      { zh: '跳舞', en: 'dancing', img: '/tag-previews/跳舞.png' },
      { zh: '沉思', en: 'contemplating', img: '/tag-previews/沉思.png' },
      { zh: '擁抱', en: 'embracing', img: '/tag-previews/擁抱.png' },
      { zh: '回頭望', en: 'looking back', img: '/tag-previews/回頭望.png' },
    ],
  },
  {
    key: 'scene',
    label: '場景',
    icon: '🏞️',
    options: [
      { zh: '森林', en: 'in a dense forest', img: '/tag-previews/森林.png' },
      { zh: '海邊', en: 'by the sea', img: '/tag-previews/海邊.png' },
      { zh: '城市', en: 'in a city', img: '/tag-previews/城市.png' },
      { zh: '花園', en: 'in a garden', img: '/tag-previews/花園.png' },
      { zh: '室內', en: 'indoors', img: '/tag-previews/室內.png' },
      { zh: '山景', en: 'on a mountain', img: '/tag-previews/山景.png' },
      { zh: '戶外', en: 'outdoors', img: '/tag-previews/戶外.png' },
      { zh: '抽象背景', en: 'abstract background', img: '/tag-previews/抽象.png' },
    ],
  },
  {
    key: 'angle',
    label: '鏡頭',
    icon: '📐',
    options: [
      { zh: '特寫', en: 'close-up shot', img: '/tag-previews/特寫.png' },
      { zh: '半身', en: 'half-body shot', img: '/tag-previews/半身.png' },
      { zh: '全身', en: 'full-body shot', img: '/tag-previews/全身.png' },
      { zh: '俯視', en: "bird's eye view", img: '/tag-previews/俯視.png' },
      { zh: '仰視', en: 'low angle shot', img: '/tag-previews/仰視.png' },
      { zh: '遠景', en: 'wide shot', img: '/tag-previews/遠景.png' },
      { zh: '側面', en: 'side view', img: '/tag-previews/側面.png' },
    ],
  },
  {
    key: 'lighting',
    label: '光影',
    icon: '☀️',
    options: [
      { zh: '自然光', en: 'natural lighting', img: '/tag-previews/自然光.png' },
      { zh: '黃金時段', en: 'golden hour lighting', img: '/tag-previews/黃金時段.png' },
      { zh: '逆光', en: 'backlit silhouette', img: '/tag-previews/逆光.png' },
      { zh: '燭光', en: 'candlelight', img: '/tag-previews/燭光.png' },
      { zh: '強烈陰影', en: 'dramatic chiaroscuro shadows', img: '/tag-previews/強烈陰影.png' },
      { zh: '夜燈', en: 'night lamp lighting', img: '/tag-previews/夜燈.png' },
      { zh: '柔光', en: 'soft diffused light', img: '/tag-previews/柔光.png' },
    ],
  },
  {
    key: 'mood',
    label: '情緒',
    icon: '🎭',
    options: [
      { zh: '寧靜', en: 'peaceful, serene atmosphere', img: '/tag-previews/寧靜.png' },
      { zh: '神秘', en: 'mysterious, eerie atmosphere', img: '/tag-previews/神祕.png' },
      { zh: '歡快', en: 'joyful, vibrant atmosphere', img: '/tag-previews/歡快.png' },
      { zh: '夢幻', en: 'dreamy, ethereal atmosphere', img: '/tag-previews/夢幻.png' },
      { zh: '憂鬱', en: 'melancholic, somber atmosphere', img: '/tag-previews/憂鬱.png' },
      { zh: '壯闊', en: 'epic, grand atmosphere', img: '/tag-previews/壯闊.png' },
    ],
  },
]

// Existing image references are retained. New references use bilingual text and
// a concrete observation note rather than an unrelated illustration.
const EXTRA = {
  action: [
    ['閱讀','reading a book','讓手、視線與書本形成互動'],
    ['飛翔','flying through the air','用展開的姿態呈現騰空感'],
    ['伸懶腰','stretching','拉長身體線條，表現放鬆'],
    ['探頭張望','peeking around a corner','只露出部分主體，增加好奇感'],
  ],
  scene: [
    ['夜市','at a Taiwanese night market','攤位與燈光形成熱鬧背景'],
    ['太空站','inside a space station','艙體、視窗與設備交代場所'],
    ['水底','underwater','漂浮與水波帶來不同空間感'],
    ['純色背景','on a plain solid-color background','減少背景干擾，突出主體'],
  ],
  angle: [
    ['平視','eye-level view','視線與主體同高，感受自然'],
    ['背面','rear view','從背後觀察輪廓與視線方向'],
    ['三分之四側面','three-quarter view','同時看到正面與側面'],
    ['微距','macro close-up','放大局部細節與表面紋理'],
    ['傾斜鏡頭','Dutch angle shot','傾斜地平線，增加不安與動勢'],
  ],
  lighting: [
    ['窗邊側光','soft side light from a window','單側受光，另一側保留柔和陰影'],
    ['霓虹燈光','cyan and magenta neon lighting','不同色光塑造都市夜景'],
    ['月光','cool moonlight','以低亮度冷光呈現夜晚'],
    ['體積光','volumetric light rays through haze','讓光束穿過薄霧而可見'],
    ['棚拍環形光','studio ring lighting','正面柔光與圓形眼神光'],
  ],
  mood: [
    ['溫馨','warm and comforting atmosphere','利用親近的距離與柔和節奏'],
    ['緊張','tense and suspenseful atmosphere','構圖與光影帶出懸念'],
    ['孤獨','quiet and lonely atmosphere','留白與距離強調孤單感'],
    ['懷舊','nostalgic atmosphere','時間痕跡與熟悉物件引起回憶'],
    ['幽默','playful and humorous atmosphere','意外的小細節製造趣味'],
    ['希望','hopeful and uplifting atmosphere','向光的方向與開闊空間帶出期待'],
  ],
}

const NOTES = {
  action: '觀察主體的姿勢、肢體方向與互動',
  scene: '觀察背景物件如何交代所在場所',
  angle: '觀察鏡頭距離、高度與主體朝向',
  lighting: '觀察光線方向、陰影邊緣與明暗',
  mood: '觀察色彩、空間與光影如何影響感受',
}
const option = ([zh, en, desc]) => ({ zh, en, desc })

const ADVANCED = [
  ['expression','表情','🙂','basic', [
    ['微笑','a gentle smile','嘴角微揚，眼神放鬆'], ['大笑','laughing joyfully','張嘴與瞇眼表現喜悅'],
    ['驚訝','a surprised expression','眼睛睜大，眉毛上揚'], ['好奇','a curious expression','視線集中，頭部微傾'],
    ['害羞','a shy expression','眼神閃避，姿態收斂'], ['自信','a confident expression','目光穩定，姿態舒展'],
    ['專注','a focused expression','眼睛注視目標，表情沉穩'], ['困倦','a sleepy expression','眼皮下垂，姿勢放鬆'],
    ['生氣','an angry expression','眉頭緊皺，嘴角緊繃'], ['難過','a sad expression','眼角與嘴角下垂'],
    ['疑惑','a puzzled expression','眉毛不對稱，頭部微偏'], ['平靜','a calm neutral expression','五官自然，情緒不強烈'],
  ]],
  ['attire','服裝配件','🧣','advanced', [
    ['連帽上衣','wearing a hoodie','帽兜與寬鬆輪廓增添日常感'], ['雨衣雨靴','wearing a raincoat and rain boots','防水輪廓與雨天用途連結'],
    ['圍巾','wearing a scarf','用布料垂墜與飄動增添線條'], ['工作圍裙','wearing a work apron','工具與布料交代職業'],
    ['太空服','wearing a space suit','頭盔與艙外裝備交代環境'], ['機械盔甲','wearing mechanical armor','硬質分件與關節連接'],
    ['斗篷','wearing a flowing cape','長布料輪廓帶出動勢'], ['針織毛衣','wearing a knitted sweater','編織紋理帶出溫暖感'],
    ['背包','carrying a backpack','背帶與收納袋交代旅行用途'], ['護目鏡','wearing protective goggles','鏡片與固定帶增加機能感'],
    ['花冠','wearing a flower crown','花朵排列強調頭部焦點'], ['簡約制服','wearing a simple uniform','一致服裝與小配件交代角色'],
  ]],
  ['composition','構圖','🖼️','advanced', [
    ['置中構圖','centered composition','把主體放在畫面中心'], ['三分法','rule-of-thirds composition','焦點靠近三分線交點'],
    ['左右對稱','bilaterally symmetrical composition','左右視覺重量保持對稱'], ['對角線構圖','diagonal composition','沿斜線安排主要形體'],
    ['大量留白','generous negative space','主體周圍保留呼吸空間'], ['前景框景','foreground framing','用前方枝葉或門窗框住主體'],
    ['引導線','leading lines toward the subject','道路、光線引導視線到主體'], ['滿版構圖','edge-to-edge full-bleed composition','讓圖像填滿畫面邊緣'],
    ['主體靠左','subject positioned on the left','右側保留空間或文字區'], ['主體靠右','subject positioned on the right','左側保留空間或文字區'],
    ['俯拍平鋪','flat lay arrangement','物件排列在同一平面，搭配俯視'], ['重複排列','rhythmic repetition of the subject','主體重複形成節奏，適合圖案'],
  ]],
  ['time','時間季節','🕰️','advanced', [
    ['清晨','early morning','光線偏低，場景開始甦醒'], ['正午','at midday','日光高，陰影通常較短'],
    ['午後','in the afternoon','斜向日光與日常活動'], ['傍晚','at dusk','天空與地面亮度逐漸變化'],
    ['午夜','at midnight','低環境光與局部照明'], ['藍色時刻','during blue hour','日出前或日落後的藍色天空'],
    ['春天','in spring','嫩葉、花朵與新生意象'], ['夏天','in summer','茂盛植物與強烈日光'],
    ['秋天','in autumn','落葉與暖褐色季節線索'], ['冬天','in winter','寒冷氣氛與稀疏植被'],
    ['節慶夜晚','on a festive evening','燈飾與慶典物件交代時間'], ['雨後時刻','just after rain','地面濕潤，反光與水珠仍在'],
  ]],
  ['weather','天氣環境','🌦️','advanced', [
    ['晴朗','clear sunny weather','天空清楚，明暗對比明確'], ['多雲','partly cloudy weather','雲層與日光交錯'],
    ['陰天','overcast weather','光線擴散，陰影邊緣柔和'], ['細雨','gentle drizzle','細小雨線與濕潤表面'],
    ['大雨','heavy rain','密集雨線與濺起水花'], ['薄霧','light mist','遠景對比降低，空間柔化'],
    ['濃霧','dense fog','背景逐漸消失在霧中'], ['飄雪','gently falling snow','空中雪片與表面積雪'],
    ['強風','strong wind','衣物、毛髮與葉片同向飄動'], ['雷雨','a thunderstorm','暗雲與短暫閃電光'],
    ['沙塵','windblown dust','細塵遮蔽遠景，色彩偏暖'], ['彩虹','a rainbow after rain','雨後天空出現彩色弧線'],
  ]],
  ['material','表面材質','🧱','advanced', [
    ['霧面陶瓷','matte ceramic surface','細緻霧面，反光不尖銳'], ['透明玻璃','transparent glass surface','透明折射與邊緣反光'],
    ['拉絲金屬','brushed metal surface','同方向細紋與金屬反射'], ['天然木紋','natural wood grain','木紋走向與色澤變化'],
    ['粗糙石材','rough stone surface','不規則孔隙與礦物顆粒'], ['柔軟絨毛','soft fluffy fibers','邊緣細毛與蓬鬆體積'],
    ['編織布料','woven fabric texture','經緯交錯與柔軟摺痕'], ['再生紙','recycled paper texture','可見纖維、色點與紙感'],
    ['半透明果凍','translucent jelly material','柔軟透光與圓潤高光'], ['水晶切面','faceted crystal material','硬質稜角與內部折射'],
    ['光滑塑膠','smooth molded plastic','均勻表面與模製圓角'], ['風化表面','weathered surface with age marks','磨損、斑駁與時間痕跡'],
  ]],
  ['ratio','畫面比例','▭','advanced', [
    ['正方形 1:1','square 1:1 aspect ratio','適合方形貼文與圖案'], ['直式 4:5','portrait 4:5 aspect ratio','適合人物與直式貼文'],
    ['直式 3:4','portrait 3:4 aspect ratio','常見直式照片比例'], ['直式 2:3','portrait 2:3 aspect ratio','適合海報與全身構圖'],
    ['直式 9:16','vertical 9:16 aspect ratio','適合手機滿版畫面'], ['橫式 5:4','landscape 5:4 aspect ratio','略寬的橫向畫面'],
    ['橫式 4:3','landscape 4:3 aspect ratio','適合傳統螢幕與插畫'], ['橫式 3:2','landscape 3:2 aspect ratio','常見橫式照片比例'],
    ['橫式 16:9','widescreen 16:9 aspect ratio','適合簡報與影片封面'], ['寬景 2:1','panoramic 2:1 aspect ratio','適合橫幅與環境敘事'],
    ['寬景 21:9','ultrawide 21:9 aspect ratio','適合電影感寬景'], ['長幅 3:1','wide banner 3:1 aspect ratio','適合網站橫幅與長形設計'],
  ]],
]

const ALL_CATEGORIES = [
  ...ORIGINAL_CATEGORIES.map(category => ({ ...category, level: 'basic',
    options: [...category.options.map(o => ({ ...o, desc: NOTES[category.key] })), ...EXTRA[category.key].map(option)],
  })),
  ...ADVANCED.map(([key, label, icon, level, entries]) => ({ key, label, icon, level, options: entries.map(option) })),
]
export const DETAIL_CATEGORIES = ALL_CATEGORIES.map(category => ({ ...category,
  options: category.options.map((option, index) => ({ ...option,
    img: option.img?.startsWith('/tag-previews/')
      ? `/detail-previews/quirky-v1/q-${category.key}-${String(index + 1).padStart(2, '0')}.webp`
      : option.img || `/detail-previews/v1/d-${category.key}-${String(index + 1).padStart(2, '0')}.${['composition','ratio'].includes(category.key) ? 'svg' : 'webp'}`,
  })),
}))
export const EMPTY_DETAILS = Object.fromEntries(DETAIL_CATEGORIES.map(c => [c.key, null]))
