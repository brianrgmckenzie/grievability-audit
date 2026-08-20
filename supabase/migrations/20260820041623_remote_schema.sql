set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on tables from "service_role";

create sequence "public"."grievability_submissions_seq_seq" as bigint increment by 1 minvalue 1 maxvalue 9223372036854775807 START with 1 cache 1 no cycle;

create table "public"."ad_hoc_reports" (
  "id"          uuid                     not null default extensions.uuid_generate_v4(),
  "project_id"  uuid                     not null,
  "title"       text                     not null,
  "prompt"      text                     not null,
  "content"     text                     not null,
  "created_by"  uuid,
  "created_at"  timestamp with time zone default now(),
  "token_usage" jsonb,
  constraint "ad_hoc_reports_pkey" primary key (id)
);

alter table "public"."ad_hoc_reports"
  enable row level security;

create table "public"."companies" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "name"       text                     not null,
  "slug"       text                     not null,
  "created_at" timestamp with time zone default now(),
  "updated_at" timestamp with time zone default now(),
  constraint "companies_pkey" primary key (id),
  constraint "companies_slug_key" unique (slug)
);

alter table "public"."companies"
  enable row level security;

create table "public"."company_members" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "company_id" uuid,
  "user_id"    uuid,
  "role"       text                     not null default 'admin'::text,
  "created_at" timestamp with time zone default now(),
  constraint "company_members_company_id_user_id_key" unique (company_id, user_id),
  constraint "company_members_pkey" primary key (id)
);

alter table "public"."company_members"
  enable row level security;

create table "public"."criteria" (
  "id"                uuid                     not null default gen_random_uuid(),
  "decision_id"       uuid                     not null,
  "category"          text                     not null,
  "name"              text                     not null default ''::text,
  "lo_anchor"         text                     not null default ''::text,
  "hi_anchor"         text                     not null default ''::text,
  "weight"            integer                  not null default 3,
  "mode"              text                     not null default 'group'::text,
  "facilitator_value" integer,
  "inverted"          boolean                  not null default false,
  "position"          integer                  not null default 0,
  "created_at"        timestamp with time zone not null default now(),
  constraint "criteria_category_check" check ((category = ANY (ARRAY['impact'::text, 'sustainability'::text]))),
  constraint "criteria_facilitator_value_check" check (((facilitator_value >= 1) AND (facilitator_value <= 5))),
  constraint "criteria_mode_check" check ((mode = ANY (ARRAY['group'::text, 'facilitator'::text]))),
  constraint "criteria_pkey" primary key (id),
  constraint "criteria_weight_check" check (((weight >= 1) AND (weight <= 5))),
  constraint "facilitator_value_required" check (((mode = 'group'::text) OR (facilitator_value IS NOT NULL)))
);

alter table "public"."criteria"
  enable row level security;

create table "public"."decisions" (
  "id"                   uuid                     not null default gen_random_uuid(),
  "facilitator_id"       uuid                     not null,
  "impact_statement"     text                     not null default ''::text,
  "default_split"        integer                  not null default 50,
  "floors_on"            boolean                  not null default false,
  "sustainability_floor" integer                  not null default 55,
  "created_at"           timestamp with time zone not null default now(),
  "updated_at"           timestamp with time zone not null default now(),
  constraint "decisions_default_split_check" check (((default_split >= 0) AND (default_split <= 100))),
  constraint "decisions_pkey" primary key (id),
  constraint "decisions_sustainability_floor_check" check (((sustainability_floor >= 0) AND (sustainability_floor <= 100)))
);

alter table "public"."decisions"
  enable row level security;

create table "public"."document_comments" (
  "id"          uuid                     not null default gen_random_uuid(),
  "document_id" uuid,
  "project_id"  uuid,
  "user_id"     uuid                     not null,
  "user_email"  text                     not null,
  "body"        text                     not null,
  "created_at"  timestamp with time zone default now(),
  constraint "document_comments_pkey" primary key (id)
);

alter table "public"."document_comments"
  enable row level security;

create table "public"."document_conflicts" (
  "id"                   uuid                     not null default extensions.uuid_generate_v4(),
  "project_id"           uuid,
  "document_a"           uuid,
  "document_b"           uuid,
  "conflict_description" text,
  "resolved"             boolean                  default false,
  "resolved_note"        text,
  "created_at"           timestamp with time zone default now(),
  constraint "document_conflicts_pkey" primary key (id)
);

alter table "public"."document_conflicts"
  enable row level security;

