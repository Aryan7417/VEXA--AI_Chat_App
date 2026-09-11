export type Screen =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'profile-setup'
  | 'home'
  | 'chat'
  | 'chats'
  | 'search'
  | 'profile'
  | 'settings'
  | 'model-selection'

export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  liked?: boolean
  disliked?: boolean
}

export interface Conversation {
  id: string
  title: string
  preview: string
  timestamp: Date
  messages: Message[]
  model: Model
}

export type Model = 'fast' | 'smart' | 'code'

export interface AppState {
  screen: Screen
  prevScreen: Screen | null
  phone: string
  userName: string
  userAvatar: string | null
  conversations: Conversation[]
  activeConversationId: string | null
  model: Model
  theme: 'dark' | 'darker'
  language: string
  notifications: boolean
  streamingMessages: boolean
}
