"""用程式碼繪製猜圖 D 組的 3 張抽象畫（由 Claude 撰寫）。
用法: pip install numpy pillow && python generate-claude-abstracts.py
輸出: web/public/intro/ai-claude-*.webp
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

OUT = Path(__file__).parent / 'web/public/intro'
rng = np.random.default_rng(42)


def noise(h, w, cell, octaves=4):
    out, amp = np.zeros((h, w)), 1.0
    for _ in range(octaves):
        gh, gw = max(2, int(h / cell) + 2), max(2, int(w / cell) + 2)
        g = Image.fromarray(rng.standard_normal((gh, gw)).astype('f4'))
        out += amp * np.asarray(g.resize((w, h), Image.BICUBIC))
        amp *= .5
        cell = max(2, cell / 2)
    return out / out.std()


class Canvas:
    def __init__(self, w, h, base):
        self.w, self.h = w, h
        y, x = np.mgrid[0:h, 0:w].astype(float)
        # 邊緣抖動，模擬手繪線條
        self.x = x + 2.2 * noise(h, w, 90)
        self.y = y + 2.2 * noise(h, w, 90)
        self.img = np.ones((h, w, 3)) * np.array(base, float)
        self.img += noise(h, w, 260)[..., None] * 5

    def fill(self, sdf, color, alpha=.95):
        """sdf < 0 的區域上色，顏料厚薄不均"""
        m = np.clip(.5 - sdf / 2.5, 0, 1)
        streak = np.asarray(Image.fromarray(
            rng.standard_normal((self.h, self.w // 24 + 2)).astype('f4')
        ).resize((self.w, self.h), Image.BICUBIC))
        tone = np.array(color, float) + (noise(self.h, self.w, 140) * 6 + streak * 4)[..., None]
        a = np.clip(m * (alpha + .05 * noise(self.h, self.w, 60)), 0, 1)[..., None]
        self.img = self.img * (1 - a) + tone * a

    def circle(self, cx, cy, r):
        return np.hypot(self.x - cx, self.y - cy) - r

    def ring(self, cx, cy, r, t):
        return abs(self.circle(cx, cy, r)) - t

    def rect(self, cx, cy, hw, hh, deg=0):
        t = np.deg2rad(deg)
        dx, dy = self.x - cx, self.y - cy
        u, v = dx * np.cos(t) + dy * np.sin(t), -dx * np.sin(t) + dy * np.cos(t)
        return np.maximum(abs(u) - hw, abs(v) - hh)

    def save(self, name):
        weave = rng.standard_normal((self.h, 1)) * 2 + rng.standard_normal((1, self.w)) * 2
        yy, xx = np.mgrid[0:self.h, 0:self.w]
        vig = ((xx / self.w - .5) ** 2 + (yy / self.h - .5) ** 2) * 26
        arr = self.img + (weave + rng.standard_normal((self.h, self.w)) * 4 - vig)[..., None]
        im = Image.fromarray(np.clip(arr, 0, 255).astype('u1')).filter(ImageFilter.GaussianBlur(.6))
        im.save(OUT / f'{name}.webp', quality=85)


def floating_planes():
    c = Canvas(1100, 1300, (226, 217, 198))
    for a in [((520, 560, 250, 88, -24), (28, 27, 29)), ((700, 330, 150, 34, -24), (186, 48, 34)),
              ((350, 800, 190, 26, 18), (214, 160, 40)), ((640, 850, 115, 115, -10), (38, 66, 120)),
              ((420, 350, 60, 60, 34), (190, 120, 110)), ((760, 610, 210, 9, 62), (40, 40, 42)),
              ((330, 1010, 130, 13, -38), (186, 48, 34)), ((800, 1010, 70, 22, 40), (60, 100, 80)),
              ((560, 1060, 170, 5, 8), (35, 33, 35)), ((250, 560, 12, 130, 12), (90, 88, 92))]:
        c.fill(c.rect(*a[0]), a[1])
    c.fill(c.circle(850, 840, 48), (30, 28, 30))
    c.save('ai-claude-planes')


def inner_orbits():
    c = Canvas(1100, 1400, (92, 106, 132))
    c.fill(c.rect(550, 1120, 560, 290), (196, 122, 92))
    for r, col in [(400, (222, 190, 150)), (330, (206, 110, 120)), (262, (238, 218, 176)),
                   (196, (96, 130, 118)), (128, (232, 178, 70)), (62, (246, 238, 220))]:
        c.fill(c.circle(550, 600, r), col)
    half = np.maximum(c.circle(550, 600, 262), c.x - 550)
    c.fill(half, (60, 78, 120), .55)
    for r in (430, 300, 228, 160):
        c.fill(c.ring(550, 600, r, 2.2), (45, 40, 42), .85)
    t = np.arctan2(c.y - 600, c.x - 550)
    rr = np.hypot(c.x - 550, c.y - 600)
    spiral = abs(((rr / 26 - t / (2 * np.pi) + .5) % 1) - .5) * 26 - 2.4
    c.fill(np.maximum(spiral, rr - 122), (120, 50, 50), .9)
    c.fill(abs(c.x - 550 - 70 * np.sin(c.y / 75)) - np.where(c.y > 1010, 4, -9), (246, 232, 200))
    c.fill(abs(c.x - 550 + 70 * np.sin(c.y / 75)) - np.where(c.y > 1010, 4, -9), (60, 70, 110))
    for i in range(7):
        c.fill(c.circle(250 + i * 100, 110, 16 + (i % 2) * 9), [(238, 218, 176), (206, 110, 120)][i % 2])
    c.save('ai-claude-orbits')


def garden_grid():
    c = Canvas(1300, 1050, (70, 58, 54))
    pal = [(196, 92, 58), (222, 160, 78), (92, 122, 104), (64, 86, 112), (206, 178, 138),
           (150, 64, 70), (116, 98, 130), (232, 206, 150), (70, 98, 90), (176, 124, 92)]
    ys = np.cumsum([30] + list(rng.integers(105, 150, 8)))
    ys = (ys - 30) * 990 / (ys[-1] - 30) + 30
    for j in range(8):
        xs = np.cumsum([30] + list(rng.integers(90, 170, 10)))
        xs = (xs - 30) * 1240 / (xs[-1] - 30) + 30
        for i in range(10):
            col = np.array(pal[rng.integers(len(pal))]) + rng.integers(-14, 15, 3)
            cx, cy = (xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2
            hw, hh = (xs[i + 1] - xs[i]) / 2 - 3, (ys[j + 1] - ys[j]) / 2 - 3
            c.fill(c.rect(cx, cy, hw, hh, rng.uniform(-1.6, 1.6)), col, .88)
            k = rng.random()
            if k < .09:
                c.fill(np.maximum(c.circle(cx, cy + hh, min(hw, hh) * 1.1), c.y - cy - hh), (48, 40, 44), .7)
            elif k < .16:
                c.fill(c.circle(cx, cy, min(hw, hh) * .5), (238, 214, 160), .85)
    c.save('ai-claude-grid')


if __name__ == '__main__':
    floating_planes()
    inner_orbits()
    garden_grid()
