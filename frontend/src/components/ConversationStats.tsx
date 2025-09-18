import { ConversationFeatures } from '../shared/types'
import { MessageCircle, Clock, Heart, Camera } from 'lucide-react'

interface ConversationStatsProps {
  features: ConversationFeatures
}

export function ConversationStats({ features }: ConversationStatsProps) {
  const formatReplyTime = (minutes: number) => {
    if (minutes === 0) return 'No data'
    if (minutes < 60) return `${Math.round(minutes)}m`
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`
    return `${Math.round(minutes / 1440)}d`
  }

  const stats = [
    {
      icon: MessageCircle,
      label: 'Message Balance',
      value: `${features.msg_count_A} : ${features.msg_count_B}`,
      detail: `${Math.round(features.reciprocity)}% balanced`
    },
    {
      icon: Clock,
      label: 'Reply Times',
      value: `${formatReplyTime(features.median_reply_minutes_AtoB)} / ${formatReplyTime(features.median_reply_minutes_BtoA)}`,
      detail: 'Median response time'
    },
    {
      icon: Heart,
      label: 'Emoji Intimacy',
      value: `${Math.round(features.emoji_intimacy)}%`,
      detail: 'Affectionate expressions'
    },
    {
      icon: Camera,
      label: 'Photo Sharing',
      value: `${Math.round(features.photos_share)}%`,
      detail: 'Visual moments shared'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Conversation Stats</h3>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.detail}</div>
            </div>
            <div className="text-lg font-bold text-primary">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Mini Chart for Sentiment */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Overall Sentiment</span>
          <span className="text-sm text-gray-600">
            {Math.round(features.sentiment_polarity)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${features.sentiment_polarity}%` }}
          />
        </div>
      </div>

      {/* Momentum Indicator */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Conversation Momentum</span>
          <span className={`text-sm font-semibold ${
            features.temporal_momentum > 60 ? 'text-green-600' :
            features.temporal_momentum > 40 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {features.temporal_momentum > 60 ? '↗️ Growing' :
             features.temporal_momentum > 40 ? '→ Stable' : '↘️ Declining'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              features.temporal_momentum > 60 ? 'bg-green-500' :
              features.temporal_momentum > 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${features.temporal_momentum}%` }}
          />
        </div>
      </div>
    </div>
  )
}