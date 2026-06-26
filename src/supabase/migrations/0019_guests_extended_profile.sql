create type guest_side as enum ('sarah', 'jordan');

alter table _20260725_guests
  drop column full_name,
  add column first_name text not null,
  add column last_name text not null,
  add column side guest_side,
  add column age_range text,
  add column relation_category text,
  add column city text,
  add column meal_message_sent boolean not null default false,
  add column rsvp_responded_at date,
  add column rsvp_channel text,
  add column needs_accommodation boolean not null default false,
  add column guide_sent boolean not null default false,
  add column address_change_sent boolean not null default false,
  add column reservation_done boolean not null default false,
  add column allergies text,
  add column drinks_alcohol boolean,
  add column cultural_origin text,
  add column primary_language text,
  add column has_ceremonial_role boolean not null default false,
  add column likely_traditional_attire boolean not null default false,
  add column notes text;
