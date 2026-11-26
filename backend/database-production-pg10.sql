CREATE OR REPLACE FUNCTION public.gen_random_uuid()
RETURNS uuid
LANGUAGE SQL
VOLATILE
AS $$
  SELECT (
    substr(md5(random()::text || clock_timestamp()::text), 1, 8) || '-' ||
    substr(md5(random()::text || clock_timestamp()::text), 9, 4) || '-' ||
    substr(md5(random()::text || clock_timestamp()::text), 13, 4) || '-' ||
    substr(md5(random()::text || clock_timestamp()::text), 17, 4) || '-' ||
    substr(md5(random()::text || clock_timestamp()::text), 21, 12)
  )::uuid;
$$;
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "careers";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "catalog";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "chat";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "content";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "crm";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "foundation";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "pqr";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "security";

-- CreateEnum
CREATE TYPE "crm"."activity_type" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'VISIT', 'FOLLOW_UP', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "crm"."company_size" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "crm"."contact_channel" AS ENUM ('WEBSITE', 'WHATSAPP', 'EMAIL', 'PHONE', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'REFERRAL');

-- CreateEnum
CREATE TYPE "security"."audit_action" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'RESTORE');

-- CreateEnum
CREATE TYPE "security"."document_type" AS ENUM ('CC', 'CE', 'NIT', 'PASSPORT', 'TI');

-- CreateEnum
CREATE TYPE "security"."gender_type" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "security"."user_role" AS ENUM ('ADMINISTRATOR', 'EDITOR', 'COMMERCIAL', 'CLIENT', 'VISITOR');

-- CreateEnum
CREATE TYPE "security"."user_status" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'PENDING_VERIFICATION');

