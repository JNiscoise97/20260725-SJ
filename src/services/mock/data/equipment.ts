import type { EquipmentItem } from "@/types/domain"

function item(id: string, category: string, label: string, sortOrder: number, notes?: string): EquipmentItem {
  return { id, category, label, sortOrder, notes: notes ?? null, status: null, guestName: null }
}

export const equipmentSeed: EquipmentItem[] = [
  // 1. Mobilier de réception
  item("eq-mob-01", "Mobilier de réception", "Tables rondes ou rectangulaires", 0),
  item("eq-mob-02", "Mobilier de réception", "Table d'honneur", 1),
  item("eq-mob-03", "Mobilier de réception", "Chaises invités", 2),
  item("eq-mob-04", "Mobilier de réception", "Chaises des mariés", 3),
  item("eq-mob-05", "Mobilier de réception", "Tables buffet", 4),
  item("eq-mob-06", "Mobilier de réception", "Tables techniques DJ", 5),
  item("eq-mob-07", "Mobilier de réception", "Tables cuisine / office traiteur", 6),
  item("eq-mob-08", "Mobilier de réception", "Mange-debout cocktail (4 à 8)", 7),

  // 2. Linge
  item("eq-lin-01", "Linge", "Nappes", 0),
  item("eq-lin-02", "Linge", "Sur-nappes", 1),
  item("eq-lin-03", "Linge", "Chemins de table", 2),
  item("eq-lin-04", "Linge", "Serviettes tissu", 3),
  item("eq-lin-05", "Linge", "Housses de chaise", 4),

  // 3. Vaisselle — Assiettes
  item("eq-vais-01", "Vaisselle", "Assiettes entrée (×100)", 0),
  item("eq-vais-02", "Vaisselle", "Assiettes plat (×100)", 1),
  item("eq-vais-03", "Vaisselle", "Assiettes dessert (×100)", 2),
  // Verrerie
  item("eq-vais-04", "Vaisselle", "Verres eau (×100)", 3),
  item("eq-vais-05", "Vaisselle", "Verres vin (×100)", 4),
  item("eq-vais-06", "Vaisselle", "Flûtes champagne (×100)", 5),
  item("eq-vais-07", "Vaisselle", "Verres cocktail", 6),
  // Couverts
  item("eq-vais-08", "Vaisselle", "Couteaux (×100)", 7),
  item("eq-vais-09", "Vaisselle", "Fourchettes (×100)", 8),
  item("eq-vais-10", "Vaisselle", "Cuillères (×100)", 9),
  item("eq-vais-11", "Vaisselle", "Cuillères dessert (×100)", 10),
  // Divers vaisselle
  item("eq-vais-12", "Vaisselle", "Plateaux", 11),
  item("eq-vais-13", "Vaisselle", "Saladiers", 12),
  item("eq-vais-14", "Vaisselle", "Corbeilles à pain", 13),

  // 4. Matériel buffet
  item("eq-buf-01", "Matériel buffet", "Réchauds", 0),
  item("eq-buf-02", "Matériel buffet", "Chafing dish", 1),
  item("eq-buf-03", "Matériel buffet", "Bacs gastronormes", 2),
  item("eq-buf-04", "Matériel buffet", "Louches", 3),
  item("eq-buf-05", "Matériel buffet", "Pinces", 4),
  item("eq-buf-06", "Matériel buffet", "Plateaux de service", 5),

  // 5. Bar
  item("eq-bar-01", "Bar", "Bar mobile", 0),
  item("eq-bar-02", "Bar", "Seaux à glace", 1),
  item("eq-bar-03", "Bar", "Vasques à champagne", 2),
  item("eq-bar-04", "Bar", "Rafraîchisseurs", 3),
  item("eq-bar-05", "Bar", "Bac à glaçons", 4),
  item("eq-bar-06", "Bar", "Shakers", 5),

  // 6. Froid
  item("eq-froid-01", "Froid", "Réfrigérateur supplémentaire", 0),
  item("eq-froid-02", "Froid", "Congélateur", 1),
  item("eq-froid-03", "Froid", "Armoire réfrigérée", 2),
  item("eq-froid-04", "Froid", "Machine à glaçons", 3),

  // 7. Sonorisation
  item("eq-son-01", "Sonorisation", "Enceintes cérémonie", 0),
  item("eq-son-02", "Sonorisation", "Enceintes cocktail", 1),
  item("eq-son-03", "Sonorisation", "Table de mixage", 2),
  item("eq-son-04", "Sonorisation", "Micros HF", 3),
  item("eq-son-05", "Sonorisation", "Pieds micro", 4),

  // 8. Éclairage
  item("eq-lum-01", "Éclairage", "Projecteurs LED", 0),
  item("eq-lum-02", "Éclairage", "Mise en lumière des murs", 1),
  item("eq-lum-03", "Éclairage", "Éclairage du buffet", 2),
  item("eq-lum-04", "Éclairage", "Éclairage de la piste", 3),
  item("eq-lum-05", "Éclairage", "Guirlandes lumineuses terrasse", 4),

  // 9. Piste de danse
  item("eq-piste-01", "Piste de danse", "Plancher de danse", 0, "Si le lieu n'en possède pas"),

  // 10. Décoration
  item("eq-deco-01", "Décoration", "Arche", 0),
  item("eq-deco-02", "Décoration", "Colonnes", 1),
  item("eq-deco-03", "Décoration", "Vases XXL", 2),
  item("eq-deco-04", "Décoration", "Chandeliers", 3),
  item("eq-deco-05", "Décoration", "Lanternes", 4),
  item("eq-deco-06", "Décoration", "Bougeoirs", 5),
  item("eq-deco-07", "Décoration", "Socles décoratifs", 6),
  item("eq-deco-08", "Décoration", "Backdrop", 7),
  item("eq-deco-09", "Décoration", "Cadres", 8),
  item("eq-deco-10", "Décoration", "Miroirs", 9),
  item("eq-deco-11", "Décoration", "Pupitre", 10),

  // 11. Cérémonie
  item("eq-cere-01", "Cérémonie", "Pupitre", 0),
  item("eq-cere-02", "Cérémonie", "Micro", 1),
  item("eq-cere-03", "Cérémonie", "Support alliances", 2),
  item("eq-cere-04", "Cérémonie", "Fauteuils spéciaux familles", 3),

  // 12. Signalétique
  item("eq-sign-01", "Signalétique", "Chevalet", 0),
  item("eq-sign-02", "Signalétique", "Porte-plan de table", 1),
  item("eq-sign-03", "Signalétique", "Panneaux directionnels", 2),

  // 13. Extérieur
  item("eq-ext-01", "Extérieur", "Parasols", 0),
  item("eq-ext-02", "Extérieur", "Chauffages extérieurs", 1, "Si soirée fraîche"),
  item("eq-ext-03", "Extérieur", "Salons lounge", 2),
  item("eq-ext-04", "Extérieur", "Bancs", 3),

  // 14. Logistique
  item("eq-log-01", "Logistique", "Portants vêtements", 0),
  item("eq-log-02", "Logistique", "Vestiaire", 1),
  item("eq-log-03", "Logistique", "Cintres", 2),
  item("eq-log-04", "Logistique", "Diables", 3),
  item("eq-log-05", "Logistique", "Chariots", 4),

  // 15. Électricité
  item("eq-elec-01", "Électricité", "Rallonges", 0),
  item("eq-elec-02", "Électricité", "Multiprises", 1),
  item("eq-elec-03", "Électricité", "Enrouleurs", 2),
  item("eq-elec-04", "Électricité", "Passe-câbles", 3),

  // 16. Sécurité
  item("eq-secu-01", "Sécurité", "Extincteur", 0),
  item("eq-secu-02", "Sécurité", "Éclairage de secours", 1),
  item("eq-secu-03", "Sécurité", "Rubalise", 2, "Si nécessaire"),

  // 17. Sanitaires
  item("eq-sani-01", "Sanitaires", "Toilettes mobiles", 0, "Probablement inutile au Grand Arbre"),

  // 18. Animations
  item("eq-anim-01", "Animations", "Photobooth", 0),
  item("eq-anim-02", "Animations", "Borne photo", 1),
  item("eq-anim-03", "Animations", "Livre d'or audio", 2),
  item("eq-anim-04", "Animations", "Machine à bulles", 3),
  item("eq-anim-05", "Animations", "Machine à fumée lourde", 4),
  item("eq-anim-06", "Animations", "Étincelles froides", 5),

  // 19. Matériel traiteur
  item("eq-trait-01", "Matériel traiteur", "Tables inox", 0, "Si non fourni par le traiteur"),
  item("eq-trait-02", "Matériel traiteur", "Étuves", 1),
  item("eq-trait-03", "Matériel traiteur", "Chariots traiteur", 2),
  item("eq-trait-04", "Matériel traiteur", "Conteneurs isothermes", 3),

  // 20. Divers
  item("eq-div-01", "Divers", "Poubelles design", 0),
  item("eq-div-02", "Divers", "Cendriers", 1),
  item("eq-div-03", "Divers", "Corbeilles", 2),
  item("eq-div-04", "Divers", "Cloches alimentaires", 3),
  item("eq-div-05", "Divers", "Paravents cuisine", 4),
]
