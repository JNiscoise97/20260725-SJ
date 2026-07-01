-- Permet de préciser, par groupe de photo, lequel des fiancés (ou les deux)
-- doit être présent — ex. une photo "Sarah et ses témoins" n'a pas besoin de
-- Jordan. Tableau vide = comportement historique (tous les fiancés requis).
alter table public._20260725_photo_groups
  add column required_fiance_ids uuid[] not null default '{}';
