-- Deuxième passe d'ETL depuis src/tmp/*.md : les domaines/missions importés
-- en 0028+seed 13 n'étaient qu'une recopie littérale des epics sources, sans
-- regroupement éditorial ni narratif. On repart de zéro sur ces tables (les
-- pôles restent inchangés, ils sont validés). Les affectations de
-- responsables et les réponses aux missions perdent leur sens avec les
-- anciens IDs et doivent être refaites depuis Paramètres après le seed.
truncate table
  _20260725_domaine_responsables,
  _20260725_mission_acceptances,
  _20260725_checklist_items,
  _20260725_checklists,
  _20260725_missions,
  _20260725_domaines
cascade;