create table "public"."documents" (
  "id"                   uuid                     not null default extensions.uuid_generate_v4(),
  "project_id"           uuid,
  "uploaded_by"          uuid,
  "file_name"            text                     not null,
  "file_path"            text                     not null,
  "file_type"            text,
  "file_size"            integer,
  "title"                text,
  "document_date"        date,
  "author"               text,
  "source_organization"  text,
  "authority_tier"       integer,
  "authority_tier_label" text,
  "category"             text,
  "relevance_weight"     integer,
  "summary"              text,
  "key_extracts"         text[],
  "topics"               text[],
  "named_entities"       jsonb,
  "key_numbers"          jsonb,
  "sentiment"            text,
  "flags"                text[],
  "superseded_by"        uuid,
  "supersedes"           uuid,
  "ai_processed"         boolean                  default false,
  "ai_processed_at"      timestamp with time zone,
  "ai_model_used"        text,
  "human_reviewed"       boolean                  default false,
  "human_reviewed_by"    uuid,
  "human_reviewed_at"    timestamp with time zone,
  "created_at"           timestamp with time zone default now(),
  "updated_at"           timestamp with time zone default now(),
  "chief_concerns"       text[],
  "consultant_notes"     text[],
  "craap_currency"       integer,
  "craap_relevance"      integer,
  "craap_authority"      integer,
  "craap_completeness"   integer,
  "craap_purpose"        integer,
  "craap_total"          integer,
  "craap_weighted_total" numeric,
  "extracted_text"       text,
  "image_url"            text,
  "sub_project_id"       uuid,
  "ai_token_usage"       jsonb,
  constraint "documents_authority_tier_check" check (((authority_tier >= 1) AND (authority_tier <= 5))),
  constraint "documents_craap_authority_check" check (((craap_authority >= 1) AND (craap_authority <= 10))),
  constraint "documents_craap_completeness_check" check (((craap_completeness >= 1) AND (craap_completeness <= 10))),
  constraint "documents_craap_currency_check" check (((craap_currency >= 1) AND (craap_currency <= 10))),
  constraint "documents_craap_purpose_check" check (((craap_purpose >= 1) AND (craap_purpose <= 10))),
  constraint "documents_craap_relevance_check" check (((craap_relevance >= 1) AND (craap_relevance <= 10))),
  constraint "documents_pkey" primary key (id),
  constraint "documents_relevance_weight_check" check (((relevance_weight >= 1) AND (relevance_weight <= 10)))
);

alter table "public"."documents"
  enable row level security;

create table "public"."grievability_sequence_emails" (
  "id"              uuid                     not null default gen_random_uuid(),
  "submission_id"   uuid                     not null,
  "step"            smallint                 not null,
  "day_offset"      smallint                 not null,
  "send_at"         timestamp with time zone not null,
  "subject"         text                     not null,
  "body"            text                     not null,
  "resend_email_id" text,
  "status"          text                     not null default 'scheduled'::text,
  "used_fallback"   boolean                  not null default false,
  "created_at"      timestamp with time zone default now(),
  "updated_at"      timestamp with time zone default now(),
  constraint "grievability_sequence_emails_pkey" primary key (id),
  constraint "grievability_sequence_emails_status_check" check ((status = ANY (ARRAY['scheduled'::text, 'sent'::text, 'canceled'::text, 'failed'::text])))
);

alter table "public"."grievability_sequence_emails"
  enable row level security;

create table "public"."grievability_submissions" (
  "id"                uuid                     not null default gen_random_uuid(),
  "created_at"        timestamp with time zone default now(),
  "name"              text                     not null,
  "email"             text                     not null,
  "org"               text                     not null,
  "answers"           jsonb                    not null,
  "final_score"       integer                  not null,
  "band_name"         text                     not null,
  "narrative"         text                     not null,
  "city"              text,
  "province"          text,
  "lang"              text                     not null default 'en'::text,
  "unsubscribe_token" uuid                     not null default gen_random_uuid(),
  "unsubscribed_at"   timestamp with time zone,
  "seq"               bigint                   not null default nextval('public.grievability_submissions_seq_seq'::regclass),
  constraint "grievability_submissions_pkey" primary key (id)
);

alter table "public"."grievability_submissions"
  enable row level security;

create table "public"."options" (
  "id"          uuid                     not null default gen_random_uuid(),
  "decision_id" uuid                     not null,
  "name"        text                     not null default ''::text,
  "position"    integer                  not null default 0,
  "created_at"  timestamp with time zone not null default now(),
  constraint "options_pkey" primary key (id)
);

alter table "public"."options"
  enable row level security;

