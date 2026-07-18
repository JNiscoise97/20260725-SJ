-- Lien parent-enfant entre invités, pour la tree view famille.
-- parentId pointe vers l'un des deux membres de la paire parentale ;
-- l'autre parent se déduit via paired_with_id.
alter table _20260725_guests
  add column if not exists parent_id uuid references _20260725_guests(id) on delete set null;
