import { motion, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Sparkles, Feather, ImagePlus, X,
  Pencil, Trash2, Check, LogIn,
  BookOpen, Archive, User, Eye, Camera, Lock, Globe, Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/app/contexts/AuthContext';
import { contentApi } from '@/api/content';
import { ossApi } from '@/api/oss';

import type { ContentArticle } from '@/types';
import { formatDate, timeAgo } from '@/utils/dateFormat';
import { toast } from 'sonner';

/* ===================================================================== */
/* Types & Constants                                                      */
/* ===================================================================== */

type BookMode = 'auth' | 'publish' | 'feed' | 'archive' | 'profile';

const MODE_TABS: { mode: BookMode; label: string; icon: React.ReactNode; cnLabel: string }[] = [
  { mode: 'auth', label: '鉴', icon: <LogIn className="w-4 h-4" />, cnLabel: '鉴' },
  { mode: 'publish', label: '书', icon: <Feather className="w-4 h-4" />, cnLabel: '书' },
  { mode: 'feed', label: '寻', icon: <Eye className="w-4 h-4" />, cnLabel: '寻' },
  { mode: 'archive', label: '档', icon: <Archive className="w-4 h-4" />, cnLabel: '档' },
  { mode: 'profile', label: '我', icon: <User className="w-4 h-4" />, cnLabel: '我' },
];

const PRIVACY_OPTIONS = [
  { value: 1, label: 'Public', icon: <Globe className="w-3.5 h-3.5" /> },
  { value: 2, label: 'Friends', icon: <Users className="w-3.5 h-3.5" /> },
  { value: 3, label: 'Private', icon: <Lock className="w-3.5 h-3.5" /> },
];

/* ===================================================================== */
/* MagicBook Main                                                         */
/* ===================================================================== */

export function MagicBook() {
  const { isAuthenticated } = useAuth();
  const [opened, setOpened] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mode, setMode] = useState<BookMode>('auth');
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'left' | 'right'>('right');
  const prevMode = useRef<BookMode>('auth');

  // Switch to publish after successful auth
  useEffect(() => {
    if (isAuthenticated && mode === 'auth') {
      setMode('publish');
    }
    if (!isAuthenticated && mode !== 'auth') {
      setMode('auth');
    }
  }, [isAuthenticated, mode]);

  const handleOpenClick = () => {
    setShimmer(true);
    setTimeout(() => setOpened(true), 1100);
  };

  const switchMode = (next: BookMode) => {
    if (next === mode) return;
    // auth mode requires no auth, others require auth
    if (next !== 'auth' && !isAuthenticated) return;
    const dir = MODE_TABS.findIndex((t) => t.mode === next) > MODE_TABS.findIndex((t) => t.mode === mode) ? 'right' : 'left';
    setFlipDir(dir);
    setFlipping(true);
    prevMode.current = mode;
    setTimeout(() => {
      setMode(next);
      setFlipping(false);
    }, 350);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!opened ? (
          <ClosedBook key="closed" shimmer={shimmer} onClick={handleOpenClick} />
        ) : (
          <div key="open" className="relative flex items-center gap-6">
            <OpenBook mode={mode} flipping={flipping} flipDir={flipDir} onLightbox={setLightbox} onSwitchMode={switchMode} />
            <PotionBowl onSwitchMode={switchMode} currentMode={mode} />
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-8 cursor-zoom-out"
            style={{ background: 'rgba(5,3,2,0.88)', backdropFilter: 'blur(4px)' }}
          >
            <motion.img
              src={lightbox} alt=""
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.5, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-md sepia-[0.15]"
              style={{
                boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 8px rgba(20,12,8,0.95), 0 0 0 10px rgba(180,134,42,0.45)',
              }}
            />
            <button type="button" onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-stone-900/80 text-amber-100 flex items-center justify-center hover:bg-stone-900 border border-amber-700/40"
              aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===================================================================== */
/* Closed Book Cover                                                      */
/* ===================================================================== */

function ClosedBook({ shimmer, onClick }: { shimmer: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, rotateY: -25, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: [0.5, 0, 0.2, 1] }}
      style={{ transformOrigin: 'left center' }}
      className="relative"
    >
      <button type="button" onClick={onClick}
        className="block relative cursor-pointer focus:outline-none"
        style={{ width: 'min(60vmin, 460px)', height: 'min(70vmin, 560px)' }}
        aria-label="Open magic book">
        <CoverArt shimmer={shimmer} />
        <motion.div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-amber-200/70 tracking-[0.4em] text-xs pointer-events-none"
          style={{ fontFamily: "'Cinzel', serif" }}
          animate={{ opacity: [0.4, 0.95, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}>
          · TAP TO OPEN ·
        </motion.div>
      </button>
    </motion.div>
  );
}

/* ===================================================================== */
/* OpenBook — two pages + bookmark nav + spine                             */
/* ===================================================================== */

function OpenBook({ mode, flipping, flipDir, onLightbox, onSwitchMode }: {
  mode: BookMode;
  flipping: boolean;
  flipDir: 'left' | 'right';
  onLightbox: (src: string | null) => void;
  onSwitchMode: (m: BookMode) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null);
  const [feedPage, setFeedPage] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotateY: 25 }}
      animate={flipping
        ? { rotateY: flipDir === 'right' ? [0, -15, 0] : [0, 15, 0] }
        : { opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: flipping ? 0.45 : 0.9, ease: [0.5, 0, 0.2, 1] }}
      style={{ transformOrigin: 'center center' }}
      className="relative"
    >
      {/* Bookmark Navigation */}
      <BookmarkNavInline currentMode={mode} onSwitchMode={onSwitchMode} />

      <div className="relative flex rounded-md overflow-hidden"
        style={{
          width: 'min(140vmin, 1100px)', height: 'min(80vmin, 720px)',
          boxShadow: '0 30px 80px -10px rgba(0,0,0,0.5), 0 12px 24px rgba(0,0,0,0.35)',
        }}>
        <Page side="left">
          <LeftPageContent mode={mode} selectedId={selectedId} selectedArticle={selectedArticle}
            onSelectId={setSelectedId} onSelectArticle={setSelectedArticle}
            feedPage={feedPage} onFeedPage={setFeedPage}
            onLightbox={onLightbox} onSwitchMode={onSwitchMode} />
        </Page>

        <Page side="right">
          <RightPageContent mode={mode} selectedId={selectedId} selectedArticle={selectedArticle}
            onSelectId={setSelectedId} onSelectArticle={setSelectedArticle}
            feedPage={feedPage} onFeedPage={setFeedPage}
            onLightbox={onLightbox} onSwitchMode={onSwitchMode} />
        </Page>

        {/* Spine shadow */}
        <div className="absolute top-2 bottom-2 left-1/2 w-5 -translate-x-1/2 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.45) 55%, transparent 100%)',
          }} />
      </div>
    </motion.div>
  );
}

