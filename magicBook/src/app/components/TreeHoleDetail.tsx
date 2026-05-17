import { motion } from 'motion/react';
import { X, Heart, MessageCircle, Clock } from 'lucide-react';
import { Post } from '../App';

interface TreeHoleDetailProps {
  post: Post;
  matches: Array<Post & { similarity: number }>;
  onClose: () => void;
  onLike: (id: string) => void;
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

export function TreeHoleDetail({ post, matches, onClose, onLike }: TreeHoleDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="w-full h-full max-w-6xl flex gap-6 items-center">
        {/* Left: Tree Hole View */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 h-full flex flex-col items-center justify-center relative"
        >
          {/* Branch with Leaves Background */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="w-full h-full">
              {/* Main branch */}
              <path
                d="M 0 50% L 100% 50%"
                stroke="#8B7355"
                strokeWidth="40"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Decorative leaves */}
              {[...Array(20)].map((_, i) => {
                const y = 30 + Math.random() * 40;
                const x = Math.random() * 100;
                const size = 20 + Math.random() * 30;
                return (
                  <motion.ellipse
                    key={i}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    rx={size}
                    ry={size * 0.6}
                    fill="#90EE90"
                    opacity={0.3 + Math.random() * 0.4}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      rotate: Math.random() * 360
                    }}
                    transition={{ delay: i * 0.05 }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Tree Hole with Door */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
          >
            {/* Tree hole background */}
            <div className="w-80 h-96 bg-gradient-to-br from-amber-900 to-amber-950 rounded-[40%] shadow-2xl relative overflow-hidden">
              {/* Wood texture */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-full bg-black/20"
                    style={{
                      left: `${i * 12}%`,
                      width: '2px'
                    }}
                  />
                ))}
              </div>

              {/* Door frame */}
              <div className="absolute inset-8 bg-gradient-to-br from-amber-800 to-amber-900 rounded-[30%] shadow-inner">
                {/* Door with gap */}
                <div className="absolute inset-4 flex gap-1">
                  {/* Left door */}
                  <div className="flex-1 bg-gradient-to-br from-amber-700 to-amber-800 rounded-l-[25%] border-r-2 border-amber-950 relative shadow-xl">
                    <div className="absolute inset-2 border-2 border-amber-600/30 rounded-l-[25%]"></div>
                    {/* Door handle */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-8 bg-yellow-600 rounded-full shadow-md"></div>
                  </div>

                  {/* Gap (crevice) */}
                  <div className="w-2 bg-black/80 relative shadow-2xl">
                    {/* Light coming through */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"></div>
                  </div>

                  {/* Right door */}
                  <div className="flex-1 bg-gradient-to-br from-amber-700 to-amber-800 rounded-r-[25%] border-l-2 border-amber-950 relative shadow-xl">
                    <div className="absolute inset-2 border-2 border-amber-600/30 rounded-r-[25%]"></div>
                    {/* Door handle */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-8 bg-yellow-600 rounded-full shadow-md"></div>
                  </div>
                </div>

                {/* "View" sign above door */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="px-6 py-2 bg-amber-100 rounded-full shadow-lg border-2 border-amber-800">
                    <p className="text-amber-900 font-bold text-sm">查看</p>
                  </div>
                </div>
              </div>

              {/* Moss/decoration around hole */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-green-700/30 rounded-full blur-sm"></div>
              <div className="absolute -bottom-2 left-1/4 w-16 h-6 bg-green-700/30 rounded-full blur-sm"></div>
            </div>

            {/* Post content floating in front */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full flex items-center justify-center text-lg">
                  {post.authorAvatar}
                </div>
                <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
              </div>

              <p className="text-gray-800 text-sm leading-relaxed mb-3">
                {post.content}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(post.timestamp)}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`w-3 h-3 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.comments.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: Matched Content */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 h-full flex flex-col bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">匹配内容</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {matches.length > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-sm">
                        {match.authorAvatar}
                      </div>
                      <span className="text-xs text-gray-600">{match.authorName}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {Math.round(match.similarity * 100)}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 leading-relaxed mb-2">
                    {match.content}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {match.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {match.comments.length}
                    </span>
                    <span className="ml-auto">{formatTime(match.timestamp)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">暂无匹配内容</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
