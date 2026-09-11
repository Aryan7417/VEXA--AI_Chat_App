import { useState, useCallback } from "react"
import { AppState, Screen, Model, Conversation, Message } from "./types"
import PhoneFrame from "./components/PhoneFrame"
import SplashScreen from "./screens/SplashScreen"
import OnboardingScreen from "./screens/OnboardingScreen"
import PhoneLoginScreen from "./screens/PhoneLoginScreen"
import OTPScreen from "./screens/OTPScreen"
import CreateProfileScreen from "./screens/CreateProfileScreen"
import HomeScreen from "./screens/HomeScreen"
import ChatScreen from "./screens/ChatScreen"
import ChatsScreen from "./screens/ChatsScreen"
import SearchScreen from "./screens/SearchScreen"
import ProfileScreen from "./screens/ProfileScreen"
import SettingsScreen from "./screens/SettingsScreen"
import ModelSelectionScreen from "./screens/ModelSelectionScreen"

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "demo-1",
    title: "Python web scraper help",
    preview: "Here's a complete web scraper using BeautifulSoup...",
    timestamp: new Date(Date.now() - 3600000),
    model: "code",
    messages: [
      { id: "m1", role: "user", content: "Write a Python web scraper for news articles", timestamp: new Date(Date.now() - 3600000) },
      { id: "m2", role: "ai", content: "Here's a complete web scraper using BeautifulSoup:\n\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\ndef scrape_news(url):\n    response = requests.get(url)\n    soup = BeautifulSoup(response.text, 'html.parser')\n    articles = soup.find_all('article')\n    return [a.get_text() for a in articles]\n```\n\nThis will extract all article text from the target page.", timestamp: new Date(Date.now() - 3500000) }
    ]
  },
  {
    id: "demo-2",
    title: "Explain quantum computing",
    preview: "Quantum computing harnesses the principles of quantum mechanics...",
    timestamp: new Date(Date.now() - 86400000),
    model: "smart",
    messages: [
      { id: "m3", role: "user", content: "Explain quantum computing in simple terms", timestamp: new Date(Date.now() - 86400000) },
      { id: "m4", role: "ai", content: "Quantum computing harnesses the principles of quantum mechanics to process information in fundamentally different ways than classical computers.\n\n**Key concepts:**\n- **Qubits** — Unlike classical bits (0 or 1), qubits can exist in superposition — both 0 and 1 simultaneously\n- **Entanglement** — Qubits can be linked so that measuring one instantly affects another\n- **Interference** — Used to amplify correct answers and cancel wrong ones\n\nThink of it like this: a classical computer tries every door one by one, while a quantum computer tries all doors at once.", timestamp: new Date(Date.now() - 86300000) }
    ]
  }
]

const initialState: AppState = {
  screen: "splash",
  prevScreen: null,
  phone: "",
  userName: "",
  userAvatar: null,
  conversations: DEMO_CONVERSATIONS,
  activeConversationId: null,
  model: "smart",
  theme: "dark",
  language: "English",
  notifications: true,
  streamingMessages: true
}

export default function App() {
  const [state, setState] = useState<AppState>(initialState)
  const [pendingMessage, setPendingMessage] = useState<string | undefined>()

  const navigate = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, prevScreen: prev.screen, screen }))
  }, [])

  const handleSplashNext = (screen: Screen) => navigate(screen)

  const handleLoginNext = (screen: Screen, phone?: string) => {
    if (phone) setState(prev => ({ ...prev, phone }))
    navigate(screen)
  }

  const handleProfileNext = (screen: Screen, name: string, avatar: string | null) => {
    setState(prev => ({ ...prev, userName: name, userAvatar: avatar }))
    navigate(screen)
  }

  const handleNewChat = (message: string, model: Model) => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: message.slice(0, 40) + (message.length > 40 ? "..." : ""),
      preview: "Starting conversation...",
      timestamp: new Date(),
      model,
      messages: []
    }
    setState(prev => ({
      ...prev,
      conversations: [newConv, ...prev.conversations],
      activeConversationId: newConv.id
    }))
    setPendingMessage(message)
    navigate("chat")
  }

  const handleOpenChat = (convId: string) => {
    setState(prev => ({ ...prev, activeConversationId: convId }))
    setPendingMessage(undefined)
  }

  const handleDeleteChat = (convId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.filter(c => c.id !== convId),
      activeConversationId: prev.activeConversationId === convId ? null : prev.activeConversationId
    }))
  }

  const handleRenameChat = (convId: string, name: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c => c.id === convId ? { ...c, title: name } : c)
    }))
  }

  const handleAddMessage = (convId: string, msg: Message) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === convId ? { ...c, messages: [...c.messages, msg], preview: msg.content.slice(0, 60) } : c
      )
    }))
  }

  const handleSelectModel = (model: Model) => {
    setState(prev => ({ ...prev, model }))
  }

  const handleUpdate = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const handleLogout = () => {
    setState({ ...initialState, screen: "login", conversations: DEMO_CONVERSATIONS })
  }

  const renderScreen = () => {
    switch (state.screen) {
      case "splash":
        return <SplashScreen onNext={handleSplashNext} />
      case "onboarding":
        return <OnboardingScreen onNext={navigate} />
      case "login":
        return <PhoneLoginScreen onNext={handleLoginNext} />
      case "otp":
        return <OTPScreen phone={state.phone} onNext={navigate} onBack={() => navigate("login")} />
      case "profile-setup":
        return <CreateProfileScreen onNext={handleProfileNext} />
      case "home":
        return <HomeScreen state={state} onNavigate={navigate} onNewChat={handleNewChat} />
      case "chat":
        return (
          <ChatScreen
            state={state}
            initialMessage={pendingMessage}
            onNavigate={navigate}
            onAddMessage={handleAddMessage}
          />
        )
      case "chats":
        return (
          <ChatsScreen
            state={state}
            onNavigate={navigate}
            onOpenChat={handleOpenChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />
        )
      case "search":
        return <SearchScreen state={state} onNavigate={navigate} onOpenChat={handleOpenChat} />
      case "profile":
        return <ProfileScreen state={state} onNavigate={navigate} onLogout={handleLogout} />
      case "settings":
        return <SettingsScreen state={state} onNavigate={navigate} onUpdate={handleUpdate} />
      case "model-selection":
        return (
          <ModelSelectionScreen
            currentModel={state.model}
            onSelect={handleSelectModel}
            onNavigate={navigate}
            prevScreen={state.prevScreen}
          />
        )
      default:
        return <SplashScreen onNext={handleSplashNext} />
    }
  }

  return (
    <PhoneFrame>
      {renderScreen()}
    </PhoneFrame>
  )
}