create table "public"."participants" (
  "id"           uuid                     not null default gen_random_uuid(),
  "session_id"   uuid                     not null,
  "user_id"      uuid                     not null,
  "display_name" text                     not null default 'Participant'::text,
  "option_order" uuid[]                   not null default '{}'::uuid[],
  "submitted_at" timestamp with time zone,
  "last_seen_at" timestamp with time zone not null default now(),
  "created_at"   timestamp with time zone not null default now(),
  constraint "participants_pkey" primary key (id),
  constraint "participants_session_id_user_id_key" unique (session_id, user_id)
);

alter table "public"."participants"
  enable row level security;

create table "public"."project_admins" (
  "id"         uuid                     not null default extensions.uuid_generate_v4(),
  "project_id" uuid,
  "user_id"    uuid,
  "created_at" timestamp with time zone default now(),
  constraint "project_admins_pkey" primary key (id),
  constraint "project_admins_project_id_user_id_key" unique (project_id, user_id)
);

alter table "public"."project_admins"
  enable row level security;

create table "public"."project_members" (
  "id"         uuid                     not null default gen_random_uuid(),
  "project_id" uuid                     not null,
  "user_id"    uuid                     not null,
  "created_at" timestamp with time zone default now(),
  constraint "project_members_pkey" primary key (id),
  constraint "project_members_project_id_user_id_key" unique (project_id, user_id)
);

alter table "public"."project_members"
  enable row level security;

create table "public"."projects" (
  "id"                      uuid                     not null default extensions.uuid_generate_v4(),
  "name"                    text                     not null,
  "client_name"             text                     not null,
  "description"             text,
  "project_type"            text,
  "slug"                    text                     not null,
  "created_by"              uuid,
  "created_at"              timestamp with time zone default now(),
  "updated_at"              timestamp with time zone default now(),
  "manuscript"              text,
  "manuscript_generated_at" timestamp with time zone,
  "craap_weights"           jsonb                    default '{"purpose": 1, "currency": 1, "authority": 1, "relevance": 1, "completeness": 1}'::jsonb,
  "search_suppressed_words" text[]                   default '{}'::text[],
  "image_url"               text,
  "status"                  text                     default 'intake'::text,
  "share_token"             uuid,
  "share_enabled"           boolean                  default false,
  "audio_url"               text,
  "company_id"              uuid,
  "engagement_context"      text,
  "manuscript_token_usage"  jsonb,
  constraint "projects_pkey" primary key (id),
  constraint "projects_slug_key" unique (slug)
);

alter table "public"."projects"
  enable row level security;

create table "public"."scores" (
  "id"             uuid                     not null default gen_random_uuid(),
  "participant_id" uuid                     not null,
  "criterion_id"   uuid                     not null,
  "option_id"      uuid                     not null,
  "value"          integer,
  "unsure"         boolean                  not null default false,
  "updated_at"     timestamp with time zone not null default now(),
  constraint "scores_participant_id_criterion_id_option_id_key" unique (participant_id, criterion_id, option_id),
  constraint "scores_pkey" primary key (id),
  constraint "scores_value_check" check (((value >= 1) AND (value <= 5))),
  constraint "value_or_unsure" check (((value IS NOT NULL) OR unsure))
);

alter table "public"."scores"
  enable row level security;

create table "public"."sessions" (
  "id"          uuid                     not null default gen_random_uuid(),
  "decision_id" uuid                     not null,
  "join_code"   text                     not null,
  "status"      text                     not null default 'open'::text,
  "created_at"  timestamp with time zone not null default now(),
  "revealed_at" timestamp with time zone,
  "closed_at"   timestamp with time zone,
  constraint "sessions_join_code_key" unique (join_code),
  constraint "sessions_pkey" primary key (id),
  constraint "sessions_status_check" check ((status = ANY (ARRAY['open'::text, 'revealed'::text, 'closed'::text])))
);

alter table "public"."sessions"
  enable row level security;

create table "public"."sub_projects" (
  "id"          uuid                     not null default extensions.uuid_generate_v4(),
  "project_id"  uuid                     not null,
  "name"        text                     not null,
  "description" text,
  "slug"        text                     not null,
  "status"      text                     default 'active'::text,
  "created_at"  timestamp with time zone default now(),
  "updated_at"  timestamp with time zone default now(),
  constraint "sub_projects_pkey" primary key (id),
  constraint "sub_projects_project_id_slug_key" unique (project_id, slug),
  constraint "sub_projects_status_check" check ((status = ANY (ARRAY['active'::text, 'complete'::text, 'archived'::text])))
);

alter table "public"."sub_projects"
  enable row level security;

create table "public"."user_profiles" (
  "user_id"      uuid                     not null,
  "first_name"   text,
  "last_name"    text,
  "organization" text,
  "created_at"   timestamp with time zone default now(),
  constraint "user_profiles_pkey" primary key (user_id)
);

alter table "public"."user_profiles"
  enable row level security;

