import { Card } from "../types/cards";

export const CARDS: Card[] = [
  // White Guard Cards
  {
    id: "junker",
    name: "Юнкер",
    faction: "white_guard",
    type: "unit",
    unitType: "assault",
    cost: 3,
    attack: 3,
    construction: 3,
    defense: 2,
    health: 3,
    emoji: "🟩"
  },
  {
    id: "maxim_gunner_white",
    name: "Пулеметчик «Максим»",
    faction: "white_guard",
    type: "unit",
    unitType: "support",
    cost: 3,
    attack: 2,
    construction: 3,
    defense: 3,
    health: 4,
    emoji: "🟩"
  },
  {
    id: "cossack",
    name: "Козак",
    faction: "white_guard",
    type: "unit",
    unitType: "assault",
    cost: 5,
    attack: 5,
    construction: 5,
    defense: 4,
    health: 4,
    emoji: "🟦"
  },
  {
    id: "ilya_muromets",
    name: "«Илья Муромец»",
    faction: "white_guard",
    type: "unit",
    unitType: "flying",
    cost: 7,
    attack: 0,
    construction: 8,
    defense: 0,
    health: 1,
    emoji: "🟪"
  },
  {
    id: "sailor",
    name: "Матрос",
    faction: "white_guard",
    type: "unit",
    unitType: "support",
    cost: 2,
    attack: 2,
    construction: 2,
    defense: 2,
    health: 3,
    emoji: "🟩"
  },
  {
    id: "doctor_pavlov",
    name: "Доктор Павлов",
    faction: "white_guard",
    type: "bonus",
    unitType: "medic",
    cost: 3,
    description: "Восстановить здоровье карте на поле",
    emoji: "🟣"
  },
  {
    id: "admiral_kolchak",
    name: "Адмирал Колчак",
    faction: "white_guard",
    type: "bonus",
    unitType: "instructor",
    cost: 5,
    description: "⚔️+4 для карты на поле",
    emoji: "🟠"
  },
  {
    id: "siege_gun_white",
    name: "Стенобитное орудие",
    faction: "white_guard",
    type: "bonus",
    unitType: "engineer",
    cost: 3,
    description: "🔨+3 для карты на поле",
    emoji: "🔵"
  },
  {
    id: "imperial_guard_officer",
    name: "Офицер императорской гвардии",
    faction: "white_guard",
    type: "unit",
    unitType: "assault",
    cost: 5,
    attack: 4,
    construction: 4,
    defense: 2,
    health: 4,
    emoji: "🟩"
  },
  {
    id: "womens_battalion",
    name: "Ударница женского батальона",
    faction: "white_guard",
    type: "unit",
    unitType: "support",
    cost: 4,
    attack: 2,
    construction: 3,
    defense: 4,
    health: 5,
    emoji: "🟩"
  },
  {
    id: "czechoslovak_legionnaire",
    name: "Чехословацкий легионер",
    faction: "white_guard",
    type: "unit",
    unitType: "assault",
    cost: 4,
    attack: 3,
    construction: 5,
    defense: 3,
    health: 4,
    emoji: "🟦"
  },
  {
    id: "admiral_kornilov",
    name: "Адмирал Корнилов",
    faction: "white_guard",
    type: "unit",
    unitType: "spy",
    cost: 6,
    attack: 0,
    construction: 5,
    defense: 0,
    health: 4,
    emoji: "🟧"
  },

  // Bolshevik Cards
  {
    id: "red_army_soldier",
    name: "Красноармеец",
    faction: "bolshevik",
    type: "unit",
    unitType: "assault",
    cost: 3,
    attack: 3,
    construction: 3,
    defense: 2,
    health: 3,
    emoji: "🟩"
  },
  {
    id: "maxim_gunner_red",
    name: "Пулеметчик «Максим»",
    faction: "bolshevik",
    type: "unit",
    unitType: "support",
    cost: 3,
    attack: 2,
    construction: 3,
    defense: 3,
    health: 4,
    emoji: "🟩"
  },
  {
    id: "cheka_officer",
    name: "Офицер ВЧК",
    faction: "bolshevik",
    type: "unit",
    unitType: "assault",
    cost: 4,
    attack: 4,
    construction: 5,
    defense: 2,
    health: 3,
    emoji: "🟦"
  },
  {
    id: "proletarian",
    name: "«Пролетарий»",
    faction: "bolshevik",
    type: "unit",
    unitType: "flying",
    cost: 7,
    attack: 5,
    construction: 5,
    defense: 0,
    health: 1,
    emoji: "🟪"
  },
  {
    id: "worker",
    name: "Рабочий",
    faction: "bolshevik",
    type: "unit",
    unitType: "support",
    cost: 2,
    attack: 2,
    construction: 2,
    defense: 2,
    health: 3,
    emoji: "🟩"
  },
  {
    id: "doctor_masha",
    name: "Доктор Маша",
    faction: "bolshevik",
    type: "bonus",
    unitType: "medic",
    cost: 3,
    description: "Восстановить здоровье карте на поле",
    emoji: "🟠"
  },
  {
    id: "felix_dzerzhinsky",
    name: "Феликс Дзержинский",
    faction: "bolshevik",
    type: "bonus",
    unitType: "instructor",
    cost: 5,
    description: "⚔️+4 для карты на поле",
    emoji: "🟣"
  },
  {
    id: "siege_gun_red",
    name: "Стенобитное орудие",
    faction: "bolshevik",
    type: "bonus",
    unitType: "engineer",
    cost: 3,
    description: "🔨+3 для карты на поле",
    emoji: "🔵"
  },
  {
    id: "nkvd_border_guard",
    name: "Пограничник НКВД",
    faction: "bolshevik",
    type: "unit",
    unitType: "support",
    cost: 3,
    attack: 2,
    construction: 2,
    defense: 4,
    health: 4,
    emoji: "🟩"
  },
  {
    id: "red_partisan",
    name: "Красный партизан",
    faction: "bolshevik",
    type: "unit",
    unitType: "spy",
    cost: 2,
    attack: 0,
    construction: 3,
    defense: 0,
    health: 1,
    emoji: "🟦"
  },
  {
    id: "aurora_artillery",
    name: "Артиллерия Авроры",
    faction: "bolshevik",
    type: "unit",
    unitType: "flying",
    cost: 5,
    attack: 7,
    construction: 3,
    defense: 0,
    health: 1,
    emoji: "🟪"
  },

  // Shared Cards
  {
    id: "gas_mask",
    name: "Противогаз",
    faction: "both",
    type: "bonus",
    cost: 4,
    description: "🛡️ Повышает +3",
    emoji: "🟢"
  },
  {
    id: "nurse",
    name: "Медсестра",
    faction: "both",
    type: "bonus",
    unitType: "medic",
    cost: 2,
    description: "❤️+2 здоровья карте на поле",
    emoji: "🔵"
  },
  {
    id: "petersburg_policeman",
    name: "Петербургский полицейский",
    faction: "both",
    type: "unit",
    unitType: "support",
    cost: 1,
    attack: 1,
    construction: 2,
    defense: 4,
    health: 4,
    emoji: "🟪"
  }
];

export function getCardsByFaction(faction: "white_guard" | "bolshevik"): Card[] {
  return CARDS.filter(card => card.faction === faction || card.faction === "both");
}

export function getCardById(id: string): Card | undefined {
  return CARDS.find(card => card.id === id);
}
