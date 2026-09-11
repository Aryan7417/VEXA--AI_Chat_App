import React, { useCallback, useState } from "react";

import {
  AppState,
  Screen,
  Model,
  Conversation,
  Message,
} from "../types";

import PhoneFrame from "./components/PhoneFrame";

import SplashScreen from "./screen/SplashScreen";
import OnboardingScreen from "./screen/OnboardingScreen";
import PhoneLoginScreen from "./screen/PhoneLoginScreen";
import OTPScreen from "./screen/OTPScreen";
import CreateProfileScreen from "./screen/CreateProfileScreen";
import HomeScreen from "./screen/HomeScreen";
import ChatScreen from "./screen/ChatScreen";
import ChatsScreen from "./screen/ChatScreen";
import SearchScreen from "./screen/SearchScreen";
import ProfileScreen from "./screen/ProfileScreen";
import SettingsScreen from "./screen/SettingScreen";
import ModelSelectionScreen from "./screen/ModelSelectionScreen";


/* -------------------------------------------------------------------------- */
/*                         DEMO CONVERSATIONS                                */
/* -------------------------------------------------------------------------- */

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "demo-1",
    title: "Python web scraper help",
    preview:
      "Here's a complete web scraper using BeautifulSoup...",
    timestamp: new Date(Date.now() - 3600000),
    model: "code",

    messages: [
      {
        id: "m1",
        role: "user",
        content:
          "Write a Python web scraper for news articles",
        timestamp: new Date(Date.now() - 3600000),
      },

      {
        id: "m2",
        role: "ai",
        content:
          "Here's a complete web scraper using BeautifulSoup:\n\n" +
          "```python\n" +
          "import requests\n" +
          "from bs4 import BeautifulSoup\n\n" +
          "def scrape_news(url):\n" +
          "    response = requests.get(url)\n" +
          "    soup = BeautifulSoup(response.text, 'html.parser')\n" +
          "    articles = soup.find_all('article')\n" +
          "    return [a.get_text() for a in articles]\n" +
          "```\n\n" +
          "This will extract all article text from the target page.",

        timestamp: new Date(Date.now() - 3500000),
      },
    ],
  },

  {
    id: "demo-2",
    title: "Explain quantum computing",
    preview:
      "Quantum computing harnesses the principles of quantum mechanics...",
    timestamp: new Date(Date.now() - 86400000),
    model: "smart",

    messages: [
      {
        id: "m3",
        role: "user",
        content:
          "Explain quantum computing in simple terms",
        timestamp: new Date(Date.now() - 86400000),
      },

      {
        id: "m4",
        role: "ai",
        content:
          "Quantum computing harnesses the principles of quantum mechanics " +
          "to process information in fundamentally different ways than " +
          "classical computers.\n\n" +

          "**Key concepts:**\n" +
          "- **Qubits** — Unlike classical bits (0 or 1), qubits can exist " +
          "in superposition — both 0 and 1 simultaneously\n" +
          "- **Entanglement** — Qubits can be linked so that measuring one " +
          "instantly affects another\n" +
          "- **Interference** — Used to amplify correct answers and cancel " +
          "wrong ones\n\n" +

          "Think of it like this: a classical computer tries every door " +
          "one by one, while a quantum computer tries all doors at once.",

        timestamp: new Date(Date.now() - 86300000),
      },
    ],
  },
];


/* -------------------------------------------------------------------------- */
/*                              INITIAL STATE                                 */
/* -------------------------------------------------------------------------- */

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

  streamingMessages: true,
};


