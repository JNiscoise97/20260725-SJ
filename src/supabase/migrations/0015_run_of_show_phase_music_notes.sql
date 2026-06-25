-- Le déroulé minute par minute fourni comporte une phase (LOGISTIQUE,
-- CÉRÉMONIE, SEMI-FORMEL, FESTIF), une indication musicale et des notes pour
-- les organisateurs en plus de l'heure/durée/lieu déjà modélisés. Texte libre
-- (pas un enum) car ces phases sont propres à ce déroulé, pas un concept
-- produit stable comme planning_milestone ou checklist_phase.
alter table _20260725_run_of_show_steps
  add column phase text,
  add column music text,
  add column notes text;
