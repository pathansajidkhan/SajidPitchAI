import * as Localization from "expo-localization"
import i18n from "i18n-js"

const en = require("./en")
const fr = require("./fr")

i18n.fallbacks = true
i18n.translations = { en, fr }

const fallback = { languageTag: "en", isRTL: false }

i18n.locale = Localization.locale || fallback