/* -------------------------------------------------------------------------- */
/*                                  APP                                       */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [state, setState] =
    useState<AppState>(initialState);

  const [pendingMessage, setPendingMessage] =
    useState<string | undefined>(undefined);


  /* ---------------------------------------------------------------------- */
  /*                              NAVIGATION                                */
  /* ---------------------------------------------------------------------- */

  const navigate = useCallback((screen: Screen) => {
    setState((prev) => ({
      ...prev,

      prevScreen: prev.screen,

      screen,
    }));
  }, []);


  /* ---------------------------------------------------------------------- */
  /*                              SPLASH                                     */
  /* ---------------------------------------------------------------------- */

  const handleSplashNext = (screen: Screen) => {
    navigate(screen);
  };


  /* ---------------------------------------------------------------------- */
  /*                              LOGIN                                      */
  /* ---------------------------------------------------------------------- */

  const handleLoginNext = (
    screen: Screen,
    phone?: string
  ) => {
    setState((prev) => ({
      ...prev,

      ...(phone ? { phone } : {}),

      prevScreen: prev.screen,

      screen,
    }));
  };


  /* ---------------------------------------------------------------------- */
  /*                           PROFILE SETUP                                 */
  /* ---------------------------------------------------------------------- */

  const handleProfileNext = (
    screen: Screen,
    name: string,
    avatar: string | null
  ) => {
    setState((prev) => ({
      ...prev,

      userName: name,

      userAvatar: avatar,

      prevScreen: prev.screen,

      screen,
    }));
  };


  /* ---------------------------------------------------------------------- */
  /*                              NEW CHAT                                   */
  /* ---------------------------------------------------------------------- */

  const handleNewChat = (
    message: string,
    model: Model
  ) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),

      title:
        message.slice(0, 40) +
        (message.length > 40 ? "..." : ""),

      preview: "Starting conversation...",

      timestamp: new Date(),

      model,

      messages: [],
    };

    setState((prev) => ({
      ...prev,

      conversations: [
        newConversation,
        ...prev.conversations,
      ],

      activeConversationId: newConversation.id,
    }));

    setPendingMessage(message);

    navigate("chat");
  };


  /* ---------------------------------------------------------------------- */
  /*                            OPEN CHAT                                    */
  /* ---------------------------------------------------------------------- */

  const handleOpenChat = (conversationId: string) => {
    setState((prev) => ({
      ...prev,

      activeConversationId: conversationId,
    }));

    setPendingMessage(undefined);

    navigate("chat");
  };


  /* ---------------------------------------------------------------------- */
  /*                            DELETE CHAT                                  */
  /* ---------------------------------------------------------------------- */

  const handleDeleteChat = (
    conversationId: string
  ) => {
    setState((prev) => ({
      ...prev,

      conversations:
        prev.conversations.filter(
          (conversation) =>
            conversation.id !== conversationId
        ),

      activeConversationId:
        prev.activeConversationId === conversationId
          ? null
          : prev.activeConversationId,
    }));
  };


  /* ---------------------------------------------------------------------- */
  /*                            RENAME CHAT                                  */
  /* ---------------------------------------------------------------------- */

  const handleRenameChat = (
    conversationId: string,
    name: string
  ) => {
    setState((prev) => ({
      ...prev,

      conversations:
        prev.conversations.map(
          (conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  title: name,
                }
              : conversation
        ),
    }));
  };


  /* ---------------------------------------------------------------------- */
  /*                            ADD MESSAGE                                  */
  /* ---------------------------------------------------------------------- */

  const handleAddMessage = (
    conversationId: string,
    message: Message
  ) => {
    setState((prev) => ({
      ...prev,

      conversations:
        prev.conversations.map(
          (conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,

                  messages: [
                    ...conversation.messages,
                    message,
                  ],

                  preview:
                    message.content.slice(0, 60),
                }
              : conversation
        ),
    }));
  };


  /* ---------------------------------------------------------------------- */
  /*                            MODEL                                        */
  /* ---------------------------------------------------------------------- */

  const handleSelectModel = (model: Model) => {
    setState((prev) => ({
      ...prev,

      model,
    }));
  };


  /* ---------------------------------------------------------------------- */
  /*                            SETTINGS                                     */
  /* ---------------------------------------------------------------------- */

  const handleUpdate = (
    updates: Partial<AppState>
  ) => {
    setState((prev) => ({
      ...prev,

      ...updates,
    }));
  };


  /* ---------------------------------------------------------------------- */
  /*                            LOGOUT                                       */
  /* ---------------------------------------------------------------------- */

  const handleLogout = () => {
    setState({
      ...initialState,

      screen: "login",

      conversations: DEMO_CONVERSATIONS,
    });

    setPendingMessage(undefined);
  };


  /* ---------------------------------------------------------------------- */
  /*                         SCREEN RENDERING                                */
  /* ---------------------------------------------------------------------- */

  const renderScreen = () => {
    switch (state.screen) {
      case "splash":
        return (
          <SplashScreen
            onNext={handleSplashNext}
          />
        );

      case "onboarding":
        return (
          <OnboardingScreen
            onNext={navigate}
          />
        );

      case "login":
        return (
          <PhoneLoginScreen
            onNext={handleLoginNext}
          />
        );

      case "otp":
        return (
          <OTPScreen
            phone={state.phone}
            onNext={navigate}
            onBack={() => navigate("login")}
          />
        );

      case "profile-setup":
        return (
          <CreateProfileScreen
            onNext={handleProfileNext}
          />
        );

      case "home":
        return (
          <HomeScreen
            state={state}
            onNavigate={navigate}
            onNewChat={handleNewChat}
          />
        );

      case "chat":
        return (
          <ChatScreen
            state={state}
            initialMessage={pendingMessage}
            onNavigate={navigate}
            onAddMessage={handleAddMessage}
          />
        );

      case "chats":
        return (
          <ChatsScreen
            state={state}
            onNavigate={navigate}
            onOpenChat={handleOpenChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />
        );

      case "search":
        return (
          <SearchScreen
            state={state}
            onNavigate={navigate}
            onOpenChat={handleOpenChat}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            state={state}
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );

      case "settings":
        return (
          <SettingsScreen
            state={state}
            onNavigate={navigate}
            onUpdate={handleUpdate}
          />
        );

      case "model-selection":
        return (
          <ModelSelectionScreen
            currentModel={state.model}
            onSelect={handleSelectModel}
            onNavigate={navigate}
            prevScreen={state.prevScreen}
          />
        );

      default:
        return (
          <SplashScreen
            onNext={handleSplashNext}
          />
        );
    }
  };


  /* ---------------------------------------------------------------------- */
  /*                                UI                                       */
  /* ---------------------------------------------------------------------- */

  return (
    <PhoneFrame>
      {renderScreen()}
    </PhoneFrame>
  );
}