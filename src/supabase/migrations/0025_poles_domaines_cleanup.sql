-- Migration de nettoyage de la refonte Pôle/Domaine/Responsable — à appliquer
-- SEULEMENT une fois que tous les domaines qui avaient un ancien référent ont
-- une ligne _20260725_domaine_responsables correspondante. Vérifier avant
-- d'appliquer :
--
--   select d.id, d.name
--   from _20260725_domaines d
--   where (d.primary_referent_id is not null or d.secondary_referent_id is not null)
--     and not exists (
--       select 1 from _20260725_domaine_responsables r where r.domaine_id = d.id
--     );
--
-- Cette requête doit renvoyer 0 ligne avant d'exécuter ce fichier.

alter table _20260725_domaines
  drop column primary_referent_id,
  drop column secondary_referent_id;

alter table _20260725_missions
  drop column referent_id,
  drop column role_category_id;

-- Ne laisse que Sarah & Jordan dans _20260725_people : les référents et
-- proches sont désormais des _20260725_guests avec un statut.
delete from _20260725_people where role in ('referent', 'proche');

-- Plus de checklist directement rattachée à un référent : elle appartient à
-- la mission (ou à l'élément de logistique). Aucune ligne réelle n'utilise
-- 'referent' aujourd'hui (voir 0021), donc rien à migrer.
alter table _20260725_checklists drop constraint _20260725_checklists_owner_type_check;
alter table _20260725_checklists add constraint _20260725_checklists_owner_type_check
  check (owner_type in ('mission', 'logistique_item'));