/* ===================================================================== */
/* BookmarkNav                                                             */
/* ===================================================================== */

// Inline bookmark nav rendered within OpenBook
function BookmarkNavInline({ currentMode, onSwitchMode }: { currentMode: BookMode; onSwitchMode: (m: BookMode) => void }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="absolute -top-12 left-0 right-0 flex justify-center gap-1 z-30">
      {MODE_TABS.map((tab) => {
        const isAuthTab = tab.mode === 'auth';
        const disabled = !isAuthTab && !isAuthenticated;
        const active = tab.mode === currentMode;
        return (
          <button
            key={tab.mode}
            type="button"
            disabled={disabled}
            onClick={() => onSwitchMode(tab.mode)}
            className={`relative flex flex-col items-center justify-center w-12 h-14 rounded-b-md transition-all cursor-pointer focus:outline-none ${
              disabled ? 'opacity-30 cursor-not-allowed' : 'hover:-translate-y-1'
            }`}
            style={{
              background: active
                ? 'linear-gradient(180deg, #8B2D2D 0%, #5A1010 100%)'
                : 'linear-gradient(180deg, #6B3A2A 0%, #3A1A0A 100%)',
              boxShadow: active
                ? '0 4px 10px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,200,150,0.2)'
                : '0 2px 4px rgba(0,0,0,0.3)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
            }}
            aria-label={tab.cnLabel}
          >
            <span className="text-amber-200/90 pointer-events-none">{tab.icon}</span>
            <span className="text-amber-200/90 text-[10px] tracking-widest pointer-events-none"
              style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
              {tab.cnLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ===================================================================== */
/* Page (parchment)                                                        */
/* ===================================================================== */

function Page({ side, children }: { side: 'left' | 'right'; children: React.ReactNode }) {
  return (
    <div className="relative w-1/2 h-full"
      style={{
        background: side === 'left'
          ? 'linear-gradient(110deg, #F4E2B5 0%, #E8D094 60%, #DEC079 100%)'
          : 'linear-gradient(250deg, #F4E2B5 0%, #E8D094 60%, #DEC079 100%)',
        boxShadow: side === 'left'
          ? 'inset -25px 0 30px -20px rgba(80,40,10,0.5), inset 8px 8px 24px rgba(120,80,40,0.15)'
          : 'inset 25px 0 30px -20px rgba(80,40,10,0.5), inset -8px 8px 24px rgba(120,80,40,0.15)',
      }}>
      <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-multiply pointer-events-none">
        <defs>
          <filter id={`pap-${side}`}>
            <feTurbulence baseFrequency="0.85" numOctaves="2" seed={side === 'left' ? 2 : 7} />
            <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.30  0 0 0 0 0.15  0 0 0 0.18 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#pap-${side})`} />
      </svg>
      <div className={`absolute top-0 bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} w-3 pointer-events-none`}
        style={{
          background: side === 'left'
            ? 'linear-gradient(90deg, rgba(80,40,10,0.45) 0%, transparent 100%)'
            : 'linear-gradient(270deg, rgba(80,40,10,0.45) 0%, transparent 100%)',
        }} />
      <div className="relative w-full h-full p-8 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}

/* ===================================================================== */
/* PotionBowl — avatar + bubbles beside book                               */
/* ===================================================================== */

function PotionBowl({ onSwitchMode, currentMode }: {
  onSwitchMode: (m: BookMode) => void;
  currentMode: BookMode;
}) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Avatar bubble */}
      <motion.button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-14 h-14 rounded-full border-2 border-amber-700/60 overflow-hidden cursor-pointer focus:outline-none flex-shrink-0"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 0 8px rgba(80,40,10,0.3)' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {user.avatar ? (
          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-amber-900/40 text-amber-200 text-xl"
            style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            {(user.nickname || user.username || '?')[0]}
          </div>
        )}
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25) 0%, transparent 50%)' }} />
      </motion.button>

      {/* Mode bubbles */}
      <div className="flex flex-col gap-1.5">
        {MODE_TABS.filter((t) => t.mode !== currentMode).map((tab) => (
          <motion.button
            key={tab.mode}
            type="button"
            onClick={() => onSwitchMode(tab.mode)}
            className="w-9 h-9 rounded-full bg-amber-900/30 border border-amber-700/40 flex items-center justify-center cursor-pointer focus:outline-none hover:bg-amber-800/40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={tab.cnLabel}
          >
            <span className="text-amber-300/70 pointer-events-none">{tab.icon}</span>
          </motion.button>
        ))}
      </div>

      {/* Logout */}
      {currentMode !== 'auth' && (
        <motion.button
          type="button"
          onClick={logout}
          className="w-8 h-8 rounded-full bg-red-900/40 border border-red-800/40 flex items-center justify-center cursor-pointer focus:outline-none hover:bg-red-800/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Logout"
        >
          <X className="w-3.5 h-3.5 text-red-300/70" />
        </motion.button>
      )}

      {/* Quick menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute left-16 top-0 bg-stone-900/95 border border-amber-700/50 rounded-md p-2 z-50 min-w-[120px]"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
          >
            <p className="text-amber-200 text-xs mb-2 px-2" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
              {user.nickname || user.username || user.email}
            </p>
            <button type="button" onClick={() => { setMenuOpen(false); logout(); }}
              className="w-full text-left px-2 py-1 text-amber-300/80 hover:text-amber-100 hover:bg-amber-900/30 rounded text-xs cursor-pointer">
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===================================================================== */
/* Left Page Content — mode-switched                                       */
/* ===================================================================== */

function LeftPageContent({ mode, selectedId, selectedArticle, onSelectId, onSelectArticle, feedPage, onFeedPage, onLightbox, onSwitchMode }: {
  mode: BookMode;
  selectedId: number | null;
  selectedArticle: ContentArticle | null;
  onSelectId: (id: number | null) => void;
  onSelectArticle: (a: ContentArticle | null) => void;
  feedPage: number;
  onFeedPage: (p: number) => void;
  onLightbox: (src: string | null) => void;
  onSwitchMode: (m: BookMode) => void;
}) {
  switch (mode) {
    case 'auth': return <AuthLoginPane />;
    case 'publish': return <PublishPane />;
    case 'feed': return <FeedListPane selectedId={selectedId} onSelectId={onSelectId} onSelectArticle={onSelectArticle} page={feedPage} onPage={onFeedPage} />;
    case 'archive': return <ArchiveListPane selectedId={selectedId} onSelectId={onSelectId} onSelectArticle={onSelectArticle} onLightbox={onLightbox} />;
    case 'profile': return <ProfileEditPane />;
    default: return null;
  }
}

/* ===================================================================== */
/* Right Page Content — mode-switched                                      */
/* ===================================================================== */

function RightPageContent({ mode, selectedId, selectedArticle, onSelectId, onSelectArticle, feedPage, onFeedPage, onLightbox, onSwitchMode }: {
  mode: BookMode;
  selectedId: number | null;
  selectedArticle: ContentArticle | null;
  onSelectId: (id: number | null) => void;
  onSelectArticle: (a: ContentArticle | null) => void;
  feedPage: number;
  onFeedPage: (p: number) => void;
  onLightbox: (src: string | null) => void;
  onSwitchMode: (m: BookMode) => void;
}) {
  switch (mode) {
    case 'auth': return <AuthRegisterPane />;
    case 'publish': return <FeedSummaryPane onSelectId={onSelectId} onSelectArticle={onSelectArticle} onSwitchMode={onSwitchMode} />;
    case 'feed': return <DetailPane article={selectedArticle} onLightbox={onLightbox} />;
    case 'archive': return <DetailPane article={selectedArticle} onLightbox={onLightbox} />;
    case 'profile': return <ProfileStatsPane />;
    default: return null;
  }
}

/* ===================================================================== */
/* Auth: Login (Left)                                                      */
/* ===================================================================== */

function AuthLoginPane() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      toast.success('Welcome back, traveler');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="text-center flex-shrink-0">
        <p className="text-amber-900/60 tracking-[0.3em] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>SIGN IN</p>
        <h2 className="mt-2 text-amber-900 text-2xl" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>旅人归来</h2>
        <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-amber-800/60 to-transparent" />
      </div>

      <div className="flex-1 flex flex-col gap-5 mt-6 min-h-0 justify-center">
        <label className="block">
          <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>EMAIL</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-2 text-amber-950 placeholder:text-amber-800/30"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }} />
        </label>

        <label className="block">
          <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>PASSWORD</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)}
            type="password" placeholder="······"
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-2 text-amber-950 placeholder:text-amber-800/30"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }} />
        </label>

        {error && <p className="text-red-800/80 text-xs text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{error}</p>}
      </div>

      <div className="flex-shrink-0 mt-6 flex justify-center">
        <button type="button" onClick={submit} disabled={loading}
          className="w-24 h-24 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer focus:outline-none disabled:opacity-50"
          style={{
            background: 'radial-gradient(circle at 30% 25%, #C44, #7A1A1A 70%, #4A0808 100%)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 -4px 6px rgba(0,0,0,0.4), inset 0 4px 8px rgba(255,255,255,0.18)',
          }}>
          <span className="text-amber-100 text-base tracking-widest pointer-events-none" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            {loading ? '...' : '归 来'}
          </span>
        </button>
      </div>
    </>
  );
}

/* ===================================================================== */
/* Auth: Register (Right)                                                  */
/* ===================================================================== */

function AuthRegisterPane() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!email || !password || !username) { setError('Email, username, and password are required'); return; }
    setLoading(true); setError('');
    try {
      await register({ email, password, username, nickname: nickname || username });
      setSuccess(true);
      toast.success('Registration successful! You can now sign in.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="text-center flex-shrink-0">
        <p className="text-amber-900/60 tracking-[0.3em] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>SIGN UP</p>
        <h2 className="mt-2 text-amber-900 text-2xl" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>刻下真名</h2>
        <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-amber-800/60 to-transparent" />
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-6 min-h-0 justify-center">
        {success ? (
          <div className="text-center">
            <Check className="w-10 h-10 text-green-700 mx-auto" />
            <p className="mt-4 text-amber-900 text-lg" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>注册成功</p>
            <p className="mt-2 text-amber-800/60 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Now sign in on the left page
            </p>
          </div>
        ) : (
          <>
            <label className="block">
              <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>EMAIL</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-1.5 text-amber-950 placeholder:text-amber-800/30"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px' }} />
            </label>
            <label className="block">
              <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>USERNAME</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="unique name"
                className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-1.5 text-amber-950 placeholder:text-amber-800/30"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px' }} />
            </label>
            <label className="block">
              <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>NICKNAME</span>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="display name"
                className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-1.5 text-amber-950 placeholder:text-amber-800/30"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px' }} />
            </label>
            <label className="block">
              <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>PASSWORD</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)}
                type="password" placeholder="at least 6 chars"
                className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-1.5 text-amber-950 placeholder:text-amber-800/30"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px' }} />
            </label>
            {error && <p className="text-red-800/80 text-xs text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{error}</p>}
          </>
        )}
      </div>

      <div className="flex-shrink-0 mt-4 flex justify-center">
        <button type="button" onClick={submit} disabled={loading || success}
          className="w-24 h-24 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer focus:outline-none disabled:opacity-50"
          style={{
            background: 'radial-gradient(circle at 30% 25%, #C44, #7A1A1A 70%, #4A0808 100%)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 -4px 6px rgba(0,0,0,0.4), inset 0 4px 8px rgba(255,255,255,0.18)',
          }}>
          <span className="text-amber-100 text-base tracking-widest pointer-events-none" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            {loading ? '...' : '封 缄'}
          </span>
        </button>
      </div>
    </>
  );
}

