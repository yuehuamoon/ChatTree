import { motion } from 'motion/react';
import { Sparkles, ImageIcon } from 'lucide-react';
import type { ContentArticle } from '@/types';

interface ContentCardProps {
  item: ContentArticle;
  index?: number;
  onClick?: (item: ContentArticle) => void;
  showAuthor?: boolean;
  showDate?: boolean;
}

export function ContentCard({ item, index = 0, onClick, showAuthor = true, showDate = true }: ContentCardProps) {
  const imgs = item.images ? (() => {
    try { return JSON.parse(item.images) as string[]; }
    catch { return []; }
  })() : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      onClick={() => onClick?.(item)}
      className="rounded-lg border border-amber-800/30 p-4 bg-stone-900/60 cursor-pointer hover:bg-stone-900/80 hover:border-amber-700/50 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-700/60 shrink-0" />
        <h3 className="text-amber-200 text-base line-clamp-1" style={{ fontFamily: "'Ma Shan Zheng', cursive" }}>
          {item.title || 'Untitled'}
        </h3>
      </div>
      <p className="text-amber-300/50 text-sm line-clamp-2 ml-5 mb-3"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {item.content}
      </p>
      <div className="flex items-center justify-between ml-5">
        {showAuthor && (
          <span className="text-amber-400/30 text-xs tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
            — {item.nickname || item.email || 'Unknown'}
          </span>
        )}
        <div className="flex items-center gap-3 ml-auto">
          {imgs.length > 0 && (
            <span className="text-amber-400/30 text-xs flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> {imgs.length}
            </span>
          )}
          {showDate && item.createTime && (
            <span className="text-amber-400/20 text-[10px] tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
              {new Date(item.createTime).toLocaleDateString('zh-CN')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
