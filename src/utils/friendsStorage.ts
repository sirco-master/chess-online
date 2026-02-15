import { Friend, FriendRequest, DMConversation, DMMessage, BlockedUser, Notification } from '../types'

const FRIENDS_KEY = 'chess_friends'
const FRIEND_REQUESTS_KEY = 'chess_friend_requests'
const DM_CONVERSATIONS_KEY = 'chess_dm_conversations'
const BLOCKED_USERS_KEY = 'chess_blocked_users'
const NOTIFICATIONS_KEY = 'chess_notifications'

// Friends
export const getFriends = (userId: string): Friend[] => {
  const friends = localStorage.getItem(`${FRIENDS_KEY}_${userId}`)
  return friends ? JSON.parse(friends) : []
}

export const saveFriends = (userId: string, friends: Friend[]): void => {
  localStorage.setItem(`${FRIENDS_KEY}_${userId}`, JSON.stringify(friends))
}

export const addFriend = (userId: string, friend: Friend): void => {
  const friends = getFriends(userId)
  friends.push(friend)
  saveFriends(userId, friends)
}

export const removeFriend = (userId: string, friendUserId: string): void => {
  const friends = getFriends(userId)
  const filtered = friends.filter(f => f.userId !== friendUserId)
  saveFriends(userId, filtered)
}

export const isFriend = (userId: string, friendUserId: string): boolean => {
  const friends = getFriends(userId)
  return friends.some(f => f.userId === friendUserId && f.status === 'accepted')
}

// Friend Requests
export const getFriendRequests = (userId: string): FriendRequest[] => {
  const requests = localStorage.getItem(`${FRIEND_REQUESTS_KEY}_${userId}`)
  return requests ? JSON.parse(requests) : []
}

export const saveFriendRequests = (userId: string, requests: FriendRequest[]): void => {
  localStorage.setItem(`${FRIEND_REQUESTS_KEY}_${userId}`, JSON.stringify(requests))
}

export const sendFriendRequest = (fromUserId: string, fromUsername: string, fromAvatar: string, toUserId: string): FriendRequest => {
  const request: FriendRequest = {
    id: `fr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromUserId,
    fromUsername,
    fromAvatar,
    toUserId,
    sentAt: Date.now(),
    status: 'pending'
  }
  
  const requests = getFriendRequests(toUserId)
  requests.push(request)
  saveFriendRequests(toUserId, requests)
  
  // Create notification
  addNotification(toUserId, {
    id: `notif-${Date.now()}`,
    type: 'friend-request',
    fromUserId,
    fromUsername,
    message: `${fromUsername} sent you a friend request`,
    timestamp: Date.now(),
    read: false,
    data: { requestId: request.id }
  })
  
  return request
}

export const acceptFriendRequest = (userId: string, requestId: string): void => {
  const requests = getFriendRequests(userId)
  const request = requests.find(r => r.id === requestId)
  
  if (request && request.status === 'pending') {
    request.status = 'accepted'
    saveFriendRequests(userId, requests)
    
    // Add to both users' friend lists
    addFriend(userId, {
      userId: request.fromUserId,
      username: request.fromUsername,
      avatar: request.fromAvatar,
      status: 'accepted',
      addedAt: Date.now(),
      userStatus: 'offline',
      elo: 1200
    })
    
    // Add reciprocal friendship (would need to fetch current user's info)
    // This is simplified - in a real app, you'd need the user's profile
  }
}

export const declineFriendRequest = (userId: string, requestId: string): void => {
  const requests = getFriendRequests(userId)
  const request = requests.find(r => r.id === requestId)
  
  if (request) {
    request.status = 'declined'
    saveFriendRequests(userId, requests)
  }
}

export const getPendingFriendRequestCount = (userId: string): number => {
  const requests = getFriendRequests(userId)
  return requests.filter(r => r.status === 'pending').length
}

// DM Conversations
export const getDMConversations = (userId: string): DMConversation[] => {
  const conversations = localStorage.getItem(`${DM_CONVERSATIONS_KEY}_${userId}`)
  return conversations ? JSON.parse(conversations) : []
}

export const saveDMConversations = (userId: string, conversations: DMConversation[]): void => {
  localStorage.setItem(`${DM_CONVERSATIONS_KEY}_${userId}`, JSON.stringify(conversations))
}

export const getDMConversation = (userId: string, withUserId: string): DMConversation | null => {
  const conversations = getDMConversations(userId)
  return conversations.find(c => c.withUserId === withUserId) || null
}

export const sendDMMessage = (fromUserId: string, toUserId: string, toUsername: string, toAvatar: string, message: string): DMMessage => {
  const dmMessage: DMMessage = {
    id: `dm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromUserId,
    toUserId,
    message,
    timestamp: Date.now(),
    read: false
  }
  
  // Add to sender's conversations
  const senderConvs = getDMConversations(fromUserId)
  let senderConv = senderConvs.find(c => c.withUserId === toUserId)
  if (!senderConv) {
    senderConv = {
      withUserId: toUserId,
      withUsername: toUsername,
      withAvatar: toAvatar,
      messages: [],
      lastMessageAt: Date.now(),
      unreadCount: 0
    }
    senderConvs.push(senderConv)
  }
  senderConv.messages.push(dmMessage)
  senderConv.lastMessageAt = Date.now()
  saveDMConversations(fromUserId, senderConvs)
  
  // Would need to add to receiver's conversations too in a real app
  // For now, this is a simplified version
  
  return dmMessage
}

