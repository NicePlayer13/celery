"""Generates textured flat-lay food illustrations (SVG) for the alpascha concept."""
import math, random, sys, os

OUT = sys.argv[1]

def lit(fid, freq, oct_, scale, seed, az=225, el=50, k1=.72, k2=.42):
    return f'''<filter id="{fid}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="{freq}" numOctaves="{oct_}" seed="{seed}" result="n"/>
<feDiffuseLighting in="n" surfaceScale="{scale}" lighting-color="#fff" result="l"><feDistantLight azimuth="{az}" elevation="{el}"/></feDiffuseLighting>
<feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="{k1}" k2="{k2}" k3="0" k4="0" result="c"/>
<feComposite in="c" in2="SourceAlpha" operator="in"/></filter>'''

SHADOW = '<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>'
SOFT = '<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>'
VIGNETTE = '<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>'

def svg(defs, body, w=800, h=600):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{body}<rect width="{w}" height="{h}" fill="url(#vig)"/></svg>\n'

def sphere(gid, light, dark, cx=35, cy=32):
    return f'<radialGradient id="{gid}" cx="{cx}%" cy="{cy}%" r="70%"><stop offset="0" stop-color="{light}"/><stop offset="1" stop-color="{dark}"/></radialGradient>'

def spec(x, y, rx, ry, rot=0, op=.55):
    return f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" transform="rotate({rot:.0f} {x:.1f} {y:.1f})" fill="#fff" opacity="{op}"/>'

def leaf(x, y, l, rot, col="#5b7f37", vein="#3f5f24"):
    return (f'<g transform="translate({x} {y}) rotate({rot})"><path d="M0 0C{l*.3:.0f} {-l*.28:.0f} {l*.75:.0f} {-l*.22:.0f} {l} 0C{l*.75:.0f} {l*.22:.0f} {l*.3:.0f} {l*.28:.0f} 0 0Z" fill="{col}"/>'
            f'<path d="M2 0H{l*.92:.0f}" stroke="{vein}" stroke-width="1.6" opacity=".7"/></g>')

