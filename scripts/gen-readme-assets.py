#!/usr/bin/env python3
"""README visuals for dsh-draw — v5.

`dsh-draw` is one drawer behind two doors: the model-facing `image_generate`
tool and the result card's `draw/regenerate` button both enter the same path
(normalize → generation quota → engine chain → byte quota → durable commit →
gated `draw/generated` event), so neither figure is a generic box chain:

* hero — the session contact sheet. The engine-chain rail sits on top (the
  preferred `openai` engine failed with HTTP 429, `cogview` served the call),
  four generated tiles carry their attachment ids and the real size preset,
  and the session quota strip runs underneath.
* flow — two mouths merge into a single drawer spine; the generation gate
  sits before any engine is contacted; the engine chain is a scoreboard with
  cooldown health; the byte gate sits before the attachment store; the commit
  forks into durable refs plus a gated session event; the returns feed the
  model value, the result card and the Settings tab, and the dashed return is
  regenerate re-entering the same drawer.

Every label is a file, config key, reason code or measured constant from
`src/`, `cordis.patch.yml` or the README — nothing here is invented.
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'docs', 'assets')

FONT_CJK = r'C:\Windows\Fonts\msyh.ttc'
FONT_CJK_BOLD = r'C:\Windows\Fonts\msyhbd.ttc'
FONT_MONO = r'C:\Windows\Fonts\consola.ttf'
for _p in (FONT_CJK, FONT_CJK_BOLD, FONT_MONO):
    if not os.path.exists(_p):
        raise SystemExit(f'FATAL: font missing: {_p}')

# Everything is composited at 2x and downsampled once at the end.
S = 2
RESAMPLE = getattr(Image, 'LANCZOS', None) or Image.Resampling.LANCZOS

SKIN = {
    'light': dict(bg_from='#f9f6fd', bg_to='#e4eaf8', card='#ffffff',
                  edge='#e2dff0', text='#141419', sub='#4d5261',
                  faint='#8f94a4', accent='#4B67B4', green='#16a34a',
                  warn='#bc4c00', danger='#c02b2b', pill='#ece7f9',
                  track='#ece8f6', shadow=(38, 30, 72), shadow_a=26),
    'dark': dict(bg_from='#131a2a', bg_to='#0c1016', card='#1b2231',
                 edge='#2e374b', text='#f0f3f9', sub='#a8b1c4',
                 faint='#737b8d', accent='#8496f5', green='#3fb950',
                 warn='#d29922', danger='#f87171', pill='#242d42',
                 track='#2b3448', shadow=(0, 0, 0), shadow_a=110),
}


def font(size, kind='cjk'):
    return ImageFont.truetype(
        {'cjk': FONT_CJK, 'cjk_bold': FONT_CJK_BOLD, 'mono': FONT_MONO}[kind],
        size)


def hx(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(int(x + (y - x) * t) for x, y in zip(hx(a), hx(b)))


def lin(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


def gradient(w, h, c1, c2):
    base = Image.new('RGB', (w, h))
    d = ImageDraw.Draw(base)
    for y in range(h):
        t = 0.18 * (y / h) + 0.82 * (y / h) ** 1.6
        d.line([(0, y), (w, y)], fill=mix(c1, c2, t))
    return base


def glow(img, cx, cy, r, color, alpha=48):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(14, 0, -1):
        rr = r * i / 14
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
                  fill=color + (int(alpha * (1 - i / 15)),))
    layer = layer.filter(ImageFilter.GaussianBlur(30))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


MEASURE = ImageDraw.Draw(Image.new('RGB', (8, 8)))


def tw(text, size, kind='cjk'):
    return MEASURE.textlength(text, font=font(size, kind))


def is_cjk(s):
    return any('\u4e00' <= ch <= '\u9fff' for ch in s)


def lab(s, size):
    """Small label font: the CJK face carries Chinese, mono carries ASCII."""
    return font(size, 'cjk' if is_cjk(s) else 'mono')


def fit(s, kind, start, maxw, floor=11):
    size = start
    while size > floor and tw(s, size, kind) > maxw:
        size -= 1
    return font(size, kind), size


class Layer:
    """Design-space vector layer (1440x576) rasterised at 2x."""

    def __init__(self, w, h):
        self.w, self.h = w, h
        self.img = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.img)

    def refresh(self):
        self.d = ImageDraw.Draw(self.img)

    def rect(self, box, radius=0, fill=None, outline=None, width=1.0):
        self.d.rounded_rectangle([v * S for v in box], radius=radius * S,
                                 fill=fill, outline=outline,
                                 width=max(1, round(width * S)))

    def line(self, p1, p2, fill, width=1.0):
        self.d.line([p1[0] * S, p1[1] * S, p2[0] * S, p2[1] * S],
                    fill=fill, width=max(1, round(width * S)))

    def dot(self, cx, cy, r, fill):
        self.d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S],
                       fill=fill)

    def shadow(self, box, radius=20, blur=16, color=(0, 0, 0), alpha=30,
               dy=10):
        sh = Image.new('RGBA', self.img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(sh)
        d.rounded_rectangle([box[0] * S, (box[1] + dy) * S, box[2] * S,
                             (box[3] + dy) * S], radius=radius * S,
                            fill=color + (alpha,))
        sh = sh.filter(ImageFilter.GaussianBlur(blur * S))
        self.img = Image.alpha_composite(self.img, sh)
        self.refresh()

    def paste_tile(self, box, painter, radius=14, strip=24):
        x0, y0, x1, y1 = [v * S for v in box]
        w, h = int(round(x1 - x0)), int(round(y1 - y0))
        tile = Image.new('RGBA', (w, h), (0, 0, 0, 255))
        painter(tile)
        band = int(strip * S)
        td = ImageDraw.Draw(tile, 'RGBA')
        td.rectangle([0, h - band, w, h], fill=(8, 10, 18, 118))
        mask = Image.new('L', (w, h), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            [0, 0, w - 1, h - 1], radius=radius * S, fill=255)
        tile.putalpha(mask)
        self.img.alpha_composite(tile, (int(round(x0)), int(round(y0))))
        self.refresh()

    def flatten(self):
        return self.img.resize((self.w, self.h), RESAMPLE)


def text(d, xy, s, f, fill, anchor='ls'):
    d.text(xy, s, font=f, fill=hx(fill), anchor=anchor)


# --------------------------------------------------------------------------
# generated tiles: four abstract frames, the product of one fallback call
# --------------------------------------------------------------------------
def tile_dusk(img):
    w, h = img.size
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        col = (lin((30, 20, 52), (198, 92, 88), t / 0.62) if t < 0.62
               else lin((198, 92, 88), (246, 178, 112), (t - 0.62) / 0.38))
        d.line([(0, y), (w, y)], fill=col + (255,))
    d = ImageDraw.Draw(img, 'RGBA')
    sx, sy, r = int(w * 0.70), int(h * 0.40), int(w * 0.050)
    d.ellipse([sx - 2 * r, sy - 2 * r, sx + 2 * r, sy + 2 * r],
              fill=(255, 216, 164, 54))
    d.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(255, 244, 220, 255))
    d.rectangle([0, int(h * 0.64), w, h], fill=(22, 17, 40, 255))
    d.ellipse([int(w * 0.46), int(h * 0.63), int(w * 1.05), int(h * 0.74)],
              fill=(172, 104, 100, 76))
    x, base, top = int(w * 0.24), int(h * 0.66), int(h * 0.14)
    d.polygon([(x - int(w * 0.036), base), (x + int(w * 0.036), base),
               (x + int(w * 0.016), top), (x - int(w * 0.016), top)],
              fill=(14, 11, 24, 255))
    d.rectangle([x - int(w * 0.020), top - int(h * 0.05),
                 x + int(w * 0.020), top], fill=(255, 232, 188, 255))


def tile_dune(img):
    w, h = img.size
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        col = lin((14, 36, 56), (66, 140, 148), t)
        d.line([(0, y), (w, y)], fill=col + (255,))
    d = ImageDraw.Draw(img, 'RGBA')
    mx, my, mr = int(w * 0.74), int(h * 0.26), int(w * 0.062)
    d.ellipse([mx - 2 * mr, my - 2 * mr, mx + 2 * mr, my + 2 * mr],
              fill=(214, 240, 238, 46))
    d.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill=(226, 246, 244, 240))
    d.ellipse([-int(w * 0.15), int(h * 0.60), int(w * 0.78), int(h * 1.55)],
              fill=(20, 48, 64, 255))
    d.ellipse([int(w * 0.46), int(h * 0.68), int(w * 1.30), int(h * 1.60)],
              fill=(13, 33, 47, 255))
    d.arc([int(w * 0.0), int(h * 0.58), int(w * 0.80), int(h * 1.20)],
          200, 320, fill=(126, 206, 204, 120), width=max(2, int(h * 0.012)))


def tile_arcs(img):
    w, h = img.size
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, w, h], fill=(24, 14, 44, 255))
    d = ImageDraw.Draw(img, 'RGBA')
    cx, cy = int(w * 0.50), int(h * 1.04)
    for i, (rad, col, width) in enumerate((
            (0.78, (236, 96, 172, 235), 0.030),
            (0.60, (122, 108, 248, 235), 0.026),
            (0.42, (86, 214, 214, 220), 0.022),
            (0.25, (250, 200, 120, 210), 0.018))):
        rr = int(w * rad)
        d.arc([cx - rr, cy - rr, cx + rr, cy + rr], 180, 360, fill=col,
              width=max(2, int(w * width)))
    for row in range(2):
        for col in range(9):
            px = int(w * 0.12) + col * int(w * 0.095)
            py = int(h * 0.14) + row * int(h * 0.09)
            d.ellipse([px - 2, py - 2, px + 2, py + 2],
                      fill=(240, 236, 255, 120))


def tile_bloom(img):
    w, h = img.size
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        col = lin((30, 12, 40), (78, 28, 74), t)
        d.line([(0, y), (w, y)], fill=col + (255,))
    d = ImageDraw.Draw(img, 'RGBA')
    cx, cy = int(w * 0.50), int(h * 0.50)
    d.ellipse([cx - int(w * 0.30), cy - int(w * 0.30),
               cx + int(w * 0.30), cy + int(w * 0.30)],
              fill=(255, 168, 214, 26))
    for i in range(7):
        ang = -1.5708 + i * 0.8976
        px = cx + int(w * 0.185 * math.cos(ang))
        py = cy + int(w * 0.185 * math.sin(ang))
        rr = int(w * 0.145)
        d.ellipse([px - rr, py - rr, px + rr, py + rr],
                  fill=(255, 132, 196, 92))
        d.ellipse([px - int(rr * 0.55), py - int(rr * 0.55),
                   px + int(rr * 0.55), py + int(rr * 0.55)],
                  fill=(255, 196, 226, 110))
    rr = int(w * 0.085)
    d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(255, 236, 246, 245))


TILES = [tile_dusk, tile_dune, tile_arcs, tile_bloom]
TILE_CAPTION = [('att-8c41', '1344x768'), ('att-2b07', '1344x768'),
                ('att-5d19', '1344x768'), ('att-9e63', '1344x768')]

HERO = {
    'zh': dict(
        kicker='DEEPSEEK HARNESS 插件 · 图像生成',
        title='dsh-draw',
        value=['一个工具，多台引擎。', '健康感知回退，结果落地为附件'],
        sub='六个标准参数，按引擎翻译。',
        meta='image_generate · draw/status · 设置 → 图像生成',
        foot='Apache-2.0 · PerryLink DSH 插件家族 · v0.2.26',
        panel='本次会话 · 生成结果',
        fallback='fallbackUsed: true',
        chain=[('openai', 'HTTP 429'), ('cogview', '已服务'),
               ('+ 任意兼容端点', '')],
        quota='会话配额',
        calls='12 / 200 次',
        bytes='84.2 / 200 MiB',
        verify='附件引用 · 内容寻址',
    ),
    'en': dict(
        kicker='DEEPSEEK HARNESS PLUGIN · IMAGE GENERATION',
        title='dsh-draw',
        value=['One tool, many engines.', 'Health-aware fallback, durable results'],
        sub='Six standard parameters, translated per engine.',
        meta='image_generate · draw/status · Settings → Image generation',
        foot='Apache-2.0 · PerryLink DSH plugin family · v0.2.26',
        panel='GENERATED THIS SESSION',
        fallback='fallbackUsed: true',
        chain=[('openai', 'http 429'), ('cogview', 'served'),
               ('+ any compatible', '')],
        quota='SESSION QUOTA',
        calls='12 / 200 calls',
        bytes='84.2 / 200 MiB',
        verify='durable attachment refs',
    ),
}


def hero(lang, skin):
    """1440x576 banner: pitch on the left, the session contact sheet right."""
    s = SKIN[skin]
    H = HERO[lang]
    W, HT = 1440, 576
    img = gradient(W, HT, s['bg_from'], s['bg_to'])
    img = glow(img, 1180, 60, 440, hx(s['accent']),
               22 if skin == 'light' else 46)
    L = Layer(W, HT)

    # ------------------------------------------------------------- panel
    panel = (736, 40, 1384, 536)
    L.shadow(panel, radius=24, blur=18, color=s['shadow'], alpha=s['shadow_a'],
             dy=12)
    L.rect(panel, radius=24, fill=hx(s['card']), outline=hx(s['edge']),
           width=1.2)
    L.line((764, 92), (1356, 92), hx(s['edge']), 1.0)

    # --------------------------------------------------------- chain rail
    p1 = (764, 104, 936, 140)
    p2 = (986, 104, 1186, 140)
    p3 = (1206, 104, 1356, 140)
    L.rect(p1, radius=18, fill=hx(s['pill']), outline=hx(s['edge']), width=1.0)
    L.rect(p2, radius=18, fill=hx(s['pill']), outline=hx(s['edge']), width=1.0)
    L.rect(p3, radius=18, fill=hx(s['card']), outline=hx(s['edge']), width=1.0)
    L.dot(782, 122, 3.6, hx(s['danger']))
    L.dot(1004, 122, 3.6, hx(s['green']))
    L.line((944, 122), (976, 122), hx(s['faint']), 1.4)
    L.line((964, 116), (976, 122), hx(s['faint']), 1.4)
    L.line((964, 128), (976, 122), hx(s['faint']), 1.4)

    # -------------------------------------------------------------- tiles
    boxes = [(764, 160, 1052, 310), (1068, 160, 1356, 310),
             (764, 326, 1052, 476), (1068, 326, 1356, 476)]
    for box, painter in zip(boxes, TILES):
        L.paste_tile(box, painter, radius=13, strip=23)

    # -------------------------------------------------------- quota strip
    L.rect((764, 496, 1356, 524), radius=14, fill=hx(s['pill']), outline=None)
    bar_x0, bar_x1 = 900, 1010
    L.rect((bar_x0, 500, bar_x1, 506), radius=3, fill=hx(s['track']))
    L.rect((bar_x0, 500, bar_x0 + (bar_x1 - bar_x0) * 0.06, 506), radius=3,
           fill=hx(s['accent']))
    L.rect((bar_x0, 512, bar_x1, 518), radius=3, fill=hx(s['track']))
    L.rect((bar_x0, 512, bar_x0 + (bar_x1 - bar_x0) * 0.42, 518), radius=3,
           fill=hx(s['accent']))

    # ------------------------------------------------ left column artwork
    kx, ky, kh = 60, 44, 34
    kw = tw(H['kicker'], 15, 'cjk') + 34
    L.rect((kx, ky, kx + kw, ky + kh), radius=kh / 2, fill=hx(s['pill']))
    L.line((60, 456), (660, 456), hx(s['edge']), 1.4)

    base = Image.alpha_composite(img.convert('RGBA'), L.flatten())
    d = ImageDraw.Draw(base)

    # ------------------------------------------------------ left column
    text(d, (kx + 17, ky + 22), H['kicker'], font(15, 'cjk'), s['accent'])
    tf, _ = fit(H['title'], 'mono', 84, 650, 70)
    text(d, (kx, 214), H['title'], tf, s['text'])

    y = 278
    for line in H['value']:
        vf, _ = fit(line, 'cjk_bold', 35, 620, 28)
        text(d, (kx, y), line, vf, s['text'])
        y += 50

    sf, _ = fit(H['sub'], 'cjk', 26, 660, 24)
    text(d, (kx, 390), H['sub'], sf, s['sub'])
    meta_kind = 'cjk' if is_cjk(H['meta']) else 'mono'
    mf, _ = fit(H['meta'], meta_kind, 20, 660, 17)
    text(d, (kx, 432), H['meta'], mf, s['faint'])
    text(d, (kx, 500), H['foot'], font(16, 'cjk'), s['faint'])

    # ----------------------------------------------------- panel content
    text(d, (764, 78), H['panel'], lab(H['panel'], 12.5), s['accent'])
    text(d, (1356, 78), H['fallback'], lab(H['fallback'], 12), s['warn'],
         anchor='rs')

    c1, c2, c3 = H['chain']
    text(d, (792, 127), c1[0], lab(c1[0], 12.5), s['text'])
    text(d, (924, 127), c1[1], lab(c1[1], 11), s['danger'], anchor='rs')
    text(d, (1014, 127), c2[0], lab(c2[0], 12.5), s['text'])
    text(d, (1174, 127), c2[1], lab(c2[1], 11), s['green'], anchor='rs')
    text(d, (1281, 127), c3[0], lab(c3[0], 11), s['faint'], anchor='ms')
    text(d, (961, 152), 'fallback', font(11, 'mono'), s['faint'],
         anchor='ms')

    for box, (att, size) in zip(boxes, TILE_CAPTION):
        x0, _, x1, y1 = box
        text(d, (x0 + 12, y1 - 9), att, font(12, 'mono'), '#f4f6ff')
        text(d, (x1 - 12, y1 - 9), size, font(12, 'mono'), '#c9cede',
             anchor='rs')

    text(d, (778, 514), H['quota'], lab(H['quota'], 11), s['accent'])
    text(d, (1018, 507), H['calls'], lab(H['calls'], 10.5), s['sub'])
    text(d, (1018, 519), H['bytes'], lab(H['bytes'], 10.5), s['sub'])
    text(d, (1344, 514), H['verify'], lab(H['verify'], 10.5), s['faint'],
         anchor='rs')

    path = os.path.join(OUT, f'dsh-draw-hero-{lang}-{skin}.webp')
    base.convert('RGB').save(path, 'WEBP', quality=93)
    print(f'dsh-draw-hero-{lang}-{skin}.webp')


# --------------------------------------------------------------------------
# flow: 1100x660, hand-written SVG
# --------------------------------------------------------------------------
MONO = ("ui-monospace, SFMono-Regular, 'Cascadia Mono', Consolas, "
        "'Microsoft YaHei', monospace")
SANS = ("ui-sans-serif, system-ui, -apple-system, 'Segoe UI', "
        "'Microsoft YaHei', 'PingFang SC', sans-serif")

FLOW = {
    'light': dict(bg1='#f9f6fd', bg2='#e4eaf8', dots='#ded7ee', card='#ffffff',
                  edge='#e2dff0', text='#141419', sub='#4d5261',
                  faint='#8f94a4', accent='#4B67B4', green='#16a34a',
                  warn='#bc4c00', danger='#c02b2b', pill='#ece7f9',
                  track='#ece8f6', grid='#e6e1f2', shadow='#1b1735',
                  shadow_op='.10'),
    'dark': dict(bg1='#131a2a', bg2='#0c1016', dots='#1b2434', card='#1b2231',
                 edge='#2e374b', text='#f0f3f9', sub='#a8b1c4',
                 faint='#737b8d', accent='#8496f5', green='#3fb950',
                 warn='#d29922', danger='#f87171', pill='#242d42',
                 track='#232c3f', grid='#1b2434', shadow='#000000',
                 shadow_op='.55'),
}


def flow_svg(skin):
    s = FLOW[skin]
    add = []
    say = add.append

    def est(label, size, fam):
        return len(label) * size * (0.60 if fam == MONO else 0.525)

    def t(x, y, label, size, col, weight='400', fam=SANS, anchor='start',
          opacity=None, ls=None):
        extra = ''
        if opacity is not None:
            extra += f' opacity="{opacity}"'
        if ls is not None:
            extra += f' letter-spacing="{ls}"'
        esc = (label.replace('&', '&amp;').replace('<', '&lt;')
               .replace('>', '&gt;'))
        say(f'<text x="{x}" y="{y}" fill="{col}" font-family="{fam}" '
            f'font-size="{size}" font-weight="{weight}" '
            f'text-anchor="{anchor}"{extra}>{esc}</text>')

    def chip(x, y, label, size, fg, bg, anchor='end', h=19, pad=8,
             weight='700', fam=MONO, border=None):
        w = est(label, size, fam) + 2 * pad
        x0 = x - w if anchor == 'end' else x
        extra = f' stroke="{border}" stroke-width="1"' if border else ''
        say(f'<rect x="{x0:.1f}" y="{y - h + 5}" width="{w:.1f}" '
            f'height="{h}" rx="{h / 2:.1f}" fill="{bg}"{extra}/>')
        t(x0 + w / 2, y, label, size, fg, weight, fam, 'middle')
        return w

    def eyebrow(x, y, label):
        t(x, y, label, 11, s['accent'], '700', MONO, ls='1.15')

    def arrow(x1, y1, x2, y2, col, marker='a', dash=None, width=2.2):
        extra = f' stroke-dasharray="{dash}"' if dash else ''
        say(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
            f'stroke="{col}" stroke-width="{width}" stroke-linecap="round"'
            f'{extra} marker-end="url(#{marker})"/>')

    def box(x0, y0, x1, y1, radius=14, fill=None, stroke=None, width=1.2,
            dash=None, opacity=None):
        fill = fill or s['card']
        stroke = stroke or s['edge']
        extra = ''
        if dash:
            extra += f' stroke-dasharray="{dash}"'
        if opacity is not None:
            extra += f' opacity="{opacity}"'
        say(f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" '
            f'rx="{radius}" fill="{fill}" stroke="{stroke}" '
            f'stroke-width="{width}"{extra}/>')

    # ------------------------------------------------------------- defs
    say('<defs>')
    for mid, col in (('a', s['accent']), ('dn', s['danger']),
                     ('wn', s['warn']), ('fa', s['faint'])):
        say(f'<marker id="{mid}" viewBox="0 0 10 10" refX="8.5" refY="5" '
            f'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0 1 L9 5 L0 9 z" fill="{col}"/></marker>')
    say(f'<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="{s["bg1"]}"/>'
        f'<stop offset="1" stop-color="{s["bg2"]}"/></linearGradient>')
    say(f'<pattern id="dots" width="26" height="26" '
        f'patternUnits="userSpaceOnUse">'
        f'<circle cx="1" cy="1" r="1" fill="{s["dots"]}" opacity=".6"/>'
        f'</pattern>')
    say('</defs>')

    say(f'<rect x="0" y="0" width="1100" height="660" fill="url(#bg)"/>')
    say(f'<rect x="0" y="0" width="1100" height="660" fill="url(#dots)"/>')

    # ----------------------------------------------------------- header
    t(40, 46, 'dsh-draw', 26, s['text'], '700', MONO)
    t(40, 70, 'one drawer · two quota gates · a health-aware engine chain',
      12.5, s['sub'])
    t(1060, 46, 'image_generate · draw/regenerate · draw/status', 11,
      s['faint'], '400', MONO, 'end')

    # ------------------------------------------- 1 intake, 2 drawer bars
    eyebrow(40, 106, '① INTAKE · TWO MOUTHS, ONE DRAWER')
    eyebrow(512, 106, '② DRAWER · VALIDATE → GATE ①')

    box(40, 116, 470, 182)
    t(60, 150, 'image_generate', 14.5, s['text'], '700', MONO)
    t(60, 169, 'model tool · prompt / size / count / quality / style / engine',
      11.5, s['sub'])
    t(450, 150, 'tool.ts', 11, s['faint'], '400', MONO, 'end')

    box(40, 194, 470, 260)
    t(60, 228, 'draw/regenerate', 14.5, s['text'], '700', MONO)
    t(60, 247, 'result-card button · the same drawer path', 11.5, s['sub'])
    t(450, 228, 'service.ts', 11, s['faint'], '400', MONO, 'end')

    # merge: both mouths join before the first station
    say(f'<path d="M470 149 H486 M470 227 H486 M486 227 V149" '
        f'stroke="{s["accent"]}" stroke-width="2.2" fill="none" '
        f'stroke-linecap="round"/>')
    say(f'<circle cx="486" cy="149" r="3.4" fill="{s["accent"]}"/>')
    arrow(490, 149, 506, 149, s['accent'])

    box(510, 116, 1060, 182)
    t(530, 150, 'normalizeRequest() → validate', 14, s['text'], '700', MONO)
    chip(1040, 150, '✕ invalid-prompt', 11, s['danger'], s['pill'])
    t(530, 169, 'prompt 1..4000 · count ≤ maxImagesPerCall · defaults '
               'square/auto', 11.5, s['sub'])
    t(1040, 169, 'translate.ts', 11, s['faint'], '400', MONO, 'end')

    box(510, 194, 1060, 260)
    t(530, 228, 'checkQuotaGenerations()', 14, s['text'], '700', MONO)
    chip(1040, 228, '✕ quota-generations', 11, s['danger'], s['pill'])
    t(530, 247, 'before any engine is contacted · 200 calls / session',
      11.5, s['sub'])
    t(1040, 247, 'quota.ts', 11, s['faint'], '400', MONO, 'end')
    arrow(785, 184, 785, 199, s['accent'])

    # ------------------------------------------------ 3 engine scoreboard
    eyebrow(40, 290, '③ ENGINE CHAIN · chainOrder() · top-down, '
                     'each engine at most once')
    box(40, 300, 1060, 468, radius=16)
    for x, label in ((96, 'ENGINE'), (200, 'MODEL · REQUEST'), (690, 'HEALTH')):
        t(x, 322, label, 11, s['faint'], '700', MONO, ls='0.9')
    t(1040, 322, 'ATTEMPT', 11, s['faint'], '700', MONO, 'end', ls='0.9')
    for y in (368, 410):
        say(f'<line x1="60" y1="{y}" x2="1040" y2="{y}" stroke="{s["grid"]}" '
            f'stroke-width="1"/>')

    t(60, 352, '#1', 11, s['faint'], '400', MONO)
    t(96, 352, 'openai', 13, s['text'], '700', MONO)
    t(200, 352, 'gpt-image-1 · POST {baseUrl}/images/generations · b64_json',
      11, s['sub'])
    say(f'<rect x="680" y="334" width="196" height="28" rx="9" '
        f'fill="none" stroke="{s["warn"]}" stroke-width="1.2" '
        f'stroke-dasharray="4 3" opacity=".85"/>')
    t(690, 352, '2 fails → cooldown', 11, s['warn'], '400', MONO)
    chip(1040, 352, '✕ http 429', 11, s['danger'], s['pill'])

    t(60, 394, '#2', 11, s['faint'], '400', MONO)
    t(96, 394, 'cogview', 13, s['text'], '700', MONO)
    t(200, 394, 'cogview-3-flash · response_format url → download', 11,
      s['sub'])
    t(690, 394, '0 fails', 11, s['sub'], '400', MONO)
    chip(1040, 394, '✓ served · 4 images', 11, s['green'], s['pill'])

    t(60, 436, '#3', 11, s['faint'], '400', MONO)
    t(96, 436, '+ any', 13, s['text'], '700', MONO)
    t(200, 436, 'OpenAI-compatible · provider openai | replicate | fal', 11,
      s['sub'])
    t(690, 436, '—', 11, s['faint'], '400', MONO)
    chip(1040, 436, 'not reached', 11, s['faint'], s['pill'])

    t(60, 458, 'failureThreshold 2 → cooldownMs 60000 · cooling or disabled '
               'engines are skipped', 11, s['faint'])
    t(1040, 458, 'apiKeyRef → env var · resolved per call, never stored',
      10.5, s['faint'], '400', MONO, 'end')

    # --------------------------------------------- 4 byte gate + commit
    eyebrow(40, 490, '④ BYTE GATE · COMMIT · RETURNS')
    arrow(330, 468, 330, 498, s['accent'])

    box(40, 500, 380, 610)
    t(60, 530, 'checkQuotaBytes()', 13.5, s['text'], '700', MONO)
    chip(360, 530, '✕ quota-bytes', 11, s['danger'], s['pill'])
    t(60, 550, 'before anything reaches the attachment store', 11.5, s['sub'])
    say(f'<rect x="60" y="562" width="200" height="6" rx="3" '
        f'fill="{s["track"]}"/>')
    say(f'<line x1="200" y1="558" x2="200" y2="572" stroke="{s["danger"]}" '
        f'stroke-width="2"/>')
    t(268, 569, 'cap 200 MiB', 11, s['faint'], '400', MONO)
    t(60, 594, 'folds draw/generated · log + ledger', 11, s['faint'])

    box(410, 500, 760, 610)
    t(430, 524, 'COMMIT · TWO CHANNELS', 11, s['accent'], '700', MONO,
      ls='1')
    t(430, 550, 'attachments.saveImage', 12.5, s['text'], '700', MONO)
    t(600, 550, 'durable refs · att-…', 11, s['sub'])
    t(430, 574, 'draw/generated', 12.5, s['text'], '700', MONO)
    t(600, 574, 'eventGate → log | ledger', 11, s['sub'])
    t(430, 596, 'log is durable · ledger is live-session only',
      10.5, s['faint'])

    box(790, 500, 1060, 610)
    t(810, 524, 'RETURNS', 11, s['accent'], '700', MONO, ls='1')
    t(810, 550, 'canonical JSON + image blocks', 11, s['sub'])
    t(810, 572, 'result card · preparing / start / result', 11, s['sub'])
    t(810, 594, 'Settings tab · status · probe · keys', 11, s['sub'])

    arrow(382, 552, 406, 552, s['accent'])
    arrow(762, 552, 786, 552, s['accent'])

    # ----------------------------------------------- regenerate return rail
    say(f'<path d="M925 610 V622 H24 V227 H38" fill="none" '
        f'stroke="{s["accent"]}" stroke-width="2" stroke-dasharray="7 5" '
        f'opacity=".62" stroke-linecap="round" marker-end="url(#a)"/>')
    say(f'<text x="15" y="430" fill="{s["faint"]}" font-family="{MONO}" '
        f'font-size="10.5" text-anchor="middle" '
        f'transform="rotate(-90 15 430)">regenerate</text>')

    # ----------------------------------------------------------- footer
    say(f'<line x1="40" y1="636" x2="1060" y2="636" stroke="{s["grid"]}"/>')
    t(40, 652, 'dashed return: the result card regenerates through the same '
               'drawer — quota, routing, storage and audit again', 11,
      s['faint'])
    t(1060, 652, 'src/drawer.ts · router.ts · quota.ts · event-gate.ts',
      10.5, s['faint'], '400', MONO, 'end')

    head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="1100" '
            f'height="660" viewBox="0 0 1100 660" role="img" aria-label="'
            f'dsh-draw structure: image_generate and draw/regenerate merge '
            f'into one drawer; normalize/validate, then the generation quota '
            f'gate, then the engine chain as a scoreboard with cooldown '
            f'health, then the byte quota gate before the attachment store; '
            f'the commit forks into durable attachment refs and a gated '
            f'draw/generated session event, and the returns feed the model '
            f'value, the result card and the Settings tab, with regenerate '
            f're-entering the same drawer on the dashed return rail">')
    title = ('<title>dsh-draw: two mouths, one drawer, two quota gates and '
             'a health-aware engine chain</title>')
    lines = [head, title] + add + ['</svg>']
    path = os.path.join(OUT, f'dsh-draw-flow-v5-{skin}.svg')
    with open(path, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\n'.join(lines) + '\n')
    print(f'dsh-draw-flow-v5-{skin}.svg')


def main():
    os.makedirs(OUT, exist_ok=True)
    for skin in ('light', 'dark'):
        for lang in ('zh', 'en'):
            hero(lang, skin)
        flow_svg(skin)


if __name__ == '__main__':
    main()