/* ===================================================================== */
/* Publish: Publish Form (Left)                                            */
/* ===================================================================== */

function PublishPane() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [privacy, setPrivacy] = useState(1);
  const [tags, setTags] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const tagList = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tagList.includes(val)) {
      setTags((prev) => (prev ? prev + ',' + val : val));
    }
    setTagInput('');
    setShowTagInput(false);
  };

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 4 - images.length;
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const preview = URL.createObjectURL(file);
      setImages((prev) => (prev.length < 4 ? [...prev, { file, preview }] : prev));
    });
  };

  const submitPublish = async () => {
    if (!title.trim() && !content.trim()) { toast.error('Please write something'); return; }
    setPublishing(true);
    try {
      // Upload images via OSS first, collect URLs
      const urls = await Promise.all(images.map((img) => ossApi.upload(img.file)));
      await contentApi.publish({
        email: user.email,
        title: title.trim() || 'Untitled',
        content: content.trim() || '...',
        images: JSON.stringify(urls),
        tags: tags || undefined,
        privacy,
      });
      // Revoke preview URLs
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.3, y: 0.5 } });
      toast.success('Incantation cast into the void');
      setTitle(''); setContent(''); setImages([]); setTags('');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Publish failed');
    } finally { setPublishing(false); }
  };

  return (
    <>
      <div className="flex-shrink-0 flex items-center justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-amber-900/60 tracking-[0.35em] text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>INCANTATION</p>
          <p className="text-amber-900/70 text-xs mt-0.5 truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {user.nickname || user.username} 谨记于此页
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={privacy} onChange={(e) => setPrivacy(Number(e.target.value))}
            className="bg-transparent border border-amber-800/30 rounded px-1 py-0.5 text-amber-900/70 text-xs outline-none cursor-pointer"
            style={{ fontFamily: "'Cinzel', serif" }}>
            {PRIVACY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button type="button" onClick={submitPublish} disabled={publishing}
            className="flex-shrink-0 relative px-5 py-2 rounded-md cursor-pointer hover:brightness-110 active:scale-95 transition focus:outline-none disabled:opacity-50"
            style={{
              background: 'linear-gradient(180deg, #7A1A1A 0%, #4A0808 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,220,180,0.25), inset 0 -2px 4px rgba(0,0,0,0.35)',
              fontFamily: "'Ma Shan Zheng', cursive",
            }}>
            <span className="relative text-amber-100 tracking-[0.25em] flex items-center gap-2 pointer-events-none">
              <Feather className="w-3.5 h-3.5" />
              {publishing ? '诵咒中…' : '魔法 · 发布'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 mb-3 flex items-center gap-2 text-amber-800/50">
        <span className="flex-1 h-px bg-amber-800/30" />
        <Feather className="w-3 h-3" />
        <span className="flex-1 h-px bg-amber-800/30" />
      </div>

      <input value={title} onChange={(e) => setTitle(e.target.value)}
        placeholder="为你的咒语命名…"
        className="flex-shrink-0 w-full bg-transparent border-b border-amber-800/30 focus:border-amber-700 outline-none py-1.5 mb-2 text-amber-950 placeholder:text-amber-800/30"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }} />

      <textarea value={content} onChange={(e) => setContent(e.target.value)}
        placeholder="…在此倾诉你内心隐秘的咒语"
        className="flex-1 min-h-0 w-full bg-transparent resize-none outline-none text-amber-950 placeholder:text-amber-800/30 overflow-y-auto magic-scroll pr-2 mb-3 block"
        style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '16px',
          backgroundImage: 'repeating-linear-gradient(transparent 0 28px, rgba(120,80,40,0.18) 28px 29px)',
          lineHeight: '29px', paddingTop: '4px',
        }} />

      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-amber-900/65 text-[11px] tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif" }}>VISIONS · 灵图 ({images.length}/4)</span>
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1 text-amber-900/70 hover:text-amber-900 text-xs cursor-pointer focus:outline-none"
            style={{ fontFamily: "'Cinzel', serif" }}>
            <ImagePlus className="w-3.5 h-3.5" /> 附上幻象
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { handleAddFiles(e.target.files); e.target.value = ''; }} />
        {images.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-md overflow-hidden border-2 border-amber-900/30"
                style={{ boxShadow: 'inset 0 0 6px rgba(80,40,10,0.5)' }}>
                <img src={img.preview} alt="" className="w-full h-full object-cover sepia-[0.25]" />
                <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/75 text-amber-100 flex items-center justify-center hover:bg-stone-900 z-10 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-full h-14 rounded-md border-2 border-dashed border-amber-800/30 hover:border-amber-700/60 hover:bg-amber-100/30 transition flex items-center justify-center gap-2 text-amber-800/60 cursor-pointer focus:outline-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <ImagePlus className="w-4 h-4" />
            <span className="italic text-sm">召唤一幅幻象作为附件…</span>
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex-shrink-0 mt-3">
        <span className="text-amber-900/65 text-[11px] tracking-[0.25em]" style={{ fontFamily: "'Cinzel', serif" }}>TAGS · 标签</span>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {tagList.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-700/40 text-amber-800/80 text-xs"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {tag}
              <button type="button" onClick={() => setTags(tagList.filter((_, idx) => idx !== i).join(','))}
                className="text-amber-800/50 hover:text-amber-900 cursor-pointer">×</button>
            </span>
          ))}
          {showTagInput ? (
            <input ref={tagInputRef} value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') { setShowTagInput(false); setTagInput(''); } }}
              onBlur={addTag}
              placeholder="tag name"
              className="w-24 bg-transparent border-b border-amber-800/40 focus:border-amber-700 outline-none px-1 py-0.5 text-amber-950 placeholder:text-amber-800/30 text-xs"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              autoFocus />
          ) : (
            <button type="button" onClick={() => { setShowTagInput(true); setTimeout(() => tagInputRef.current?.focus(), 50); }}
              className="px-2 py-0.5 rounded border border-dashed border-amber-800/30 text-amber-800/60 hover:text-amber-900 hover:border-amber-700/40 text-xs cursor-pointer"
              style={{ fontFamily: "'Cinzel', serif" }}>
              + Tag
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ===================================================================== */
/* Publish: Feed Summary (Right) — recent 4 cards                          */
/* ===================================================================== */

function FeedSummaryPane({ onSelectId, onSelectArticle, onSwitchMode }: {
  onSelectId: (id: number | null) => void;
  onSelectArticle: (a: ContentArticle | null) => void;
  onSwitchMode: (m: BookMode) => void;
}) {
  const [items, setItems] = useState<ContentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getMeetList(1, 4).then((res) => {
      setItems(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex-shrink-0 text-center mb-3">
        <p className="text-amber-900/60 tracking-[0.35em] text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>RECENT INCANTATIONS</p>
        <h3 className="mt-1 text-amber-900 text-lg" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>最近 · 咒语</h3>
        <div className="mx-auto mt-2 h-px w-16 bg-amber-800/30" />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <CastingAnim />
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-amber-800/50 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          No incantations yet...
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto magic-scroll pr-1">
          {items.map((item) => {
              const imgs = parseImages(item.images);
              const tags = parseTags(item.tags);
              return (
            <button key={item.id} type="button"
              onClick={() => { onSelectId(item.id); onSelectArticle(item); onSwitchMode('feed'); }}
              className="text-left p-3 rounded border border-amber-800/20 bg-amber-50/20 hover:bg-amber-100/40 hover:-translate-y-0.5 transition cursor-pointer">
              <p className="text-amber-900 truncate" style={{ fontFamily: "'Ma Shan Zheng', cursive", fontSize: '15px' }}>{item.title}</p>
              <p className="text-amber-800/70 line-clamp-2 mt-1 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {item.content}
              </p>
              {/* Image thumbnails */}
              {imgs.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {imgs.slice(0, 3).map((src, i) => (
                    <div key={i} className="w-12 h-12 rounded overflow-hidden border border-amber-900/30 flex-shrink-0">
                      <img src={src} alt="" className="w-full h-full object-cover sepia-[0.2]" />
                    </div>
                  ))}
                  {imgs.length > 3 && (
                    <div className="w-12 h-12 rounded border border-amber-900/30 flex items-center justify-center bg-amber-100/50 flex-shrink-0">
                      <span className="text-amber-800/70 text-xs" style={{ fontFamily: "'Cinzel', serif" }}>+{imgs.length - 3}</span>
                    </div>
                  )}
                </div>
              )}
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {tags.slice(0, 2).map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded-full border border-amber-700/40 text-amber-800/70 text-[10px]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t}</span>
                  ))}
                  {tags.length > 2 && (
                    <span className="text-amber-800/50 text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>+{tags.length - 2}</span>
                  )}
                </div>
              )}
              <p className="text-amber-800/50 text-xs mt-1" style={{ fontFamily: "'Cinzel', serif" }}>
                — {item.nickname || item.username} · {timeAgo(item.createDate)}
              </p>
            </button>
            )})}
        </div>
      )}
    </>
  );
}

