-- Lien symétrique entre deux invités "inséparables" (ex. couple non marié,
-- duo qui doit rester ensemble) — matérialisé dans la liste des invités et
-- destiné à terme à contraindre le plan de table. Toujours mis à jour des
-- deux côtés ensemble côté application (jamais un seul des deux pointeurs).
alter table _20260725_guests
  add column paired_with_id uuid references _20260725_guests(id) on delete set null;
