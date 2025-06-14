export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_usage: {
        Row: {
          id: string
          user_id: string
          paid_interpretations_remaining: number
          referral_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          paid_interpretations_remaining?: number
          referral_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          paid_interpretations_remaining?: number
          referral_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}
