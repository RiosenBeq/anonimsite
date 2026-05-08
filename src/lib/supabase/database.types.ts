/**
 * Anonim — Supabase database types.
 *
 * Hand-curated to expose only the public Anonim surface; the project also
 * contains pre-existing tables from another app (Location, Investment, etc.)
 * which we deliberately do not reference here.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ReactionKind = "honest" | "warm" | "useful" | "deep";
export type TopicColorEnum = "accent" | "violet" | "warm" | "lime";

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      topics: {
        Row: {
          slug: string;
          label: string;
          color: TopicColorEnum;
          description: string;
          display_order: number;
          angle: number;
        };
        Insert: {
          slug: string;
          label: string;
          color: TopicColorEnum;
          description?: string;
          display_order?: number;
          angle?: number;
        };
        Update: Partial<Database["public"]["Tables"]["topics"]["Insert"]>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          title: string;
          context: string;
          topic_slug: string;
          moods: string[];
          pseudonym: string;
          asker_id: string;
          answers_count: number;
          saves_count: number;
          views_count: number;
          pulse: number;
          featured: boolean;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          context?: string;
          topic_slug: string;
          moods?: string[];
          pseudonym: string;
          asker_id?: string;
          answers_count?: number;
          saves_count?: number;
          views_count?: number;
          pulse?: number;
          featured?: boolean;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
        Relationships: [];
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          body: string;
          pseudonym: string;
          responder_id: string;
          helpfulness: number;
          upvotes: number;
          badge: string | null;
          honest_count: number;
          warm_count: number;
          useful_count: number;
          deep_count: number;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          question_id: string;
          body: string;
          pseudonym: string;
          responder_id?: string;
          helpfulness?: number;
          upvotes?: number;
          badge?: string | null;
          honest_count?: number;
          warm_count?: number;
          useful_count?: number;
          deep_count?: number;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["answers"]["Insert"]>;
        Relationships: [];
      };
      reactions: {
        Row: { answer_id: string; user_id: string; kind: ReactionKind; created_at: string };
        Insert: { answer_id: string; user_id?: string; kind: ReactionKind; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["reactions"]["Insert"]>;
        Relationships: [];
      };
      saves: {
        Row: { question_id: string; user_id: string; created_at: string };
        Insert: { question_id: string; user_id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["saves"]["Insert"]>;
        Relationships: [];
      };
      topic_follows: {
        Row: { topic_slug: string; user_id: string; created_at: string };
        Insert: { topic_slug: string; user_id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["topic_follows"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      app_ask_question: {
        Args: {
          p_session: string;
          p_title: string;
          p_context: string;
          p_topic_slug: string;
          p_moods: string[];
          p_pseudonym: string;
        };
        Returns: string;
      };
      app_post_answer: {
        Args: {
          p_session: string;
          p_question_id: string;
          p_body: string;
          p_pseudonym: string;
        };
        Returns: string;
      };
      app_toggle_reaction: {
        Args: { p_session: string; p_answer_id: string; p_kind: ReactionKind };
        Returns: ReactionKind | null;
      };
      app_toggle_save: {
        Args: { p_session: string; p_question_id: string };
        Returns: boolean;
      };
      app_toggle_topic_follow: {
        Args: { p_session: string; p_topic_slug: string };
        Returns: boolean;
      };
      app_register_view: { Args: { p_question_id: string }; Returns: undefined };
      app_my_saves: { Args: { p_session: string }; Returns: string[] };
      app_my_topic_follows: { Args: { p_session: string }; Returns: string[] };
      app_my_reactions_for_question: {
        Args: { p_session: string; p_question_id: string };
        Returns: { answer_id: string; kind: ReactionKind }[];
      };
    };
    Enums: {
      reaction_kind: ReactionKind;
      topic_color: TopicColorEnum;
    };
    CompositeTypes: Record<string, never>;
  };
};
