"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeInDown,
  Layout,
} from "react-native-reanimated";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/contexts/ThemeContext";

type MessageType = {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
};

const generateMockMessages = (
  employeeName: string | undefined
): MessageType[] => {
  return [
    {
      id: 1,
      text: `Hi, ${employeeName}! How's the project going?`,
      sender: "me",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 2,
      text: "Hello! It's going well. I've completed the initial design phase.",
      sender: "them",
      timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
    },
    {
      id: 3,
      text: "Great! Can you share the progress report by tomorrow?",
      sender: "me",
      timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    },
    {
      id: 4,
      text: "Sure, I'll prepare it and send it to you by noon.",
      sender: "them",
      timestamp: new Date(Date.now() - 3600000 * 21).toISOString(),
    },
    {
      id: 5,
      text: "Also, I wanted to discuss the timeline for the next phase.",
      sender: "them",
      timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
    {
      id: 6,
      text: "Let's schedule a meeting for that. How about tomorrow at 2 PM?",
      sender: "me",
      timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    },
    {
      id: 7,
      text: "That works for me. I'll prepare the agenda.",
      sender: "them",
      timestamp: new Date(Date.now() - 3600000 * 9).toISOString(),
    },
    {
      id: 8,
      text: "Perfect! Looking forward to seeing the progress.",
      sender: "me",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];
};

const ChatRoom: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //   const { employee } = route.params as RouteParams
  const { user: employee } = useAuth();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<MessageType[]>(
    generateMockMessages(employee?.username)
  );
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const headerOpacity = useSharedValue(0);
  const inputContainerTranslateY = useSharedValue(50);

  useEffect(() => {
    // Initialize animations
    headerOpacity.value = withTiming(1, { duration: 500 });
    inputContainerTranslateY.value = withTiming(0, { duration: 600 });

    const typingInterval = setInterval(() => {
      setIsTyping(Math.random() > 0.7);
    }, 3000);

    return () => clearInterval(typingInterval);
  }, []);

  // Animated styles - defined at the top level
  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: inputContainerTranslateY.value }],
    };
  });

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = (): void => {
    if (inputText.trim() === "") return;

    // Add new message
    const newMessage: MessageType = {
      id: messages.length + 1,
      text: inputText.trim(),
      sender: "me",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate reply after delay
    setTimeout(() => {
      setIsTyping(true);

      setTimeout(() => {
        const replyMessage: MessageType = {
          id: messages.length + 2,
          text: getRandomReply(),
          sender: "them",
          timestamp: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, replyMessage]);
        setIsTyping(false);

        // Scroll to bottom again
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 2000 + Math.random() * 2000);
    }, 1000);
  };

  const getRandomReply = (): string => {
    const replies = [
      "I'll look into that right away.",
      "Thanks for the update!",
      "Got it, I'll handle it.",
      "Let me check and get back to you.",
      "That sounds good to me.",
      "I'll need more information about this.",
      "Can we discuss this in our next meeting?",
      "I've already started working on it.",
      "I'll have it ready by tomorrow.",
      "Is there anything else you need from me?",
    ];

    return replies[Math.floor(Math.random() * replies.length)];
  };

  const renderMessageItem = ({
    item,
    index,
  }: {
    item: MessageType;
    index: number;
  }) => {
    const isMe = item.sender === "me";
    const showTimestamp =
      index === 0 ||
      new Date(item.timestamp).getDate() !==
        new Date(messages[index - 1].timestamp).getDate();

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).springify()}
        layout={Layout.springify()}
      >
        {showTimestamp && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {new Date(item.timestamp).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            isMe ? styles.myMessageContainer : styles.theirMessageContainer,
          ]}
        >
          {!isMe && (
            <Image
              source={{
                uri: `https://randomuser.me/api/portraits/${
                  1 ? "men" : "women"
                }/${(1 % 70) + 1}.jpg`,
              }}
              style={styles.messageBubbleAvatar}
            />
          )}

          <View
            style={[
              styles.messageBubble,
              isMe ? {...styles.myMessageBubble, backgroundColor: theme.accent} : styles.theirMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.theirMessageText,
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                isMe ? styles.myMessageTime : styles.theirMessageTime,
              ]}
            >
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.userInfo} onPress={() => {}}>
            <Image
              source={{
                uri: `https://randomuser.me/api/portraits/${
                  1 % 2 === 0 ? "men" : "women"
                }/${(1 % 70) + 1}.jpg`,
              }}
              style={styles.userAvatar}
            />
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{employee?.username}</Text>
              <Text style={styles.userStatus}>
                {employee?.email === "aktif" ? "Online" : "Offline"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() =>
                // @ts-ignore
                navigation.navigate("Call" as never, { employee } as never)
              }
            >
              <Ionicons name="call-outline" size={22} color="#4c669f" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
              <Ionicons name="ellipsis-vertical" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={messages.length}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {isTyping && (
          <Animated.View entering={FadeIn} style={styles.typingContainer}>
            <View style={styles.typingBubble}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, { marginLeft: 4 }]} />
              <View style={[styles.typingDot, { marginLeft: 4 }]} />
            </View>
            <Text style={styles.typingText}>
              {employee?.username} is typing...
            </Text>
          </Animated.View>
        )}

        <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color="#4c669f" />
          </TouchableOpacity>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === "" ? styles.sendButtonDisabled : {},
            ]}
            onPress={handleSend}
            disabled={inputText.trim() === ""}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userTextInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userStatus: {
    fontSize: 12,
    color: "#4CAF50",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "rgba(0,0,0,0.02)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  theirMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubbleAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "100%",
  },
  myMessageBubble: {
    borderBottomRightRadius: 5,
  },
  theirMessageBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1.5,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  myMessageText: {
    color: "#fff",
  },
  theirMessageText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 11,
    alignSelf: "flex-end",
  },
  myMessageTime: {
    color: "rgba(255,255,255,0.7)",
  },
  theirMessageTime: {
    color: "#999",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginBottom: 10,
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#999",
    opacity: 0.5,
  },
  typingText: {
    fontSize: 12,
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  attachButton: {
    padding: 5,
    marginRight: 5,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 10,
  },
  emojiButton: {
    padding: 5,
  },
  sendButton: {
    backgroundColor: "#4c669f",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
});

export default ChatRoom;
