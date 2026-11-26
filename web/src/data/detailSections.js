import { DETAIL_CATEGORIES } from './detailOptions.js'

export const DETAIL_SECTIONS = [
  { id: 'palette', label: '配色', icon: '🎨', keys: [], hint: '選擇 1～4 個顏色，試試色輪與和諧配色。' },
  { id: 'action', label: '動作', icon: '🏃', keys: ['action','attire'], hint: '從姿勢與服裝配件，說明角色正在做什麼。' },
  { id: 'scene', label: '場景', icon: '🌿', keys: ['scene','time','weather','material'], hint: '選擇所在場所、時間季節、天氣與表面材質。' },
  { id: 'camera', label: '鏡頭', icon: '📷', keys: ['angle','composition','ratio'], hint: '調整觀看角度、構圖與畫面比例。' },
  { id: 'lighting', label: '光影', icon: '☀️', keys: ['lighting'], hint: '觀察光線方向、陰影邊緣與明暗對比。' },
  { id: 'mood', label: '情緒', icon: '🙂', keys: ['mood','expression'], hint: '用整體氣氛與表情，傳達角色的感受。' },
]

export function sectionCategories(sectionId, query = '') {
  const section = DETAIL_SECTIONS.find(s=>s.id===sectionId)
  const term = query.trim().toLocaleLowerCase()
  return (section?.keys || []).map(key=>DETAIL_CATEGORIES.find(c=>c.key===key))
    .map(c=>({...c,options:c.options.filter(o=>!term || `${c.label} ${o.zh} ${o.en} ${o.desc}`.toLocaleLowerCase().includes(term))}))
    .filter(c=>c.options.length)
}
