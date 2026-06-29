-- Liste blanche des invités pouvant être proposés comme responsable de domaine
-- (référent) dans le select de ParametresTree — éviter de proposer les ~100
-- invités du mariage, seulement ceux que Sarah/Jordan ont identifiés comme
-- volontaires/fiables. Devenir responsable d'un domaine (domaine_responsables)
-- reste ce qui fait réellement de quelqu'un un "référent" ; ce flag ne fait
-- que filtrer les candidats proposés.
alter table _20260725_guests
  add column assignable boolean not null default false;