export const markDMAsRead = (userId: string, withUserId: string): void => {
  const conversations = getDMConversations(userId)
  const conv = conversations.find(c => c.withUserId === withUserId)
  if (conv) {
    conv.unreadCount = 0
    conv.messages.forEach(m => {
      if (m.toUserId === userId) {
        m.read = true
      }
    })
    saveDMConversations(userId, conversations)
  }
}

// Blocked Users
export const getBlockedUsers = (userId: string): BlockedUser[] => {
  const blocked = localStorage.getItem(`${BLOCKED_USERS_KEY}_${userId}`)
  return blocked ? JSON.parse(blocked) : []
}

export const saveBlockedUsers = (userId: string, blocked: BlockedUser[]): void => {
  localStorage.setItem(`${BLOCKED_USERS_KEY}_${userId}`, JSON.stringify(blocked))
}

export const blockUser = (userId: string, blockedUserId: string, blockedUsername: string): void => {
  const blocked = getBlockedUsers(userId)
  if (!blocked.some(b => b.userId === blockedUserId)) {
    blocked.push({
      userId: blockedUserId,
      username: blockedUsername,
      blockedAt: Date.now()
    })
    saveBlockedUsers(userId, blocked)
  }
}

export const unblockUser = (userId: string, blockedUserId: string): void => {
  const blocked = getBlockedUsers(userId)
  const filtered = blocked.filter(b => b.userId !== blockedUserId)
  saveBlockedUsers(userId, filtered)
}

export const isUserBlocked = (userId: string, targetUserId: string): boolean => {
  const blocked = getBlockedUsers(userId)
  return blocked.some(b => b.userId === targetUserId)
}

// Notifications
export const getNotifications = (userId: string): Notification[] => {
  const notifications = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userId}`)
  return notifications ? JSON.parse(notifications) : []
}

export const saveNotifications = (userId: string, notifications: Notification[]): void => {
  localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(notifications))
}

export const addNotification = (userId: string, notification: Notification): void => {
  const notifications = getNotifications(userId)
  notifications.unshift(notification)
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50)
  }
  saveNotifications(userId, notifications)
}

export const markNotificationAsRead = (userId: string, notificationId: string): void => {
  const notifications = getNotifications(userId)
  const notification = notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    saveNotifications(userId, notifications)
  }
}

export const getUnreadNotificationCount = (userId: string): number => {
  const notifications = getNotifications(userId)
  return notifications.filter(n => !n.read).length
}

// User search (mock implementation - in real app would be server-side)
export const searchUsers = (query: string): Array<{ userId: string, username: string, avatar: string, elo: number }> => {
  // Mock users for demo
  const mockUsers = [
    { userId: 'user-1', username: 'ChessMaster2024', avatar: '👑', elo: 1500 },
    { userId: 'user-2', username: 'PawnStorm', avatar: '🦸', elo: 1300 },
    { userId: 'user-3', username: 'KnightRider99', avatar: '🥷', elo: 1450 },
    { userId: 'user-4', username: 'QueenGambit', avatar: '👸', elo: 1600 },
    { userId: 'user-5', username: 'RookieMistake', avatar: '🧙', elo: 1100 }
  ]
  
  if (!query) return []
  
  const lowerQuery = query.toLowerCase()
  return mockUsers.filter(u => u.username.toLowerCase().includes(lowerQuery))
}
