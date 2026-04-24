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
      solicitudes: {
        Row: {
          id: string
          user_id: string
          tipo: 'curso' | 'evento'
          estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'
          datos: Json
          fecha_solicitud: string
          actualizado_en: string
        }
        Insert: {
          id?: string
          user_id: string
          tipo: 'curso' | 'evento'
          estado?: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'
          datos?: Json
          fecha_solicitud?: string
          actualizado_en?: string
        }
        Update: {
          id?: string
          user_id?: string
          tipo?: 'curso' | 'evento'
          estado?: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'
          datos?: Json
          fecha_solicitud?: string
          actualizado_en?: string
        }
      }
      tarifas: {
        Row: {
          id: string
          tipo: 'curso' | 'evento'
          monto: number
          moneda: string
          activa: boolean
          creado_en: string
        }
        Insert: {
          id?: string
          tipo: 'curso' | 'evento'
          monto: number
          moneda?: string
          activa?: boolean
          creado_en?: string
        }
        Update: {
          id?: string
          tipo?: 'curso' | 'evento'
          monto?: number
          moneda?: string
          activa?: boolean
          creado_en?: string
        }
      }
    }
  }
}
