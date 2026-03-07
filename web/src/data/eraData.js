// Era groupings for the 20 Wikidata movements, sorted chronologically
export const ERA_ORDER = [
  { key: 'medieval',      name_zh: '中世紀末 / 早期文藝復興', yearRange: '~1400–1480' },
  { key: 'renaissance',   name_zh: '文藝復興',                yearRange: '~1480–1600' },
  { key: 'baroque',       name_zh: '巴洛克 / 荷蘭黃金時代',  yearRange: '~1600–1750' },
  { key: 'neoclassical',  name_zh: '新古典 / 浪漫主義',       yearRange: '~1750–1870' },
  { key: '19thcentury',   name_zh: '19世紀末',                yearRange: '~1848–1910' },
  { key: 'modern',        name_zh: '現代主義',                yearRange: '~1905–1960' },
  { key: 'contemporary',  name_zh: '當代',                    yearRange: '1960–' },
]

// Maps each Wikidata movement Q-ID to an era + sort year
export const MOVEMENT_ERA = {
  'Q443153':  { eraKey: 'medieval',     year: 1420 }, // 早期尼德蘭油畫
  'Q610687':  { eraKey: 'renaissance',  year: 1480 }, // 威尼斯畫派
  'Q1474884': { eraKey: 'renaissance',  year: 1490 }, // 文藝復興全盛期
  'Q131808':  { eraKey: 'renaissance',  year: 1520 }, // 風格主義
  'Q37853':   { eraKey: 'baroque',      year: 1620 }, // 巴洛克藝術
  'Q2352880': { eraKey: 'baroque',      year: 1650 }, // 荷蘭黃金時代油畫
  'Q14378':   { eraKey: 'neoclassical', year: 1780 }, // 新古典主義
  'Q37068':   { eraKey: 'neoclassical', year: 1820 }, // 浪漫主義
  'Q189458':  { eraKey: 'neoclassical', year: 1850 }, // 學院藝術
  'Q184814':  { eraKey: '19thcentury',  year: 1848 }, // 前拉斐爾派
  'Q10857409':{ eraKey: '19thcentury',  year: 1850 }, // 現實主義
  'Q40415':   { eraKey: '19thcentury',  year: 1870 }, // 印象派
  'Q164800':  { eraKey: '19thcentury',  year: 1880 }, // 象徵主義
  'Q34636':   { eraKey: '19thcentury',  year: 1890 }, // 新藝術運動
  'Q281108':  { eraKey: '19thcentury',  year: 1900 }, // 素人藝術
  'Q128115':  { eraKey: 'modern',       year: 1910 }, // 抽象藝術
  'Q42934':   { eraKey: 'modern',       year: 1910 }, // 立體主義
  'Q39427':   { eraKey: 'modern',       year: 1925 }, // 超現實主義
  'Q10822316':{ eraKey: 'modern',       year: 1930 }, // 具體藝術
  'Q186030':  { eraKey: 'contemporary', year: 1970 }, // 當代藝術
}
