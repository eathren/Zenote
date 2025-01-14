import { Color } from "antd/es/color-picker"
import * as d3 from "d3"

export type GraphMembership = {
  userId: string
  graphId: string
  permission: GraphPermission
}

// Graph Privacy Settings
export enum GraphPrivacySetting {
  Private = "private",
  Team = "team",
  Global = "global",
}

// Permissions for Graph
export enum GraphPermission {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Owner = "owner",
}

export interface Graph {
  id: string
  name: string
  date_created: number
  ownerId: string // Firebase User ID
  isFavorite?: boolean
  nodes?: Record<string, string>
  type: GraphPrivacySetting
  teamId?: string // Team ID
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  ownerId?: string // Firebase User ID
  name: string
  graphId?: string
  date_created?: number | Date
  markdownUrl?: string
  tags?: string[]
  groups?: string[]
  edges?: GraphEdge[]
  isFavorite?: boolean
  isTagNode?: boolean
}

export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
  id: string
  graphId?: string
  date_created?: number
  label?: string
  source: string | GraphNode
  target: string | GraphNode
}

export interface User {
  uid: string
  email: string
  username: string
  profilePictureUrl: string
  phoneNumber: string
  secondaryEmail: string
  lastLogin: string
  accountCreationDate: string
  lastActivity: string
  loginSource: string
  language: string
  timezone: string
  newsletterSubscription: boolean
  savedItems: string[]
  searchHistory: string[]
  userSettings: Record<string, unknown>
  subscriptionType: string
  subscriptionExpiry: string | null
  twoFactorAuthenticationEnabled: boolean
  accountRecoveryOptions: Record<string, unknown>
  termsAndConditionsAccepted: string
  privacyPolicyAccepted: string
  gdprConsent: boolean
  connectedAccounts: Record<string, unknown>
}

export interface Group {
  name: string
  color?: Color | string
}

export interface GraphSettings {
  showOrphans: boolean
  showTags: boolean
  nodeSize: number
  linkStrength: number
  nodeStrength: number
  repelForce: number
  nodeGrowth: boolean
  searchText: string
  color: Color | string
  lineThickness: number
  groups: Group[]
}
