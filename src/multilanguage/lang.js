export function getLang() {
  // Check lang save in local storage
  let lang = localStorage.getItem("lang");

  // If no language select --> fr
  if (!lang) {
    localStorage.setItem("lang", "Français");
    lang = "Français";
  }

  return lang;
}

export function getLangsNames() {
  return languages.map((lang) => lang.name).sort();
}

export function setLang(lg) {
  const displayMode = localStorage.getItem("displayMode");
  localStorage.setItem("lang", lg);
  if (displayMode === "Time") {
    localStorage.setItem("displayMode", "Temps");
  } else if (displayMode === "Temps") {
    localStorage.setItem("displayMode", "Time");
  }
  setTimeout(() => {
    document.location.reload(true);
  }, 500);
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
    month_list: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],

    SECTION_3: "OPTIONS",
    tt_display_mode: "Affichage",
    lb_search_bar: "Nom du client",
    txt_time_mode: "Temps",

    SECTION_4: "RECAP_BOARD",
    lb_hour: "Heures",
    lb_total_hours: "Total : ",
    lb_day_avg: "Moyenne/Jour : ",
    lb_day_max: "Max",
    lb_day_min: "Min",
    lb_income: "Revenus",
    lb_ca: "Chf. d'affaires : ",
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

    SECTEUR_7: "LOADER_BOX",
    txt_error_add_line: "Impossible d'enregistrer ces horaires",
    txt_error_set_line: "Impossible de modifier ces horaires",
    txt_error_delete_line: "Erreur lors de la suppression des données",
    txt_error_client_color: "Erreur lors du changement de couleur",
    txt_error_client_del: "Erreur lors de la suppression du client",
    txt_error_change_lang: "Erreur lors du changement de language",
    txt_error_mail: "Erreur lors de l'envoi du mail",
    txt_error_add_record: "Impossible de démarrer l'enregistrement",
    txt_error_record: "Erreur enregistreur",
    txt_error_load_data: "Erreur lors du chargements des données",

    SECTEUR_8: "SETTINGS",
    tt_settings_page: "Paramètres",
    tt_home_page: "Retour",
    tt_contact_form: "Formulaire de contact",
    labelName: "Nom",
    labelEmail: "Votre adresse e-mail",
    objectEmail: "Objet du courriel",
    objects: {
      bug: "Signaler un problème",
      feedback: "Retour d'expérience",
      other: "Autre raison",
    },
    labelMailArea: "Saisissez votre message ici",
    sendMail: "Envoyer",
    tt_information_panel: "Informations",
    txt_update_version: "Mise à jour: ",
    tt_pts_1: "Stockage des données",
    txt_pts_1:
      "Vos données sont stockées localement dans une base de données du navigateur. Cela signifie qu'en cas de réinstallation ou de suppression des données du navigateur, toutes les informations de l'application seront perdues.",
    tt_pts_2: "Enregistrement en temps réel",
    txt_pts_2:
      "Lorsque vous utilisez l'enregistreur en temps réel, vous pouvez fermer l'application sans risque. L'enregistrement se poursuivra en arrière-plan et les données seront sauvegardées.",
    tt_pts_3: "Fonctionnalités à venir",
    txt_pts_3:
      "De nouvelles fonctionnalités sont en cours de développement, comme la possibilité de générer des fichiers PDF de vos heures de travail ou même de créer des factures.",
    tt_pts_4: "Contact & Retour d'information",
    txt_pts_4:
      "Si vous avez des suggestions d'amélioration ou rencontrez un problème, n'hésitez pas à me contacter via le formulaire disponible ici.",

    SECTEUR_9: "CHECK-FIELD",
    requireMsg: "Ce champ est requis",
    isNotEmail: "Veuillez saisir une adresse e-mail valide",

    SECTEUR_10: "BIG_PANEL",
    txt_dark_mode: "Sombre",
    txt_light_mode: "Clair",

    SECTEUR_11: "CALENDAR",
    txt_multi_select: "Sélection multiple",
    days_list: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    days_list_full: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    txt_tooltip_single: "Sélectionnez une seule date",
    txt_tooltip_multi: "Sélectionnez plusieurs dates",

    SECTEUR_12: "RECORDER",
    btn_tabs_hourly: "Horaires",
    btn_tabs_recorder: "Enregistreur",
    btn_start: "Démarrer",
    btn_break: "Pause",
    btn_restart: "Reprendre",
    btn_stop: "Stop",

    SECTEUR_13: "STATS",
    btn_statsVue: "Statistiques",

    SECTEUR_14: "WELCOME",
    tt_welcome: "Bienvenue",
    txt_welcome_1:
      "Cette application est conçue pour vous aider à gérer et comptabiliser facilement vos heures de travail, que vous soyez sur ordinateur, tablette ou smartphone.",
    txt_welcome_2: " Notez qu'il s'agit d'une version bêta.",
    txt_welcome_3:
      " Dans le menu Paramètres, vous trouverez un formulaire de contact ainsi que des informations détaillées sur l'utilisation de l'application.",
    txt_welcome_4: "Bonne utilisation !",
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
    month_list: [
      "January",
      "Febuary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "Decembrer",
    ],

    SECTION_3: "OPTIONS",
    tt_display_mode: "Display",
    lb_search_bar: "Client name",
    txt_time_mode: "Time",

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

    SECTEUR_7: "LOADER_BOX",
    txt_error_add_line: "Unable to save these schedules",
    txt_error_set_line: "Unable to modify these schedules",
    txt_error_delete_line: "Error while deleting data",
    txt_error_client_color: "Error changing the client's color",
    txt_error_client_del: "Error deleting the client",
    txt_error_change_lang: "Error changing the language",
    txt_error_mail: "Error sending email",
    txt_error_add_record: "Unable to start recording",
    txt_error_record: "Recorder error",
    txt_error_load_data: "Error loading data",

    SECTEUR_8: "SETTINGS",
    tt_settings_page: "Settings",
    tt_home_page: "Back",
    tt_contact_form: "Contact form",
    labelEmail: "Your e-mail adress",
    labelName: "Name",
    objectEmail: "Mail object",
    objects: {
      bug: "Report an issue",
      feedback: "Provide feedback",
      other: "Another reason",
    },
    labelMailArea: "Enter your message here",
    sendMail: "Send",
    tt_information_panel: "Renseignements",
    txt_update_version: "Update: ",
    tt_pts_1: "Data Storage",
    txt_pts_1:
      "Your data is stored locally in the browser's database. This means that if the browser's data is cleared or the app is reinstalled, all of the app's data will be lost.",
    tt_pts_2: "Real-Time Recording",
    txt_pts_2:
      "When using the real-time recorder, you can safely close the app. The recording will continue in the background, and your data will be saved.",
    tt_pts_3: "Upcoming Features",
    txt_pts_3:
      "New features are in development, such as the ability to generate PDF files of your working hours or even create invoices.",
    tt_pts_4: "Contact & Feedback",
    txt_pts_4:
      "If you have any suggestions for improvement or encounter any issues, please feel free to contact me through the form available here.",

    SECTEUR_9: "CHECK-FIELD",
    requireMsg: "Field is required",
    isNotEmail: "Please enter a valid e-mail address",

    SECTEUR_10: "BIG_PANEL",
    txt_dark_mode: "Dark",
    txt_light_mode: "Light",

    SECTEUR_11: "CALENDAR",
    txt_multi_select: "Multiple selection",
    days_list: ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"],
    days_list_full: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    txt_tooltip_single: "Select a single date",
    txt_tooltip_multi: "Select multiple date",

    SECTEUR_12: "RECORDER",
    btn_tabs_hourly: "Hourly",
    btn_tabs_recorder: "Recorder",
    btn_start: "Start",
    btn_break: "Break",
    btn_restart: "Restart",
    btn_stop: "Stop",

    SECTEUR_13: "STATS",
    btn_statsVue: "Statistics",

    SECTEUR_14: "WELCOME",
    tt_welcome: "Welcome",
    txt_welcome_1:
      "This app is designed to help you easily manage and track your working hours, whether you're on a computer, tablet, or smartphone.",
    txt_welcome_2: "Please note that this is a beta version.",
    txt_welcome_3:
      "In the Settings menu, you'll find a contact form as well as detailed information on how to use the app.",
    txt_welcome_4: "Enjoy using the app!",
  },
];
