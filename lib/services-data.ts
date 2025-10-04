import type { Language } from "./i18n"

export interface ServiceDuration {
  duration: string
  durationMinutes: number
  price: string
  priceValue: number
}

export interface Service {
  id: string
  title: Record<Language, string>
  description: Record<Language, string>
  benefits: Record<Language, string[]>
  durations: Record<Language, ServiceDuration[]>
  videoQuery: string
  color: string
}

export const services: Service[] = [
  {
    id: "classic",
    title: {
      ru: "Классический массаж",
      uk: "Класичний масаж",
      en: "Classic Massage",
      de: "Klassische Massage",
    },
    description: {
      ru: "Традиционная техника массажа, направленная на общее оздоровление организма, улучшение кровообращения и снятие мышечного напряжения.",
      uk: "Традиційна техніка масажу, спрямована на загальне оздоровлення організму, покращення кровообігу та зняття м'язової напруги.",
      en: "Traditional massage technique aimed at overall body wellness, improving blood circulation and relieving muscle tension.",
      de: "Traditionelle Massagetechnik zur allgemeinen Körpergesundheit, Verbesserung der Durchblutung und Linderung von Muskelverspannungen.",
    },
    benefits: {
      ru: [
        "Улучшает кровообращение",
        "Снимает мышечное напряжение",
        "Повышает тонус организма",
        "Укрепляет иммунитет",
        "Улучшает сон",
      ],
      uk: [
        "Покращує кровообіг",
        "Знімає м'язову напругу",
        "Підвищує тонус організму",
        "Зміцнює імунітет",
        "Покращує сон",
      ],
      en: [
        "Improves blood circulation",
        "Relieves muscle tension",
        "Increases body tone",
        "Strengthens immunity",
        "Improves sleep",
      ],
      de: [
        "Verbessert die Durchblutung",
        "Lindert Muskelverspannungen",
        "Erhöht den Körpertonus",
        "Stärkt die Immunität",
        "Verbessert den Schlaf",
      ],
    },
    durations: {
      ru: [
        { duration: "60 минут", durationMinutes: 60, price: "1150 ₴", priceValue: 1150 },
        { duration: "90 минут", durationMinutes: 90, price: "1650 ₴", priceValue: 1650 },
        { duration: "120 минут", durationMinutes: 120, price: "2200 ₴", priceValue: 2200 },
      ],
      uk: [
        { duration: "60 хвилин", durationMinutes: 60, price: "1150 ₴", priceValue: 1150 },
        { duration: "90 хвилин", durationMinutes: 90, price: "1650 ₴", priceValue: 1650 },
        { duration: "120 хвилин", durationMinutes: 120, price: "2200 ₴", priceValue: 2200 },
      ],
      en: [
        { duration: "60 minutes", durationMinutes: 60, price: "€65", priceValue: 65 },
        { duration: "90 minutes", durationMinutes: 90, price: "€90", priceValue: 90 },
        { duration: "120 minutes", durationMinutes: 120, price: "€125", priceValue: 125 },
      ],
      de: [
        { duration: "60 Minuten", durationMinutes: 60, price: "65 €", priceValue: 65 },
        { duration: "90 Minuten", durationMinutes: 90, price: "90 €", priceValue: 90 },
        { duration: "120 Minuten", durationMinutes: 120, price: "125 €", priceValue: 125 },
      ],
    },
    videoQuery: "relaxing classical massage therapy session",
    color: "from-primary/20 to-primary/5",
  },
  {
    id: "lymphatic",
    title: {
      ru: "Лимфодренажный массаж",
      uk: "Лімфодренажний масаж",
      en: "Lymphatic Drainage Massage",
      de: "Lymphdrainage-Massage",
    },
    description: {
      ru: "Специальная техника, стимулирующая лимфатическую систему, выводящая лишнюю жидкость и токсины из организма.",
      uk: "Спеціальна техніка, що стимулює лімфатичну систему, виводить зайву рідину та токсини з організму.",
      en: "Special technique that stimulates the lymphatic system, removing excess fluid and toxins from the body.",
      de: "Spezielle Technik, die das Lymphsystem stimuliert und überschüssige Flüssigkeit und Toxine aus dem Körper entfernt.",
    },
    benefits: {
      ru: [
        "Выводит лишнюю жидкость",
        "Уменьшает отеки",
        "Улучшает обмен веществ",
        "Повышает иммунитет",
        "Улучшает цвет кожи",
      ],
      uk: [
        "Виводить зайву рідину",
        "Зменшує набряки",
        "Покращує обмін речовин",
        "Підвищує імунітет",
        "Покращує колір шкіри",
      ],
      en: ["Removes excess fluid", "Reduces swelling", "Improves metabolism", "Boosts immunity", "Improves skin color"],
      de: [
        "Entfernt überschüssige Flüssigkeit",
        "Reduziert Schwellungen",
        "Verbessert den Stoffwechsel",
        "Stärkt die Immunität",
        "Verbessert die Hautfarbe",
      ],
    },
    durations: {
      ru: [
        { duration: "60 минут", durationMinutes: 60, price: "1150 ₴", priceValue: 1150 },
        { duration: "90 минут", durationMinutes: 90, price: "1650 ₴", priceValue: 1650 },
      ],
      uk: [
        { duration: "60 хвилин", durationMinutes: 60, price: "1150 ₴", priceValue: 1150 },
        { duration: "90 хвилин", durationMinutes: 90, price: "1650 ₴", priceValue: 1650 },
      ],
      en: [
        { duration: "60 minutes", durationMinutes: 60, price: "€60", priceValue: 60 },
        { duration: "90 minutes", durationMinutes: 90, price: "€85", priceValue: 85 },
      ],
      de: [
        { duration: "60 Minuten", durationMinutes: 60, price: "60 €", priceValue: 60 },
        { duration: "90 Minuten", durationMinutes: 90, price: "85 €", priceValue: 85 },
      ],
    },
    videoQuery: "lymphatic drainage massage technique",
    color: "from-accent/20 to-accent/5",
  },
  {
    id: "sports",
    title: {
      ru: "Спортивный массаж",
      uk: "Спортивний масаж",
      en: "Sports Massage",
      de: "Sportmassage",
    },
    description: {
      ru: "Интенсивная техника для спортсменов и активных людей, помогающая восстановить мышцы после физических нагрузок.",
      uk: "Інтенсивна техніка для спортсменів та активних людей, що допомагає відновити м'язи після фізичних навантажень.",
      en: "Intensive technique for athletes and active people, helping to restore muscles after physical activity.",
      de: "Intensive Technik für Sportler und aktive Menschen, die hilft, Muskeln nach körperlicher Aktivität wiederherzustellen.",
    },
    benefits: {
      ru: [
        "Восстанавливает мышцы",
        "Снимает крепатуру",
        "Повышает выносливость",
        "Предотвращает травмы",
        "Улучшает гибкость",
      ],
      uk: ["Відновлює м'язи", "Знімає крепатуру", "Підвищує витривалість", "Запобігає травмам", "Покращує гнучкість"],
      en: ["Restores muscles", "Relieves soreness", "Increases endurance", "Prevents injuries", "Improves flexibility"],
      de: [
        "Stellt Muskeln wieder her",
        "Lindert Muskelkater",
        "Erhöht die Ausdauer",
        "Verhindert Verletzungen",
        "Verbessert die Flexibilität",
      ],
    },
    durations: {
      ru: [
        { duration: "60 минут", durationMinutes: 60, price: "1500 ₴", priceValue: 1500 },
        { duration: "90 минут", durationMinutes: 90, price: "1750 ₴", priceValue: 1750 },
      ],
      uk: [
        { duration: "60 хвилин", durationMinutes: 60, price: "1500 ₴", priceValue: 1500 },
        { duration: "90 хвилин", durationMinutes: 90, price: "1750 ₴", priceValue: 1750 },
      ],
      en: [
        { duration: "60 minutes", durationMinutes: 60, price: "€65", priceValue: 65 },
        { duration: "90 minutes", durationMinutes: 90, price: "€95", priceValue: 95 },
      ],
      de: [
        { duration: "60 Minuten", durationMinutes: 60, price: "65 €", priceValue: 65 },
        { duration: "90 Minuten", durationMinutes: 90, price: "95 €", priceValue: 95 },
      ],
    },
    videoQuery: "sports massage therapy for athletes",
    color: "from-chart-3/20 to-chart-3/5",
  },
  {
    id: "facial",
    title: {
      ru: "Массаж лица",
      uk: "Масаж обличчя",
      en: "Facial Massage",
      de: "Gesichtsmassage",
    },
    description: {
      ru: "Деликатная техника для омоложения кожи лица, улучшения тонуса и разглаживания морщин.",
      uk: "Делікатна техніка для омолодження шкіри обличчя, покращення тонусу та розгладжування зморшок.",
      en: "Delicate technique for facial skin rejuvenation, improving tone and smoothing wrinkles.",
      de: "Zarte Technik zur Verjüngung der Gesichtshaut, Verbesserung des Tons und Glättung von Falten.",
    },
    benefits: {
      ru: [
        "Разглаживает морщины",
        "Улучшает тонус кожи",
        "Подтягивает овал лица",
        "Улучшает цвет лица",
        "Снимает отеки",
      ],
      uk: [
        "Розгладжує зморшки",
        "Покращує тонус шкіри",
        "Підтягує овал обличчя",
        "Покращує колір обличчя",
        "Знімає набряки",
      ],
      en: [
        "Smooths wrinkles",
        "Improves skin tone",
        "Lifts facial contours",
        "Improves complexion",
        "Reduces puffiness",
      ],
      de: [
        "Glättet Falten",
        "Verbessert den Hautton",
        "Strafft die Gesichtskonturen",
        "Verbessert den Teint",
        "Reduziert Schwellungen",
      ],
    },
    durations: {
      ru: [
        { duration: "45 минут", durationMinutes: 45, price: "550 ₴", priceValue: 550 },
        { duration: "60 минут", durationMinutes: 60, price: "750 ₴", priceValue: 750 },
      ],
      uk: [
        { duration: "45 хвилин", durationMinutes: 45, price: "550 ₴", priceValue: 550 },
        { duration: "60 хвилин", durationMinutes: 60, price: "750 ₴", priceValue: 750 },
      ],
      en: [
        { duration: "45 minutes", durationMinutes: 45, price: "€50", priceValue: 50 },
        { duration: "60 minutes", durationMinutes: 60, price: "€65", priceValue: 65 },
      ],
      de: [
        { duration: "45 Minuten", durationMinutes: 45, price: "50 €", priceValue: 50 },
        { duration: "60 Minuten", durationMinutes: 60, price: "65 €", priceValue: 65 },
      ],
    },
    videoQuery: "facial massage anti-aging technique",
    color: "from-chart-2/20 to-chart-2/5",
  },
]

export function getServices(lang: Language) {
  return services.map((service) => ({
    id: service.id,
    title: service.title[lang],
    description: service.description[lang],
    benefits: service.benefits[lang],
    durations: service.durations[lang],
    videoQuery: service.videoQuery,
    color: service.color,
  }))
}