# ---------------------------------------------------------------- Hummus & Tahina
def hummus():
    random.seed(3)
    d = (lit("linen", ".9 .05", 2, 1.4, 2, k1=.55, k2=.5) + lit("paste", ".028", 4, 4.5, 8, k1=.7, k2=.42)
         + lit("tah", ".012", 3, 2, 4, k1=.55, k2=.5) + SHADOW + SOFT + VIGNETTE
         + '<radialGradient id="bowl" cx="48%" cy="44%" r="55%"><stop offset="0" stop-color="#fbf7ef"/><stop offset=".86" stop-color="#ebe2d2"/><stop offset="1" stop-color="#c9bba3"/></radialGradient>'
         + '<radialGradient id="oil" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#f4dc78"/><stop offset=".6" stop-color="#d1a52a"/><stop offset="1" stop-color="#a87c12"/></radialGradient>'
         + sphere("pea", "#f3dcaa", "#c3924f"))
    b = '<rect width="800" height="600" fill="#ddc9a8" filter="url(#linen)"/>'
    # Tahina bowl (back right)
    b += '<circle cx="668" cy="148" r="118" fill="#000" opacity=".28" filter="url(#sh)"/>'
    b += '<circle cx="660" cy="138" r="112" fill="url(#bowl)"/><circle cx="660" cy="140" r="88" fill="#d7bd8e" filter="url(#tah)"/>'
    b += '<path d="M610 120c25-30 75-30 98-6" stroke="#f3e2bf" stroke-width="9" fill="none" opacity=".7" stroke-linecap="round"/>'
    # Hummus bowl
    b += '<circle cx="372" cy="338" r="262" fill="#000" opacity=".3" filter="url(#sh)"/>'
    b += '<circle cx="360" cy="320" r="255" fill="url(#bowl)"/><circle cx="360" cy="322" r="206" fill="#c4a874" opacity=".45"/>'
    b += '<circle cx="360" cy="324" r="198" fill="#e6cf9e" filter="url(#paste)"/>'
    spiral = "M360 186A132 132 0 1 1 230 324A114 114 0 0 1 360 208A98 98 0 0 1 458 324A82 82 0 0 1 360 404A64 64 0 0 1 296 324"
    b += f'<path d="{spiral}" fill="none" stroke="#b8945a" stroke-width="30" stroke-linecap="round" opacity=".42"/>'
    b += f'<path d="{spiral}" fill="none" stroke="#f7e8c7" stroke-width="9" stroke-linecap="round" opacity=".55" transform="translate(-4 -5)"/>'
    b += '<path d="M330 282C362 256 420 268 428 304C438 352 388 372 350 362C306 350 300 304 330 282Z" fill="url(#oil)" opacity=".92"/>'
    b += spec(372, 290, 30, 9, -18, .55) + spec(395, 345, 10, 4, 20, .4)
    # chickpeas
    for (x, y) in [(352, 316), (380, 322), (366, 342), (338, 336), (396, 302)]:
        b += f'<circle cx="{x}" cy="{y}" r="15" fill="url(#pea)"/>' + spec(x - 5, y - 6, 5, 3, -30, .5)
    # paprika
    for _ in range(80):
        a, r = random.uniform(0, 6.28), random.uniform(20, 150)
        b += f'<circle cx="{360 + r * math.cos(a):.1f}" cy="{324 + r * math.sin(a) * .95:.1f}" r="{random.uniform(1.2, 3.2):.1f}" fill="#b2391b" opacity="{random.uniform(.5, .9):.2f}" filter="url(#soft)"/>'
    # parsley
    for (x, y, l, r) in [(420, 400, 34, -30), (300, 250, 28, 150), (440, 230, 26, 40), (250, 380, 30, 200), (520, 470, 46, -60), (560, 495, 40, 10)]:
        b += leaf(x, y, l, r)
    # bread wedge bottom left
    b += '<path d="M40 600L210 470C250 520 260 560 250 600Z" fill="#d9a15e" filter="url(#paste)"/>'
    return svg(d, b)

