// ============================================================================
// AIBAPT — Tipos TypeScript para el esquema de base de datos
// Generados manualmente para garantizar type-safety full-stack.
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// --- Enums como union types ---
export type UserRole = 'member' | 'admin'
export type ApplicationStatus = 'draft' | 'uploading' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled'
export type DocumentType = 'cv' | 'formulario' | 'caso_clinico' | 'pago' | 'carta_recomendacion' | 'comprobante_formacion'
export type SupportedLanguage = 'es' | 'pt'

// --- Interfaz principal de la base de datos ---
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          first_name: string
          last_name: string
          email: string | null
          is_member: boolean
          membership_type: 'institucional' | 'pleno_salud_mental' | 'pleno_agente_social' | 'simpatizante' | 'bienhechor' | 'certificado' | 'supervisor' | 'ninguno' | null
          membership_expiry: string | null
          member_number: string | null
          role: UserRole
          language_preference: SupportedLanguage
          created_at: string
          person_type: string | null
          cpf_document: string | null
          address: string | null
          neighborhood: string | null
          city: string | null
          state: string | null
          country: string | null
          zip_code: string | null
          phone_mobile: string | null
          phone_commercial: string | null
          professional_register: string | null
          training_background: Json | null
          is_public_directory: boolean | null
        }
        Insert: {
          id: string
          full_name?: string | null
          first_name?: string
          last_name?: string
          email?: string | null
          is_member?: boolean
          membership_type?: 'institucional' | 'pleno_salud_mental' | 'pleno_agente_social' | 'simpatizante' | 'bienhechor' | 'certificado' | 'supervisor' | 'ninguno' | null
          membership_expiry?: string | null
          member_number?: string | null
          role?: UserRole
          language_preference?: SupportedLanguage
          created_at?: string
          person_type?: string | null
          cpf_document?: string | null
          address?: string | null
          neighborhood?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          zip_code?: string | null
          phone_mobile?: string | null
          phone_commercial?: string | null
          professional_register?: string | null
          training_background?: Json | null
          is_public_directory?: boolean | null
        }
        Update: {
          id?: string
          full_name?: string | null
          first_name?: string
          last_name?: string
          email?: string | null
          is_member?: boolean
          membership_type?: 'institucional' | 'pleno_salud_mental' | 'pleno_agente_social' | 'simpatizante' | 'bienhechor' | 'certificado' | 'supervisor' | 'ninguno' | null
          membership_expiry?: string | null
          member_number?: string | null
          role?: UserRole
          language_preference?: SupportedLanguage
          created_at?: string
          person_type?: string | null
          cpf_document?: string | null
          address?: string | null
          neighborhood?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          zip_code?: string | null
          phone_mobile?: string | null
          phone_commercial?: string | null
          professional_register?: string | null
          training_background?: Json | null
          is_public_directory?: boolean | null
        }
      }
      accreditation_types: {
        Row: {
          id: string
          name: string
          fee_member: number
          fee_non_member: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          fee_member: number
          fee_non_member: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          fee_member?: number
          fee_non_member?: number
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          type_id: string
          status: ApplicationStatus
          metadata: Json | null
          admin_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type_id: string
          status?: ApplicationStatus
          metadata?: Json | null
          admin_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type_id?: string
          status?: ApplicationStatus
          metadata?: Json | null
          admin_notes?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          application_id: string
          file_path: string
          document_type: DocumentType
          is_private: boolean
          uploaded_at: string
        }
        Insert: {
          id?: string
          application_id: string
          file_path: string
          document_type: DocumentType
          is_private?: boolean
          uploaded_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          file_path?: string
          document_type?: DocumentType
          is_private?: boolean
          uploaded_at?: string
        }
      }
      courses_accredited: {
        Row: {
          id: string
          title: string
          instructor_name: string | null
          language: SupportedLanguage
          credits: number
          expiry_date: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          instructor_name?: string | null
          language?: SupportedLanguage
          credits?: number
          expiry_date?: string | null
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          instructor_name?: string | null
          language?: SupportedLanguage
          credits?: number
          expiry_date?: string | null
          is_public?: boolean
          created_at?: string
        }
      }
      user_credits: {
        Row: {
          id: string
          user_id: string
          application_id: string | null
          course_id: string | null
          amount: number
          category: 'EMDR' | 'Psicotrauma'
          expiry_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          application_id?: string | null
          course_id?: string | null
          amount: number
          category: 'EMDR' | 'Psicotrauma'
          expiry_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          application_id?: string | null
          course_id?: string | null
          amount?: number
          category?: 'EMDR' | 'Psicotrauma'
          expiry_date?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }

      // =============================================
      // TABLAS LEGACY — Compatibilidad con código existente.
      // Migrar a las tablas nuevas (applications, courses_accredited) progresivamente.
      // =============================================
      solicitudes: {
        Row: {
          id: string
          user_id: string
          tipo: string
          estado: string
          datos: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tipo: string
          estado?: string
          datos?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tipo?: string
          estado?: string
          datos?: Json
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          instructor_name: string | null
          language: SupportedLanguage
          credits: number
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          instructor_name?: string | null
          language?: SupportedLanguage
          credits?: number
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          instructor_name?: string | null
          language?: SupportedLanguage
          credits?: number
          is_public?: boolean
          created_at?: string
        }
      }
      videoteca_webinars: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string | null
          thumbnail_url: string | null
          language: string | null
          created_at: string
          slug: string | null
          instructor_img: string | null
          category: string | null
          price: string | null
          duration: string | null
          instructor_name: string | null
          event_date: string | null
          desc_long: string | null
          price_public: number
          price_member_past: number
          credits_num: number
          includes: any | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          language?: string | null
          created_at?: string
          slug?: string | null
          instructor_img?: string | null
          category?: string | null
          price?: string | null
          duration?: string | null
          instructor_name?: string | null
          event_date?: string | null
          desc_long?: string | null
          price_public?: number
          price_member_past?: number
          credits_num?: number
          includes?: any | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          language?: string | null
          created_at?: string
          slug?: string | null
          instructor_img?: string | null
          category?: string | null
          price?: string | null
          duration?: string | null
          instructor_name?: string | null
          event_date?: string | null
          desc_long?: string | null
          price_public?: number
          price_member_past?: number
          credits_num?: number
          includes?: any | null
        }
      }
    }
    Functions: {
      generate_member_number: {
        Args: {
          p_category: string
          p_language: string
        }
        Returns: string
      }
    }
  }
}

// --- Helpers de acceso rápido a los tipos Row ---
export type Profile = Database['public']['Tables']['profiles']['Row']
export type AccreditationType = Database['public']['Tables']['accreditation_types']['Row']
export type Application = Database['public']['Tables']['applications']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type CourseAccredited = Database['public']['Tables']['courses_accredited']['Row']
export type UserCredit = Database['public']['Tables']['user_credits']['Row']
export type VideotecaWebinar = Database['public']['Tables']['videoteca_webinars']['Row']
