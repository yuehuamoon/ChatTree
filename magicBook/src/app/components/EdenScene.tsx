import { motion } from 'motion/react';

// 宽屏 viewBox，便于做远景层次
const VBW = 1600;
const VBH = 1000;

export function EdenScene() {
  // —— 确定性伪随机生成器 ——
  const seeded = (i: number, mod: number, off = 0) => off + ((i * 9301 + 49297) % 233280) % mod;

  // 散落叶子（树冠间漂动）
  const leafColors = ['#7FB069', '#9BCB7A', '#A8D58A', '#6FA85A', '#BFD98F', '#E8C76A'];
  const driftingLeaves = Array.from({ length: 80 }, (_, i) => ({
    cx: 50 + seeded(i, 1500, 30),
    cy: 100 + seeded(i * 3 + 1, 700, 50),
    rotation: seeded(i, 360),
    scale: 0.4 + (seeded(i, 70) / 100),
    color: leafColors[i % leafColors.length],
    opacity: 0.6 + seeded(i, 35) / 100,
    delay: (i % 8) * 0.3,
    duration: 4 + (i % 6),
  }));

  // 萤火光点
  const fireflies = Array.from({ length: 36 }, (_, i) => ({
    cx: 60 + seeded(i * 7, 1480),
    cy: 80 + seeded(i * 11 + 3, 800),
    r: 1.5 + seeded(i, 30) / 10,
    delay: (i % 8) * 0.4,
    duration: 2.5 + (i % 5),
  }));

  // 草地草叶
  const grasses = Array.from({ length: 140 }, (_, i) => {
    const x = 10 + i * 11 + seeded(i, 8);
    const h = 10 + seeded(i, 25);
    const tilt = seeded(i, 6) - 3;
    return { x, h, tilt };
  });

  // 前景花朵：色彩斑斓的伊甸园花圃
  const flowerColors = [
    ['#F8C8D8', '#F49AB5'], // 粉
    ['#F5B7B1', '#E89A8E'], // 桃
    ['#FBD876', '#F3B842'], // 金
    ['#D6A2E8', '#B57FCC'], // 紫
    ['#F9E79F', '#F2CB52'], // 黄
    ['#FADBD8', '#F1948A'], // 玫
    ['#E8DAEF', '#C39BD3'], // 淡紫
    ['#FCF3CF', '#F7DC6F'], // 奶油
  ];
  const flowers = Array.from({ length: 55 }, (_, i) => {
    const x = 40 + (i * 28) + seeded(i, 18);
    const y = 880 + seeded(i * 5, 100);
    const c = flowerColors[i % flowerColors.length];
    return { x, y, color: c[0], deep: c[1], scale: 0.55 + seeded(i, 60) / 100 };
  });

  // 蝴蝶
  const butterflies = [
    { x: 280, y: 460, color: '#F49AB5', delay: 0 },
    { x: 1180, y: 520, color: '#F3B842', delay: 1.2 },
    { x: 900, y: 380, color: '#B57FCC', delay: 0.6 },
    { x: 1320, y: 700, color: '#F49AB5', delay: 2 },
  ];

  // 飞鸟（远空）
  const birds = [
    { x: 1100, y: 180, scale: 1, delay: 0 },
    { x: 1180, y: 210, scale: 0.8, delay: 0.3 },
    { x: 1240, y: 195, scale: 0.7, delay: 0.6 },
    { x: 280, y: 240, scale: 0.6, delay: 0.4 },
  ];

  // 中央生命之树枝桠
  const branches = [
    'M 800 600 C 720 540, 600 480, 480 450',
    'M 800 600 C 880 540, 1000 480, 1120 450',
    'M 800 550 C 740 480, 660 420, 580 370',
    'M 800 550 C 860 480, 940 420, 1020 370',
    'M 800 500 C 780 420, 760 340, 770 270',
    'M 800 500 C 820 420, 840 340, 830 270',
    'M 800 650 C 730 660, 640 660, 560 650',
    'M 800 650 C 870 660, 960 660, 1040 650',
  ];

  const subBranches = [
    'M 480 450 C 430 430, 380 420, 340 425',
    'M 1120 450 C 1170 430, 1220 420, 1260 425',
    'M 580 370 C 540 340, 510 310, 490 285',
    'M 1020 370 C 1060 340, 1090 310, 1110 285',
    'M 560 650 C 510 640, 470 632, 440 635',
    'M 1040 650 C 1090 640, 1130 632, 1160 635',
    'M 770 270 C 745 240, 725 215, 715 195',
    'M 830 270 C 855 240, 875 215, 885 195',
  ];

  // 生命之树叶簇位置
  const canopyBlobs = [
    // 背景暗层
    { cx: 800, cy: 280, rx: 240, ry: 160, c: '#4F7A38', layer: 'back' },
    { cx: 620, cy: 340, rx: 180, ry: 140, c: '#557F3D', layer: 'back' },
    { cx: 980, cy: 340, rx: 180, ry: 140, c: '#557F3D', layer: 'back' },
    { cx: 480, cy: 430, rx: 130, ry: 100, c: '#557F3D', layer: 'back' },
    { cx: 1120, cy: 430, rx: 130, ry: 100, c: '#557F3D', layer: 'back' },
    { cx: 540, cy: 640, rx: 120, ry: 90, c: '#4F7A38', layer: 'back' },
    { cx: 1060, cy: 640, rx: 120, ry: 90, c: '#4F7A38', layer: 'back' },

    // 主色层
    { cx: 800, cy: 270, rx: 220, ry: 145, c: '#7FB069', layer: 'mid' },
    { cx: 630, cy: 330, rx: 160, ry: 125, c: '#86B96B', layer: 'mid' },
    { cx: 970, cy: 330, rx: 160, ry: 125, c: '#86B96B', layer: 'mid' },
    { cx: 490, cy: 425, rx: 115, ry: 88, c: '#86B96B', layer: 'mid' },
    { cx: 1110, cy: 425, rx: 115, ry: 88, c: '#86B96B', layer: 'mid' },
    { cx: 555, cy: 635, rx: 110, ry: 80, c: '#7FB069', layer: 'mid' },
    { cx: 1045, cy: 635, rx: 110, ry: 80, c: '#7FB069', layer: 'mid' },
    { cx: 720, cy: 420, rx: 90, ry: 70, c: '#9BCB7A', layer: 'mid' },
    { cx: 880, cy: 420, rx: 90, ry: 70, c: '#9BCB7A', layer: 'mid' },

    // 高光层
    { cx: 770, cy: 230, rx: 130, ry: 70, c: '#D4EAA8', layer: 'light' },
    { cx: 600, cy: 295, rx: 95, ry: 55, c: '#D4EAA8', layer: 'light' },
    { cx: 950, cy: 295, rx: 95, ry: 55, c: '#D4EAA8', layer: 'light' },
    { cx: 460, cy: 405, rx: 70, ry: 42, c: '#C7E29A', layer: 'light' },
    { cx: 1090, cy: 405, rx: 70, ry: 42, c: '#C7E29A', layer: 'light' },
    { cx: 520, cy: 610, rx: 65, ry: 38, c: '#C7E29A', layer: 'light' },
    { cx: 1040, cy: 610, rx: 65, ry: 38, c: '#C7E29A', layer: 'light' },
  ];

  // 树上挂的果实（金苹果）
  const fruits = [
    { cx: 510, cy: 460, color: '#F25C54' },
    { cx: 1100, cy: 460, color: '#F25C54' },
    { cx: 660, cy: 380, color: '#F8B042' },
    { cx: 940, cy: 380, color: '#F8B042' },
    { cx: 760, cy: 320, color: '#F25C54' },
    { cx: 840, cy: 320, color: '#F8B042' },
    { cx: 590, cy: 470, color: '#F8B042' },
    { cx: 1020, cy: 470, color: '#F25C54' },
    { cx: 720, cy: 480, color: '#E63946' },
    { cx: 880, cy: 480, color: '#E63946' },
    { cx: 550, cy: 650, color: '#F8B042' },
    { cx: 1050, cy: 650, color: '#F25C54' },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FCEFD7]">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* 天空 */}
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8D6B0" />
            <stop offset="25%" stopColor="#FBE6C2" />
            <stop offset="55%" stopColor="#F7EBC8" />
            <stop offset="100%" stopColor="#E8F0CC" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7DC" stopOpacity="1" />
            <stop offset="40%" stopColor="#FCD980" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F8B042" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEA" />
            <stop offset="80%" stopColor="#FCD980" />
            <stop offset="100%" stopColor="#F4B860" />
          </radialGradient>

          {/* 山 */}
          <linearGradient id="mountFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A89DC4" />
            <stop offset="100%" stopColor="#C7BFD9" />
          </linearGradient>
          <linearGradient id="mountMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8AA8B5" />
            <stop offset="100%" stopColor="#B6C9C8" />
          </linearGradient>
          <linearGradient id="hillFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7FA96D" />
            <stop offset="100%" stopColor="#A4C58C" />
          </linearGradient>
          <linearGradient id="hillNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6FA15A" />
            <stop offset="100%" stopColor="#86B96B" />
          </linearGradient>

          {/* 水 */}
          <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CC8D8" />
            <stop offset="50%" stopColor="#B8DCE8" />
            <stop offset="100%" stopColor="#7AB0C0" />
          </linearGradient>

          {/* 树干 */}
          <linearGradient id="trunkV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A88056" />
            <stop offset="100%" stopColor="#4F3018" />
          </linearGradient>
          <linearGradient id="trunkH" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5A3A22" />
            <stop offset="50%" stopColor="#C9A07A" />
            <stop offset="100%" stopColor="#5A3A22" />
          </linearGradient>
          <linearGradient id="branchG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7A5430" />
            <stop offset="100%" stopColor="#A88056" />
          </linearGradient>

          {/* 草地 */}
          <linearGradient id="meadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9BCB7A" />
            <stop offset="60%" stopColor="#6FA15A" />
            <stop offset="100%" stopColor="#4F7A38" />
          </linearGradient>
          <linearGradient id="grassBlade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C7E29A" />
            <stop offset="100%" stopColor="#5E8A45" />
          </linearGradient>

          <radialGradient id="canopyGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF4C7" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#D4EAA8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#A8D58A" stopOpacity="0" />
          </radialGradient>

          {/* 滤镜 */}
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="3" dy="10" stdDeviation="12" floodOpacity="0.25" />
          </filter>
          <filter id="watercolor" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="6" />
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
          <filter id="watercolorSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="14" />
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          <filter id="bgBlur"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="farBlur"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="glow"><feGaussianBlur stdDeviation="3" /></filter>

          {/* 叶子 */}
          <symbol id="leaf" overflow="visible">
            <path d="M 0 4 C -8 0, -10 -10, 0 -20 C 10 -10, 8 0, 0 4 Z" fill="currentColor" />
            <path d="M 0 3 L 0 -19" stroke="rgba(60,40,20,0.25)" strokeWidth="0.8" fill="none" />
          </symbol>

          {/* 花朵 - 五瓣 */}
          <symbol id="flower" overflow="visible">
            {[0, 72, 144, 216, 288].map((rot, i) => (
              <ellipse key={i} cx="0" cy="-5" rx="4" ry="6" fill="currentColor" transform={`rotate(${rot})`} />
            ))}
            <circle r="2" fill="#FBD876" />
          </symbol>

          {/* 远景小树剪影 */}
          <symbol id="distTree" overflow="visible">
            <ellipse cx="0" cy="-50" rx="35" ry="55" fill="currentColor" />
            <ellipse cx="-20" cy="-65" rx="25" ry="35" fill="currentColor" />
            <ellipse cx="20" cy="-65" rx="25" ry="35" fill="currentColor" />
            <rect x="-4" y="-18" width="8" height="22" fill="#7A6044" />
          </symbol>

          {/* 蝴蝶 */}
          <symbol id="butterfly" overflow="visible">
            <g>
              <ellipse cx="-6" cy="-4" rx="7" ry="9" fill="currentColor" opacity="0.9" />
              <ellipse cx="-5" cy="4" rx="5" ry="6" fill="currentColor" opacity="0.85" />
              <ellipse cx="6" cy="-4" rx="7" ry="9" fill="currentColor" opacity="0.9" />
              <ellipse cx="5" cy="4" rx="5" ry="6" fill="currentColor" opacity="0.85" />
              <ellipse cx="0" cy="0" rx="1.5" ry="9" fill="#3A2410" />
            </g>
          </symbol>

          {/* 飞鸟 (M 形剪影) */}
          <symbol id="bird" overflow="visible">
            <path
              d="M -12 0 Q -8 -6, -4 -2 Q 0 4, 4 -2 Q 8 -6, 12 0"
              stroke="#5A4A38"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </symbol>

          {/* 纸张颗粒 */}
          <pattern id="paperGrain" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
            <rect width="240" height="240" fill="white" />
            <filter id="grainF">
              <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="1" seed="4" />
              <feColorMatrix values="0 0 0 0 0.78  0 0 0 0 0.68  0 0 0 0 0.48  0 0 0 0.1 0" />
            </filter>
            <rect width="240" height="240" filter="url(#grainF)" />
          </pattern>
        </defs>

        {/* ========== 天空 ========== */}
        <rect width={VBW} height={VBH} fill="url(#sky)" />

        {/* 太阳光晕 + 本体 */}
        <circle cx="1280" cy="220" r="280" fill="url(#sun)" opacity="0.9" />
        <motion.circle
          cx="1280"
          cy="220"
          r="80"
          fill="url(#sunCore)"
          animate={{ opacity: [0.95, 1, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 阳光斜射光束 */}
        <g opacity="0.22">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.path
              key={`beam-${i}`}
              d={`M ${1280 + (i - 2) * 60} 220 L ${1280 + (i - 2) * 200 + 100} 1000 L ${1280 + (i - 2) * 200 - 100} 1000 Z`}
              fill="#FFF4C7"
              animate={{ opacity: [0.12, 0.28, 0.12] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          ))}
        </g>

        {/* 几朵柔云 */}
        <g opacity="0.55" filter="url(#bgBlur)">
          <ellipse cx="220" cy="160" rx="120" ry="22" fill="#FFFFFF" />
          <ellipse cx="260" cy="180" rx="90" ry="18" fill="#FFFFFF" opacity="0.8" />
          <ellipse cx="700" cy="130" rx="160" ry="26" fill="#FFFFFF" />
          <ellipse cx="730" cy="148" rx="110" ry="20" fill="#FFFFFF" opacity="0.8" />
          <ellipse cx="1060" cy="100" rx="140" ry="22" fill="#FFFFFF" opacity="0.85" />
        </g>

        {/* ========== 远山 ========== */}
        <g filter="url(#farBlur)" opacity="0.85">
          <path
            d="M 0 480 L 120 380 L 220 430 L 340 320 L 460 410 L 580 360 L 720 420 L 860 340 L 980 400 L 1120 350 L 1260 410 L 1400 360 L 1520 420 L 1600 390 L 1600 600 L 0 600 Z"
            fill="url(#mountFar)"
          />
        </g>
        <g filter="url(#bgBlur)" opacity="0.9">
          <path
            d="M 0 540 L 100 470 L 200 510 L 340 440 L 460 500 L 580 460 L 720 510 L 860 450 L 980 500 L 1120 460 L 1260 510 L 1400 460 L 1540 500 L 1600 480 L 1600 650 L 0 650 Z"
            fill="url(#mountMid)"
          />
        </g>

        {/* 远山雾气 */}
        <rect y="480" width={VBW} height="180" fill="white" opacity="0.25" />

        {/* ========== 远丘陵 ========== */}
        <path
          d="M 0 660 C 180 600, 360 640, 540 620 C 720 600, 900 660, 1080 640 C 1260 620, 1440 680, 1600 650 L 1600 760 L 0 760 Z"
          fill="url(#hillFar)"
          opacity="0.95"
        />

        {/* 远景小树丛 */}
        <g filter="url(#bgBlur)">
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 40 + i * 90 + seeded(i, 30);
            const y = 660 + seeded(i * 3, 25);
            const s = 0.35 + seeded(i, 30) / 100;
            const colors = ['#7FA96D', '#6FA15A', '#86B96B', '#A4C58C'];
            return (
              <g key={`dt-${i}`} style={{ color: colors[i % colors.length] }} transform={`translate(${x} ${y}) scale(${s})`}>
                <use href="#distTree" />
              </g>
            );
          })}
        </g>

        {/* ========== 中景河流 ========== */}
        <g filter="url(#watercolor)">
          <path
            d="M 0 770 C 200 740, 380 800, 540 790 C 700 780, 820 820, 900 870 C 980 920, 1100 960, 1300 970 L 1600 980 L 1600 1000 L 0 1000 Z"
            fill="url(#water)"
            opacity="0.95"
          />
        </g>
        {/* 水波反光 */}
        <g opacity="0.7">
          {[780, 820, 860, 900, 940].map((y, i) => (
            <motion.path
              key={`wave-${i}`}
              d={`M ${100 + i * 30} ${y} Q ${200 + i * 30} ${y - 4}, ${300 + i * 30} ${y}`}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
          ))}
          {[800, 870, 940].map((y, i) => (
            <path
              key={`refl-${i}`}
              d={`M ${1000 + i * 60} ${y} Q ${1100 + i * 60} ${y - 3}, ${1200 + i * 60} ${y}`}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              fill="none"
              opacity="0.55"
            />
          ))}
        </g>

        {/* ========== 近景草地 ========== */}
        <path
          d="M 0 720 C 200 700, 400 740, 600 720 C 800 700, 1000 750, 1200 730 C 1400 710, 1500 740, 1600 720 L 1600 1000 L 0 1000 Z"
          fill="url(#meadow)"
        />

        {/* 草地阴影斑 */}
        <ellipse cx="800" cy="970" rx="320" ry="35" fill="#3A5A28" opacity="0.35" />

        {/* ========== 左侧附属树（果树） ========== */}
        <g filter="url(#watercolor)">
          {/* 树干 */}
          <path
            d="M 240 880 C 235 800, 232 720, 238 660 L 252 660 C 258 720, 255 800, 260 880 Z"
            fill="url(#trunkV)"
          />
          {/* 枝 */}
          <g stroke="url(#branchG)" strokeLinecap="round" fill="none">
            <path d="M 245 700 C 220 670, 190 650, 160 645" strokeWidth="8" />
            <path d="M 248 680 C 280 650, 310 640, 340 640" strokeWidth="8" />
            <path d="M 250 720 C 230 705, 200 700, 180 705" strokeWidth="6" />
          </g>
        </g>
        {/* 果树叶簇 */}
        <g filter="url(#watercolorSoft)">
          <ellipse cx="250" cy="620" rx="120" ry="80" fill="#557F3D" opacity="0.7" />
          <ellipse cx="220" cy="610" rx="90" ry="65" fill="#7FB069" opacity="0.8" />
          <ellipse cx="280" cy="615" rx="90" ry="65" fill="#86B96B" opacity="0.8" />
          <ellipse cx="240" cy="595" rx="60" ry="40" fill="#C7E29A" opacity="0.7" />
        </g>
        {/* 果树上的果实 */}
        {[
          { cx: 180, cy: 650, c: '#F25C54' },
          { cx: 300, cy: 645, c: '#F8B042' },
          { cx: 220, cy: 670, c: '#E63946' },
          { cx: 280, cy: 670, c: '#F25C54' },
          { cx: 250, cy: 685, c: '#F8B042' },
        ].map((f, i) => (
          <g key={`fr-l-${i}`}>
            <ellipse cx={f.cx} cy={f.cy} rx="10" ry="11" fill={f.c} />
            <ellipse cx={f.cx - 3} cy={f.cy - 4} rx="3" ry="3.5" fill="#FFFFFF" opacity="0.55" />
          </g>
        ))}

        {/* ========== 右侧附属树（柳/松） ========== */}
        <g filter="url(#watercolor)">
          <path
            d="M 1380 900 C 1374 820, 1370 720, 1376 640 L 1390 640 C 1396 720, 1392 820, 1398 900 Z"
            fill="url(#trunkV)"
          />
          <g stroke="url(#branchG)" strokeLinecap="round" fill="none">
            <path d="M 1383 680 C 1410 650, 1440 635, 1470 630" strokeWidth="8" />
            <path d="M 1385 660 C 1355 635, 1325 625, 1300 625" strokeWidth="8" />
            <path d="M 1387 710 C 1410 695, 1440 690, 1460 695" strokeWidth="6" />
          </g>
        </g>
        <g filter="url(#watercolorSoft)">
          <ellipse cx="1380" cy="600" rx="130" ry="90" fill="#4F7A38" opacity="0.75" />
          <ellipse cx="1340" cy="590" rx="95" ry="70" fill="#7FB069" opacity="0.8" />
          <ellipse cx="1420" cy="590" rx="95" ry="70" fill="#86B96B" opacity="0.8" />
          <ellipse cx="1380" cy="570" rx="65" ry="45" fill="#C7E29A" opacity="0.7" />
        </g>
        {/* 悬挂藤 */}
        <g opacity="0.7">
          {[1300, 1340, 1420, 1460].map((x, i) => (
            <motion.g
              key={`vine-${i}`}
              style={{ transformOrigin: `${x}px 640px` }}
              animate={{ rotate: [-2.5, 2.5, -2.5] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              <path d={`M ${x} 640 Q ${x - 4} ${680 + i * 5}, ${x - 2} ${720 + i * 6}`} stroke="#7A9A55" strokeWidth="1.5" fill="none" />
              {[0.35, 0.6, 0.85].map((t, j) => (
                <g
                  key={j}
                  style={{ color: '#86B96B' }}
                  transform={`translate(${x - 3} ${640 + (80 + i * 6) * t}) scale(0.45) rotate(${j * 40 - 20})`}
                >
                  <use href="#leaf" opacity="0.85" />
                </g>
              ))}
            </motion.g>
          ))}
        </g>

        {/* ========== 中央生命之树 ========== */}
        {/* 阴影 */}
        <ellipse cx="800" cy="920" rx="260" ry="25" fill="#000" opacity="0.18" />

        {/* 树根 */}
        <g filter="url(#watercolor)">
          <path d="M 800 905 C 760 875, 700 855, 620 858 C 560 862, 510 880, 470 905" stroke="#4F3018" strokeWidth="20" fill="none" strokeLinecap="round" />
          <path d="M 800 905 C 840 875, 900 855, 980 858 C 1040 862, 1090 880, 1130 905" stroke="#4F3018" strokeWidth="20" fill="none" strokeLinecap="round" />
          <path d="M 800 910 C 790 880, 782 858, 778 838" stroke="#4F3018" strokeWidth="13" fill="none" strokeLinecap="round" />
          <path d="M 800 912 C 812 882, 820 860, 824 840" stroke="#4F3018" strokeWidth="12" fill="none" strokeLinecap="round" />
        </g>

        {/* 树干 */}
        <g filter="url(#softShadow)">
          <path
            d="
              M 740 910
              C 745 850, 750 790, 758 720
              C 762 670, 758 620, 768 570
              L 832 570
              C 842 620, 838 670, 842 720
              C 850 790, 855 850, 860 910
              Z
            "
            fill="url(#trunkV)"
          />
          <path
            d="M 770 900 C 778 800, 786 700, 790 590 L 810 590 C 814 700, 822 800, 830 900 Z"
            fill="url(#trunkH)"
            opacity="0.6"
          />
        </g>

        {/* 树皮纹理 */}
        <g opacity="0.4" stroke="#2E1A08" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M 760 880 C 764 800, 766 720, 770 640" />
          <path d="M 840 880 C 836 800, 834 720, 830 640" />
          <path d="M 790 870 C 792 780, 794 690, 796 600" />
          <path d="M 810 870 C 808 780, 806 690, 804 600" />
          <path d="M 778 820 Q 800 816, 822 820" />
          <path d="M 776 720 Q 800 716, 824 720" />
          <path d="M 778 630 Q 800 626, 822 630" />
        </g>
        {/* 树洞瘤节 */}
        <g>
          <ellipse cx="775" cy="760" rx="9" ry="13" fill="#2E1A08" opacity="0.7" />
          <ellipse cx="775" cy="759" rx="5" ry="7" fill="#8A6244" opacity="0.55" />
          <ellipse cx="822" cy="680" rx="7" ry="10" fill="#2E1A08" opacity="0.65" />
        </g>

        {/* 主枝桠 - 三层 stroke */}
        <g filter="url(#watercolor)">
          {branches.map((d, i) => (
            <g key={`b-${i}`}>
              <path d={d} stroke="#3A2410" strokeWidth="18" fill="none" strokeLinecap="round" transform="translate(2,3)" opacity="0.55" />
              <path d={d} stroke="url(#branchG)" strokeWidth="17" fill="none" strokeLinecap="round" />
              <path d={d} stroke="#7A5430" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.6" />
              <path d={d} stroke="#E0BE94" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.75" transform="translate(0,-1.5)" />
            </g>
          ))}
          {subBranches.map((d, i) => (
            <g key={`sb-${i}`}>
              <path d={d} stroke="#3A2410" strokeWidth="6" fill="none" strokeLinecap="round" transform="translate(1.5,2)" opacity="0.5" />
              <path d={d} stroke="url(#branchG)" strokeWidth="5.5" fill="none" strokeLinecap="round" />
              <path d={d} stroke="#D4B58A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" transform="translate(0,-1)" />
            </g>
          ))}
        </g>

        {/* 树冠 - 背景层 */}
        <g filter="url(#watercolorSoft)" opacity="0.9">
          {canopyBlobs.filter(b => b.layer === 'back').map((b, i) => (
            <ellipse key={`bk-${i}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.c} opacity="0.75" />
          ))}
        </g>
        {/* 中层 */}
        <g filter="url(#watercolorSoft)">
          {canopyBlobs.filter(b => b.layer === 'mid').map((b, i) => (
            <ellipse key={`md-${i}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.c} opacity="0.78" />
          ))}
        </g>
        {/* 高光层 */}
        <g filter="url(#watercolorSoft)">
          {canopyBlobs.filter(b => b.layer === 'light').map((b, i) => (
            <ellipse key={`lg-${i}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.c} opacity="0.55" />
          ))}
        </g>

        {/* 果实 */}
        {fruits.map((f, i) => (
          <motion.g
            key={`fruit-${i}`}
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          >
            <ellipse cx={f.cx} cy={f.cy + 4} rx="4" ry="2" fill="#000" opacity="0.2" />
            <ellipse cx={f.cx} cy={f.cy} rx="12" ry="14" fill={f.color} />
            <ellipse cx={f.cx - 4} cy={f.cy - 5} rx="3.5" ry="4" fill="#FFFFFF" opacity="0.55" />
            <path d={`M ${f.cx} ${f.cy - 13} L ${f.cx} ${f.cy - 18}`} stroke="#5A3A22" strokeWidth="1.5" />
            <path d={`M ${f.cx} ${f.cy - 18} Q ${f.cx + 5} ${f.cy - 22}, ${f.cx + 10} ${f.cy - 18}`} stroke="#5E8A45" strokeWidth="2.5" fill="#7FB069" />
          </motion.g>
        ))}

        {/* 漂浮叶子 */}
        {driftingLeaves.map((leaf, i) => (
          <motion.g
            key={`dl-${i}`}
            style={{ color: leaf.color }}
            initial={{ rotate: leaf.rotation }}
            animate={{ rotate: [leaf.rotation - 14, leaf.rotation + 14, leaf.rotation - 14] }}
            transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'easeInOut' }}
            transform={`translate(${leaf.cx} ${leaf.cy}) scale(${leaf.scale})`}
          >
            <use href="#leaf" opacity={leaf.opacity} />
          </motion.g>
        ))}

        {/* 树冠柔光 */}
        <ellipse cx="800" cy="380" rx="600" ry="380" fill="url(#canopyGlow)" pointerEvents="none" />

        {/* ========== 草地草叶 ========== */}
        <g>
          {grasses.map((g, i) => (
            <path
              key={`gr-${i}`}
              d={`M ${g.x} 1000 Q ${g.x + g.tilt} ${1000 - g.h / 2}, ${g.x + g.tilt * 2} ${1000 - g.h}`}
              stroke="url(#grassBlade)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}
        </g>

        {/* ========== 花朵地毯 ========== */}
        {flowers.map((f, i) => (
          <motion.g
            key={`fl-${i}`}
            style={{ color: f.color }}
            transform={`translate(${f.x} ${f.y}) scale(${f.scale})`}
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: (i % 6) * 0.2 }}
          >
            <path d="M 0 0 L 0 14" stroke="#5E8A45" strokeWidth="1.5" />
            <use href="#flower" />
          </motion.g>
        ))}

        {/* ========== 蝴蝶 ========== */}
        {butterflies.map((b, i) => (
          <motion.g
            key={`bf-${i}`}
            style={{ color: b.color }}
            animate={{
              x: [b.x, b.x + 60, b.x - 40, b.x + 30, b.x],
              y: [b.y, b.y - 30, b.y + 20, b.y - 15, b.y],
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
          >
            <motion.g
              animate={{ scaleX: [1, 0.7, 1] }}
              transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <use href="#butterfly" />
            </motion.g>
          </motion.g>
        ))}

        {/* ========== 飞鸟 ========== */}
        {birds.map((bd, i) => (
          <motion.g
            key={`bd-${i}`}
            transform={`scale(${bd.scale})`}
            animate={{ x: [bd.x, bd.x + 200], y: [bd.y, bd.y - 20] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: bd.delay }}
          >
            <use href="#bird" />
          </motion.g>
        ))}

        {/* ========== 萤火虫 ========== */}
        {fireflies.map((s, i) => (
          <motion.circle
            key={`ff-${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#FFF4C7"
            filter="url(#glow)"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* 纸张颗粒 */}
        <rect width={VBW} height={VBH} fill="url(#paperGrain)" opacity="0.07" pointerEvents="none" />

        {/* 整体暖色光晕 */}
        <rect width={VBW} height={VBH} fill="#F8B042" opacity="0.04" pointerEvents="none" />
      </svg>

      {/* 顶部标题（可去掉） */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <p className="text-stone-700/80 tracking-[0.4em] text-sm md:text-base font-serif">EDEN</p>
        <p className="text-stone-600/60 mt-1 text-xs tracking-widest">伊甸园 · 一棵树的故事</p>
      </div>
    </div>
  );
}
