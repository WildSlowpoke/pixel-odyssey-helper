import { ActionDispatch, createContext, useContext, useReducer } from "react";
import { TalentName } from "@/data/talents.mjs";
import { MonsterHunterTalentName } from "@/data/monster-hunter.mjs";

interface BuildContextProviderProps {
  children: React.ReactNode;
}
interface BuilderState {
  profile: {
    pvpKills: number;
    wisdom: number;
    coliseumTrophies: number;
  };
  talentsLevels: Record<TalentName, number>;
  monsterHunterTalentsLevels: Record<MonsterHunterTalentName, number>;
}

const defaultValue: BuilderState = {
  profile: {
    coliseumTrophies: 0,
    pvpKills: 0,
    wisdom: 0,
  },
  talentsLevels: {
    strength: 0,
    defense: 0,
    agility: 0,
    hp: 0,
    luck: 0,
    mana: 0,
    strength_mastery: 0,
    defense_expertise: 0,
    first_strike: 0,
    hp_expertise: 0,
    number_of_dice: 0,
    mana_expertise: 0,
    critical_chance: 0,
    berserk: 0,
    meditation_reward: 0,
    willpower: 0,
    bleed_damage: 0,
    mana_regen: 0,
    critical_damage: 0,
    angels_dare: 0,
    fire_proficiency: 0,
    fire_resistance: 0,
    water_proficiency: 0,
    water_resistance: 0,
    air_proficiency: 0,
    air_resistance: 0,
    earth_proficiency: 0,
    earth_resistance: 0,
    damage_per_kill: 0,
    pride: 0,
  },
  monsterHunterTalentsLevels: {
    necklace: 0,
    heart: 0,
    instinct: 0,
    reflexes: 0,
    wrath: 0,
  },
};
const BuildContext = createContext<{
  state: BuilderState;
  dispatch: ActionDispatch<[action: Actions]>;
}>({ state: defaultValue, dispatch: () => {} });

type Actions =
  | {
      type: "set_profile";
      property: keyof BuilderState["profile"];
      value: number;
    }
  | {
      type: "set_talent";
      property: keyof BuilderState["talentsLevels"];
      value: number;
    }
  | {
      type: "set_monster_hunter";
      property: keyof BuilderState["monsterHunterTalentsLevels"];
      value: number;
    };

function reducer(state: BuilderState, action: Actions) {
  switch (action.type) {
    case "set_profile": {
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.property]: action.value,
        },
      };
    }
    case "set_talent": {
      return {
        ...state,
        talentsLevels: {
          ...state.talentsLevels,
          [action.property]: action.value,
        },
      };
    }
    case "set_monster_hunter": {
      return {
        ...state,
        monsterHunterTalentsLevels: {
          ...state.monsterHunterTalentsLevels,
          [action.property]: action.value,
        },
      };
    }
  }
}

export function BuildProvider({ children }: BuildContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, defaultValue);
  return (
    <BuildContext.Provider value={{ state, dispatch }}>
      {children}
    </BuildContext.Provider>
  );
}

export const useBuilder = () => {
  const context = useContext(BuildContext);

  if (context === undefined)
    throw new Error("useBuilder must be used within a BuildContext");

  return context;
};