-- CreateTable
CREATE TABLE "catalog"."address_types" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."company_types" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."contact_sources" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."email_types" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."industries" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."lead_priorities" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "level" SMALLINT NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_priorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."lead_temperatures" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "level" SMALLINT NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_temperatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."phone_types" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."rejection_reasons" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rejection_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."service_categories" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."services" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" BIGINT,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "icon" VARCHAR(100),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog"."social_networks" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100),
    "base_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "module" VARCHAR(80),
    "entity_name" VARCHAR(80),
    "entity_id" BIGINT,
    "action" VARCHAR(50),
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."branches" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" BIGINT NOT NULL,
    "city_id" BIGINT,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(20),
    "manager_name" VARCHAR(150),
    "opening_hours" VARCHAR(150),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "is_main" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."cities" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "state_id" BIGINT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "divipola_code" VARCHAR(5) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."companies" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "country_id" BIGINT NOT NULL,
    "legal_name" VARCHAR(200) NOT NULL,
    "commercial_name" VARCHAR(200),
    "tax_id" VARCHAR(30),
    "verification_digit" VARCHAR(5),
    "company_type" VARCHAR(100),
    "industry" VARCHAR(150),
    "website" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "logo_url" TEXT,
    "cover_image_url" TEXT,
    "description" TEXT,
    "slogan" VARCHAR(255),
    "founded_at" DATE,
    "employees_count" INTEGER DEFAULT 0,
    "primary_color" VARCHAR(20),
    "secondary_color" VARCHAR(20),
    "linkedin_url" TEXT,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "youtube_url" TEXT,
    "tiktok_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_type_id" BIGINT,
    "industry_id" BIGINT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."company_addresses" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" BIGINT NOT NULL,
    "branch_id" BIGINT,
    "city_id" BIGINT,
    "address" VARCHAR(300) NOT NULL,
    "neighborhood" VARCHAR(150),
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "address_type" VARCHAR(50),
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "address_type_id" BIGINT,

    CONSTRAINT "company_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."company_emails" (
    "id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "description" VARCHAR(100),
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."company_phones" (
    "id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "extension" VARCHAR(20),
    "whatsapp" BOOLEAN DEFAULT false,
    "description" VARCHAR(100),
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."company_settings" (
    "id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "company_logo" TEXT,
    "favicon" TEXT,
    "primary_color" VARCHAR(20),
    "secondary_color" VARCHAR(20),
    "accent_color" VARCHAR(20),
    "website" VARCHAR(255),
    "timezone" VARCHAR(80),
    "language" VARCHAR(20),
    "currency" VARCHAR(20),
    "date_format" VARCHAR(30),
    "time_format" VARCHAR(20),
    "smtp_host" VARCHAR(255),
    "smtp_port" INTEGER,
    "smtp_user" VARCHAR(255),
    "smtp_password" TEXT,
    "smtp_ssl" BOOLEAN DEFAULT true,
    "google_analytics_id" VARCHAR(100),
    "google_tag_manager" VARCHAR(100),
    "meta_pixel" VARCHAR(100),
    "whatsapp_number" VARCHAR(50),
    "google_maps_url" TEXT,
    "maintenance_mode" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."company_social_networks" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" BIGINT NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "username" VARCHAR(150),
    "url" TEXT NOT NULL,
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "social_network_id" BIGINT,

    CONSTRAINT "company_social_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."contact_addresses" (
    "id" BIGSERIAL NOT NULL,
    "contact_id" BIGINT NOT NULL,
    "city_id" BIGINT,
    "address" TEXT NOT NULL,
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "type" VARCHAR(50),
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."contact_emails" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contact_id" BIGINT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_type" VARCHAR(50),
    "is_primary" BOOLEAN DEFAULT false,
    "is_verified" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "email_type_id" BIGINT,

    CONSTRAINT "contact_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."contact_phones" (
    "id" BIGSERIAL NOT NULL,
    "contact_id" BIGINT NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "extension" VARCHAR(20),
    "type" VARCHAR(50),
    "whatsapp" BOOLEAN DEFAULT false,
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "phone_type_id" BIGINT,

    CONSTRAINT "contact_phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."contact_social_networks" (
    "id" BIGSERIAL NOT NULL,
    "contact_id" BIGINT NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "username" VARCHAR(150),
    "url" TEXT,
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "social_network_id" BIGINT,

    CONSTRAINT "contact_social_networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."contacts" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" BIGINT NOT NULL,
    "branch_id" BIGINT,
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "last_name" VARCHAR(100) NOT NULL,
    "second_last_name" VARCHAR(100),
    "full_name" VARCHAR(300),
    "identification_type" VARCHAR(20),
    "identification_number" VARCHAR(50),
    "birth_date" DATE,
    "gender" VARCHAR(20),
    "job_title" VARCHAR(150),
    "company_name" VARCHAR(200),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "mobile_phone" VARCHAR(50),
    "whatsapp" VARCHAR(50),
    "website" VARCHAR(255),
    "notes" TEXT,
    "source" VARCHAR(100),
    "is_customer" BOOLEAN DEFAULT false,
    "is_supplier" BOOLEAN DEFAULT false,
    "is_employee" BOOLEAN DEFAULT false,
    "is_candidate" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "source_id" BIGINT,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."countries" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "iso2" CHAR(2) NOT NULL,
    "iso3" CHAR(3),
    "name" VARCHAR(120) NOT NULL,
    "phone_code" VARCHAR(10),
    "currency_code" VARCHAR(10),
    "currency_name" VARCHAR(60),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."currencies" (
    "id" BIGSERIAL NOT NULL,
    "code" CHAR(3) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "symbol" VARCHAR(10),
    "decimal_places" SMALLINT DEFAULT 2,
    "is_default" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."holidays" (
    "id" BIGSERIAL NOT NULL,
    "country_id" BIGINT,
    "holiday_date" DATE NOT NULL,
    "name" VARCHAR(150),
    "is_recurring" BOOLEAN DEFAULT true,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."languages" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(10),
    "name" VARCHAR(80),
    "native_name" VARCHAR(80),
    "is_default" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."states" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "country_id" BIGINT NOT NULL,
    "code" VARCHAR(10),
    "name" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "divipola_code" VARCHAR(2),

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."timezones" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(120),
    "utc_offset" VARCHAR(10),
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "timezones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."activity_types" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "icon" VARCHAR(50),
    "color" VARCHAR(20),
    "description" TEXT,
    "active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_activities" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" BIGINT NOT NULL,
    "activity_type_id" BIGINT NOT NULL,
    "assigned_user_id" BIGINT,
    "company_id" BIGINT,
    "contact_id" BIGINT,
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "activity_date" TIMESTAMPTZ(6) NOT NULL,
    "start_date" TIMESTAMPTZ(6),
    "end_date" TIMESTAMPTZ(6),
    "duration_minutes" INTEGER,
    "completed" BOOLEAN DEFAULT false,
    "completion_date" TIMESTAMPTZ(6),
    "reminder_date" TIMESTAMPTZ(6),
    "location" VARCHAR(250),
    "meeting_url" VARCHAR(500),
    "result" TEXT,
    "observations" TEXT,
    "created_by" BIGINT NOT NULL,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_files" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" BIGINT NOT NULL,
    "file_id" BIGINT NOT NULL,
    "description" TEXT,
    "uploaded_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_notes" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" BIGINT NOT NULL,
    "company_id" BIGINT,
    "title" VARCHAR(200),
    "note" TEXT NOT NULL,
    "is_private" BOOLEAN DEFAULT true,
    "pinned" BOOLEAN DEFAULT false,
    "created_by" BIGINT NOT NULL,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_sources" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(100),
    "color" VARCHAR(20),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_statuses" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(20),
    "is_final" BOOLEAN DEFAULT false,
    "is_success" BOOLEAN DEFAULT false,
    "sort_order" SMALLINT DEFAULT 1,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_tag_relations" (
    "id" BIGSERIAL NOT NULL,
    "lead_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "created_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_tag_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."lead_tags" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" BIGINT,
    "name" VARCHAR(80) NOT NULL,
    "color" VARCHAR(20),
    "icon" VARCHAR(50),
    "description" TEXT,
    "active" BOOLEAN DEFAULT true,
    "created_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."leads" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(30) NOT NULL,
    "company_id" BIGINT,
    "contact_id" BIGINT NOT NULL,
    "assigned_to" BIGINT NOT NULL,
    "source_id" BIGINT NOT NULL,
    "status_id" BIGINT NOT NULL,
    "pipeline_id" BIGINT NOT NULL,
    "stage_id" BIGINT NOT NULL,
    "parent_lead_id" BIGINT,
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "estimated_value" DECIMAL(18,2) DEFAULT 0,
    "probability" DECIMAL(5,2) DEFAULT 0,
    "expected_close_date" DATE,
    "next_follow_up" TIMESTAMPTZ(6),
    "priority" VARCHAR(20) DEFAULT 'MEDIA',
    "lead_score" INTEGER DEFAULT 0,
    "temperature" VARCHAR(20) DEFAULT 'WARM',
    "interested_service" VARCHAR(200),
    "campaign" VARCHAR(150),
    "industry" VARCHAR(120),
    "employees" INTEGER,
    "annual_revenue" DECIMAL(18,2),
    "website" VARCHAR(255),
    "origin_notes" TEXT,
    "observations" TEXT,
    "is_converted" BOOLEAN DEFAULT false,
    "converted_company_id" BIGINT,
    "converted_contact_id" BIGINT,
    "converted_at" TIMESTAMPTZ(6),
    "won_reason" TEXT,
    "lost_reason" TEXT,
    "closed_at" TIMESTAMPTZ(6),
    "created_by" BIGINT NOT NULL,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."pipeline_stages" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID DEFAULT gen_random_uuid(),
    "pipeline_id" BIGINT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "stage_order" SMALLINT NOT NULL,
    "probability" DECIMAL(5,2),
    "color" VARCHAR(20),
    "is_closed" BOOLEAN DEFAULT false,
    "is_success" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pipeline_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."pipelines" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(20),
    "is_default" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."file_access_logs" (
    "id" BIGSERIAL NOT NULL,
    "file_id" BIGINT NOT NULL,
    "user_id" BIGINT,
    "action" VARCHAR(50),
    "ip_address" VARCHAR(50),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."file_categories" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(20),
    "icon" VARCHAR(80),
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "file_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."file_shares" (
    "id" BIGSERIAL NOT NULL,
    "file_id" BIGINT NOT NULL,
    "token" UUID DEFAULT gen_random_uuid(),
    "expires_at" TIMESTAMPTZ(6),
    "max_downloads" INTEGER,
    "download_count" INTEGER DEFAULT 0,
    "password_hash" TEXT,
    "created_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."file_tags" (
    "id" BIGSERIAL NOT NULL,
    "file_id" BIGINT NOT NULL,
    "tag" VARCHAR(80) NOT NULL,

    CONSTRAINT "file_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."file_versions" (
    "id" BIGSERIAL NOT NULL,
    "file_id" BIGINT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "storage_path" TEXT NOT NULL,
    "checksum" VARCHAR(255),
    "size_bytes" BIGINT,
    "uploaded_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."files" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" BIGINT NOT NULL,
    "uploaded_by" BIGINT,
    "storage_provider_id" BIGINT,
    "original_name" VARCHAR(255) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "extension" VARCHAR(20),
    "mime_type" VARCHAR(120),
    "size_bytes" BIGINT,
    "folder" VARCHAR(255),
    "storage_path" TEXT NOT NULL,
    "public_url" TEXT,
    "checksum" VARCHAR(255),
    "entity_type" VARCHAR(100),
    "entity_id" BIGINT,
    "description" TEXT,
    "is_public" BOOLEAN DEFAULT false,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."storage_providers" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "provider_type" VARCHAR(50),
    "bucket_name" VARCHAR(200),
    "endpoint" TEXT,
    "region" VARCHAR(100),
    "is_default" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foundation"."system_settings" (
    "id" BIGSERIAL NOT NULL,
    "setting_key" VARCHAR(150) NOT NULL,
    "setting_value" TEXT,
    "description" TEXT,
    "data_type" VARCHAR(30),
    "is_public" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."api_clients" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "client_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "client_secret" UUID NOT NULL DEFAULT gen_random_uuid(),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rate_limit_per_hour" INTEGER DEFAULT 1000,
    "allowed_ips" TEXT,
    "expires_at" TIMESTAMPTZ(6),
    "last_used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" BIGINT,
    "session_id" BIGINT,
    "module" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "entity_uuid" UUID,
    "action" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "old_data" JSONB,
    "new_data" JSONB,
    "ip_address" INET,
    "user_agent" TEXT,
    "browser" VARCHAR(100),
    "operating_system" VARCHAR(100),
    "device_type" VARCHAR(50),
    "request_method" VARCHAR(10),
    "request_url" TEXT,
    "http_status" SMALLINT,
    "execution_time_ms" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."email_verifications" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" BIGINT NOT NULL,
    "token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."login_attempts" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" BIGINT,
    "email" VARCHAR(255),
    "ip_address" INET NOT NULL,
    "user_agent" TEXT,
    "browser" VARCHAR(100),
    "operating_system" VARCHAR(100),
    "device_type" VARCHAR(50),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "success" BOOLEAN NOT NULL,
    "failure_reason" VARCHAR(200),
    "attempted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."password_resets" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" BIGINT NOT NULL,
    "token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ip_address" INET,
    "user_agent" TEXT,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."permissions" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "module" VARCHAR(50) NOT NULL,
    "resource" VARCHAR(100) NOT NULL,
    "action" VARCHAR(30) NOT NULL,
    "permission_key" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."positions" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."role_permissions" (
    "id" BIGSERIAL NOT NULL,
    "role_id" BIGINT NOT NULL,
    "permission_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."roles" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sessions" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" BIGINT NOT NULL,
    "access_token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "refresh_token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ip_address" INET NOT NULL,
    "user_agent" TEXT,
    "browser" VARCHAR(100),
    "browser_version" VARCHAR(50),
    "operating_system" VARCHAR(100),
    "device_type" VARCHAR(50),
    "device_name" VARCHAR(150),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "is_mobile" BOOLEAN NOT NULL DEFAULT false,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "revoked_at" TIMESTAMP(6),
    "last_activity_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."users" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" BIGINT NOT NULL,
    "position_id" BIGINT,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "status" "security"."user_status" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "language_code" VARCHAR(5) DEFAULT 'es',
    "timezone" VARCHAR(60) DEFAULT 'America/Bogota',
    "last_login_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."application_evaluations" (
    "id" BIGSERIAL NOT NULL,
    "application_id" BIGINT NOT NULL,
    "evaluator_id" BIGINT,
    "technical_score" DECIMAL(5,2),
    "communication_score" DECIMAL(5,2),
    "experience_score" DECIMAL(5,2),
    "culture_score" DECIMAL(5,2),
    "overall_score" DECIMAL(5,2),
    "recommendation" VARCHAR(30),
    "comments" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."application_interviews" (
    "id" BIGSERIAL NOT NULL,
    "application_id" BIGINT NOT NULL,
    "interviewer_id" BIGINT,
    "interview_type" VARCHAR(50),
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "duration_minutes" INTEGER,
    "location" VARCHAR(200),
    "meeting_url" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."application_status_history" (
    "id" BIGSERIAL NOT NULL,
    "application_id" BIGINT NOT NULL,
    "old_status" VARCHAR(40),
    "new_status" VARCHAR(40) NOT NULL,
    "notes" TEXT,
    "changed_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."applications" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_position_id" BIGINT NOT NULL,
    "cover_letter" TEXT,
    "notes" TEXT,
    "status" VARCHAR(40) NOT NULL DEFAULT 'RECEIVED',
    "applied_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "candidate_id" BIGINT NOT NULL,
    "source" VARCHAR(50),
    "recruiter_notes" TEXT,
    "assigned_recruiter" BIGINT,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."candidate_education" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "institution" VARCHAR(200) NOT NULL,
    "degree" VARCHAR(200),
    "field_of_study" VARCHAR(200),
    "education_level" VARCHAR(100),
    "start_date" DATE,
    "end_date" DATE,
    "currently_studying" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."candidate_experiences" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "company_name" VARCHAR(200) NOT NULL,
    "position" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."candidate_languages" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "language_name" VARCHAR(100) NOT NULL,
    "reading_level" VARCHAR(30),
    "writing_level" VARCHAR(30),
    "speaking_level" VARCHAR(30),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."candidate_skills" (
    "id" BIGSERIAL NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "skill_name" VARCHAR(150) NOT NULL,
    "level" VARCHAR(30),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."candidates" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "last_name" VARCHAR(100) NOT NULL,
    "second_last_name" VARCHAR(100),
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(50),
    "mobile_phone" VARCHAR(50),
    "whatsapp" VARCHAR(50),
    "identification_type" VARCHAR(30),
    "identification_number" VARCHAR(50),
    "birth_date" DATE,
    "gender" VARCHAR(30),
    "city_id" BIGINT,
    "linkedin_url" TEXT,
    "portfolio_url" TEXT,
    "github_url" TEXT,
    "professional_summary" TEXT,
    "current_position" VARCHAR(200),
    "current_company" VARCHAR(200),
    "years_experience" DECIMAL(5,2),
    "availability" VARCHAR(50),
    "expected_salary" DECIMAL(14,2),
    "salary_currency" VARCHAR(10) DEFAULT 'COP',
    "consent_data_processing" BOOLEAN NOT NULL DEFAULT false,
    "consent_date" TIMESTAMPTZ(6),
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."job_position_benefits" (
    "id" BIGSERIAL NOT NULL,
    "job_position_id" BIGINT NOT NULL,
    "benefit" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_position_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."job_position_skills" (
    "id" BIGSERIAL NOT NULL,
    "job_position_id" BIGINT NOT NULL,
    "skill_name" VARCHAR(150) NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "level" VARCHAR(30),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_position_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."job_positions" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50),
    "description" TEXT,
    "requirements" TEXT,
    "responsibilities" TEXT,
    "location" VARCHAR(200),
    "work_mode" VARCHAR(50),
    "employment_type" VARCHAR(50),
    "salary_min" DECIMAL(14,2),
    "salary_max" DECIMAL(14,2),
    "salary_currency" VARCHAR(10) DEFAULT 'COP',
    "vacancies" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMPTZ(6),
    "closing_date" DATE,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers"."recruiters" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recruiters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."faqs" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" VARCHAR(300) NOT NULL,
    "answer" TEXT NOT NULL,
    "category" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."menu_items" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "menu_id" BIGINT NOT NULL,
    "parent_id" BIGINT,
    "title" VARCHAR(150) NOT NULL,
    "url" TEXT,
    "page_id" BIGINT,
    "target" VARCHAR(30) DEFAULT '_self',
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."menus" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."page_sections" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "page_id" BIGINT NOT NULL,
    "section_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(200),
    "subtitle" TEXT,
    "content" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."pages" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "meta_title" VARCHAR(200),
    "meta_description" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "template" VARCHAR(100),
    "published_at" TIMESTAMPTZ(6),
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."post_categories" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."post_category_relations" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,

    CONSTRAINT "post_category_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."post_tag_relations" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,

    CONSTRAINT "post_tag_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."post_tags" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."posts" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(250) NOT NULL,
    "slug" VARCHAR(250) NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "featured_image_file_id" BIGINT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "author_id" BIGINT,
    "meta_title" VARCHAR(200),
    "meta_description" TEXT,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "post_type" VARCHAR(10) NOT NULL DEFAULT 'BLOG',
    "cover_image_url" TEXT,
    "author_name" VARCHAR(150),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."redirects" (
    "id" BIGSERIAL NOT NULL,
    "source_path" VARCHAR(500) NOT NULL,
    "destination_path" VARCHAR(500) NOT NULL,
    "status_code" SMALLINT NOT NULL DEFAULT 301,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."testimonials" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "position" VARCHAR(150),
    "company_name" VARCHAR(200),
    "content" TEXT NOT NULL,
    "photo_file_id" BIGINT,
    "rating" SMALLINT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_assignments" (
    "id" BIGSERIAL NOT NULL,
    "request_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassigned_at" TIMESTAMPTZ(6),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "request_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_attachments" (
    "id" BIGSERIAL NOT NULL,
    "request_id" BIGINT NOT NULL,
    "file_id" BIGINT NOT NULL,
    "description" TEXT,
    "uploaded_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_categories" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "request_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_messages" (
    "id" BIGSERIAL NOT NULL,
    "request_id" BIGINT NOT NULL,
    "sender_user_id" BIGINT,
    "sender_name" VARCHAR(200),
    "sender_email" VARCHAR(200),
    "channel" VARCHAR(50) NOT NULL,
    "subject" VARCHAR(300),
    "message" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_priorities" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "level" SMALLINT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "request_priorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_slas" (
    "id" BIGSERIAL NOT NULL,
    "request_type_id" BIGINT NOT NULL,
    "priority_id" BIGINT NOT NULL,
    "response_hours" INTEGER NOT NULL,
    "resolution_hours" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_slas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_status_history" (
    "id" BIGSERIAL NOT NULL,
    "request_id" BIGINT NOT NULL,
    "old_status_id" BIGINT,
    "new_status_id" BIGINT NOT NULL,
    "changed_by" BIGINT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_statuses" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "request_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."request_types" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "request_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pqr"."requests" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "type_id" BIGINT NOT NULL,
    "status_id" BIGINT NOT NULL,
    "priority_id" BIGINT NOT NULL,
    "category_id" BIGINT,
    "company_id" BIGINT,
    "contact_id" BIGINT,
    "requester_name" VARCHAR(200) NOT NULL,
    "requester_email" VARCHAR(200),
    "requester_phone" VARCHAR(50),
    "subject" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,
    "source" VARCHAR(50),
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" TIMESTAMPTZ(6),
    "responded_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "assigned_to" BIGINT,
    "resolution" TEXT,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."opportunities" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(250) NOT NULL,
    "company_id" BIGINT,
    "contact_id" BIGINT,
    "source_lead_id" BIGINT,
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'COP',
    "stage" VARCHAR(20) NOT NULL DEFAULT 'NEW',
    "probability" SMALLINT,
    "owner_user_id" BIGINT,
    "expected_close_date" DATE,
    "closed_at" TIMESTAMPTZ(6),
    "close_reason" TEXT,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."tasks" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMPTZ(6),
    "assignee_user_id" BIGINT,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "related_type" VARCHAR(20),
    "related_id" BIGINT,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_context" (
    "session_id" UUID NOT NULL,
    "name" TEXT,
    "company_name" TEXT,
    "industry" TEXT,
    "position" TEXT,
    "need" TEXT,
    "service_id" BIGINT,
    "intent_id" UUID,
    "lead_intent" BOOLEAN NOT NULL DEFAULT false,
    "quote_requested" BOOLEAN NOT NULL DEFAULT false,
    "human_requested" BOOLEAN NOT NULL DEFAULT false,
    "pqr_requested" BOOLEAN NOT NULL DEFAULT false,
    "careers_requested" BOOLEAN NOT NULL DEFAULT false,
    "context_data" JSONB,
    "confidence" DECIMAL(5,4),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_context_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "chat"."chat_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "message_id" UUID,
    "user_id" BIGINT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "message_id" UUID,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_intent_detections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "intent_id" UUID NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "detected_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "chat_intent_detections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_intents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "sender_type" VARCHAR(30) NOT NULL,
    "sender_id" BIGINT,
    "message_type" VARCHAR(30) NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "intent_id" UUID,
    "service_id" BIGINT,
    "parent_message_id" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'SENT',
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_service_matches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "service_id" BIGINT NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "source" VARCHAR(50),
    "detected_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_service_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" BIGINT,
    "lead_id" BIGINT,
    "channel" VARCHAR(30) NOT NULL DEFAULT 'WEB',
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ(6),
    "ip_address" INET,
    "user_agent" TEXT,
    "language" VARCHAR(20),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."chat_suggestions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "message_id" UUID,
    "label" TEXT NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "action_value" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."consents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "user_id" BIGINT,
    "consent_type" VARCHAR(50) NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "policy_version" VARCHAR(50),
    "consent_text" TEXT,
    "ip_address" INET,
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."handover_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "handover_id" UUID NOT NULL,
    "assigned_to" BIGINT NOT NULL,
    "assigned_by" BIGINT,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassigned_at" TIMESTAMPTZ(6),
    "reason" TEXT,

    CONSTRAINT "handover_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."handovers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "lead_id" BIGINT,
    "requested_by" BIGINT,
    "assigned_to" BIGINT,
    "channel" VARCHAR(30) NOT NULL,
    "reason" VARCHAR(50) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_at" TIMESTAMPTZ(6),
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "metadata" JSONB,

    CONSTRAINT "handovers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."team_members" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "position" VARCHAR(200) NOT NULL,
    "bio" TEXT,
    "photo_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profession" VARCHAR(200),
    "area" VARCHAR(150),
    "service_code" VARCHAR(50),
    "specialties" JSONB NOT NULL DEFAULT '[]',
    "certifications" JSONB,
    "certifications_label" VARCHAR(150),
    "is_transversal" BOOLEAN NOT NULL DEFAULT false,
    "org_level" SMALLINT,
    "parent_id" BIGINT,
    "connector_curve" VARCHAR(5),

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm"."activities" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" VARCHAR(20) NOT NULL,
    "description" TEXT NOT NULL,
    "author_user_id" BIGINT,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "related_type" VARCHAR(20),
    "related_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."company_profile" (
    "id" SMALLINT NOT NULL DEFAULT 1,
    "home_about_eyebrow" VARCHAR(150),
    "home_about_title" VARCHAR(300),
    "home_about_text" TEXT,
    "home_about_image_url" TEXT,
    "home_about_stat1_value" VARCHAR(20),
    "home_about_stat1_label" VARCHAR(150),
    "home_about_stat2_value" VARCHAR(20),
    "home_about_stat2_label" VARCHAR(150),
    "about_hero_title" VARCHAR(300),
    "about_hero_subtitle" VARCHAR(400),
    "about_hero_image_url" TEXT,
    "about_who_title" VARCHAR(300),
    "about_who_text" TEXT,
    "about_who_image_url" TEXT,
    "about_mission_text" TEXT,
    "about_mission_image_url" TEXT,
    "about_vision_year" VARCHAR(10),
    "about_vision_text" TEXT,
    "about_vision_image_url" TEXT,
    "mission_vision_is_placeholder" BOOLEAN NOT NULL DEFAULT true,
    "about_ecosystem_title" VARCHAR(300),
    "about_ecosystem_text" TEXT,
    "about_team_title" VARCHAR(300),
    "about_team_subtitle" VARCHAR(400),
    "about_cta_title" VARCHAR(300),
    "about_cta_message" TEXT,
    "about_cta_image_url" TEXT,
    "updated_by" BIGINT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."company_values" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR(50) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "icon_key" VARCHAR(50),
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."hero_slides" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(100) NOT NULL,
    "service_code" VARCHAR(50),
    "name_white" VARCHAR(50) NOT NULL,
    "name_blue" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "image_position" VARCHAR(50),
    "href" VARCHAR(300) NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."who_we_are_concepts" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR(50) NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT,
    "updated_by" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "who_we_are_concepts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_address_type_code" ON "catalog"."address_types"("code");

-- CreateIndex
CREATE INDEX "idx_address_types_active" ON "catalog"."address_types"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_company_type_uuid" ON "catalog"."company_types"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_company_type_code" ON "catalog"."company_types"("code");

-- CreateIndex
CREATE INDEX "idx_company_types_active" ON "catalog"."company_types"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_contact_source_uuid" ON "catalog"."contact_sources"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_contact_source_code" ON "catalog"."contact_sources"("code");

-- CreateIndex
CREATE INDEX "idx_contact_sources_active" ON "catalog"."contact_sources"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_email_type_code" ON "catalog"."email_types"("code");

-- CreateIndex
CREATE INDEX "idx_email_types_active" ON "catalog"."email_types"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_industry_uuid" ON "catalog"."industries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_industry_code" ON "catalog"."industries"("code");

-- CreateIndex
CREATE INDEX "idx_industries_active" ON "catalog"."industries"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_lead_priority_code" ON "catalog"."lead_priorities"("code");

-- CreateIndex
CREATE INDEX "idx_lead_priorities_active" ON "catalog"."lead_priorities"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_lead_temperature_code" ON "catalog"."lead_temperatures"("code");

-- CreateIndex
CREATE INDEX "idx_lead_temperatures_active" ON "catalog"."lead_temperatures"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_phone_type_code" ON "catalog"."phone_types"("code");

-- CreateIndex
CREATE INDEX "idx_phone_types_active" ON "catalog"."phone_types"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_rejection_reason_uuid" ON "catalog"."rejection_reasons"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_rejection_reason_code" ON "catalog"."rejection_reasons"("code");

-- CreateIndex
CREATE INDEX "idx_rejection_reasons_active" ON "catalog"."rejection_reasons"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_service_category_uuid" ON "catalog"."service_categories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_service_category_code" ON "catalog"."service_categories"("code");

-- CreateIndex
CREATE INDEX "idx_service_categories_active" ON "catalog"."service_categories"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_service_uuid" ON "catalog"."services"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_service_code" ON "catalog"."services"("code");

-- CreateIndex
CREATE INDEX "idx_services_active" ON "catalog"."services"("is_active");

-- CreateIndex
CREATE INDEX "idx_services_category" ON "catalog"."services"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_social_network_uuid" ON "catalog"."social_networks"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_catalog_social_network_code" ON "catalog"."social_networks"("code");

-- CreateIndex
CREATE INDEX "idx_social_networks_active" ON "catalog"."social_networks"("is_active");

-- CreateIndex
CREATE INDEX "idx_branch_active" ON "core"."branches"("is_active");

-- CreateIndex
CREATE INDEX "idx_branch_city" ON "core"."branches"("city_id");

-- CreateIndex
CREATE INDEX "idx_branch_company" ON "core"."branches"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_cities_divipola_code" ON "core"."cities"("divipola_code");

-- CreateIndex
CREATE INDEX "idx_cities_name" ON "core"."cities"("name");

-- CreateIndex
CREATE INDEX "idx_cities_state" ON "core"."cities"("state_id");

-- CreateIndex
CREATE INDEX "idx_city_divipola" ON "core"."cities"("divipola_code");

-- CreateIndex
CREATE UNIQUE INDEX "uk_city_state_name" ON "core"."cities"("state_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "uk_company_uuid" ON "core"."companies"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_company_tax" ON "core"."companies"("tax_id");

-- CreateIndex
CREATE INDEX "idx_company_active" ON "core"."companies"("is_active");

-- CreateIndex
CREATE INDEX "idx_company_company_type" ON "core"."companies"("company_type_id");

-- CreateIndex
CREATE INDEX "idx_company_country" ON "core"."companies"("country_id");

-- CreateIndex
CREATE INDEX "idx_company_industry" ON "core"."companies"("industry_id");

-- CreateIndex
CREATE INDEX "idx_company_name" ON "core"."companies"("legal_name");

-- CreateIndex
CREATE INDEX "idx_company_address_city" ON "core"."company_addresses"("city_id");

-- CreateIndex
CREATE INDEX "idx_company_address_company" ON "core"."company_addresses"("company_id");

-- CreateIndex
CREATE INDEX "idx_company_address_type" ON "core"."company_addresses"("address_type_id");

-- CreateIndex
CREATE INDEX "idx_company_email_company" ON "core"."company_emails"("company_id");

-- CreateIndex
CREATE INDEX "idx_company_phone_company" ON "core"."company_phones"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_settings_company_id_key" ON "core"."company_settings"("company_id");

-- CreateIndex
CREATE INDEX "idx_company_social_company" ON "core"."company_social_networks"("company_id");

-- CreateIndex
CREATE INDEX "idx_company_social_network" ON "core"."company_social_networks"("social_network_id");

-- CreateIndex
CREATE INDEX "idx_contact_address_contact" ON "core"."contact_addresses"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_contact_email_unique" ON "core"."contact_emails"("email");

-- CreateIndex
CREATE INDEX "idx_contact_email_contact" ON "core"."contact_emails"("contact_id");

-- CreateIndex
CREATE INDEX "idx_contact_email_type" ON "core"."contact_emails"("email_type_id");

-- CreateIndex
CREATE INDEX "idx_contact_phone_contact" ON "core"."contact_phones"("contact_id");

-- CreateIndex
CREATE INDEX "idx_contact_phone_type" ON "core"."contact_phones"("phone_type_id");

-- CreateIndex
CREATE INDEX "idx_contact_social_contact" ON "core"."contact_social_networks"("contact_id");

-- CreateIndex
CREATE INDEX "idx_contact_social_network" ON "core"."contact_social_networks"("social_network_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_contact_uuid" ON "core"."contacts"("uuid");

-- CreateIndex
CREATE INDEX "idx_contact_branch" ON "core"."contacts"("branch_id");

-- CreateIndex
CREATE INDEX "idx_contact_company" ON "core"."contacts"("company_id");

-- CreateIndex
CREATE INDEX "idx_contact_document" ON "core"."contacts"("identification_number");

-- CreateIndex
CREATE INDEX "idx_contact_email" ON "core"."contacts"("email");

-- CreateIndex
CREATE INDEX "idx_contact_name" ON "core"."contacts"("last_name", "first_name");

-- CreateIndex
CREATE INDEX "idx_contact_source" ON "core"."contacts"("source_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso2_key" ON "core"."countries"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso3_key" ON "core"."countries"("iso3");

-- CreateIndex
CREATE INDEX "idx_country_name" ON "core"."countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "core"."currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "core"."languages"("code");

-- CreateIndex
CREATE INDEX "idx_states_country" ON "core"."states"("country_id");

-- CreateIndex
CREATE INDEX "idx_states_name" ON "core"."states"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uk_timezones_name" ON "core"."timezones"("name");

-- CreateIndex
CREATE UNIQUE INDEX "activity_types_name_key" ON "crm"."activity_types"("name");

-- CreateIndex
CREATE INDEX "idx_activity_completed" ON "crm"."lead_activities"("completed");

-- CreateIndex
CREATE INDEX "idx_activity_date" ON "crm"."lead_activities"("activity_date");

-- CreateIndex
CREATE INDEX "idx_activity_lead" ON "crm"."lead_activities"("lead_id");

-- CreateIndex
CREATE INDEX "idx_activity_type" ON "crm"."lead_activities"("activity_type_id");

-- CreateIndex
CREATE INDEX "idx_activity_user" ON "crm"."lead_activities"("assigned_user_id");

-- CreateIndex
CREATE INDEX "idx_file" ON "crm"."lead_files"("file_id");

-- CreateIndex
CREATE INDEX "idx_lead_file" ON "crm"."lead_files"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_lead_file" ON "crm"."lead_files"("lead_id", "file_id");

-- CreateIndex
CREATE INDEX "idx_note_company" ON "crm"."lead_notes"("company_id");

-- CreateIndex
CREATE INDEX "idx_note_created" ON "crm"."lead_notes"("created_by");

-- CreateIndex
CREATE INDEX "idx_note_lead" ON "crm"."lead_notes"("lead_id");

-- CreateIndex
CREATE INDEX "idx_note_private" ON "crm"."lead_notes"("is_private");

-- CreateIndex
CREATE UNIQUE INDEX "idx_lead_source_name" ON "crm"."lead_sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_lead_statuses_name" ON "crm"."lead_statuses"("name");

-- CreateIndex
CREATE INDEX "idx_relation_lead" ON "crm"."lead_tag_relations"("lead_id");

-- CreateIndex
CREATE INDEX "idx_relation_tag" ON "crm"."lead_tag_relations"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_lead_tag" ON "crm"."lead_tag_relations"("lead_id", "tag_id");

-- CreateIndex
CREATE INDEX "idx_tag_company" ON "crm"."lead_tags"("company_id");

-- CreateIndex
CREATE INDEX "idx_tag_name" ON "crm"."lead_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_company_tag" ON "crm"."lead_tags"("company_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "leads_code_key" ON "crm"."leads"("code");

-- CreateIndex
CREATE INDEX "idx_leads_assigned" ON "crm"."leads"("assigned_to");

-- CreateIndex
CREATE INDEX "idx_leads_company" ON "crm"."leads"("company_id");

-- CreateIndex
CREATE INDEX "idx_leads_contact" ON "crm"."leads"("contact_id");

-- CreateIndex
CREATE INDEX "idx_leads_created" ON "crm"."leads"("created_at");

-- CreateIndex
CREATE INDEX "idx_leads_pipeline" ON "crm"."leads"("pipeline_id");

-- CreateIndex
CREATE INDEX "idx_leads_priority" ON "crm"."leads"("priority");

-- CreateIndex
CREATE INDEX "idx_leads_score" ON "crm"."leads"("lead_score");

-- CreateIndex
CREATE INDEX "idx_leads_stage" ON "crm"."leads"("stage_id");

-- CreateIndex
CREATE INDEX "idx_leads_status" ON "crm"."leads"("status_id");

-- CreateIndex
CREATE INDEX "idx_leads_temperature" ON "crm"."leads"("temperature");

-- CreateIndex
CREATE INDEX "idx_pipeline_stage_pipeline" ON "crm"."pipeline_stages"("pipeline_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_pipeline_name" ON "crm"."pipelines"("name");

-- CreateIndex
CREATE INDEX "idx_file_access_logs_file" ON "foundation"."file_access_logs"("file_id");

-- CreateIndex
CREATE INDEX "idx_file_access_logs_user" ON "foundation"."file_access_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_file_shares_created_by" ON "foundation"."file_shares"("created_by");

-- CreateIndex
CREATE INDEX "idx_file_shares_file" ON "foundation"."file_shares"("file_id");

-- CreateIndex
CREATE INDEX "idx_file_tag" ON "foundation"."file_tags"("tag");

-- CreateIndex
CREATE INDEX "idx_file_versions_file" ON "foundation"."file_versions"("file_id");

-- CreateIndex
CREATE INDEX "idx_file_versions_uploaded_by" ON "foundation"."file_versions"("uploaded_by");

-- CreateIndex
CREATE UNIQUE INDEX "uk_file_uuid" ON "foundation"."files"("uuid");

-- CreateIndex
CREATE INDEX "idx_file_company" ON "foundation"."files"("company_id");

-- CreateIndex
CREATE INDEX "idx_file_entity" ON "foundation"."files"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_file_uploaded" ON "foundation"."files"("uploaded_by");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_setting_key_key" ON "foundation"."system_settings"("setting_key");

-- CreateIndex
CREATE UNIQUE INDEX "uk_api_client_uuid" ON "security"."api_clients"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_api_client_id" ON "security"."api_clients"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_api_client_secret" ON "security"."api_clients"("client_secret");

-- CreateIndex
CREATE INDEX "idx_api_client_active" ON "security"."api_clients"("is_active");

-- CreateIndex
CREATE INDEX "idx_api_client_expiration" ON "security"."api_clients"("expires_at");

-- CreateIndex
CREATE INDEX "idx_audit_action" ON "security"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_audit_date" ON "security"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "idx_audit_entity" ON "security"."audit_logs"("entity");

-- CreateIndex
CREATE INDEX "idx_audit_entity_uuid" ON "security"."audit_logs"("entity_uuid");

-- CreateIndex
CREATE INDEX "idx_audit_module" ON "security"."audit_logs"("module");

-- CreateIndex
CREATE INDEX "idx_audit_user" ON "security"."audit_logs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_email_verification_token" ON "security"."email_verifications"("token");

-- CreateIndex
CREATE INDEX "idx_email_verification_user" ON "security"."email_verifications"("user_id");

-- CreateIndex
CREATE INDEX "idx_login_attempts_date" ON "security"."login_attempts"("attempted_at");

-- CreateIndex
CREATE INDEX "idx_login_attempts_email" ON "security"."login_attempts"("email");

-- CreateIndex
CREATE INDEX "idx_login_attempts_ip" ON "security"."login_attempts"("ip_address");

-- CreateIndex
CREATE INDEX "idx_login_attempts_user" ON "security"."login_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_password_reset_token" ON "security"."password_resets"("token");

-- CreateIndex
CREATE INDEX "idx_password_resets_expiration" ON "security"."password_resets"("expires_at");

-- CreateIndex
CREATE INDEX "idx_password_resets_user" ON "security"."password_resets"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_permission_key" ON "security"."permissions"("permission_key");

-- CreateIndex
CREATE UNIQUE INDEX "uk_positions_uuid" ON "security"."positions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_positions_name" ON "security"."positions"("name");

-- CreateIndex
CREATE INDEX "idx_role_permissions_permission" ON "security"."role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "idx_role_permissions_role" ON "security"."role_permissions"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_role_permission" ON "security"."role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_roles_uuid" ON "security"."roles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uk_roles_name" ON "security"."roles"("name");

-- CreateIndex
CREATE INDEX "idx_sessions_access_token" ON "security"."sessions"("access_token");

-- CreateIndex
CREATE INDEX "idx_sessions_created" ON "security"."sessions"("created_at");

-- CreateIndex
CREATE INDEX "idx_sessions_last_activity" ON "security"."sessions"("last_activity_at");

-- CreateIndex
CREATE INDEX "idx_sessions_refresh_token" ON "security"."sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "idx_sessions_user" ON "security"."sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_application_history_application" ON "careers"."application_status_history"("application_id");

-- CreateIndex
CREATE INDEX "idx_applications_job" ON "careers"."applications"("job_position_id");

-- CreateIndex
CREATE INDEX "idx_applications_status" ON "careers"."applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_candidate_job" ON "careers"."applications"("candidate_id", "job_position_id");

-- CreateIndex
CREATE INDEX "idx_job_positions_closing_date" ON "careers"."job_positions"("closing_date");

-- CreateIndex
CREATE INDEX "idx_job_positions_status" ON "careers"."job_positions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "recruiters_user_id_key" ON "careers"."recruiters"("user_id");

-- CreateIndex
CREATE INDEX "idx_faqs_active" ON "content"."faqs"("is_active");

-- CreateIndex
CREATE INDEX "idx_menu_items_menu" ON "content"."menu_items"("menu_id");

-- CreateIndex
CREATE INDEX "idx_menu_items_page" ON "content"."menu_items"("page_id");

-- CreateIndex
CREATE INDEX "idx_menu_items_parent" ON "content"."menu_items"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_content_menu_name" ON "content"."menus"("name");

-- CreateIndex
CREATE INDEX "idx_page_sections_order" ON "content"."page_sections"("page_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_page_sections_page" ON "content"."page_sections"("page_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_content_page_slug" ON "content"."pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uq_post_category_name" ON "content"."post_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_post_category_slug" ON "content"."post_categories"("slug");

-- CreateIndex
CREATE INDEX "idx_post_category_category" ON "content"."post_category_relations"("category_id");

-- CreateIndex
CREATE INDEX "idx_post_category_post" ON "content"."post_category_relations"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_post_category" ON "content"."post_category_relations"("post_id", "category_id");

-- CreateIndex
CREATE INDEX "idx_post_tag_post" ON "content"."post_tag_relations"("post_id");

-- CreateIndex
CREATE INDEX "idx_post_tag_tag" ON "content"."post_tag_relations"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_post_tag" ON "content"."post_tag_relations"("post_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_post_tag_name" ON "content"."post_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_post_tag_slug" ON "content"."post_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uq_content_post_slug" ON "content"."posts"("slug");

-- CreateIndex
CREATE INDEX "idx_posts_author" ON "content"."posts"("author_id");

-- CreateIndex
CREATE INDEX "idx_posts_published" ON "content"."posts"("published_at");

-- CreateIndex
CREATE INDEX "idx_posts_status" ON "content"."posts"("status");

-- CreateIndex
CREATE INDEX "idx_posts_type" ON "content"."posts"("post_type");

-- CreateIndex
CREATE UNIQUE INDEX "uq_redirect_source" ON "content"."redirects"("source_path");

-- CreateIndex
CREATE INDEX "idx_redirects_active" ON "content"."redirects"("is_active");

-- CreateIndex
CREATE INDEX "idx_testimonials_active" ON "content"."testimonials"("is_active");

-- CreateIndex
CREATE INDEX "idx_assignments_request" ON "pqr"."request_assignments"("request_id");

-- CreateIndex
CREATE INDEX "idx_assignments_user" ON "pqr"."request_assignments"("user_id");

-- CreateIndex
CREATE INDEX "idx_attachments_request" ON "pqr"."request_attachments"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_request_attachment" ON "pqr"."request_attachments"("request_id", "file_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_categories_code_key" ON "pqr"."request_categories"("code");

-- CreateIndex
CREATE INDEX "idx_messages_request" ON "pqr"."request_messages"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_priorities_code_key" ON "pqr"."request_priorities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uq_sla_type_priority" ON "pqr"."request_slas"("request_type_id", "priority_id");

-- CreateIndex
CREATE INDEX "idx_status_history_request" ON "pqr"."request_status_history"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_statuses_code_key" ON "pqr"."request_statuses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "request_types_code_key" ON "pqr"."request_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "requests_code_key" ON "pqr"."requests"("code");

-- CreateIndex
CREATE INDEX "idx_requests_assigned" ON "pqr"."requests"("assigned_to");

-- CreateIndex
CREATE INDEX "idx_requests_category" ON "pqr"."requests"("category_id");

-- CreateIndex
CREATE INDEX "idx_requests_company" ON "pqr"."requests"("company_id");

-- CreateIndex
CREATE INDEX "idx_requests_contact" ON "pqr"."requests"("contact_id");

-- CreateIndex
CREATE INDEX "idx_requests_due" ON "pqr"."requests"("due_at");

-- CreateIndex
CREATE INDEX "idx_requests_priority" ON "pqr"."requests"("priority_id");

-- CreateIndex
CREATE INDEX "idx_requests_received" ON "pqr"."requests"("received_at");

-- CreateIndex
CREATE INDEX "idx_requests_status" ON "pqr"."requests"("status_id");

-- CreateIndex
CREATE INDEX "idx_requests_type" ON "pqr"."requests"("type_id");

-- CreateIndex
CREATE INDEX "idx_opportunities_company" ON "crm"."opportunities"("company_id");

-- CreateIndex
CREATE INDEX "idx_opportunities_contact" ON "crm"."opportunities"("contact_id");

-- CreateIndex
CREATE INDEX "idx_opportunities_created" ON "crm"."opportunities"("created_at");

-- CreateIndex
CREATE INDEX "idx_opportunities_lead" ON "crm"."opportunities"("source_lead_id");

-- CreateIndex
CREATE INDEX "idx_opportunities_owner" ON "crm"."opportunities"("owner_user_id");

-- CreateIndex
CREATE INDEX "idx_opportunities_stage" ON "crm"."opportunities"("stage");

-- CreateIndex
CREATE INDEX "idx_tasks_assignee" ON "crm"."tasks"("assignee_user_id");

-- CreateIndex
CREATE INDEX "idx_tasks_due" ON "crm"."tasks"("due_date");

-- CreateIndex
CREATE INDEX "idx_tasks_related" ON "crm"."tasks"("related_type", "related_id");

-- CreateIndex
CREATE INDEX "idx_tasks_status" ON "crm"."tasks"("status");

-- CreateIndex
CREATE INDEX "idx_chat_context_intent" ON "chat"."chat_context"("intent_id");

-- CreateIndex
CREATE INDEX "idx_chat_context_service" ON "chat"."chat_context"("service_id");

-- CreateIndex
CREATE INDEX "idx_chat_events_created" ON "chat"."chat_events"("created_at");

-- CreateIndex
CREATE INDEX "idx_chat_events_session" ON "chat"."chat_events"("session_id");

-- CreateIndex
CREATE INDEX "idx_chat_events_type" ON "chat"."chat_events"("event_type");

-- CreateIndex
CREATE INDEX "idx_intent_detection_message" ON "chat"."chat_intent_detections"("message_id");

-- CreateIndex
CREATE INDEX "idx_intent_detection_session" ON "chat"."chat_intent_detections"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_intents_code_key" ON "chat"."chat_intents"("code");

-- CreateIndex
CREATE INDEX "idx_chat_messages_created" ON "chat"."chat_messages"("created_at");

-- CreateIndex
CREATE INDEX "idx_chat_messages_intent" ON "chat"."chat_messages"("intent_id");

-- CreateIndex
CREATE INDEX "idx_chat_messages_sender" ON "chat"."chat_messages"("sender_id");

-- CreateIndex
CREATE INDEX "idx_chat_messages_service" ON "chat"."chat_messages"("service_id");

-- CreateIndex
CREATE INDEX "idx_chat_messages_session" ON "chat"."chat_messages"("session_id");

-- CreateIndex
CREATE INDEX "idx_service_match_service" ON "chat"."chat_service_matches"("service_id");

-- CreateIndex
CREATE INDEX "idx_service_match_session" ON "chat"."chat_service_matches"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_chat_session_token" ON "chat"."chat_sessions"("session_token");

-- CreateIndex
CREATE INDEX "idx_chat_sessions_last_activity" ON "chat"."chat_sessions"("last_activity_at");

-- CreateIndex
CREATE INDEX "idx_chat_sessions_lead" ON "chat"."chat_sessions"("lead_id");

-- CreateIndex
CREATE INDEX "idx_chat_sessions_status" ON "chat"."chat_sessions"("status");

-- CreateIndex
CREATE INDEX "idx_chat_sessions_user" ON "chat"."chat_sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_handovers_assigned" ON "chat"."handovers"("assigned_to");

-- CreateIndex
CREATE INDEX "idx_handovers_lead" ON "chat"."handovers"("lead_id");

-- CreateIndex
CREATE INDEX "idx_handovers_requested" ON "chat"."handovers"("requested_at");

-- CreateIndex
CREATE INDEX "idx_handovers_session" ON "chat"."handovers"("session_id");

-- CreateIndex
CREATE INDEX "idx_handovers_status" ON "chat"."handovers"("status");

-- CreateIndex
CREATE INDEX "idx_team_members_active" ON "content"."team_members"("is_active");

-- CreateIndex
CREATE INDEX "idx_team_members_order" ON "content"."team_members"("sort_order");

-- CreateIndex
CREATE INDEX "idx_team_members_org_level" ON "content"."team_members"("org_level");

-- CreateIndex
CREATE INDEX "idx_team_members_parent" ON "content"."team_members"("parent_id");

-- CreateIndex
CREATE INDEX "idx_crm_activities_author" ON "crm"."activities"("author_user_id");

-- CreateIndex
CREATE INDEX "idx_crm_activities_occurred" ON "crm"."activities"("occurred_at");

-- CreateIndex
CREATE INDEX "idx_crm_activities_related" ON "crm"."activities"("related_type", "related_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_values_key_key" ON "content"."company_values"("key");

-- CreateIndex
CREATE INDEX "idx_company_values_active" ON "content"."company_values"("is_active");

-- CreateIndex
CREATE INDEX "idx_company_values_order" ON "content"."company_values"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "hero_slides_slug_key" ON "content"."hero_slides"("slug");

-- CreateIndex
CREATE INDEX "idx_hero_slides_active" ON "content"."hero_slides"("is_active");

-- CreateIndex
CREATE INDEX "idx_hero_slides_order" ON "content"."hero_slides"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "who_we_are_concepts_key_key" ON "content"."who_we_are_concepts"("key");

-- CreateIndex
CREATE INDEX "idx_who_we_are_concepts_active" ON "content"."who_we_are_concepts"("is_active");

-- AddForeignKey
ALTER TABLE "catalog"."services" ADD CONSTRAINT "fk_catalog_service_category" FOREIGN KEY ("category_id") REFERENCES "catalog"."service_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."audit_logs" ADD CONSTRAINT "fk_audit_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."branches" ADD CONSTRAINT "fk_branch_city" FOREIGN KEY ("city_id") REFERENCES "core"."cities"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."branches" ADD CONSTRAINT "fk_branch_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."cities" ADD CONSTRAINT "fk_cities_state" FOREIGN KEY ("state_id") REFERENCES "core"."states"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."companies" ADD CONSTRAINT "fk_company_country" FOREIGN KEY ("country_id") REFERENCES "core"."countries"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."companies" ADD CONSTRAINT "fk_company_industry" FOREIGN KEY ("industry_id") REFERENCES "catalog"."industries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."companies" ADD CONSTRAINT "fk_company_type" FOREIGN KEY ("company_type_id") REFERENCES "catalog"."company_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_addresses" ADD CONSTRAINT "fk_company_address_branch" FOREIGN KEY ("branch_id") REFERENCES "core"."branches"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_addresses" ADD CONSTRAINT "fk_company_address_city" FOREIGN KEY ("city_id") REFERENCES "core"."cities"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_addresses" ADD CONSTRAINT "fk_company_address_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_addresses" ADD CONSTRAINT "fk_company_address_type" FOREIGN KEY ("address_type_id") REFERENCES "catalog"."address_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_emails" ADD CONSTRAINT "fk_company_email" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_phones" ADD CONSTRAINT "fk_company_phone" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_settings" ADD CONSTRAINT "fk_company_settings" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."company_social_networks" ADD CONSTRAINT "fk_company_social" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contact_addresses" ADD CONSTRAINT "fk_contact_address" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contact_addresses" ADD CONSTRAINT "fk_contact_address_city" FOREIGN KEY ("city_id") REFERENCES "core"."cities"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contact_emails" ADD CONSTRAINT "fk_contact_email" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contact_emails" ADD CONSTRAINT "fk_contact_email_type" FOREIGN KEY ("email_type_id") REFERENCES "catalog"."email_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contact_phones" ADD CONSTRAINT "fk_contact_phone" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contact_phones" ADD CONSTRAINT "fk_contact_phone_type" FOREIGN KEY ("phone_type_id") REFERENCES "catalog"."phone_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contact_social_networks" ADD CONSTRAINT "fk_contact_social" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contacts" ADD CONSTRAINT "fk_contact_branch" FOREIGN KEY ("branch_id") REFERENCES "core"."branches"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contacts" ADD CONSTRAINT "fk_contact_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."contacts" ADD CONSTRAINT "fk_contact_source" FOREIGN KEY ("source_id") REFERENCES "catalog"."contact_sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."holidays" ADD CONSTRAINT "fk_holiday_country" FOREIGN KEY ("country_id") REFERENCES "core"."countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core"."states" ADD CONSTRAINT "fk_states_country" FOREIGN KEY ("country_id") REFERENCES "core"."countries"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_activities" ADD CONSTRAINT "fk_activity_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_activities" ADD CONSTRAINT "fk_activity_contact" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_activities" ADD CONSTRAINT "fk_activity_created" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_activities" ADD CONSTRAINT "fk_activity_lead" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_activities" ADD CONSTRAINT "fk_activity_type" FOREIGN KEY ("activity_type_id") REFERENCES "crm"."activity_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_activities" ADD CONSTRAINT "fk_activity_updated" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_activities" ADD CONSTRAINT "fk_activity_user" FOREIGN KEY ("assigned_user_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_files" ADD CONSTRAINT "fk_file" FOREIGN KEY ("file_id") REFERENCES "foundation"."files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_files" ADD CONSTRAINT "fk_lead_file" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_files" ADD CONSTRAINT "fk_uploaded_by" FOREIGN KEY ("uploaded_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_notes" ADD CONSTRAINT "fk_note_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_notes" ADD CONSTRAINT "fk_note_created_by" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_notes" ADD CONSTRAINT "fk_note_lead" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_notes" ADD CONSTRAINT "fk_note_updated_by" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_tag_relations" ADD CONSTRAINT "fk_relation_lead" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_tag_relations" ADD CONSTRAINT "fk_relation_tag" FOREIGN KEY ("tag_id") REFERENCES "crm"."lead_tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_tag_relations" ADD CONSTRAINT "fk_relation_user" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_tags" ADD CONSTRAINT "fk_tag_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."lead_tags" ADD CONSTRAINT "fk_tag_user" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_converted_company" FOREIGN KEY ("converted_company_id") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_converted_contact" FOREIGN KEY ("converted_contact_id") REFERENCES "core"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_created_user" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_lead_assigned" FOREIGN KEY ("assigned_to") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_lead_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_lead_contact" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_lead_pipeline" FOREIGN KEY ("pipeline_id") REFERENCES "crm"."pipelines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_lead_source" FOREIGN KEY ("source_id") REFERENCES "crm"."lead_sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_lead_stage" FOREIGN KEY ("stage_id") REFERENCES "crm"."pipeline_stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_lead_status" FOREIGN KEY ("status_id") REFERENCES "crm"."lead_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_parent_lead" FOREIGN KEY ("parent_lead_id") REFERENCES "crm"."leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."leads" ADD CONSTRAINT "fk_updated_user" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."pipeline_stages" ADD CONSTRAINT "fk_pipeline_stage_pipeline" FOREIGN KEY ("pipeline_id") REFERENCES "crm"."pipelines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."file_access_logs" ADD CONSTRAINT "fk_log_file" FOREIGN KEY ("file_id") REFERENCES "foundation"."files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."file_access_logs" ADD CONSTRAINT "fk_log_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."file_shares" ADD CONSTRAINT "fk_share_file" FOREIGN KEY ("file_id") REFERENCES "foundation"."files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."file_shares" ADD CONSTRAINT "fk_share_user" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."file_tags" ADD CONSTRAINT "fk_tag_file" FOREIGN KEY ("file_id") REFERENCES "foundation"."files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."file_versions" ADD CONSTRAINT "fk_version_file" FOREIGN KEY ("file_id") REFERENCES "foundation"."files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."file_versions" ADD CONSTRAINT "fk_version_user" FOREIGN KEY ("uploaded_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."files" ADD CONSTRAINT "fk_file_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "foundation"."files" ADD CONSTRAINT "fk_file_user" FOREIGN KEY ("uploaded_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."audit_logs" ADD CONSTRAINT "fk_audit_session" FOREIGN KEY ("session_id") REFERENCES "security"."sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."audit_logs" ADD CONSTRAINT "fk_audit_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."email_verifications" ADD CONSTRAINT "fk_email_verification_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."login_attempts" ADD CONSTRAINT "fk_login_attempts_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."password_resets" ADD CONSTRAINT "fk_password_resets_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."role_permissions" ADD CONSTRAINT "fk_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "security"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."role_permissions" ADD CONSTRAINT "fk_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "security"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."sessions" ADD CONSTRAINT "fk_sessions_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."users" ADD CONSTRAINT "fk_users_position" FOREIGN KEY ("position_id") REFERENCES "security"."positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "security"."users" ADD CONSTRAINT "fk_users_role" FOREIGN KEY ("role_id") REFERENCES "security"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."application_evaluations" ADD CONSTRAINT "fk_evaluation_application" FOREIGN KEY ("application_id") REFERENCES "careers"."applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."application_evaluations" ADD CONSTRAINT "fk_evaluation_user" FOREIGN KEY ("evaluator_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."application_interviews" ADD CONSTRAINT "fk_interview_application" FOREIGN KEY ("application_id") REFERENCES "careers"."applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."application_interviews" ADD CONSTRAINT "fk_interview_interviewer" FOREIGN KEY ("interviewer_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."application_status_history" ADD CONSTRAINT "fk_application_history_application" FOREIGN KEY ("application_id") REFERENCES "careers"."applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."application_status_history" ADD CONSTRAINT "fk_application_history_user" FOREIGN KEY ("changed_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."applications" ADD CONSTRAINT "fk_application_candidate" FOREIGN KEY ("candidate_id") REFERENCES "careers"."candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."applications" ADD CONSTRAINT "fk_application_job" FOREIGN KEY ("job_position_id") REFERENCES "careers"."job_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."applications" ADD CONSTRAINT "fk_application_recruiter" FOREIGN KEY ("assigned_recruiter") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."candidate_education" ADD CONSTRAINT "fk_education_candidate" FOREIGN KEY ("candidate_id") REFERENCES "careers"."candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."candidate_experiences" ADD CONSTRAINT "fk_experience_candidate" FOREIGN KEY ("candidate_id") REFERENCES "careers"."candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."candidate_languages" ADD CONSTRAINT "fk_candidate_language" FOREIGN KEY ("candidate_id") REFERENCES "careers"."candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."candidate_skills" ADD CONSTRAINT "fk_candidate_skill" FOREIGN KEY ("candidate_id") REFERENCES "careers"."candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."candidates" ADD CONSTRAINT "fk_candidate_city" FOREIGN KEY ("city_id") REFERENCES "core"."cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."job_position_benefits" ADD CONSTRAINT "fk_job_benefit_position" FOREIGN KEY ("job_position_id") REFERENCES "careers"."job_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."job_position_skills" ADD CONSTRAINT "fk_job_skill_position" FOREIGN KEY ("job_position_id") REFERENCES "careers"."job_positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."job_positions" ADD CONSTRAINT "fk_job_created_by" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."job_positions" ADD CONSTRAINT "fk_job_updated_by" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "careers"."recruiters" ADD CONSTRAINT "fk_recruiter_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."menu_items" ADD CONSTRAINT "fk_menu_item_menu" FOREIGN KEY ("menu_id") REFERENCES "content"."menus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."menu_items" ADD CONSTRAINT "fk_menu_item_page" FOREIGN KEY ("page_id") REFERENCES "content"."pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."menu_items" ADD CONSTRAINT "fk_menu_item_parent" FOREIGN KEY ("parent_id") REFERENCES "content"."menu_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."page_sections" ADD CONSTRAINT "fk_page_section_page" FOREIGN KEY ("page_id") REFERENCES "content"."pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."pages" ADD CONSTRAINT "fk_content_page_created_by" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."pages" ADD CONSTRAINT "fk_content_page_updated_by" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."post_category_relations" ADD CONSTRAINT "fk_post_category_category" FOREIGN KEY ("category_id") REFERENCES "content"."post_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."post_category_relations" ADD CONSTRAINT "fk_post_category_post" FOREIGN KEY ("post_id") REFERENCES "content"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."post_tag_relations" ADD CONSTRAINT "fk_post_tag_post" FOREIGN KEY ("post_id") REFERENCES "content"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."post_tag_relations" ADD CONSTRAINT "fk_post_tag_tag" FOREIGN KEY ("tag_id") REFERENCES "content"."post_tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."posts" ADD CONSTRAINT "fk_post_author" FOREIGN KEY ("author_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."posts" ADD CONSTRAINT "fk_post_image" FOREIGN KEY ("featured_image_file_id") REFERENCES "foundation"."files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."testimonials" ADD CONSTRAINT "fk_testimonial_photo" FOREIGN KEY ("photo_file_id") REFERENCES "foundation"."files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_assignments" ADD CONSTRAINT "fk_assignment_request" FOREIGN KEY ("request_id") REFERENCES "pqr"."requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_assignments" ADD CONSTRAINT "fk_assignment_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_attachments" ADD CONSTRAINT "fk_attachment_file" FOREIGN KEY ("file_id") REFERENCES "foundation"."files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_attachments" ADD CONSTRAINT "fk_attachment_request" FOREIGN KEY ("request_id") REFERENCES "pqr"."requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_attachments" ADD CONSTRAINT "fk_attachment_user" FOREIGN KEY ("uploaded_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_messages" ADD CONSTRAINT "fk_message_request" FOREIGN KEY ("request_id") REFERENCES "pqr"."requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_messages" ADD CONSTRAINT "fk_message_user" FOREIGN KEY ("sender_user_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_slas" ADD CONSTRAINT "fk_sla_priority" FOREIGN KEY ("priority_id") REFERENCES "pqr"."request_priorities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_slas" ADD CONSTRAINT "fk_sla_type" FOREIGN KEY ("request_type_id") REFERENCES "pqr"."request_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_status_history" ADD CONSTRAINT "fk_status_history_new" FOREIGN KEY ("new_status_id") REFERENCES "pqr"."request_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_status_history" ADD CONSTRAINT "fk_status_history_old" FOREIGN KEY ("old_status_id") REFERENCES "pqr"."request_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_status_history" ADD CONSTRAINT "fk_status_history_request" FOREIGN KEY ("request_id") REFERENCES "pqr"."requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."request_status_history" ADD CONSTRAINT "fk_status_history_user" FOREIGN KEY ("changed_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_assigned" FOREIGN KEY ("assigned_to") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_category" FOREIGN KEY ("category_id") REFERENCES "pqr"."request_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_company" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_contact" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_created" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_priority" FOREIGN KEY ("priority_id") REFERENCES "pqr"."request_priorities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_status" FOREIGN KEY ("status_id") REFERENCES "pqr"."request_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_type" FOREIGN KEY ("type_id") REFERENCES "pqr"."request_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pqr"."requests" ADD CONSTRAINT "fk_request_updated" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."opportunities" ADD CONSTRAINT "opportunities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "core"."companies"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."opportunities" ADD CONSTRAINT "opportunities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "core"."contacts"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."opportunities" ADD CONSTRAINT "opportunities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."opportunities" ADD CONSTRAINT "opportunities_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."opportunities" ADD CONSTRAINT "opportunities_source_lead_id_fkey" FOREIGN KEY ("source_lead_id") REFERENCES "crm"."leads"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."opportunities" ADD CONSTRAINT "opportunities_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."tasks" ADD CONSTRAINT "tasks_assignee_user_id_fkey" FOREIGN KEY ("assignee_user_id") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."tasks" ADD CONSTRAINT "tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."tasks" ADD CONSTRAINT "tasks_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_context" ADD CONSTRAINT "fk_chat_context_intent" FOREIGN KEY ("intent_id") REFERENCES "chat"."chat_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_context" ADD CONSTRAINT "fk_chat_context_service" FOREIGN KEY ("service_id") REFERENCES "catalog"."services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_context" ADD CONSTRAINT "fk_chat_context_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_events" ADD CONSTRAINT "fk_chat_event_message" FOREIGN KEY ("message_id") REFERENCES "chat"."chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_events" ADD CONSTRAINT "fk_chat_event_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_events" ADD CONSTRAINT "fk_chat_event_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_feedback" ADD CONSTRAINT "fk_chat_feedback_message" FOREIGN KEY ("message_id") REFERENCES "chat"."chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_feedback" ADD CONSTRAINT "fk_chat_feedback_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_intent_detections" ADD CONSTRAINT "fk_intent_detection_intent" FOREIGN KEY ("intent_id") REFERENCES "chat"."chat_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_intent_detections" ADD CONSTRAINT "fk_intent_detection_message" FOREIGN KEY ("message_id") REFERENCES "chat"."chat_messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_intent_detections" ADD CONSTRAINT "fk_intent_detection_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_messages" ADD CONSTRAINT "fk_chat_message_intent" FOREIGN KEY ("intent_id") REFERENCES "chat"."chat_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_messages" ADD CONSTRAINT "fk_chat_message_parent" FOREIGN KEY ("parent_message_id") REFERENCES "chat"."chat_messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_messages" ADD CONSTRAINT "fk_chat_message_service" FOREIGN KEY ("service_id") REFERENCES "catalog"."services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_messages" ADD CONSTRAINT "fk_chat_message_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_messages" ADD CONSTRAINT "fk_chat_message_user" FOREIGN KEY ("sender_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_service_matches" ADD CONSTRAINT "fk_service_match_message" FOREIGN KEY ("message_id") REFERENCES "chat"."chat_messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_service_matches" ADD CONSTRAINT "fk_service_match_service" FOREIGN KEY ("service_id") REFERENCES "catalog"."services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_service_matches" ADD CONSTRAINT "fk_service_match_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_sessions" ADD CONSTRAINT "fk_chat_session_lead" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_sessions" ADD CONSTRAINT "fk_chat_session_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_suggestions" ADD CONSTRAINT "fk_suggestion_message" FOREIGN KEY ("message_id") REFERENCES "chat"."chat_messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."chat_suggestions" ADD CONSTRAINT "fk_suggestion_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."consents" ADD CONSTRAINT "fk_chat_consent_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."consents" ADD CONSTRAINT "fk_chat_consent_user" FOREIGN KEY ("user_id") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."handover_assignments" ADD CONSTRAINT "fk_handover_assignment_assigned_by" FOREIGN KEY ("assigned_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."handover_assignments" ADD CONSTRAINT "fk_handover_assignment_handover" FOREIGN KEY ("handover_id") REFERENCES "chat"."handovers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."handover_assignments" ADD CONSTRAINT "fk_handover_assignment_user" FOREIGN KEY ("assigned_to") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."handovers" ADD CONSTRAINT "fk_handover_assigned_to" FOREIGN KEY ("assigned_to") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."handovers" ADD CONSTRAINT "fk_handover_lead" FOREIGN KEY ("lead_id") REFERENCES "crm"."leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."handovers" ADD CONSTRAINT "fk_handover_requested_by" FOREIGN KEY ("requested_by") REFERENCES "security"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat"."handovers" ADD CONSTRAINT "fk_handover_session" FOREIGN KEY ("session_id") REFERENCES "chat"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."team_members" ADD CONSTRAINT "team_members_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."team_members" ADD CONSTRAINT "team_members_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "content"."team_members"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."team_members" ADD CONSTRAINT "team_members_service_code_fkey" FOREIGN KEY ("service_code") REFERENCES "catalog"."services"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."team_members" ADD CONSTRAINT "team_members_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "crm"."activities" ADD CONSTRAINT "activities_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."company_profile" ADD CONSTRAINT "company_profile_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."company_values" ADD CONSTRAINT "company_values_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."company_values" ADD CONSTRAINT "company_values_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."hero_slides" ADD CONSTRAINT "hero_slides_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."hero_slides" ADD CONSTRAINT "hero_slides_service_code_fkey" FOREIGN KEY ("service_code") REFERENCES "catalog"."services"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."hero_slides" ADD CONSTRAINT "hero_slides_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."who_we_are_concepts" ADD CONSTRAINT "who_we_are_concepts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content"."who_we_are_concepts" ADD CONSTRAINT "who_we_are_concepts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "security"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;