create table "public"."user_roles" (
  "id"         uuid                     not null default gen_random_uuid(),
  "user_id"    uuid                     not null,
  "role"       text                     not null,
  "created_at" timestamp with time zone default now(),
  constraint "user_roles_pkey" primary key (id),
  constraint "user_roles_role_check" check ((role = ANY (ARRAY['super_admin'::text, 'company_admin'::text, 'client'::text]))),
  constraint "user_roles_user_id_key" unique (user_id)
);

alter table "public"."user_roles"
  enable row level security;

alter sequence "public"."grievability_submissions_seq_seq" owned by "public"."grievability_submissions"."seq";

create or replace function public._is_decision_facilitator (
  p_decision_id uuid
)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$
  select exists (select 1 from decisions where id = p_decision_id and facilitator_id = auth.uid());
$function$;

create or replace function public._is_decision_participant (
  p_decision_id uuid
)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$
  select exists (
    select 1 from participants p join sessions s on s.id = p.session_id
    where s.decision_id = p_decision_id and p.user_id = auth.uid()
  );
$function$;

create or replace function public._is_session_facilitator (
  p_session_id uuid
)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$
  select exists (
    select 1 from sessions s join decisions d on d.id = s.decision_id
    where s.id = p_session_id and d.facilitator_id = auth.uid()
  );
$function$;

create or replace function public._is_session_participant (
  p_session_id uuid
)
  returns boolean
  language sql
  stable
  security definer
  set search_path to 'public'
  AS $function$
  select exists (select 1 from participants where session_id = p_session_id and user_id = auth.uid());
$function$;

create or replace function public.generate_join_code()
  returns text
  language plpgsql
  AS $function$
declare
  alphabet text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  code text;
  exists_already boolean;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    select exists(select 1 from sessions where join_code = code) into exists_already;
    exit when not exists_already;
  end loop;
  return code;
end;
$function$;

create or replace function public.get_decision_results (
  p_session_id uuid
)
  returns table (
    option_id         uuid,
    name              text,
    impact_mean       numeric,
    sustain_mean      numeric,
    alignment         numeric,
    below_floor       boolean,
    participant_count integer
  )
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
#variable_conflict use_column
declare
  v_decision decisions;
  v_status text;
begin
  select d.* into v_decision
    from sessions s join decisions d on d.id = s.decision_id
    where s.id = p_session_id;
  select s.status into v_status from sessions s where s.id = p_session_id;

  if v_status is null or v_status <> 'revealed' then
    return; -- empty result set: nothing is available pre-reveal.
  end if;

  return query
  with effective as (
    select
      sc.option_id,
      p.id as participant_id,
      c.category,
      c.weight,
      case when c.inverted then 6 - sc.value else sc.value end as value
    from scores sc
    join criteria c on c.id = sc.criterion_id
    join participants p on p.id = sc.participant_id
    where c.decision_id = v_decision.id and not sc.unsure and sc.value is not null
  ),
  per_participant_option as (
    select
      option_id,
      participant_id,
      sum(weight * value) filter (where category = 'impact') / nullif(sum(weight) filter (where category = 'impact'), 0) as impact_p,
      sum(weight * value) filter (where category = 'sustainability') / nullif(sum(weight) filter (where category = 'sustainability'), 0) as sustain_p
    from effective
    group by option_id, participant_id
  ),
  per_participant_combined as (
    select
      option_id,
      participant_id,
      -- normalize 1-5 -> 0-100 before blending, matching the 0-100 split/floor scale
      ((impact_p - 1) / 4.0 * 100) as impact_pct,
      ((sustain_p - 1) / 4.0 * 100) as sustain_pct,
      (v_decision.default_split / 100.0) * ((impact_p - 1) / 4.0 * 100)
        + (1 - v_decision.default_split / 100.0) * ((sustain_p - 1) / 4.0 * 100) as combined_pct
    from per_participant_option
    where impact_p is not null and sustain_p is not null
  )
  select
    o.id as option_id,
    o.name,
    round(avg(ppc.impact_pct)::numeric, 1) as impact_mean,
    round(avg(ppc.sustain_pct)::numeric, 1) as sustain_mean,
    round(greatest(0, 1 - coalesce(stddev_pop(ppc.combined_pct), 0) / 50)::numeric, 3) as alignment,
    coalesce(v_decision.floors_on and avg(ppc.sustain_pct) < v_decision.sustainability_floor, false) as below_floor,
    count(ppc.participant_id)::int as participant_count
  from options o
  left join per_participant_combined ppc on ppc.option_id = o.id
  where o.decision_id = v_decision.id
  group by o.id, o.name, o.position
  order by o.position;
end;
$function$;

