import { Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { Post } from '../App';

interface StatsProps {
  posts: Post[];
}

export function Stats({ posts }: StatsProps) {
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
  const avgEngagement = posts.length > 0
    ? Math.round((totalLikes + totalComments) / posts.length)
    : 0;

  return (
    <div className="max-w-md mx-auto px-4 py-3">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-lg font-bold">{totalLikes}</span>
          </div>
          <p className="text-xs text-white/50">总点赞</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
            <MessageCircle className="w-4 h-4" />
            <span className="text-lg font-bold">{totalComments}</span>
          </div>
          <p className="text-xs text-white/50">总评论</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-lg font-bold">{avgEngagement}</span>
          </div>
          <p className="text-xs text-white/50">平均互动</p>
        </div>
      </div>
    </div>
  );
}
