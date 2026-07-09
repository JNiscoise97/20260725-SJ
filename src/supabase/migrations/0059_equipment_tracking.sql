-- Champs de suivi opérationnel par catégorie de statut (voir page /materiel, onglet Suivi).
alter table _20260725_equipment
  add column if not exists demande_au_lieu_faite boolean,
  add column if not exists location_reserve boolean,
  add column if not exists location_fournisseur text,
  add column if not exists location_entree_at text,
  add column if not exists location_entree_lieu text,
  add column if not exists location_sortie_at text,
  add column if not exists location_sortie_lieu text,
  add column if not exists location_caution text,
  add column if not exists location_livraison boolean,
  add column if not exists achat_receptionne boolean,
  add column if not exists fabrication_statut text
    check (fabrication_statut is null or fabrication_statut in ('non_commence', 'en_cours', 'termine'));
