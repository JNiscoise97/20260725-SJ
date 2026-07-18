alter table _20260725_guests
  add column if not exists allowed_tabs text[] null;
