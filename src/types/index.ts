import { Color } from "antd/es/color-picker"
import * as d3 from "d3"

export interface Graph {
  id?: string
  name: string
  date_created: number
  ownerId: string
  favorited?: boolean
  nodes?: Record<string, string>
}

export interface GraphNode extends d3.SimulationNodeDatum {
  // Required Properties
  id?: string
  ownerId: string
  name: string
  graphId: string
  date_created: number

  // Optional Properties
  markdownUrl?: string
  tags?: string[]
  groups?: string[]
  edges?: GraphEdge[]
  isFavorite?: boolean
}

export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
  id: string
  graphId: string
  date_created: number
  label?: string
  // source and target are already included in d3.SimulationLinkDatum
}

export interface User {
  email: string
  username: string
  profilePictureUrl: string
  roles: string[]
  phoneNumber: string
  secondaryEmail: string
  lastLogin: string // Using ISO string to represent date
  accountCreationDate: string // Using ISO string to represent date
  lastActivity: string // Using ISO string to represent date
  loginSource: string
  language: string
  timezone: string
  newsletterSubscription: boolean
  savedItems: string[] // Type depending on what kind of items are saved
  searchHistory: string[] // Type depending on what the search string represents
  userSettings: Record<string, unknown> // Or define a more specific type
  subscriptionType: string
  subscriptionExpiry: string | null // Using ISO string to represent date or null
  twoFactorAuthenticationEnabled: boolean
  accountRecoveryOptions: Record<string, unknown> // Or define a more specific type
  termsAndConditionsAccepted: string // Using ISO string to represent date
  privacyPolicyAccepted: string // Using ISO string to represent date
  gdprConsent: boolean
  connectedAccounts: Record<string, unknown> // Or define a more specific type
}

export interface Group {
  name: string
  color?: Color | string
}

export interface GraphSettings {
  showOrphans: boolean
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
