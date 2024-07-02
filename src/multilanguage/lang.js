export function getLang() {
  // Check lang save in local storage
  let lang = localStorage.getItem("lang");

  // If no language select --> fr
  if (!lang) {
    localStorage.setItem("lang", "Français");
    lang = "Français";
  }
}

export function getLangsNames() {
  return languages.map((lang) => lang.name).sort();
}

export function setLang(lg) {
  localStorage.setItem("lang", lg);
  document.location.reload(true);
}

export function getTranslate() {
  const langSave = localStorage.getItem("lang");
  const lang = langSave ? langSave : "English";
  return languages.find((lg) => lg.name === lang);
}

// ____________________________________________

const languages = [
  {
    name: "Français",

    SECTION_1: "CLIENT_FORMS",
    tt_client_form: "Client",
    lb_client_name: "Nom du client",
    btn_delete: "Supprimer",

    SECTION_2: "HOURLY_FORMS",
    btn_note: "Note",
    btn_hourly: "Horaires",
    btn_done: "Valider",
    btn_cancel: "Annuler",

    SECTION_3: "OPTIONS",
    tt_display_mode: "Affichage",

    SECTION_4: "RECAP_BOARD",
    lb_hour: "Heures",
    lb_total_hours: "Total : ",
    lb_day_avg: "Moyenne/Jour : ",
    lb_day_max: "Max",
    lb_day_min: "Min",
    lb_income: "Revenus",
    lb_ca: "Chiffre d'affaires : ",
    lb_th_dot: "Taux horaire : ",
    lb_th_nodot: "Taux horaire",
    lb_chrg_dot: "Charges : ",
    lb_chrg_nodot: "Charges",
    lb_bnf: "Bénéfices : ",

    SECTION_5: "INVOICE_PANEL",
    btn_billed: "Facturé",
    btn_paid: "Payé",

    SECTION_6: "INFO_MESSAGE_BOX",
    tt_imb_warning: "Attention",
    txt_imb_del_lines_from_month_p1: "Tous les horaires du mois de",
    txt_imb_del_lines_from_month_p2: "seront supprimés, continuer ?",
    txt_imb_del_lines_from_clientCard:
      "Tous les horaires en lien avec ce client seront supprimés, continuer ?",
    txt_imb_del_client_and_lines_from_clientForm:
      "Ce client ainsi que tous les horaires en lien avec celui-ci seront supprimés, continuer ?",
    btn_img_continu: "Continuer",
    btn_img_cancel: "Annuler",

    SECTEUR_7: "SETTINGS",
    tt_settings_page: "Réglages",
    h3_titleContactForm: "Formulaire de contact",
    labelEmail: "Votre adresse e-mail",
    objectEmail: "Objet du courriel",
    objects: {
      bug: "Signaler un problème",
      feedback: "Retour d'expérience",
      other: "Autre raison",
    },
    labelMailArea: "Saisissez votre message ici",
    sendMail: "Envoyer",
    mailDone: "E-mail envoyé avec succès",
    mailError: "Erreur, l'e-mail n'a pas pu être envoyé",
    offlineError: "Vous êtes hors ligne",
  },

  {
    name: "English",

    SECTION_1: "CLIENT_FORMS",
    tt_client_form: "Client",
    lb_client_name: "Client Name",
    btn_delete: "Delete",

    SECTION_2: "HOURLY_FORMS",
    btn_note: "Note",
    btn_hourly: "Hours",
    btn_done: "Validate",
    btn_cancel: "Cancel",

    SECTION_3: "OPTIONS",
    tt_display_mode: "Display",

    SECTION_4: "RECAP_BOARD",
    lb_hour: "Hours",
    lb_total_hours: "Total : ",
    lb_day_avg: "Average/Day : ",
    lb_day_max: "Max",
    lb_day_min: "Min",
    lb_income: "Income",
    lb_ca: "Revenue : ",
    lb_th_dot: "Hourly Rate : ",
    lb_th_nodot: "Hourly Rate",
    lb_chrg_dot: "Expenses : ",
    lb_chrg_nodot: "Expenses",
    lb_bnf: "Profits : ",

    SECTION_5: "INVOICE_PANEL",
    btn_billed: "Billed",
    btn_paid: "Paid",

    SECTION_6: "INFO_MESSAGE_BOX",
    tt_imb_warning: "Warning",
    txt_imb_del_lines_from_month_p1: "All hours for the month of",
    txt_imb_del_lines_from_month_p2: "will be deleted, continue?",
    txt_imb_del_lines_from_clientCard:
      "All hours related to this client will be deleted, continue?",
    txt_imb_del_client_and_lines_from_clientForm:
      "This client and all related hours will be deleted, continue?",
    btn_img_continu: "Continue",
    btn_img_cancel: "Cancel",

    SECTEUR_7: "SETTINGS",
    tt_settings_page: "Settings",
    h3_titleContactForm: "Contact form",
    labelEmail: "Your e-mail adress",
    objectEmail: "Mail object",
    objects: {
      bug: "Report an issue",
      feedback: "Provide feedback",
      other: "Another reason",
    },
    labelMailArea: "Enter your message here",
    sendMail: "Send",
    mailDone: "Email sent successfully",
    mailError: "Error, e-mail not sent",
    offlineError: "You are offline",
  },
];