# ---------------------------------------------------------------- Olives & pickled cucumbers
def oliven():
    random.seed(5)
    d = (lit("slate", ".012", 4, 2.2, 6, k1=.6, k2=.4) + lit("cuke", ".05 .12", 3, 3.5, 2, k1=.75, k2=.35)
         + SHADOW + SOFT + VIGNETTE
         + sphere("g1", "#b2b958", "#4f5a19") + sphere("g2", "#9aa64a", "#3f4a12")
         + sphere("k1", "#6c5562", "#1c1418") + sphere("k2", "#7d5a48", "#2a1813")
         + '<radialGradient id="dish" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#e9e3d6"/><stop offset=".85" stop-color="#d7cfbf"/><stop offset="1" stop-color="#a99f8c"/></radialGradient>'
         + '<linearGradient id="cuk" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9caa52"/><stop offset=".5" stop-color="#6f7e2b"/><stop offset="1" stop-color="#4b5719"/></linearGradient>'
         + '<linearGradient id="board" x1="0" x2="1"><stop offset="0" stop-color="#a77446"/><stop offset="1" stop-color="#8a5a32"/></linearGradient>'
         + lit("wood", ".008 .18", 3, 2, 12, k1=.7, k2=.4))
    b = '<rect width="800" height="600" fill="#4a4740" filter="url(#slate)"/>'
    # wooden board with pickles (right)
    b += '<rect x="430" y="70" width="330" height="470" rx="26" fill="#000" opacity=".35" filter="url(#sh)" transform="rotate(8 595 305)"/>'
    b += '<rect x="420" y="60" width="330" height="470" rx="26" fill="url(#board)" filter="url(#wood)" transform="rotate(8 585 295)"/>'
    for i, (x, y, rot, L) in enumerate([(470, 150, 64, 230), (540, 140, 70, 250), (610, 160, 76, 220), (660, 200, 82, 200)]):
        b += (f'<g transform="translate({x} {y}) rotate({rot})"><ellipse cx="{L/2+6}" cy="8" rx="{L/2}" ry="30" fill="#000" opacity=".3" filter="url(#soft)"/>'
              f'<rect x="0" y="-28" width="{L}" height="56" rx="28" fill="url(#cuk)" filter="url(#cuke)"/>'
              f'<rect x="20" y="-20" width="{L-40}" height="8" rx="4" fill="#fff" opacity=".22"/></g>')
    # dill
    for (x, y, r) in [(500, 470, -50), (660, 460, -110)]:
        b += f'<g transform="translate({x} {y}) rotate({r})" stroke="#5c7a33" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M0 0C30 -10 60 -10 90 0"/>' + ''.join(
            f'<path d="M{t} {-.11*t*(1-t/90)*0:.0f}l{8+random.random()*6:.0f} {-12-random.random()*6:.0f}M{t} 0l{8+random.random()*6:.0f} {12+random.random()*6:.0f}"/>' for t in range(12, 86, 9)) + '</g>'
    # olive bowl (left)
    b += '<circle cx="262" cy="318" r="215" fill="#000" opacity=".4" filter="url(#sh)"/>'
    b += '<circle cx="250" cy="300" r="210" fill="url(#dish)"/><circle cx="250" cy="302" r="176" fill="#cbc2b0"/>'
    pts = []
    for ring, n in [(0, 1), (52, 7), (104, 13), (148, 17)]:
        for k in range(n):
            a = k / n * 6.283 + ring * .03
            pts.append((250 + ring * math.cos(a) + random.uniform(-6, 6), 302 + ring * math.sin(a) + random.uniform(-6, 6)))
    random.shuffle(pts)
    for (x, y) in pts:
        g = random.choice(["g1", "g2", "k1", "k2", "g1", "k1"])
        rot = random.uniform(0, 180)
        b += (f'<g transform="rotate({rot:.0f} {x:.0f} {y:.0f})"><ellipse cx="{x+3:.0f}" cy="{y+5:.0f}" rx="31" ry="23" fill="#000" opacity=".25" filter="url(#soft)"/>'
              f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="30" ry="22" fill="url(#{g})"/></g>') + spec(x - 9, y - 8, 9, 4, -25, .5)
    # loose olives
    for (x, y, g) in [(110, 560, "k1"), (395, 540, "g1"), (70, 80, "g2")]:
        b += f'<ellipse cx="{x}" cy="{y}" rx="30" ry="22" fill="url(#{g})"/>' + spec(x - 9, y - 8, 9, 4, -25, .5)
    return svg(d, b)

# ---------------------------------------------------------------- Olive oil
def olivenoel():
    random.seed(9)
    d = (lit("wall", ".01", 4, 2, 3, k1=.6, k2=.45) + lit("bread", ".018 .05", 4, 3.2, 7) + SHADOW + SOFT + VIGNETTE
         + '<linearGradient id="glass" x1="0" x2="1"><stop offset="0" stop-color="#3e4a12"/><stop offset=".22" stop-color="#8f8a1f"/><stop offset=".5" stop-color="#c4ac2e"/><stop offset=".8" stop-color="#7d7314"/><stop offset="1" stop-color="#30380c"/></linearGradient>'
         + '<radialGradient id="glow" cx="30%" cy="35%" r="75%"><stop offset="0" stop-color="#6a4426"/><stop offset="1" stop-color="#1c120b"/></radialGradient>'
         + '<radialGradient id="oil" cx="40%" cy="40%" r="60%"><stop offset="0" stop-color="#f2d860"/><stop offset=".7" stop-color="#c4a020"/><stop offset="1" stop-color="#7f6a0c"/></radialGradient>'
         + '<radialGradient id="dish" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#f4efe6"/><stop offset="1" stop-color="#bdb3a2"/></radialGradient>'
         + '<linearGradient id="tbl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6b4527"/><stop offset="1" stop-color="#3b2414"/></linearGradient>'
         + sphere("ol", "#9aa94c", "#3c4710") + sphere("olb", "#5c4a55", "#1b1317")
         + '<linearGradient id="lf" x1="0" x2="1"><stop offset="0" stop-color="#8d9b6a"/><stop offset="1" stop-color="#4f5e30"/></linearGradient>')
    b = '<rect width="800" height="600" fill="url(#glow)"/><rect width="800" height="600" fill="#3b2617" opacity=".35" filter="url(#wall)"/>'
    b += '<rect y="430" width="800" height="170" fill="url(#tbl)" filter="url(#wall)"/>'
    # bottle
    b += '<ellipse cx="330" cy="470" rx="110" ry="18" fill="#000" opacity=".55" filter="url(#sh)"/>'
    b += ('<path d="M300 70h56v22h-4v70c62 30 84 72 84 128v170a24 24 0 0 1-24 24H244a24 24 0 0 1-24-24V290c0-56 22-98 84-128V92h-4z" fill="url(#glass)"/>'
          '<rect x="296" y="46" width="64" height="34" rx="6" fill="#7a5032"/><rect x="296" y="46" width="64" height="10" rx="4" fill="#9c6c45"/>'
          '<path d="M246 300c0-40 14-70 50-94" stroke="#fff" stroke-opacity=".35" stroke-width="10" fill="none" stroke-linecap="round"/>'
          '<rect x="252" y="300" width="14" height="150" rx="7" fill="#fff" opacity=".22"/>'
          '<rect x="246" y="300" width="168" height="110" rx="8" fill="#efe4cf"/><rect x="266" y="326" width="128" height="6" rx="3" fill="#b99c6b"/>'
          '<rect x="286" y="344" width="88" height="5" rx="2.5" fill="#cdb48a"/><path d="M314 386c12-22 30-28 42-20-12 16-26 24-42 20z" fill="#6b7a3a"/>')
    # dish with oil and bread
    b += '<ellipse cx="600" cy="500" rx="150" ry="38" fill="#000" opacity=".5" filter="url(#sh)"/>'
    b += '<ellipse cx="590" cy="488" rx="150" ry="42" fill="url(#dish)"/><ellipse cx="590" cy="484" rx="118" ry="28" fill="url(#oil)"/>'
    b += spec(560, 476, 40, 6, -4, .55)
    b += '<path d="M640 470C660 420 720 400 760 420L740 486C716 492 676 490 640 470Z" fill="#d9a15e" filter="url(#bread)"/>'
    # olive branch
    b += '<path d="M500 140C560 160 620 200 700 300" stroke="#5a4a2a" stroke-width="5" fill="none"/>'
    for (x, y, r) in [(530, 150, -40), (560, 168, 30), (590, 190, -50), (620, 214, 40), (650, 240, -30), (680, 272, 60)]:
        b += f'<g transform="translate({x} {y}) rotate({r})"><path d="M0 0C20-12 60-12 82 0C60 12 20 12 0 0Z" fill="url(#lf)"/></g>'
    for (x, y, g) in [(600, 236, "ol"), (640, 262, "olb"), (568, 210, "ol")]:
        b += f'<ellipse cx="{x}" cy="{y}" rx="17" ry="23" fill="url(#{g})"/>' + spec(x - 5, y - 8, 5, 3, -20, .5)
    return svg(d, b)

# ---------------------------------------------------------------- Rice & bulgur
def reis():
    random.seed(11)
    d = (lit("wood", ".006 .16", 4, 2.4, 5, az=200, k1=.68, k2=.42)
         + lit("rice", ".18", 2, 3.5, 2, k1=.55, k2=.55) + lit("fine", ".22", 2, 3, 6, k1=.6, k2=.45) + lit("coarse", ".09", 3, 4, 9, k1=.66, k2=.4)
         + SHADOW + SOFT + VIGNETTE
         + '<radialGradient id="bowl" cx="48%" cy="44%" r="55%"><stop offset="0" stop-color="#f6f1e8"/><stop offset=".86" stop-color="#e3dacb"/><stop offset="1" stop-color="#b9ad98"/></radialGradient>'
         + '<radialGradient id="cl" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#b8875a"/><stop offset="1" stop-color="#6b4526"/></radialGradient>')
    b = '<rect width="800" height="600" fill="#6a4529" filter="url(#wood)"/>'
    bowls = [(230, 230, 170, "#f2ece0", "rice"), (560, 190, 140, "#d8b066", "fine"), (520, 450, 130, "#b98845", "coarse")]
    for (x, y, r, c, f) in bowls:
        b += f'<circle cx="{x+10}" cy="{y+16}" r="{r+6}" fill="#000" opacity=".45" filter="url(#sh)"/>'
        b += f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#bowl)"/><circle cx="{x}" cy="{y+2}" r="{r*.83:.0f}" fill="{c}" filter="url(#{f})"/>'
    # wooden scoop with rice
    b += '<g transform="rotate(-28 230 470)"><rect x="60" y="458" width="170" height="24" rx="12" fill="url(#cl)"/><ellipse cx="290" cy="470" rx="78" ry="56" fill="url(#cl)"/><ellipse cx="290" cy="468" rx="62" ry="42" fill="#d8b066" filter="url(#fine)"/></g>'
    # scattered grains
    for _ in range(70):
        x, y = random.uniform(40, 760), random.uniform(380, 590)
        if (x - 520) ** 2 + (y - 450) ** 2 < 150 ** 2: continue
        col = random.choice(["#f3ede0", "#d8b066", "#c79a55"])
        b += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{random.uniform(3, 6):.1f}" ry="{random.uniform(1.5, 2.6):.1f}" transform="rotate({random.uniform(0, 180):.0f} {x:.0f} {y:.0f})" fill="{col}"/>'
    return svg(d, b)

# ---------------------------------------------------------------- Assortment (neutral: unlabeled jars, tins, sacks)
def sortiment():
    random.seed(13)
    d = (lit("wood", ".006 .16", 4, 2.4, 15, az=200, k1=.68, k2=.42) + lit("burlap", ".35 .35", 2, 2.5, 4, k1=.7, k2=.4)
         + lit("pea", ".07", 3, 5, 3, k1=.7, k2=.42) + SHADOW + SOFT + VIGNETTE
         + '<radialGradient id="lid" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#f1e9d9"/><stop offset=".7" stop-color="#c9b99a"/><stop offset="1" stop-color="#8c7c60"/></radialGradient>'
         + '<radialGradient id="lidg" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#7fb08f"/><stop offset="1" stop-color="#22533d"/></radialGradient>'
         + '<radialGradient id="lidr" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#e38a5a"/><stop offset="1" stop-color="#8b3a1a"/></radialGradient>'
         + '<radialGradient id="lidy" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#f2cf72"/><stop offset="1" stop-color="#b7841f"/></radialGradient>'
         + '<radialGradient id="tin" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#f5f5f2"/><stop offset=".6" stop-color="#bdbdb6"/><stop offset="1" stop-color="#7d7d76"/></radialGradient>')
    b = '<rect width="800" height="600" fill="#5e3d24" filter="url(#wood)"/>'
    # burlap sack (left, top-down open)
    b += '<circle cx="190" cy="330" r="200" fill="#000" opacity=".4" filter="url(#sh)"/>'
    b += '<path d="M40 330C30 200 120 120 190 130S360 190 345 330 260 520 190 520 50 460 40 330Z" fill="#b8955f" filter="url(#burlap)"/>'
    b += '<ellipse cx="192" cy="330" rx="128" ry="120" fill="#7a5a33" opacity=".5"/><ellipse cx="192" cy="332" rx="118" ry="110" fill="#e0bf86" filter="url(#pea)"/>'
    # jars / tins grid (right)
    items = [(470, 140, 70, "lidg"), (630, 130, 78, "tin"), (720, 260, 56, "lidr"), (520, 300, 82, "lid"), (660, 400, 74, "lidy"), (470, 470, 64, "tin"), (750, 520, 50, "lid")]
    for (x, y, r, g) in items:
        b += f'<circle cx="{x+8}" cy="{y+12}" r="{r+4}" fill="#000" opacity=".45" filter="url(#sh)"/>'
        b += f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#{g})"/><circle cx="{x}" cy="{y}" r="{r*.86:.0f}" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="2"/>'
        b += spec(x - r * .35, y - r * .4, r * .3, r * .12, -35, .45)
    return svg(d, b)

# ---------------------------------------------------------------- Bakery: oven mouth with bread on a peel
def backstube():
    d = (lit("brick", ".02 .06", 4, 3, 4, k1=.7, k2=.4) + lit("bread", ".018 .05", 4, 3.2, 7) + SHADOW + SOFT + VIGNETTE
         + '<radialGradient id="fire" cx="50%" cy="70%" r="65%"><stop offset="0" stop-color="#ffd27a"/><stop offset=".35" stop-color="#f08a2c"/><stop offset=".75" stop-color="#9a3412"/><stop offset="1" stop-color="#2a0f06"/></radialGradient>'
         + '<radialGradient id="g" cx="44%" cy="38%" r="64%"><stop offset="0" stop-color="#f3d39c"/><stop offset=".5" stop-color="#e2ac67"/><stop offset=".84" stop-color="#c88743"/><stop offset="1" stop-color="#9f612b"/></radialGradient>'
         + '<linearGradient id="peel" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b98a58"/><stop offset="1" stop-color="#7a5230"/></linearGradient>'
         + '<radialGradient id="spill" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>')
    b = '<rect width="800" height="600" fill="#7b4a33" filter="url(#brick)"/>'
    # mortar lines
    for row in range(0, 600, 46):
        off = 0 if (row // 46) % 2 else 60
        b += f'<path d="M0 {row}H800" stroke="#3a2418" stroke-width="5" opacity=".55"/>'
        for x in range(-off, 800, 120):
            b += f'<path d="M{x} {row}v46" stroke="#3a2418" stroke-width="5" opacity=".55"/>'
    b += '<path d="M150 470V250A250 200 0 0 1 650 250V470Z" fill="#1a0c06"/><path d="M180 470V262A220 175 0 0 1 620 262V470Z" fill="url(#fire)"/>'
    b += '<path d="M150 250A250 200 0 0 1 650 250" fill="none" stroke="#5a3322" stroke-width="22"/>'
    b += '<rect y="470" width="800" height="130" fill="#2a1a10"/><rect y="470" width="800" height="130" fill="url(#spill)"/>'
    b += '<rect x="390" y="500" width="400" height="26" rx="10" fill="url(#peel)" transform="rotate(-4 590 513)"/>'
    b += '<ellipse cx="400" cy="456" rx="190" ry="44" fill="url(#peel)"/>'
    b += '<ellipse cx="400" cy="440" rx="166" ry="40" fill="url(#g)" filter="url(#bread)"/>'
    b += '<ellipse cx="400" cy="440" rx="166" ry="40" fill="url(#spill)" opacity=".6"/>'
    return svg(d, b)

for name, fn in [("hummus", hummus), ("oliven", oliven), ("olivenoel", olivenoel), ("reis-bulgur", reis), ("sortiment", sortiment), ("backstube", backstube)]:
    open(os.path.join(OUT, name + ".svg"), "w").write(fn())
print("ok")
