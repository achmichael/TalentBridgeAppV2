"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay } from "react-native-reanimated"

const ChatScreen = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState([])

  const lastMessages = [
    "Can you review the latest design?",
    "I'll send the report by tomorrow",
    "Meeting at 3pm today",
    "Project deadline extended",
    "Thanks for your help!",
    "Let's discuss this in person",
    "I need your feedback on this",
    "Are you available for a call?",
    "The client approved our proposal",
    "Please check your email",
  ]

  const headerOpacity = useSharedValue(0)
  const listTranslateY = useSharedValue(50)

  const itemScales = useRef(new Map()).current

  // Initialize itemScale values for all employees
//   useEffect(() => {
//     employees.forEach((employee) => {
//       if (!itemScales.has(employee.id)) {
//         itemScales.set(employee.id, useSharedValue(0.9))
//       }
//     })
//   }, [employees, itemScales])

//   useEffect(() => {
//     // Initialize animations
//     headerOpacity.value = withTiming(1, { duration: 500 })
//     listTranslateY.value = withTiming(0, { duration: 600 })

//     // Filter employees based on search
//     if (searchQuery) {
//       const filtered = employees.filter((emp) => emp.username.toLowerCase().includes(searchQuery.toLowerCase()))
//       setFilteredEmployees(filtered)
//     } else {
//       setFilteredEmployees(employees)
//     }
//   }, [searchQuery, employees, headerOpacity, listTranslateY])

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    }
  })

  const listStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: listTranslateY.value }],
    }
  })

  const renderChatItem = ({ item, index }: { item: any, index: number}) => {
    const itemScale = itemScales.get(item.id)

    useEffect(() => {
      itemScale.value = withDelay(index * 100, withSpring(1, { damping: 12 }))
    }, [index, itemScale])

    const itemStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: itemScale.value }],
      }
    })

    // Generate random time for demo
    const hours = Math.floor(Math.random() * 12) + 1
    const minutes = Math.floor(Math.random() * 60)
    const ampm = Math.random() > 0.5 ? "AM" : "PM"
    const timeString = `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`

    // Get random last message
    const lastMessage = lastMessages[index % lastMessages.length]

    // Random unread count for some chats
    const hasUnread = Math.random() > 0.7
    const unreadCount = hasUnread ? Math.floor(Math.random() * 5) + 1 : 0

    return (
      <Animated.View style={itemStyle}>
        {/* @ts-ignore */}
        <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate("ChatRoom", { employee: item })}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: `https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"}/${(index % 70) + 1}.jpg`,
              }}
              style={styles.avatar}
            />
            {item.status === "aktif" && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>{item.username}</Text>
              <Text style={styles.chatTime}>{timeString}</Text>
            </View>

            <View style={styles.chatPreview}>
              <Text style={[styles.chatMessage, hasUnread && styles.unreadMessage]} numberOfLines={1}>
                {lastMessage}
              </Text>

              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.optionsButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Animated.View style={[styles.listContainer, listStyle]}>
        {filteredEmployees.length > 0 ? (
          <FlatList
            data={filteredEmployees}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#ddd" />
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>Start chatting with your employees</Text>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  optionsButton: {
    padding: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
  },
  chatPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginRight: 10,
  },
  unreadMessage: {
    color: "#333",
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: "#4c669f",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
})

export default ChatScreen
