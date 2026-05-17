import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { Heart, MessageCircle, Bookmark, X, Check, Clock, Sparkles } from 'lucide-react';
import { Post } from '../App';

interface CardStackProps {
  posts: Post[];
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onComment: (id: string, content: string) => void;
  showSimilarity?: boolean;
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
}

export function CardStack({ posts, onLike, onBookmark, onComment, showSimilarity }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= posts.length) return;

    setExitDirection(direction);

    if (direction === 'right') {
      onLike(posts[currentIndex].id);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
    }, 300);
  };

  const handleBookmarkClick = () => {
    if (currentIndex < posts.length) {
      onBookmark(posts[currentIndex].id);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white/50" />
          </div>
          <p className="text-white/70 text-lg">暂无内容</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= posts.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <p className="text-white text-lg font-medium mb-2">已浏览完所有内容</p>
          <p className="text-white/70">向上滑动返回</p>
        </div>
      </div>
    );
  }

  const visibleCards = posts.slice(currentIndex, currentIndex + 3);
  const currentPost = posts[currentIndex];

  return (
    <div className="relative h-full flex items-center justify-center px-4">
      {/* Card Stack */}
      <div className="relative w-full max-w-md h-[600px]">
        {visibleCards.map((post, index) => {
          const isTop = index === 0;
          const scale = 1 - index * 0.05;
          const yOffset = index * 20;

          return (
            <SwipeableCard
              key={post.id}
              post={post}
              isTop={isTop}
              scale={scale}
              yOffset={yOffset}
              onSwipe={handleSwipe}
              exitDirection={exitDirection}
              showSimilarity={showSimilarity && 'similarity' in post}
              similarity={'similarity' in post ? (post as any).similarity : undefined}
            />
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-8">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-white/10 backdrop-blur-md border-2 border-red-500/50 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-all hover:scale-110"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>

        <button
          onClick={handleBookmarkClick}
          className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
        >
          <Bookmark className={`w-6 h-6 ${currentPost?.isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
        </button>

        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-white/10 backdrop-blur-md border-2 border-green-500/50 rounded-full flex items-center justify-center hover:bg-green-500/20 transition-all hover:scale-110"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>
      </div>
    </div>
  );
}

interface SwipeableCardProps {
  post: Post;
  isTop: boolean;
  scale: number;
  yOffset: number;
  onSwipe: (direction: 'left' | 'right') => void;
  exitDirection: 'left' | 'right' | null;
  showSimilarity?: boolean;
  similarity?: number;
}

function SwipeableCard({ post, isTop, scale, yOffset, onSwipe, exitDirection, showSimilarity, similarity }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? {
              x: exitDirection === 'right' ? 500 : -500,
              opacity: 0,
              rotate: exitDirection === 'right' ? 25 : -25,
              transition: { duration: 0.3 }
            }
          : {
              scale,
              y: yOffset,
              rotate: 0
            }
      }
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1
      }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 flex flex-col">
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {showSimilarity && similarity !== undefined && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
              <Sparkles className="w-3 h-3" />
              {Math.round(similarity * 100)}% 匹配
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-900 text-2xl leading-relaxed text-center font-medium">
            {post.content}
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(post.timestamp)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>

          {/* Swipe Hint */}
          {isTop && (
            <div className="text-center text-xs text-gray-400">
              ← 跳过 · 喜欢 →
            </div>
          )}
        </div>
      </div>

      {/* Swipe Indicators */}
      {isTop && (
        <>
          <motion.div
            style={{
              opacity: likeOpacity
            }}
            className="absolute top-12 right-12 pointer-events-none"
          >
            <div className="px-4 py-2 bg-green-500 text-white font-bold text-lg rounded-lg rotate-12 border-4 border-green-600">
              喜欢
            </div>
          </motion.div>

          <motion.div
            style={{
              opacity: skipOpacity
            }}
            className="absolute top-12 left-12 pointer-events-none"
          >
            <div className="px-4 py-2 bg-red-500 text-white font-bold text-lg rounded-lg -rotate-12 border-4 border-red-600">
              跳过
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