create or replace function public.get_session_progress (
  p_session_id uuid
)
  returns json
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
declare
  v_decision_id uuid;
  v_owner uuid;
  v_total_criteria int;
  v_result json;
begin
  select s.decision_id into v_decision_id from sessions s where s.id = p_session_id;
  select d.facilitator_id into v_owner from decisions d where d.id = v_decision_id;
  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'not authorized';
  end if;

  select count(*) into v_total_criteria from criteria where criteria.decision_id = v_decision_id;

  select json_build_object(
    'total_criteria', v_total_criteria,
    'participants', coalesce(json_agg(row), '[]'::json)
  ) into v_result
  from (
    select
      p.id,
      p.display_name,
      p.submitted_at,
      (
        select count(*) from criteria c
        where c.decision_id = v_decision_id
        and not exists (
          select 1 from options o
          where o.decision_id = v_decision_id
          and not exists (
            select 1 from scores sc
            where sc.participant_id = p.id and sc.criterion_id = c.id and sc.option_id = o.id
          )
        )
      ) as done_count
    from participants p
    where p.session_id = p_session_id
    order by p.created_at
  ) row;

  return v_result;
end;
$function$;

create or replace function public.join_session (
  p_join_code    text,
  p_display_name text
)
  returns table (
    participant_id uuid,
    session_id     uuid,
    decision_id    uuid
  )
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
#variable_conflict use_column
declare
  v_session sessions;
  v_participant participants;
  v_option_order uuid[];
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select * into v_session from sessions
    where upper(sessions.join_code) = upper(p_join_code) and sessions.status = 'open';
  if v_session.id is null then
    raise exception 'session not found or not open';
  end if;

  select array_agg(o.id order by random()) into v_option_order
    from options o where o.decision_id = v_session.decision_id;

  insert into participants (session_id, user_id, display_name, option_order)
  values (v_session.id, auth.uid(), coalesce(nullif(trim(p_display_name), ''), 'Participant'), coalesce(v_option_order, '{}'))
  on conflict (session_id, user_id)
  do update set display_name = excluded.display_name, last_seen_at = now()
  returning * into v_participant;

  return query select v_participant.id, v_session.id, v_session.decision_id;
end;
$function$;

create or replace function public.resolve_join_code (
  p_join_code text
)
  returns table (
    session_id  uuid,
    decision_id uuid,
    status      text
  )
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
#variable_conflict use_column
begin
  return query
    select s.id, s.decision_id, s.status
    from sessions s
    where upper(s.join_code) = upper(p_join_code)
      and s.status <> 'closed';
end;
$function$;

create or replace function public.reveal_session (
  p_session_id uuid
)
  returns void
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
declare
  v_owner uuid;
begin
  select d.facilitator_id into v_owner
    from sessions s join decisions d on d.id = s.decision_id
    where s.id = p_session_id;
  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'not authorized';
  end if;

  update sessions set status = 'revealed', revealed_at = now() where id = p_session_id;
end;
$function$;

create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create or replace function public.start_session (
  p_decision_id uuid
)
  returns table (
    id        uuid,
    join_code text
  )
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
#variable_conflict use_column
declare
  v_owner uuid;
  v_session sessions;
begin
  select facilitator_id into v_owner from decisions where decisions.id = p_decision_id;
  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'not authorized';
  end if;

  insert into sessions (decision_id, join_code)
  values (p_decision_id, generate_join_code())
  returning * into v_session;

  return query select v_session.id, v_session.join_code;
end;
$function$;

create or replace function public.submit_scores (
  p_participant_id uuid
)
  returns void
  language plpgsql
  security definer
  set search_path to 'public'
  AS $function$
begin
  update participants
    set submitted_at = now(), last_seen_at = now()
    where id = p_participant_id and user_id = auth.uid();
  if not found then
    raise exception 'not authorized';
  end if;
end;
$function$;

create or replace function public.touch_participant_on_score()
  returns trigger
  language plpgsql
  AS $function$
begin
  update participants set last_seen_at = now() where id = new.participant_id;
  return new;
end;
$function$;

alter table "public"."ad_hoc_reports"
  add constraint "ad_hoc_reports_created_by_fkey" foreign key (created_by) references auth.users(id);

alter table "public"."company_members"
  add constraint "company_members_company_id_fkey" foreign key (company_id) references public.companies(id) on delete cascade;

alter table "public"."company_members"
  add constraint "company_members_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

alter table "public"."decisions"
  add constraint "decisions_facilitator_id_fkey" foreign key (facilitator_id) references auth.users(id) on delete cascade;

alter table "public"."criteria"
  add constraint "criteria_decision_id_fkey" foreign key (decision_id) references public.decisions(id) on delete cascade;

