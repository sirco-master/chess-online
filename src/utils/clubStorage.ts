import { Club, ClubMember, ClubMatch } from '../types'

const CLUBS_KEY = 'chess_clubs'
const USER_CLUB_KEY = 'chess_user_club'
const CLUB_MATCHES_KEY = 'chess_club_matches'

// Get all clubs
export const getAllClubs = (): Club[] => {
  const clubs = localStorage.getItem(CLUBS_KEY)
  return clubs ? JSON.parse(clubs) : []
}

// Save all clubs
export const saveAllClubs = (clubs: Club[]): void => {
  localStorage.setItem(CLUBS_KEY, JSON.stringify(clubs))
}

// Get a specific club by ID
export const getClubById = (clubId: string): Club | null => {
  const clubs = getAllClubs()
  return clubs.find(club => club.id === clubId) || null
}

// Create a new club
export const createClub = (name: string, bio: string, president: ClubMember): Club => {
  const clubs = getAllClubs()
  const newClub: Club = {
    id: `club-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    bio,
    createdAt: Date.now(),
    visibility: 'open',
    trophies: 0,
    members: [president],
    maxMembers: 30,
    president: president.userId
  }
  clubs.push(newClub)
  saveAllClubs(clubs)
  setUserClub(president.userId, newClub.id)
  return newClub
}

// Update club
export const updateClub = (club: Club): void => {
  const clubs = getAllClubs()
  const index = clubs.findIndex(c => c.id === club.id)
  if (index !== -1) {
    clubs[index] = club
    saveAllClubs(clubs)
  }
}

// Get user's club ID
export const getUserClubId = (userId: string): string | null => {
  const userClub = localStorage.getItem(`${USER_CLUB_KEY}_${userId}`)
  return userClub || null
}

// Set user's club
export const setUserClub = (userId: string, clubId: string | null): void => {
  if (clubId) {
    localStorage.setItem(`${USER_CLUB_KEY}_${userId}`, clubId)
  } else {
    localStorage.removeItem(`${USER_CLUB_KEY}_${userId}`)
  }
}

// Add member to club
export const addMemberToClub = (clubId: string, member: ClubMember): boolean => {
  const club = getClubById(clubId)
  if (!club) return false
  
  if (club.members.length >= club.maxMembers) {
    return false
  }
  
  club.members.push(member)
  updateClub(club)
  setUserClub(member.userId, clubId)
  return true
}

// Remove member from club
export const removeMemberFromClub = (clubId: string, userId: string): boolean => {
  const club = getClubById(clubId)
  if (!club) return false
  
  // Cannot remove president
  if (club.president === userId) return false
  
  club.members = club.members.filter(m => m.userId !== userId)
  updateClub(club)
  setUserClub(userId, null)
  return true
}

// Update member role/permissions
export const updateClubMember = (clubId: string, userId: string, updates: Partial<ClubMember>): boolean => {
  const club = getClubById(clubId)
  if (!club) return false
  
  const memberIndex = club.members.findIndex(m => m.userId === userId)
  if (memberIndex === -1) return false
  
  club.members[memberIndex] = { ...club.members[memberIndex], ...updates }
  updateClub(club)
  return true
}

// Get open clubs (random 10)
export const getRandomOpenClubs = (count: number = 10): Club[] => {
  const clubs = getAllClubs().filter(club => club.visibility === 'open')
  const shuffled = [...clubs].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Club matches
export const getAllClubMatches = (): ClubMatch[] => {
  const matches = localStorage.getItem(CLUB_MATCHES_KEY)
  return matches ? JSON.parse(matches) : []
}

export const saveAllClubMatches = (matches: ClubMatch[]): void => {
  localStorage.setItem(CLUB_MATCHES_KEY, JSON.stringify(matches))
}

export const createClubMatch = (match: ClubMatch): ClubMatch => {
  const matches = getAllClubMatches()
  matches.push(match)
  saveAllClubMatches(matches)
  return match
}

export const updateClubMatch = (match: ClubMatch): void => {
  const matches = getAllClubMatches()
  const index = matches.findIndex(m => m.id === match.id)
  if (index !== -1) {
    matches[index] = match
    saveAllClubMatches(matches)
  }
}

export const getClubMatches = (clubId: string): ClubMatch[] => {
  const matches = getAllClubMatches()
  return matches.filter(m => m.clubAId === clubId || m.clubBId === clubId)
}

// Update club trophies after match
export const updateClubTrophies = (winnerId: string, loserId: string): void => {
  const winnerClub = getClubById(winnerId)
  const loserClub = getClubById(loserId)
  
  if (winnerClub) {
    winnerClub.trophies += 10
    updateClub(winnerClub)
  }
  
  if (loserClub) {
    loserClub.trophies = Math.max(0, loserClub.trophies - 5)
    updateClub(loserClub)
  }
}

// Initialize with some demo clubs if empty
export const initializeDemoClubs = (): void => {
  const clubs = getAllClubs()
  if (clubs.length === 0) {
    // Create a few demo clubs
    const demoClubs: Club[] = [
      {
        id: 'demo-club-1',
        name: 'Chess Masters',
        bio: 'Elite chess players united',
        createdAt: Date.now() - 86400000 * 30,
        visibility: 'open',
        trophies: 150,
        members: [],
        maxMembers: 30,
        president: 'demo-user-1'
      },
      {
        id: 'demo-club-2',
        name: 'Knight Riders',
        bio: 'Tactical excellence',
        createdAt: Date.now() - 86400000 * 20,
        visibility: 'open',
        trophies: 120,
        members: [],
        maxMembers: 30,
        president: 'demo-user-2'
      },
      {
        id: 'demo-club-3',
        name: 'Royal Pawns',
        bio: 'From humble beginnings to checkmate',
        createdAt: Date.now() - 86400000 * 15,
        visibility: 'open',
        trophies: 95,
        members: [],
        maxMembers: 30,
        president: 'demo-user-3'
      }
    ]
    saveAllClubs(demoClubs)
  }
}
