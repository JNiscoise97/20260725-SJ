-- partner_referent_id ne servait à rien en pratique — supprimé.
-- Le besoin réel : quand plusieurs personnes sont référentes d'une même
-- catégorie, distinguer qui est référent principal et qui est secondaire.
-- On déplace donc l'assignation référent(s) du côté de la catégorie (au lieu
-- du tableau referent_category_ids côté personne, qui ne portait aucune
-- notion de rang) : chaque catégorie a au plus un référent principal et un
-- référent secondaire.
alter table _20260725_people
  drop column partner_referent_id,
  drop column referent_category_ids;

alter table _20260725_role_categories
  add column primary_referent_id uuid references _20260725_people(id) on delete set null,
  add column secondary_referent_id uuid references _20260725_people(id) on delete set null;
