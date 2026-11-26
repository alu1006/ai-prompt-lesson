export const TURNAROUND_PROMPT = {
  zh: `請根據我上傳的手繪草圖，整理成原創角色三視圖設定圖。

目標：產生同一角色的正面、側面與背面，三個視角並排，角色比例、服裝、髮型、道具與表情特徵必須一致。

必須保留：手繪草圖中的基礎形狀、輪廓、表情、五官、服裝、道具與手繪感。

視覺整理：保留原始筆觸與手繪感，線條清楚，使用乾淨柔和的配色。

限制：不要重新設計成不同角色，不要改變頭身比例，不要增加草圖中沒有的不必要裝飾，不要加入文字或背景場景。不要模仿任何知名角色、品牌角色或特定插畫家風格。

版面：白色背景，正面、側面、背面完整呈現，角色不可互相重疊，四周保留空間。`,
  en: `Based on my uploaded hand-drawn sketch, create an original character turnaround reference sheet.

Goal: Show the front, side and back of the same character side by side. Keep the character proportions, clothing, hairstyle, props and distinctive facial expression features consistent across all three views.

Preserve: The basic shapes, silhouette, expression, facial features, clothing, props and hand-drawn quality of the sketch.

Visual cleanup: Preserve the original strokes and hand-drawn feel. Keep the lines clear and use clean, soft colors.

Constraints: Do not redesign this into a different character. Do not change the head-to-body proportions. Do not add unnecessary decorations absent from the sketch. Do not add text or background scenery. Do not imitate any well-known character, brand character or specific illustrator's style.

Layout: White background. Show the complete front, side and back views without overlapping. Leave space around all views.`,
}

export const isTurnaround = selection => selection.product?.id === 'turnaround'