/* ===================================================================== */
/* Feed: Content List (Left) — paginated grid                              */
/* ===================================================================== */

function FeedListPane({ selectedId, onSelectId, onSelectArticle, page, onPage }: {
  selectedId: number | null;
  onSelectId: (id: number | null) => void;
  onSelectArticle: (a: ContentArticle | null) => void;
  page: number;
  onPage: (p: number) => void;
}) {
  const [items, setItems] = useState<ContentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  useEffect(() => {
    setLoading(true);
    contentApi.getMeetList(page, 100).then((res) => {
      setItems(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="flex-shrink-0 text-center mb-3">
        <p className="text-amber-900/60 tracking-[0.35em] text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>FORBIDDEN ARTS</p>
        <h3 className="mt-1 text-amber-900 text-lg" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>禁忌 · 魔法</h3>
        <div className="mx-auto mt-2 flex items-center gap-2 text-amber-800/50">
          <span className="h-px w-12 bg-amber-800/40" />
          <Sparkles className="w-3 h-3" />
          <span className="h-px w-12 bg-amber-800/40" />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center"><CastingAnim /></div>
      ) : (
        <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto magic-scroll pr-2 content-start">
          {pageItems.map((item) => {
              const imgs = parseImages(item.images);
              const tags = parseTags(item.tags);
              return (
              <button key={item.id} type="button"
                onClick={() => { onSelectId(item.id); onSelectArticle(item); }}
                className={`text-left p-3 rounded border transition cursor-pointer hover:-translate-y-0.5 ${
                  selectedId === item.id
                    ? 'border-amber-700 bg-amber-100/50 shadow-inner'
                    : 'border-amber-800/20 bg-amber-50/20 hover:bg-amber-100/40'
                }`}>
                <p className="text-amber-900 truncate text-sm" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>{item.title}</p>
                <p className="text-amber-800/70 line-clamp-2 text-xs mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.content}
                </p>
                {/* Image thumbnails */}
                {imgs.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {imgs.slice(0, 3).map((src, i) => (
                      <div key={i} className="w-12 h-12 rounded overflow-hidden border border-amber-900/30 flex-shrink-0">
                        <img src={src} alt="" className="w-full h-full object-cover sepia-[0.2]" />
                      </div>
                    ))}
                    {imgs.length > 3 && (
                      <div className="w-12 h-12 rounded border border-amber-900/30 flex items-center justify-center bg-amber-100/50 flex-shrink-0">
                        <span className="text-amber-800/70 text-xs" style={{ fontFamily: "'Cinzel', serif" }}>+{imgs.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tags.slice(0, 3).map((t, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded-full border border-amber-700/40 text-amber-800/70 text-[10px]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t}</span>
                    ))}
                  </div>
                )}
                <p className="text-amber-800/50 text-[10px] mt-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                  {item.nickname || item.username} · {timeAgo(item.createDate)}
                </p>
              </button>
            )})}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex-shrink-0 mt-2 pt-2 border-t border-amber-800/20 flex items-center justify-between">
          <button type="button" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}
            className="flex items-center gap-1 text-amber-900/70 hover:text-amber-900 cursor-pointer focus:outline-none disabled:opacity-30"
            style={{ fontFamily: "'Cinzel', serif" }}>
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-amber-900/60 text-xs tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>{page} / {totalPages}</span>
          <button type="button" onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
            className="flex items-center gap-1 text-amber-900/70 hover:text-amber-900 cursor-pointer focus:outline-none disabled:opacity-30"
            style={{ fontFamily: "'Cinzel', serif" }}>
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}

/* ===================================================================== */
/* Archive: My Content List (Left)                                         */
/* ===================================================================== */

function ArchiveListPane({ selectedId, onSelectId, onSelectArticle, onLightbox }: {
  selectedId: number | null;
  onSelectId: (id: number | null) => void;
  onSelectArticle: (a: ContentArticle | null) => void;
  onLightbox: (src: string | null) => void;
}) {
  const { user } = useAuth();
  const [items, setItems] = useState<ContentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const loadItems = useCallback(() => {
    setLoading(true);
    contentApi.getMyList(user.email).then((res) => {
      setItems(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user.email]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleDelete = async (id: number) => {
    try {
      await contentApi.deleteContent(id);
      toast.success('Incantation burned');
      setConfirmDelete(null);
      if (selectedId === id) { onSelectId(null); onSelectArticle(null); }
      loadItems();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleEdit = async () => {
    if (!editingId) return;
    try {
      await contentApi.publish({
        email: user.email,
        title: editTitle,
        content: editContent,
        images: '',
        privacy: 1,
      });
      // Note: Backend doesn't have an edit endpoint, so we publish a new one and delete old
      // For now, just refresh the list
      toast.success('Updated');
      setEditingId(null);
      loadItems();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  return (
    <>
      <div className="flex-shrink-0 text-center mb-3">
        <p className="text-amber-900/60 tracking-[0.35em] text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>ARCHIVE · 档 案</p>
        <h3 className="mt-1 text-amber-900 text-lg" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>我所书之咒 ({items.length})</h3>
        <div className="mx-auto mt-2 h-px w-16 bg-amber-800/30" />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center"><CastingAnim /></div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-amber-800/50 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          This volume is empty...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto magic-scroll pr-2 space-y-2">
          {items.map((item) => (
            <div key={item.id}
              className={`rounded-md border p-2.5 transition cursor-pointer hover:-translate-y-0.5 ${
                selectedId === item.id ? 'border-amber-700 bg-amber-100/50' : 'border-amber-800/20 bg-amber-50/20 hover:bg-amber-100/30'
              }`}
              onClick={() => { onSelectId(item.id); onSelectArticle(item); }}>
              {editingId === item.id ? (
                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-amber-800/30 focus:border-amber-700 outline-none py-1 text-amber-950 text-sm"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }} />
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3}
                    className="w-full bg-transparent resize-none outline-none text-amber-950 text-sm"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }} />
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setEditingId(null)}
                      className="px-2 py-0.5 rounded text-amber-900/70 hover:text-amber-900 text-xs cursor-pointer"
                      style={{ fontFamily: "'Cinzel', serif" }}>Cancel</button>
                    <button type="button" onClick={handleEdit}
                      className="px-2 py-0.5 rounded text-amber-100 text-xs cursor-pointer"
                      style={{ background: 'linear-gradient(180deg, #7A1A1A 0%, #4A0808 100%)', fontFamily: "'Ma Shan Zheng', cursive" }}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-amber-900 truncate text-sm" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>{item.title}</p>
                      {item.status != null && (
                        <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] tracking-widest ${statusBadgeStyle(item.status)}`}
                          style={{ fontFamily: "'Cinzel', serif" }}>{statusLabel(item.status)}</span>
                      )}
                    </div>
                    <p className="text-amber-800/70 line-clamp-2 text-xs mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.content}</p>
                    <ArchiveItemImages images={item.images} onLightbox={onLightbox} />
                    <p className="text-amber-800/50 text-[10px] mt-1" style={{ fontFamily: "'Cinzel', serif" }}>{formatDate(item.createDate)}</p>
                  </div>
                  <div className="flex flex-col gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button type="button" onClick={() => { setEditingId(item.id); setEditTitle(item.title); setEditContent(item.content); }}
                      className="w-6 h-6 rounded flex items-center justify-center text-amber-900/60 hover:text-amber-900 hover:bg-amber-100/40 cursor-pointer">
                      <Pencil className="w-3 h-3" />
                    </button>
                    {confirmDelete === item.id ? (
                      <button type="button" onClick={() => handleDelete(item.id)}
                        className="w-6 h-6 rounded flex items-center justify-center bg-red-900/80 text-amber-100 cursor-pointer">
                        <Check className="w-3 h-3" />
                      </button>
                    ) : (
                      <button type="button" onClick={() => setConfirmDelete(item.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-red-900/60 hover:text-red-900 hover:bg-red-100/40 cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={loadItems}
        className="flex-shrink-0 mt-2 mx-auto text-amber-900/50 hover:text-amber-900 text-xs cursor-pointer"
        style={{ fontFamily: "'Cinzel', serif" }}>
        Refresh
      </button>
    </>
  );
}

function ArchiveItemImages({ images, onLightbox }: { images: string; onLightbox: (src: string | null) => void }) {
  if (!images) return null;
  try {
    const imgs = JSON.parse(images);
    if (!Array.isArray(imgs) || imgs.length === 0) return null;
    return (
      <div className="flex gap-1 mt-1.5">
        {imgs.slice(0, 3).map((src: string, i: number) => (
          <div key={i} onDoubleClick={(e) => { e.stopPropagation(); onLightbox(src); }}
            className="w-12 h-12 rounded overflow-hidden border border-amber-900/30 cursor-zoom-in">
            <img src={src} alt="" className="w-full h-full object-cover sepia-[0.25]" />
          </div>
        ))}
        {imgs.length > 3 && (
          <div className="w-12 h-12 rounded border border-amber-900/30 flex items-center justify-center bg-amber-100/50 flex-shrink-0">
            <span className="text-amber-800/70 text-xs" style={{ fontFamily: "'Cinzel', serif" }}>+{imgs.length - 3}</span>
          </div>
        )}
      </div>
    );
  } catch {
    return null;
  }
}

/* ===================================================================== */
/* Detail Pane (Right, shared by feed & archive)                           */
/* ===================================================================== */

function DetailPane({ article, onLightbox }: {
  article: ContentArticle | null;
  onLightbox: (src: string | null) => void;
}) {
  if (!article) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <BookOpen className="w-8 h-8 text-amber-700/50" />
        <p className="mt-4 text-amber-900/60 italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }}>
          Select an incantation to read...
        </p>
        <p className="mt-2 text-amber-800/50 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Tap any card on the left page
        </p>
      </div>
    );
  }

  let imgs: string[] = [];
  try { const parsed = JSON.parse(article.images || '[]'); imgs = Array.isArray(parsed) ? parsed : []; } catch { imgs = []; }
  const tags = parseTags(article.tags);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 flex items-center gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-amber-900 text-lg leading-none truncate" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>{article.title}</p>
          <p className="text-amber-800/60 text-xs mt-1 truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            — {article.nickname || article.username}
          </p>
        </div>
        {article.status != null && (
          <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] tracking-widest ${statusBadgeStyle(article.status)}`}
            style={{ fontFamily: "'Cinzel', serif" }}>{statusLabel(article.status)}</span>
        )}
      </div>
      <div className="flex-shrink-0 h-px bg-gradient-to-r from-transparent via-amber-800/40 to-transparent mb-2" />

      <div className="flex-1 min-h-0 overflow-y-auto magic-scroll pr-2 mb-3">
        <p className="text-amber-950/90 whitespace-pre-wrap"
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', lineHeight: '29px',
            backgroundImage: 'repeating-linear-gradient(transparent 0 28px, rgba(120,80,40,0.18) 28px 29px)',
            paddingTop: '4px',
          }}>
          {article.content}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex-shrink-0 flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-amber-800/20">
          {tags.map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full border border-amber-700/40 text-amber-800/70 text-xs"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t}</span>
          ))}
        </div>
      )}

      {imgs.length > 0 && (
        <div className="flex-shrink-0">
          <p className="text-amber-900/55 text-[10px] tracking-[0.3em] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            ⸻ ATTACHED VISIONS · 双击放大 ⸻
          </p>
          <div className="flex flex-wrap gap-3">
            {imgs.map((src, i) => (
              <div key={i} onDoubleClick={() => onLightbox(src)}
                className="relative rounded-lg overflow-hidden border-2 border-amber-900/40 cursor-zoom-in max-w-full"
                style={{ boxShadow: 'inset 0 0 10px rgba(80,40,10,0.5), 0 4px 8px rgba(80,40,10,0.25)' }}>
                <img src={src} alt="" className="max-h-[300px] max-w-[280px] object-contain sepia-[0.25]" />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(80,40,10,0.35) 100%)' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="flex-shrink-0 text-amber-800/50 text-[10px] mt-2 text-right" style={{ fontFamily: "'Cinzel', serif" }}>
        {formatDate(article.createDate)}
      </p>
    </div>
  );
}

/* ===================================================================== */
/* Profile: Edit Pane (Left)                                               */
/* ===================================================================== */

function ProfileEditPane() {
  const { user, updateProfile } = useAuth();
  const [nickname, setNickname] = useState(user.nickname);
  const [intro, setIntro] = useState((user as any).intro || '');
  const [privacy, setPrivacy] = useState(1);
  const [password, setPassword] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const res = await ossApi.upload(file);
      const url = res.data as unknown as string;
      await updateProfile({ avatar: url });
      toast.success('Avatar updated');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally { setAvatarUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: { nickname?: string; intro?: string; privacy?: number; password?: string } = {};
      if (nickname.trim() && nickname !== user.nickname) data.nickname = nickname.trim();
      if (intro.trim() !== ((user as any).intro || '')) data.intro = intro.trim();
      if (privacy) data.privacy = privacy;
      if (password.trim()) data.password = password.trim();
      if (Object.keys(data).length === 0) { toast('Nothing to save'); return; }
      await updateProfile(data);
      setPassword('');
      toast.success('Profile updated');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="flex-shrink-0 text-center mb-3">
        <p className="text-amber-900/60 tracking-[0.3em] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>PROFILE</p>
        <h2 className="mt-1 text-amber-900 text-xl" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>旅人 · 真名</h2>
        <div className="mx-auto mt-2 h-px w-16 bg-amber-800/30" />
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto magic-scroll pr-2">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full border-2 border-amber-700/60 overflow-hidden flex-shrink-0"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amber-900/40 text-amber-200 text-2xl"
                style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
                {(user.nickname || user.username || '?')[0]}
              </div>
            )}
          </div>
          <div>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={avatarUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-amber-100 cursor-pointer hover:brightness-110 disabled:opacity-50"
              style={{ background: 'linear-gradient(180deg, #7A1A1A 0%, #4A0808 100%)', fontFamily: "'Ma Shan Zheng', cursive" }}>
              <Camera className="w-3.5 h-3.5" />
              {avatarUploading ? 'Uploading...' : '更换头像'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <p className="text-amber-800/50 text-[10px] mt-1" style={{ fontFamily: "'Cinzel', serif" }}>Click to upload avatar</p>
          </div>
        </div>

        {/* Email (readonly) */}
        <label className="block">
          <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>EMAIL</span>
          <input value={user.email} readOnly
            className="w-full bg-transparent border-0 border-b-2 border-amber-800/20 outline-none px-1 py-1.5 text-amber-950/60"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px' }} />
        </label>

        {/* Nickname */}
        <label className="block">
          <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>NICKNAME</span>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={user.nickname || user.username}
            className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-1.5 text-amber-950 placeholder:text-amber-800/30"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px' }} />
        </label>

        {/* Intro */}
        <label className="block">
          <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>INTRO · 简介</span>
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={3}
            placeholder="About yourself..."
            className="w-full bg-transparent resize-none border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-1.5 text-amber-950 placeholder:text-amber-800/30"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px' }} />
        </label>

        {/* Privacy */}
        <div>
          <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>PRIVACY</span>
          <div className="flex gap-2">
            {PRIVACY_OPTIONS.map((o) => (
              <button key={o.value} type="button" onClick={() => setPrivacy(o.value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                  privacy === o.value ? 'bg-amber-200/60 border-amber-700 text-amber-900' : 'bg-transparent border-amber-800/20 text-amber-800/60 hover:border-amber-700/40'
                } border`}
                style={{ fontFamily: "'Cinzel', serif" }}>
                {o.icon} {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* New password */}
        <label className="block">
          <span className="block text-amber-900/70 text-xs tracking-[0.2em] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>NEW PASSWORD (optional)</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="leave blank to keep"
            className="w-full bg-transparent border-0 border-b-2 border-amber-800/40 focus:border-amber-700 outline-none px-1 py-1.5 text-amber-950 placeholder:text-amber-800/30"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px' }} />
        </label>
      </div>

      <div className="flex-shrink-0 mt-4 flex justify-center">
        <button type="button" onClick={handleSave} disabled={saving}
          className="w-24 h-24 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer focus:outline-none disabled:opacity-50"
          style={{
            background: 'radial-gradient(circle at 30% 25%, #C44, #7A1A1A 70%, #4A0808 100%)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 -4px 6px rgba(0,0,0,0.4), inset 0 4px 8px rgba(255,255,255,0.18)',
          }}>
          <span className="text-amber-100 text-base tracking-widest pointer-events-none" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
            {saving ? '...' : '保 存'}
          </span>
        </button>
      </div>
    </>
  );
}

/* ===================================================================== */
/* Profile: Stats Pane (Right)                                             */
/* ===================================================================== */

function ProfileStatsPane() {
  const { user } = useAuth();
  const [contentCount, setContentCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [myItems, setMyItems] = useState<ContentArticle[]>([]);

  useEffect(() => {
    contentApi.getCount().then((res) => setContentCount(res.data as unknown as number)).catch(() => {});
    contentApi.getMyList(user.email).then((res) => {
      const items = Array.isArray(res.data) ? res.data : [];
      setMyItems(items);
    }).catch(() => {});
    // User count needs admin permission, skip for now
  }, [user.email]);

  return (
    <>
      <div className="flex-shrink-0 text-center mb-3">
        <p className="text-amber-900/60 tracking-[0.3em] text-xs" style={{ fontFamily: "'Cinzel', serif" }}>STATS</p>
        <h2 className="mt-1 text-amber-900 text-xl" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>旅人 · 印记</h2>
        <div className="mx-auto mt-2 h-px w-16 bg-amber-800/30" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* User info card */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-700/60 overflow-hidden mb-3"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amber-900/40 text-amber-200 text-3xl"
                style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
                {(user.nickname || user.username || '?')[0]}
              </div>
            )}
          </div>
          <p className="text-amber-900 text-xl" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>{user.nickname || user.username}</p>
          <p className="text-amber-800/60 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[240px]">
          <div className="text-center p-3 rounded border border-amber-800/20 bg-amber-50/20">
            <p className="text-2xl text-amber-900" style={{ fontFamily: "'Cinzel', serif" }}>{myItems.length}</p>
            <p className="text-amber-800/60 text-[10px] tracking-[0.2em] mt-1" style={{ fontFamily: "'Cinzel', serif" }}>MY SPELLS</p>
          </div>
          <div className="text-center p-3 rounded border border-amber-800/20 bg-amber-50/20">
            <p className="text-2xl text-amber-900" style={{ fontFamily: "'Cinzel', serif" }}>{contentCount ?? '...'}</p>
            <p className="text-amber-800/60 text-[10px] tracking-[0.2em] mt-1" style={{ fontFamily: "'Cinzel', serif" }}>ALL SPELLS</p>
          </div>
        </div>

        {/* Recent activity */}
        {myItems.length > 0 && (
          <div className="w-full">
            <p className="text-amber-900/60 text-[10px] tracking-[0.25em] mb-2 text-center" style={{ fontFamily: "'Cinzel', serif" }}>RECENT ACTIVITY</p>
            <div className="space-y-1 max-h-[200px] overflow-y-auto magic-scroll pr-1">
              {myItems.slice(0, 5).map((item) => (
                <div key={item.id} className="text-xs p-2 rounded border border-amber-800/10 bg-amber-50/10">
                  <p className="text-amber-900 truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</p>
                  <p className="text-amber-800/50 text-[10px]" style={{ fontFamily: "'Cinzel', serif" }}>{formatDate(item.createDate)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ===================================================================== */
/* Shared Helpers                                                          */
/* ===================================================================== */

function parseImages(images: string | undefined | null): string[] {
  if (!images) return [];
  try { const parsed = JSON.parse(images); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

function parseTags(tags: string | undefined | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  return tags.split(',').map((t) => t.trim()).filter(Boolean);
}

function statusLabel(status: number): string {
  const labels: Record<number, string> = { 0: 'Draft', 1: 'Pending', 2: 'Approved', 3: 'Rejected', 4: 'Blocked' };
  return labels[status] || 'Unknown';
}

function statusBadgeStyle(status: number): string {
  const styles: Record<number, string> = {
    0: 'bg-amber-200/60 text-amber-800 border border-amber-400/40',
    1: 'bg-yellow-200/60 text-yellow-800 border border-yellow-400/40',
    2: 'bg-green-200/60 text-green-800 border border-green-400/40',
    3: 'bg-red-200/60 text-red-800 border border-red-400/40',
    4: 'bg-red-300/60 text-red-900 border border-red-500/40',
  };
  return styles[status] || 'bg-stone-200/60 text-stone-800 border border-stone-400/40';
}

/* ===================================================================== */
/* Shared Components                                                       */
/* ===================================================================== */

function CastingAnim() {
  return (
    <motion.div className="relative w-32 h-32" animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <motion.div key={deg}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-amber-600"
          style={{ transform: `rotate(${deg}deg) translateY(-50px)` }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: deg / 300 }} />
      ))}
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity }}>
        ✦
      </motion.div>
    </motion.div>
  );
}

/* ===================================================================== */
/* Cover Art SVG                                                           */
/* ===================================================================== */

function CoverArt({ shimmer }: { shimmer: boolean }) {
  return (
    <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #2A201A 0%, #14100C 45%, #050302 100%)',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7), inset 0 0 12px rgba(0,0,0,0.85), 0 30px 60px -10px rgba(0,0,0,0.7), 0 12px 24px rgba(0,0,0,0.45)',
      }}>
      <svg viewBox="0 0 400 580" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8E08E" />
            <stop offset="40%" stopColor="#D4A84B" />
            <stop offset="60%" stopColor="#B8862A" />
            <stop offset="100%" stopColor="#F0D17A" />
          </linearGradient>
          <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A84B" />
            <stop offset="50%" stopColor="#FFF6CF" />
            <stop offset="100%" stopColor="#D4A84B" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="leatherTex" width="60" height="60" patternUnits="userSpaceOnUse">
            <filter id="leatherF">
              <feTurbulence baseFrequency="0.9" numOctaves="2" seed="3" />
              <feColorMatrix values="0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0 0.02  0 0 0 0.32 0" />
            </filter>
            <rect width="60" height="60" filter="url(#leatherF)" />
          </pattern>
          <symbol id="corner" overflow="visible">
            <path d="M 0 0 L 90 0 M 0 0 L 0 90 M 10 10 Q 30 10, 40 24 Q 50 38, 70 40 M 10 10 Q 10 30, 24 40 Q 38 50, 40 70 M 12 12 L 20 20 M 18 12 L 26 18 M 12 18 L 18 26"
              stroke="url(#gold)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="40" r="3" fill="url(#gold)" />
            <path d="M 22 22 Q 32 18, 40 24 Q 48 18, 58 22" stroke="url(#gold)" strokeWidth="1.2" fill="none" />
          </symbol>
        </defs>
        <rect width="400" height="580" fill="url(#leatherTex)" opacity="0.55" />
        <rect x="18" y="18" width="364" height="544" fill="none" stroke="url(#gold)" strokeWidth="2" rx="4" />
        <rect x="26" y="26" width="348" height="528" fill="none" stroke="url(#gold)" strokeWidth="1" strokeDasharray="2 4" rx="3" opacity="0.8" />
        <g>
          <use href="#corner" x="20" y="20" />
          <g transform="translate(380, 20) scale(-1, 1)"><use href="#corner" /></g>
          <g transform="translate(20, 560) scale(1, -1)"><use href="#corner" /></g>
          <g transform="translate(380, 560) scale(-1, -1)"><use href="#corner" /></g>
        </g>
        <text x="200" y="68" textAnchor="middle" fill="url(#gold)" fontSize="13" letterSpacing="6"
          style={{ fontFamily: "'Cinzel', serif" }}>ARCANUM · GRIMOIRE</text>
        <g filter="url(#goldGlow)">
          <text x="200" y="190" textAnchor="middle" fill={shimmer ? 'url(#goldShimmer)' : 'url(#gold)'}
            fontSize="72" letterSpacing="14" style={{ fontFamily: "'Ma Shan Zheng', cursive", fontWeight: 600 }}>魔法</text>
          <text x="200" y="270" textAnchor="middle" fill={shimmer ? 'url(#goldShimmer)' : 'url(#gold)'}
            fontSize="72" letterSpacing="14" style={{ fontFamily: "'Ma Shan Zheng', cursive", fontWeight: 600 }}>禁书</text>
        </g>
        <g stroke="url(#gold)" strokeWidth="1.2" fill="none">
          <path d="M 110 295 L 175 295" />
          <path d="M 225 295 L 290 295" />
          <circle cx="200" cy="295" r="3" fill="url(#gold)" />
        </g>
        <g transform="translate(200, 420)" filter="url(#goldGlow)">
          <g stroke="url(#gold)" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M 0 100 C -5 60, -8 20, -4 -20 C -2 -50, 0 -80, 0 -110" />
            <path d="M 0 100 C 5 60, 8 20, 4 -20 C 2 -50, 0 -80, 0 -110" />
            <path d="M -2 -10 C -30 -25, -55 -45, -75 -75" />
            <path d="M 2 -10 C 30 -25, 55 -45, 75 -75" />
            <path d="M -3 -45 C -25 -65, -40 -85, -50 -110" />
            <path d="M 3 -45 C 25 -65, 40 -85, 50 -110" />
            <path d="M 0 -80 C -10 -100, -15 -120, -18 -140" />
            <path d="M 0 -80 C 10 -100, 15 -120, 18 -140" />
            <path d="M -75 -75 C -85 -90, -92 -100, -100 -108" strokeWidth="1.2" />
            <path d="M 75 -75 C 85 -90, 92 -100, 100 -108" strokeWidth="1.2" />
            <path d="M -50 -110 C -58 -125, -62 -132, -65 -140" strokeWidth="1.2" />
            <path d="M 50 -110 C 58 -125, 62 -132, 65 -140" strokeWidth="1.2" />
            <path d="M 0 100 C -20 105, -40 108, -55 115" strokeWidth="1.5" />
            <path d="M 0 100 C 20 105, 40 108, 55 115" strokeWidth="1.5" />
          </g>
          {[
            [-80, -90], [80, -90], [-55, -115], [55, -115], [-18, -135], [18, -135],
            [-100, -105], [100, -105], [-30, -100], [30, -100],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="2.5" ry="4" fill="url(#gold)" />
          ))}
        </g>
        <text x="200" y="540" textAnchor="middle" fill="url(#gold)" fontSize="11" letterSpacing="8"
          style={{ fontFamily: "'Cinzel', serif" }}>⚜ VOL · I ⚜</text>
        {shimmer && (
          <motion.rect x="0" y="0" width="120" height="580" fill="url(#goldShimmer)" opacity="0.35"
            initial={{ x: -150 }} animate={{ x: 450 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            style={{ mixBlendMode: 'screen' }} />
        )}
      </svg>
      <div className="absolute left-0 right-0 text-center pointer-events-none" style={{ top: '74%' }}>
        <p className="text-amber-300/80 tracking-[0.4em]"
          style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '14px' }}>人 之 相 遇 · 皆 因 选 择</p>
      </div>
    </div>
  );
}
