create table
  public.transcriptions (
    id bigint generated by default as identity not null,
    inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    request_id uuid null,
    url text null,
    data json null,
    constraint table_name_pkey primary key (id)
  ) tablespace pg_default;
