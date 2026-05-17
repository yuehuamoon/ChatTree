import { MagicBook } from './components/MagicBook';

export default function App() {
  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={{
        background:
          'radial-gradient(ellipse at center, #3A2A1A 0%, #1E140C 70%, #0A0604 100%)',
      }}
    >
      {/* 桌面木纹 */}
      <DeskTexture />
      {/* 烛光 */}
      <CandleLight />

      <div className="absolute inset-0">
        <MagicBook />
      </div>
    </div>
  );
}

function DeskTexture() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
      <defs>
        <filter id="wood">
          <feTurbulence type="turbulence" baseFrequency="0.012 0.18" numOctaves="3" seed="5" />
          <feColorMatrix
            values="0 0 0 0 0.30  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0.55 0"
          />
        </filter>
        <filter id="woodGrain">
          <feTurbulence type="turbulence" baseFrequency="0.005 0.6" numOctaves="2" seed="9" />
          <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.08  0 0 0 0 0.03  0 0 0 0.35 0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#wood)" />
      <rect width="100%" height="100%" filter="url(#woodGrain)" opacity="0.5" />
    </svg>
  );
}

function CandleLight() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vmin] h-[100vmin] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,200,120,0.18) 0%, rgba(255,180,90,0.08) 35%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)' }} />
    </div>
  );
}
