export type Role = 'USER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date | null
  posts: Post[]
  role: Role
}

export interface Post {
  id: number
  createdAt: Date
  updatedAt: Date | null
  published: boolean
  title: string
  content: string
  authorId: number
}