alter table "public"."documents"
  add constraint "documents_human_reviewed_by_fkey" foreign key (human_reviewed_by) references auth.users(id);

alter table "public"."document_comments"
  add constraint "document_comments_document_id_fkey" foreign key (document_id) references public.documents(id) on delete cascade;

alter table "public"."document_conflicts"
  add constraint "document_conflicts_document_a_fkey" foreign key (document_a) references public.documents(id) on delete cascade;

alter table "public"."document_conflicts"
  add constraint "document_conflicts_document_b_fkey" foreign key (document_b) references public.documents(id) on delete cascade;

alter table "public"."documents"
  add constraint "documents_superseded_by_fkey" foreign key (superseded_by) references public.documents(id);

alter table "public"."documents"
  add constraint "documents_supersedes_fkey" foreign key (supersedes) references public.documents(id);

alter table "public"."documents"
  add constraint "documents_uploaded_by_fkey" foreign key (uploaded_by) references auth.users(id);

alter table "public"."grievability_sequence_emails"
  add constraint "grievability_sequence_emails_submission_id_fkey" foreign key (submission_id) references public.grievability_submissions(id) on delete cascade;

alter table "public"."options"
  add constraint "options_decision_id_fkey" foreign key (decision_id) references public.decisions(id) on delete cascade;

alter table "public"."participants"
  add constraint "participants_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

alter table "public"."project_admins"
  add constraint "project_admins_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

alter table "public"."project_members"
  add constraint "project_members_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

alter table "public"."projects"
  add constraint "projects_company_id_fkey" foreign key (company_id) references public.companies(id);

alter table "public"."projects"
  add constraint "projects_created_by_fkey" foreign key (created_by) references auth.users(id);

alter table "public"."ad_hoc_reports"
  add constraint "ad_hoc_reports_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

alter table "public"."document_comments"
  add constraint "document_comments_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

alter table "public"."document_conflicts"
  add constraint "document_conflicts_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

alter table "public"."documents"
  add constraint "documents_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

alter table "public"."project_admins"
  add constraint "project_admins_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

alter table "public"."project_members"
  add constraint "project_members_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

alter table "public"."scores"
  add constraint "scores_criterion_id_fkey" foreign key (criterion_id) references public.criteria(id) on delete cascade;

alter table "public"."scores"
  add constraint "scores_option_id_fkey" foreign key (option_id) references public.options(id) on delete cascade;

alter table "public"."scores"
  add constraint "scores_participant_id_fkey" foreign key (participant_id) references public.participants(id) on delete cascade;

alter table "public"."sessions"
  add constraint "sessions_decision_id_fkey" foreign key (decision_id) references public.decisions(id) on delete cascade;

alter table "public"."participants"
  add constraint "participants_session_id_fkey" foreign key (session_id) references public.sessions(id) on delete cascade;

alter table "public"."documents"
  add constraint "documents_sub_project_id_fkey" foreign key (sub_project_id) references public.sub_projects(id) on delete set null;

alter table "public"."sub_projects"
  add constraint "sub_projects_project_id_fkey" foreign key (project_id) references public.projects(id) on delete cascade;

alter table "public"."user_profiles"
  add constraint "user_profiles_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

alter table "public"."user_roles"
  add constraint "user_roles_user_id_fkey" foreign key (user_id) references auth.users(id) on delete cascade;

create index ad_hoc_reports_project_id_idx on public.ad_hoc_reports using btree (project_id);

create index criteria_decision_id_idx on public.criteria using btree (decision_id, "position");

create index decisions_facilitator_id_idx on public.decisions using btree (facilitator_id);

create unique index grievability_submissions_unsubscribe_token_idx on public.grievability_submissions using btree (unsubscribe_token);

create index options_decision_id_idx on public.options using btree (decision_id, "position");

create index participants_session_id_idx on public.participants using btree (session_id);

create index scores_criterion_option_idx on public.scores using btree (criterion_id, option_id);

create index scores_participant_id_idx on public.scores using btree (participant_id);

create trigger decisions_set_updated_at
  before update on public.decisions
  for each row
  execute function public.set_updated_at();

create trigger scores_touch_participant
  after insert or update on public.scores
  for each row
  execute function public.touch_participant_on_score();

