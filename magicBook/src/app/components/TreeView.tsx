import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Post } from '../App';

interface TreeViewProps {
  posts: Post[];
  userProfile: { name: string; avatar: string };
  onPostClick: (post: Post) => void;
  onCreatePost: () => void;
}

const VB = 1000;

// 锚点：每个都是一根具体枝桠的末端
const USER_ANCHOR = { x: 500, y: 100 };
const POST_ANCHORS: { x: number; y: number }[] = [
  { x: 195, y: 235 },
  { x: 805, y: 235 },
  { x: 95, y: 420 },
  { x: 905, y: 420 },
  { x: 240, y: 605 },
  { x: 760, y: 605 },
  { x: 500, y: 735 },
];

// 一根枝桠：起点/控制点/终点 + 起末粗细，用于"三层 stroke"模拟立体
interface Branch {
  d: string;
  w1: number; // 起点粗
  w2: number; // 末端粗（视觉上靠主色多层叠加）
}

// 树冠叶簇 - 多层、有前后景
const LEAF_BLOBS = [
  // 背景层（暗）
  { cx: 200, cy: 220, rx: 130, ry: 95, color: '#5E8A45', layer: 'back' },
  { cx: 800, cy: 220, rx: 130, ry: 95, color: '#5E8A45', layer: 'back' },
  { cx: 100, cy: 410, rx: 115, ry: 85, color: '#5E8A45', layer: 'back' },
  { cx: 900, cy: 410, rx: 115, ry: 85, color: '#5E8A45', layer: 'back' },
  { cx: 245, cy: 590, rx: 120, ry: 85, color: '#557F3D', layer: 'back' },
  { cx: 755, cy: 590, rx: 120, ry: 85, color: '#557F3D', layer: 'back' },
  { cx: 500, cy: 720, rx: 120, ry: 85, color: '#6FA15A', layer: 'back' },
  { cx: 500, cy: 195, rx: 105, ry: 70, color: '#6FA15A', layer: 'back' },
  { cx: 360, cy: 320, rx: 70, ry: 50, color: '#5E8A45', layer: 'back' },
  { cx: 640, cy: 320, rx: 70, ry: 50, color: '#5E8A45', layer: 'back' },

  // 中层（主色）
  { cx: 195, cy: 230, rx: 105, ry: 78, color: '#86B96B', layer: 'mid' },
  { cx: 805, cy: 230, rx: 105, ry: 78, color: '#86B96B', layer: 'mid' },
  { cx: 95, cy: 420, rx: 95, ry: 72, color: '#9BCB7A', layer: 'mid' },
  { cx: 905, cy: 420, rx: 95, ry: 72, color: '#9BCB7A', layer: 'mid' },
  { cx: 240, cy: 600, rx: 100, ry: 72, color: '#7FB55E', layer: 'mid' },
  { cx: 760, cy: 600, rx: 100, ry: 72, color: '#7FB55E', layer: 'mid' },
  { cx: 500, cy: 728, rx: 100, ry: 72, color: '#A8D58A', layer: 'mid' },
  { cx: 500, cy: 200, rx: 88, ry: 60, color: '#A8D58A', layer: 'mid' },
  { cx: 360, cy: 318, rx: 60, ry: 44, color: '#9BCB7A', layer: 'mid' },
  { cx: 640, cy: 318, rx: 60, ry: 44, color: '#9BCB7A', layer: 'mid' },
  { cx: 410, cy: 470, rx: 50, ry: 38, color: '#86B96B', layer: 'mid' },
  { cx: 590, cy: 470, rx: 50, ry: 38, color: '#86B96B', layer: 'mid' },

  // 高光层（亮）
  { cx: 175, cy: 215, rx: 60, ry: 40, color: '#D4EAA8', layer: 'light' },
  { cx: 785, cy: 215, rx: 60, ry: 40, color: '#D4EAA8', layer: 'light' },
  { cx: 75, cy: 405, rx: 50, ry: 38, color: '#D4EAA8', layer: 'light' },
  { cx: 885, cy: 405, rx: 50, ry: 38, color: '#D4EAA8', layer: 'light' },
  { cx: 220, cy: 585, rx: 55, ry: 38, color: '#C7E29A', layer: 'light' },
  { cx: 780, cy: 585, rx: 55, ry: 38, color: '#C7E29A', layer: 'light' },
  { cx: 478, cy: 710, rx: 55, ry: 38, color: '#D4EAA8', layer: 'light' },
  { cx: 480, cy: 185, rx: 48, ry: 32, color: '#D4EAA8', layer: 'light' },
];

