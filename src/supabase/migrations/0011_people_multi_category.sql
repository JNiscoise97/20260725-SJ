-- Une personne peut être référente de plusieurs catégories (ex. Jordan sur
-- "Logistique installation" ET "Logistique rangement"). On remplace la
-- relation 1:1 (referent_category_id) par un tableau, sur le même modèle que
-- _20260725_documents.visible_to_roles dans 0007_documents_attachments_comments.sql.
alter table _20260725_people
  drop column referent_category_id,
  add column referent_category_ids uuid[] not null default '{}';

create index _20260725_people_referent_category_ids_idx
  on _20260725_people using gin (referent_category_ids);