create policy "Project members can delete ad_hoc_reports" on "public"."ad_hoc_reports"
  for delete
  to PUBLIC
  using (((exists ( select 1
   from public.project_members
  where ((project_members.project_id = ad_hoc_reports.project_id) AND (project_members.user_id = auth.uid())))) or (exists ( select 1
   from public.projects
  where ((projects.id = ad_hoc_reports.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Project members can insert ad_hoc_reports" on "public"."ad_hoc_reports"
  for insert
  to PUBLIC
  with check (((EXISTS ( SELECT 1
   FROM public.project_members
  WHERE ((project_members.project_id = ad_hoc_reports.project_id) AND (project_members.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = ad_hoc_reports.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Project members can view ad_hoc_reports" on "public"."ad_hoc_reports"
  for select
  to PUBLIC
  using (((exists ( select 1
   from public.project_members
  where ((project_members.project_id = ad_hoc_reports.project_id) AND (project_members.user_id = auth.uid())))) or (exists ( select 1
   from public.projects
  where ((projects.id = ad_hoc_reports.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Service role manages companies" on "public"."companies"
  for all
  to PUBLIC
  using (false);

create policy "Service role manages company_members" on "public"."company_members"
  for all
  to PUBLIC
  using (false);

create policy "facilitator manages own criteria" on "public"."criteria"
  for all
  to PUBLIC
  using (public._is_decision_facilitator(decision_id))
  with check (public._is_decision_facilitator(decision_id));

create policy "participants read criteria" on "public"."criteria"
  for select
  to PUBLIC
  using (public._is_decision_participant(decision_id));

create policy "facilitator manages own decisions" on "public"."decisions"
  for all
  to PUBLIC
  using ((facilitator_id = auth.uid()))
  with check ((facilitator_id = auth.uid()));

create policy "participants read own decision" on "public"."decisions"
  for select
  to PUBLIC
  using (public._is_decision_participant(id));

create policy "Authenticated users can insert comments" on "public"."document_comments"
  for insert
  to "authenticated"
  with check ((auth.uid() = user_id));

create policy "Authenticated users can read comments" on "public"."document_comments"
  for select
  to "authenticated"
  using (true);

create policy "Service role manages document_conflicts" on "public"."document_conflicts"
  for all
  to PUBLIC
  using (false);

create policy "Project members can delete documents" on "public"."documents"
  for delete
  to PUBLIC
  using (((exists ( select 1
   from public.project_admins
  where ((project_admins.project_id = documents.project_id) AND (project_admins.user_id = auth.uid())))) or (exists ( select 1
   from public.projects
  where ((projects.id = documents.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Project members can insert documents" on "public"."documents"
  for insert
  to PUBLIC
  with check (((EXISTS ( SELECT 1
   FROM public.project_admins
  WHERE ((project_admins.project_id = documents.project_id) AND (project_admins.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = documents.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Project members can update documents" on "public"."documents"
  for update
  to PUBLIC
  using (((exists ( select 1
   from public.project_admins
  where ((project_admins.project_id = documents.project_id) AND (project_admins.user_id = auth.uid())))) or (exists ( select 1
   from public.projects
  where ((projects.id = documents.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Project members can view documents" on "public"."documents"
  for select
  to PUBLIC
  using (((exists ( select 1
   from public.project_admins
  where ((project_admins.project_id = documents.project_id) AND (project_admins.user_id = auth.uid())))) or (exists ( select 1
   from public.projects
  where ((projects.id = documents.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Service role manages grievability_sequence_emails" on "public"."grievability_sequence_emails"
  for all
  to PUBLIC
  using (false);

create policy "Service role manages grievability_submissions" on "public"."grievability_submissions"
  for all
  to PUBLIC
  using (false);

create policy "facilitator manages own options" on "public"."options"
  for all
  to PUBLIC
  using (public._is_decision_facilitator(decision_id))
  with check (public._is_decision_facilitator(decision_id));

create policy "participants read options" on "public"."options"
  for select
  to PUBLIC
  using (public._is_decision_participant(decision_id));

create policy "facilitator reads roster" on "public"."participants"
  for select
  to PUBLIC
  using (public._is_session_facilitator(session_id));

create policy "participant reads own row" on "public"."participants"
  for select
  to PUBLIC
  using ((user_id = auth.uid()));

create policy "participant updates own row" on "public"."participants"
  for update
  to PUBLIC
  using ((user_id = auth.uid()))
  with check ((user_id = auth.uid()));

create policy "Service role manages project_admins" on "public"."project_admins"
  for all
  to PUBLIC
  using (false);

create policy "super_admin can write project_members" on "public"."project_members"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.user_roles ur
  where ((ur.user_id = auth.uid()) AND (ur.role = 'super_admin'::text)))));

create policy "super_admin or self can read project_members" on "public"."project_members"
  for select
  to PUBLIC
  using (((user_id = auth.uid()) or (exists ( select 1
   from public.user_roles ur
  where ((ur.user_id = auth.uid()) AND (ur.role = 'super_admin'::text))))));

create policy "Admins can view assigned projects" on "public"."projects"
  for select
  to PUBLIC
  using ((exists ( select 1
   from public.project_admins
  where ((project_admins.project_id = projects.id) AND (project_admins.user_id = auth.uid())))));

create policy "Project members can update projects" on "public"."projects"
  for update
  to PUBLIC
  using (((auth.uid() = created_by) or (exists ( select 1
   from public.project_members
  where ((project_members.project_id = projects.id) AND (project_members.user_id = auth.uid())))) or (exists ( select 1
   from public.company_members
  where ((company_members.company_id = projects.company_id) AND (company_members.user_id = auth.uid()) AND (company_members.role = 'admin'::text))))));

create policy "Users can create projects" on "public"."projects"
  for insert
  to PUBLIC
  with check ((auth.uid() = created_by));

create policy "Users can update their own projects" on "public"."projects"
  for update
  to PUBLIC
  using ((auth.uid() = created_by));

create policy "Users can view their own projects" on "public"."projects"
  for select
  to PUBLIC
  using ((auth.uid() = created_by));

create policy "participant manages own scores" on "public"."scores"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.participants p
  where ((p.id = scores.participant_id) AND (p.user_id = auth.uid())))))
  with check ((EXISTS ( SELECT 1
   FROM public.participants p
  WHERE ((p.id = scores.participant_id) AND (p.user_id = auth.uid())))));

create policy "facilitator manages own sessions" on "public"."sessions"
  for all
  to PUBLIC
  using (public._is_decision_facilitator(decision_id))
  with check (public._is_decision_facilitator(decision_id));

create policy "participants read own session" on "public"."sessions"
  for select
  to PUBLIC
  using (public._is_session_participant(id));

create policy "Project members can insert sub_projects" on "public"."sub_projects"
  for insert
  to PUBLIC
  with check (((EXISTS ( SELECT 1
   FROM public.project_members
  WHERE ((project_members.project_id = sub_projects.project_id) AND (project_members.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = sub_projects.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Project members can update sub_projects" on "public"."sub_projects"
  for update
  to PUBLIC
  using (((exists ( select 1
   from public.project_members
  where ((project_members.project_id = sub_projects.project_id) AND (project_members.user_id = auth.uid())))) or (exists ( select 1
   from public.projects
  where ((projects.id = sub_projects.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Project members can view sub_projects" on "public"."sub_projects"
  for select
  to PUBLIC
  using (((exists ( select 1
   from public.project_members
  where ((project_members.project_id = sub_projects.project_id) AND (project_members.user_id = auth.uid())))) or (exists ( select 1
   from public.projects
  where ((projects.id = sub_projects.project_id) AND (projects.created_by = auth.uid()))))));

create policy "Users can read own profile" on "public"."user_profiles"
  for select
  to PUBLIC
  using ((auth.uid() = user_id));

create policy "Users can update own profile" on "public"."user_profiles"
  for update
  to PUBLIC
  using ((auth.uid() = user_id));

create policy "super_admin full access to user_roles" on "public"."user_roles"
  for all
  to PUBLIC
  using ((exists ( select 1
   from public.user_roles ur
  where ((ur.user_id = auth.uid()) AND (ur.role = 'super_admin'::text)))));

alter publication "supabase_realtime" add table "public"."participants";

grant execute on function "public"."_is_decision_facilitator"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."_is_decision_participant"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."_is_session_facilitator"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."_is_session_participant"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."generate_join_code"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."get_decision_results"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."get_session_progress"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."join_session"(text, text) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."resolve_join_code"(text) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."reveal_session"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."set_updated_at"() to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."start_session"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."submit_scores"(uuid) to public, "anon", "authenticated", "postgres", "service_role";

grant execute on function "public"."touch_participant_on_score"() to public, "anon", "authenticated", "postgres", "service_role";

grant select, update, usage on sequence "public"."grievability_submissions_seq_seq" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."ad_hoc_reports" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."companies" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."company_members" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."criteria" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."decisions" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."document_comments" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."document_conflicts" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."documents" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update
  on table "public"."grievability_sequence_emails"
  to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."grievability_submissions" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."options" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."participants" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."project_admins" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."project_members" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."projects" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."scores" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."sessions" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."sub_projects" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."user_profiles" to "anon", "authenticated", "postgres", "service_role";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."user_roles" to "anon", "authenticated", "postgres", "service_role";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "anon";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "authenticated";

alter default privileges for role "postgres" in schema "public" grant select, update, usage on sequences to "service_role";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "anon";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "authenticated";

alter default privileges for role "postgres" in schema "public" grant execute on FUNCTIONS to "service_role";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "anon";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "authenticated";

alter default privileges for role "postgres" in schema "public" grant delete, insert, maintain, references, select, trigger, truncate, update on tables to "service_role";