// 樱花/小花点缀
const BLOSSOMS = [
  { cx: 240, cy: 215, color: '#F8C8D8' },
  { cx: 760, cy: 215, color: '#F8C8D8' },
  { cx: 130, cy: 400, color: '#FBE3A2' },
  { cx: 870, cy: 400, color: '#FBE3A2' },
  { cx: 280, cy: 615, color: '#F8C8D8' },
  { cx: 720, cy: 615, color: '#F8C8D8' },
  { cx: 520, cy: 720, color: '#FBE3A2' },
  { cx: 340, cy: 305, color: '#F0B3CC' },
  { cx: 660, cy: 305, color: '#F0B3CC' },
  { cx: 175, cy: 250, color: '#FBE3A2' },
  { cx: 825, cy: 250, color: '#FBE3A2' },
];

export function TreeView({ posts, userProfile, onPostClick, onCreatePost }: TreeViewProps) {
  const toPct = (p: { x: number; y: number }) => ({
    leftPct: (p.x / VB) * 100,
    topPct: (p.y / VB) * 100,
  });

  // 主枝桠定义：起点(树干) → 控制 → 终点(锚点附近)
  const branches: Branch[] = [
    // 顶部主枝（通向头像）
    { d: 'M 500 220 C 498 170, 500 130, 500 100', w1: 18, w2: 10 },

    // 上层左右
    { d: 'M 485 290 C 410 268, 305 250, 195 235', w1: 22, w2: 8 },
    { d: 'M 515 290 C 590 268, 695 250, 805 235', w1: 22, w2: 8 },

    // 中层左右（最外伸）
    { d: 'M 480 458 C 365 446, 230 432, 95 420', w1: 24, w2: 8 },
    { d: 'M 520 458 C 635 446, 770 432, 905 420', w1: 24, w2: 8 },

    // 下层左右
    { d: 'M 485 615 C 410 612, 330 610, 240 605', w1: 20, w2: 7 },
    { d: 'M 515 615 C 590 612, 670 610, 760 605', w1: 20, w2: 7 },

    // 底部中央枝
    { d: 'M 500 800 C 500 770, 500 750, 500 735', w1: 18, w2: 9 },
  ];

  // 次级小枝梢（纯装饰，让树冠"枝节"丰富）
  const twigs = [
    'M 360 282 C 340 240, 320 210, 305 188',
    'M 640 282 C 660 240, 680 210, 695 188',
    'M 280 250 C 260 270, 240 282, 220 286',
    'M 720 250 C 740 270, 760 282, 780 286',
    'M 280 450 C 248 420, 218 392, 198 374',
    'M 720 450 C 752 420, 782 392, 802 374',
    'M 200 432 C 168 452, 148 464, 128 468',
    'M 800 432 C 832 452, 852 464, 872 468',
    'M 360 614 C 340 590, 320 568, 305 552',
    'M 640 614 C 660 590, 680 568, 695 552',
    'M 500 770 C 478 758, 458 744, 442 728',
    'M 500 770 C 522 758, 542 744, 558 728',
    // 更细的末梢
    'M 195 235 C 175 220, 160 210, 145 205',
    'M 805 235 C 825 220, 840 210, 855 205',
    'M 95 420 C 78 410, 65 405, 50 400',
    'M 905 420 C 922 410, 935 405, 950 400',
    'M 240 605 C 220 612, 205 618, 188 622',
    'M 760 605 C 780 612, 795 618, 812 622',
    'M 350 320 C 332 332, 318 342, 308 350',
    'M 650 320 C 668 332, 682 342, 692 350',
  ];

  // 三层 stroke 渲染一根枝桠：暗色(阴影偏移) / 主色 / 高光
  const renderBranch = (b: Branch, key: string, opts?: { dim?: boolean }) => {
    const baseW = b.w1;
    const op = opts?.dim ? 0.55 : 1;
    return (
      <g key={key} opacity={op}>
        {/* 阴影底（向下偏移） */}
        <path
          d={b.d}
          stroke="#3A2410"
          strokeWidth={baseW + 1}
          fill="none"
          strokeLinecap="round"
          transform="translate(1.5, 2.5)"
          opacity="0.55"
        />
        {/* 主色 */}
        <path
          d={b.d}
          stroke="url(#branchGradient)"
          strokeWidth={baseW}
          fill="none"
          strokeLinecap="round"
        />
        {/* 主色再叠一层（让起点更粗，末端逐渐被树冠遮住自然变细的错觉） */}
        <path
          d={b.d}
          stroke="#7A5430"
          strokeWidth={baseW * 0.55}
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* 顶部高光线 */}
        <path
          d={b.d}
          stroke="#E0BE94"
          strokeWidth={Math.max(1.2, baseW * 0.18)}
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
          transform="translate(0, -1.2)"
        />
      </g>
    );
  };

  // 散落小叶子
  const leafColors = ['#7FB069', '#9BCB7A', '#A8D58A', '#6FA85A', '#BFD98F', '#E8C76A', '#5E8A45'];
  const scatteredLeaves = Array.from({ length: 95 }, (_, i) => ({
    cx: 50 + ((i * 367) % 900),
    cy: 110 + ((i * 211) % 680),
    rotation: (i * 47) % 360,
    scale: 0.45 + ((i * 13) % 80) / 100,
    color: leafColors[i % leafColors.length],
    opacity: 0.65 + ((i * 17) % 30) / 100,
    swayDelay: (i % 8) * 0.3,
    swayDuration: 3 + (i % 5),
  }));

  // 微光萤火
  const sparkles = Array.from({ length: 22 }, (_, i) => ({
    cx: 70 + ((i * 421) % 860),
    cy: 100 + ((i * 263) % 760),
    r: 1.5 + ((i * 7) % 4) / 2,
    delay: (i % 6) * 0.5,
    duration: 2.5 + (i % 4),
  }));

  // 阳光斜射光束
  const lightBeams = [
    { x1: 100, y1: 0, x2: 250, y2: 700 },
    { x1: 380, y1: 0, x2: 480, y2: 700 },
    { x1: 720, y1: 0, x2: 600, y2: 700 },
    { x1: 920, y1: 0, x2: 800, y2: 700 },
  ];

  // 远处背景树剪影
  const bgTrees = [
    { x: 80, scale: 0.55, color: '#B5D6A0' },
    { x: 200, scale: 0.45, color: '#C5DFB0' },
    { x: 850, scale: 0.5, color: '#B5D6A0' },
    { x: 940, scale: 0.4, color: '#C5DFB0' },
  ];

  // 悬挂藤蔓
  const vines = [
    { x: 195, y: 245, len: 60 },
    { x: 805, y: 245, len: 70 },
    { x: 380, y: 320, len: 45 },
    { x: 620, y: 320, len: 55 },
    { x: 95, y: 430, len: 80 },
    { x: 905, y: 430, len: 75 },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 顶部暖光 */}
      <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-amber-50/70 via-amber-50/20 to-transparent pointer-events-none" />
      {/* 底部草地 */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-green-200/50 via-green-100/25 to-transparent pointer-events-none" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5A3A22" />
            <stop offset="35%" stopColor="#8A6244" />
            <stop offset="55%" stopColor="#C9A07A" />
            <stop offset="75%" stopColor="#8A6244" />
            <stop offset="100%" stopColor="#5A3A22" />
          </linearGradient>
          <linearGradient id="trunkVert" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A88056" />
            <stop offset="100%" stopColor="#4F3018" />
          </linearGradient>
          <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7A5430" />
            <stop offset="50%" stopColor="#A88056" />
            <stop offset="100%" stopColor="#8B6440" />
          </linearGradient>
          <linearGradient id="rootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5A3A22" />
            <stop offset="100%" stopColor="#3A2410" />
          </linearGradient>
          <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A8D58A" />
            <stop offset="100%" stopColor="#6FA15A" />
          </linearGradient>
          <radialGradient id="canopyGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF4C7" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#D4EAA8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#A8D58A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7A5430" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7A5430" stopOpacity="0" />
          </radialGradient>

          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="8" stdDeviation="10" floodOpacity="0.22" />
          </filter>
          <filter id="watercolor" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <filter id="watercolorSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="12" />
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <filter id="bgBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="sparkleGlow">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          {/* 叶子 */}
          <symbol id="leaf" overflow="visible">
            <path d="M 0 4 C -8 0, -10 -10, 0 -20 C 10 -10, 8 0, 0 4 Z" fill="currentColor" />
            <path d="M 0 3 L 0 -19" stroke="rgba(60,40,20,0.25)" strokeWidth="0.8" fill="none" />
          </symbol>

          {/* 樱花 - 五瓣 */}
          <symbol id="blossom" overflow="visible">
            <g>
              {[0, 72, 144, 216, 288].map((rot, i) => (
                <ellipse
                  key={i}
                  cx="0"
                  cy="-4"
                  rx="3"
                  ry="4.5"
                  fill="currentColor"
                  transform={`rotate(${rot})`}
                />
              ))}
              <circle r="1.6" fill="#F5A623" />
            </g>
          </symbol>

          {/* 远景树剪影 */}
          <symbol id="bgTree" overflow="visible">
            <ellipse cx="0" cy="-90" rx="65" ry="80" fill="currentColor" />
            <ellipse cx="-30" cy="-110" rx="45" ry="55" fill="currentColor" />
            <ellipse cx="30" cy="-110" rx="45" ry="55" fill="currentColor" />
            <rect x="-8" y="-30" width="16" height="50" fill="#7A6044" />
          </symbol>

          {/* 纸张颗粒 */}
          <pattern id="paperGrain" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
            <rect width="240" height="240" fill="white" />
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="1" seed="4" />
              <feColorMatrix values="0 0 0 0 0.78  0 0 0 0 0.68  0 0 0 0 0.48  0 0 0 0.1 0" />
            </filter>
            <rect width="240" height="240" filter="url(#grain)" />
          </pattern>
        </defs>

        {/* ===== 远景：背景小树剪影 + 阳光光束 ===== */}
        <g filter="url(#bgBlur)" opacity="0.7">
          {bgTrees.map((t, i) => (
            <g key={`bg-${i}`} style={{ color: t.color }} transform={`translate(${t.x}, 920) scale(${t.scale})`}>
              <use href="#bgTree" />
            </g>
          ))}
        </g>

        {/* 阳光斜射光束 */}
        <g opacity="0.18">
          {lightBeams.map((b, i) => (
            <motion.path
              key={`beam-${i}`}
              d={`M ${b.x1} ${b.y1} L ${b.x1 + 80} ${b.y1} L ${b.x2 + 50} ${b.y2} L ${b.x2 - 50} ${b.y2} Z`}
              fill="#FFF4C7"
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
          ))}
        </g>

        {/* ===== 地面阴影斑 ===== */}
        <ellipse cx="500" cy="985" rx="380" ry="42" fill="url(#ground)" />

        {/* ===== 树冠"背景叶层"（树/枝干背后那层叶子，最暗） ===== */}
        <g filter="url(#watercolorSoft)" opacity="0.85">
          {LEAF_BLOBS.filter(b => b.layer === 'back').map((b, i) => (
            <ellipse key={`back-${i}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color} opacity="0.7" />
          ))}
        </g>

        {/* ===== 树根 ===== */}
        <g filter="url(#watercolor)">
          <path
            d="M 500 980 C 460 945, 410 928, 350 935 C 300 940, 268 958, 245 985"
            stroke="url(#rootGradient)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 500 980 C 540 945, 590 928, 650 935 C 700 940, 732 958, 755 985"
            stroke="url(#rootGradient)"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 500 985 C 492 962, 486 942, 482 920"
            stroke="url(#rootGradient)"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 500 988 C 510 968, 518 948, 522 928"
            stroke="url(#rootGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ===== 主树干（带瘤节起伏的填充形状） ===== */}
        <g filter="url(#softShadow)">
          <path
            d="
              M 450 1000
              C 455 940, 460 880, 466 820
              C 470 770, 472 720, 470 670
              C 468 620, 466 570, 470 520
              C 474 470, 480 420, 484 370
              C 487 320, 489 260, 492 200
              C 494 160, 496 130, 498 100
              L 502 100
              C 504 130, 506 160, 508 200
              C 511 260, 513 320, 516 370
              C 520 420, 526 470, 530 520
              C 534 570, 532 620, 530 670
              C 528 720, 530 770, 534 820
              C 540 880, 545 940, 550 1000
              Z
            "
            fill="url(#trunkVert)"
          />
          {/* 中央高光带 */}
          <path
            d="
              M 488 980
              C 492 880, 496 760, 498 620
              C 499 480, 500 320, 500 130
              L 504 130
              C 504 320, 505 480, 506 620
              C 508 760, 512 880, 514 980
              Z
            "
            fill="url(#trunkGradient)"
            opacity="0.55"
          />
        </g>

        {/* 树皮纵纹 */}
        <g opacity="0.4" stroke="#2E1A08" strokeWidth="1.3" fill="none" strokeLinecap="round">
          <path d="M 472 980 C 476 880, 478 780, 480 680" />
          <path d="M 520 980 C 518 860, 516 740, 514 620" />
          <path d="M 488 880 C 490 800, 492 720, 494 640" />
          <path d="M 502 920 C 502 820, 502 720, 502 620" />
          <path d="M 484 620 C 486 540, 488 460, 490 380" />
          <path d="M 512 600 C 510 520, 508 440, 506 360" />
          <path d="M 496 560 C 496 480, 496 400, 496 320" />
          <path d="M 478 760 C 480 680, 482 600, 484 520" />
          <path d="M 522 740 C 520 660, 518 580, 516 500" />
        </g>

        {/* 树皮横纹（瘤节质感） */}
        <g opacity="0.25" stroke="#3A2410" strokeWidth="1" fill="none">
          <path d="M 470 750 Q 500 745, 530 752" />
          <path d="M 468 600 Q 500 596, 532 603" />
          <path d="M 472 450 Q 500 446, 528 453" />
          <path d="M 480 300 Q 500 297, 520 302" />
        </g>

        {/* 树洞瘤节 */}
        <g>
          <ellipse cx="485" cy="820" rx="8" ry="11" fill="#2E1A08" opacity="0.7" />
          <ellipse cx="485" cy="819" rx="5" ry="7" fill="#8A6244" opacity="0.6" />
          <ellipse cx="515" cy="690" rx="6" ry="9" fill="#2E1A08" opacity="0.65" />
          <ellipse cx="515" cy="689" rx="3.5" ry="5.5" fill="#8A6244" opacity="0.55" />
          <ellipse cx="490" cy="540" rx="5" ry="7" fill="#2E1A08" opacity="0.6" />
          <ellipse cx="510" cy="400" rx="4" ry="5.5" fill="#2E1A08" opacity="0.55" />
        </g>

        {/* ===== 主枝桠（三层 stroke） ===== */}
        <g filter="url(#watercolor)">
          {branches.map((b, i) => renderBranch(b, `b-${i}`))}
        </g>

        {/* ===== 次级小枝梢 ===== */}
        <g filter="url(#watercolor)" opacity="0.9">
          {twigs.map((d, i) => (
            <g key={`twig-${i}`}>
              <path
                d={d}
                stroke="#3A2410"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                transform="translate(1, 1.8)"
                opacity="0.5"
              />
              <path d={d} stroke="url(#branchGradient)" strokeWidth="4.2" fill="none" strokeLinecap="round" />
              <path d={d} stroke="#D4B58A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" transform="translate(0,-0.8)" />
            </g>
          ))}
        </g>

        {/* ===== 悬挂藤蔓 ===== */}
        <g opacity="0.7">
          {vines.map((v, i) => (
            <motion.g
              key={`vine-${i}`}
              style={{ transformOrigin: `${v.x}px ${v.y}px` }}
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              <path
                d={`M ${v.x} ${v.y} Q ${v.x - 5} ${v.y + v.len / 2}, ${v.x - 2} ${v.y + v.len}`}
                stroke="#7A9A55"
                strokeWidth="1.5"
                fill="none"
              />
              {/* 藤上几片小叶 */}
              {[0.4, 0.7, 0.95].map((t, j) => (
                <g
                  key={j}
                  style={{ color: '#86B96B' }}
                  transform={`translate(${v.x - 3} ${v.y + v.len * t}) scale(0.4) rotate(${j * 40 - 20})`}
                >
                  <use href="#leaf" opacity="0.85" />
                </g>
              ))}
            </motion.g>
          ))}
        </g>

        {/* ===== 树冠中层 + 高光层（前景叶簇） ===== */}
        <g filter="url(#watercolorSoft)">
          {LEAF_BLOBS.filter(b => b.layer === 'mid').map((b, i) => (
            <ellipse key={`mid-${i}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color} opacity="0.7" />
          ))}
          {LEAF_BLOBS.filter(b => b.layer === 'light').map((b, i) => (
            <ellipse key={`light-${i}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color} opacity="0.55" />
          ))}
        </g>

        {/* ===== 散落小叶子（摇摆） ===== */}
        {scatteredLeaves.map((leaf, i) => (
          <motion.g
            key={`leaf-${i}`}
            style={{ color: leaf.color }}
            initial={{ rotate: leaf.rotation }}
            animate={{ rotate: [leaf.rotation - 12, leaf.rotation + 12, leaf.rotation - 12] }}
            transition={{
              duration: leaf.swayDuration,
              delay: leaf.swayDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            transform={`translate(${leaf.cx} ${leaf.cy}) scale(${leaf.scale})`}
          >
            <use href="#leaf" opacity={leaf.opacity} />
          </motion.g>
        ))}

        {/* ===== 樱花/小花点缀 ===== */}
        {BLOSSOMS.map((b, i) => (
          <motion.g
            key={`bloss-${i}`}
            style={{ color: b.color }}
            transform={`translate(${b.cx} ${b.cy}) scale(${1 + ((i * 7) % 5) / 10})`}
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            <use href="#blossom" />
          </motion.g>
        ))}

        {/* ===== 萤火微光 ===== */}
        {sparkles.map((s, i) => (
          <motion.circle
            key={`sparkle-${i}`}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#FFF4C7"
            filter="url(#sparkleGlow)"
            animate={{ opacity: [0, 0.95, 0], scale: [0.5, 1.4, 0.5] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* 树冠柔光罩 */}
        <ellipse cx="500" cy="400" rx="520" ry="420" fill="url(#canopyGlow)" pointerEvents="none" />

        {/* 草地 - 底部小草丛 */}
        <g opacity="0.85">
          {Array.from({ length: 22 }).map((_, i) => {
            const x = 30 + i * 44 + ((i * 37) % 20);
            const h = 12 + ((i * 13) % 18);
            return (
              <path
                key={`grass-${i}`}
                d={`M ${x} 1000 Q ${x + 2} ${1000 - h / 2}, ${x + 5} ${1000 - h}`}
                stroke="url(#grassGradient)"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* 纸张颗粒 */}
        <rect width="1000" height="1000" fill="url(#paperGrain)" opacity="0.08" pointerEvents="none" />
      </svg>

      {/* ===== 顶部用户头像 ===== */}
      {(() => {
        const { leftPct, topPct } = toPct(USER_ANCHOR);
        return (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="absolute"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 -m-4 rounded-full bg-amber-200/50 blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-100 via-yellow-200 to-orange-200 border-4 border-white shadow-[0_8px_24px_rgba(180,140,80,0.4)] flex items-center justify-center text-3xl md:text-4xl">
                {userProfile.avatar}
              </div>
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="px-3 py-1 bg-white/85 backdrop-blur-md rounded-full shadow-md text-sm font-medium text-stone-700 border border-white">
                  {userProfile.name}
                </div>
              </div>
              <button
                onClick={onCreatePost}
                className="absolute -right-2 -top-2 w-9 h-9 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border-2 border-white"
                aria-label="发布新内容"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        );
      })()}

      {/* ===== 帖子气泡（问号 + 磨砂玻璃） ===== */}
      {POST_ANCHORS.map((anchor, index) => {
        const post = posts[index];
        if (!post) return null;
        const { leftPct, topPct } = toPct(anchor);
        return (
          <motion.button
            key={post.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 120 }}
            className="absolute cursor-pointer group focus:outline-none"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
            }}
            onClick={() => onPostClick(post)}
            aria-label="查看树洞"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                y: { duration: 3 + (index % 3), repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 },
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
              className="relative"
            >
              <div className="absolute inset-0 -m-2 rounded-full bg-white/40 blur-xl group-hover:bg-amber-200/60 transition-colors duration-500" />
              <div
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
                           bg-white/35 backdrop-blur-md border border-white/70
                           shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),0_8px_20px_rgba(120,140,100,0.25)]
                           overflow-hidden"
              >
                <div className="absolute top-2 left-2 w-5 h-5 bg-white/70 rounded-full blur-[2px]" />
                <div className="absolute top-3 left-3 w-2 h-2 bg-white rounded-full" />
                <div className="absolute bottom-1 right-2 w-6 h-3 bg-white/30 rounded-full blur-sm" />
                <span
                  className="relative text-2xl md:text-3xl font-serif text-stone-600/85 select-none"
                  style={{
                    textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(120,90,60,0.15)',
                  }}
                >
                  ?
                </span>
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-gradient-to-b from-stone-400/60 to-transparent" />
            </motion.div>
          </motion.button>
        );
      })}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white/70 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg border border-white/80"
        >
          <p className="text-sm text-stone-600 font-medium">轻触问号 · 走进一个树洞 🌳</p>
        </motion.div>
      </div>
    </div>
  );
}
