-- Le défaut de `is_present` était `false` (oubli initial) : chaque invité
-- ajouté à un groupe partait "absent" et il fallait cocher manuellement les
-- présents. On veut l'inverse : tout le monde part présent, on décoche les
-- absents le jour J.
alter table public._20260725_photo_group_members
  alter column is_present set default true;

-- Rattrapage des lignes déjà créées sous l'ancien défaut : uniquement celles
-- dont le groupe n'a pas encore été photographié (status <> 'done'), pour ne
-- jamais écraser une présence/absence déjà constatée en vrai le jour J.
update public._20260725_photo_group_members m
set is_present = true
from public._20260725_photo_groups g
where g.id = m.photo_group_id
  and g.status <> 'done'
  and m.is_present = false;
