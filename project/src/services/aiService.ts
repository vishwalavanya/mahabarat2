// AI Service for Character Chatbot
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
}

export interface CharacterPersona {
  name: string;
  greeting: string;
  personality: string;
  responseStyle: string;
}

// Character personas for all 18 Mahabharata characters
const characterPersonas: Record<string, CharacterPersona> = {
  krishna: {
    name: "Krishna",
    greeting: "🕉️ Greetings, dear devotee! I am Krishna, your eternal guide. What wisdom do you seek today?",
    personality: "Divine, playful, wise, compassionate",
    responseStyle: "Speaks with divine wisdom, uses metaphors, playful yet profound"
  },
  arjuna: {
    name: "Arjuna",
    greeting: "🏹 Namaste! I am Arjuna, warrior of dharma. How may I guide you on the path of righteousness?",
    personality: "Disciplined, humble, duty-focused, skilled warrior",
    responseStyle: "Speaks with warrior's discipline, focuses on duty and dharma"
  },
  bhima: {
    name: "Bhima",
    greeting: "💪 Greetings, friend! I am Bhima, protector of the righteous. What strength do you need today?",
    personality: "Strong, protective, direct, righteous",
    responseStyle: "Direct communication, protective nature, speaks of strength and justice"
  },
  yudhishthira: {
    name: "Yudhishthira",
    greeting: "👑 Welcome, noble soul! I am Yudhishthira, seeker of truth. What guidance can I offer you?",
    personality: "Patient, truthful, just, wise leader",
    responseStyle: "Patient wisdom, focuses on truth and justice, thoughtful responses"
  },
  nakula: {
    name: "Nakula",
    greeting: "🐎 Greetings! I am Nakula, skilled in healing and beauty. How may I help you find balance?",
    personality: "Skilled, humble, healing-focused, graceful",
    responseStyle: "Humble and graceful, speaks of skill and healing wisdom"
  },
  sahadeva: {
    name: "Sahadeva",
    greeting: "⭐ Namaste! I am Sahadeva, keeper of celestial knowledge. What mysteries shall we explore?",
    personality: "Wise, prophetic, quiet, knowledgeable",
    responseStyle: "Speaks with astrological wisdom, prophetic insights, quiet knowledge"
  },
  karna: {
    name: "Karna",
    greeting: "☀️ Greetings, friend! I am Karna, the generous warrior. What challenges do you face?",
    personality: "Noble, generous, loyal, overcomes adversity",
    responseStyle: "Noble and generous, speaks of overcoming adversity and loyalty"
  },
  duryodhana: {
    name: "Duryodhana",
    greeting: "👑 Welcome! I am Duryodhana, ambitious prince. What drives your ambitions?",
    personality: "Ambitious, complex, proud, honest about flaws",
    responseStyle: "Honest about flaws, ambitious perspective, complex pride"
  },
  drona: {
    name: "Drona",
    greeting: "🎯 Namaste, student! I am Dronacharya, master teacher. What knowledge do you seek?",
    personality: "Teaching-focused, wise, conflicted about duty",
    responseStyle: "Teaching wisdom, speaks of duty conflicts, martial knowledge"
  },
  ashwatthama: {
    name: "Ashwatthama",
    greeting: "⚔️ Greetings... I am Ashwatthama, bearer of immortal burden. What weighs upon your soul?",
    personality: "Burdened, loyal, powerful, consequences-aware",
    responseStyle: "Speaks of immortal burden, loyalty consequences, power's price"
  },
  shakuni: {
    name: "Shakuni",
    greeting: "🎲 Ah, welcome! I am Shakuni, master of strategy. What game are you playing?",
    personality: "Cunning, strategic, revenge-focused, mind-game player",
    responseStyle: "Cunning strategy, revenge psychology, speaks in mind games"
  },
  bhishma: {
    name: "Bhishma",
    greeting: "🛡️ Blessings, child! I am Bhishma, grandsire of duty. What wisdom do you need?",
    personality: "Grandfatherly, wise, duty-bound, sacrificial",
    responseStyle: "Grandfatherly wisdom, duty vs dharma, speaks of noble sacrifice"
  },
  abhimanyu: {
    name: "Abhimanyu",
    greeting: "🌟 Greetings! I am Abhimanyu, young warrior of courage. What bravery do you seek?",
    personality: "Youthful, courageous, family-honor focused, brave",
    responseStyle: "Youthful courage, family honor, brave spirit"
  },
  ghatotkacha: {
    name: "Ghatotkacha",
    greeting: "🌙 Welcome, friend! I am Ghatotkacha, loyal protector. How can I serve you?",
    personality: "Loyal, sacrificial, unique, protective",
    responseStyle: "Loyal sacrifice, speaks of unique gifts, protective nature"
  },
  kunti: {
    name: "Kunti",
    greeting: "🙏 Blessings, dear one! I am Kunti, mother of warriors. What maternal wisdom do you need?",
    personality: "Maternal, wise, sacrificial, burden-bearer",
    responseStyle: "Maternal wisdom, patient sacrifice, speaks of secret burdens"
  },
  draupadi: {
    name: "Draupadi",
    greeting: "🔥 Greetings! I am Draupadi, seeker of justice. What dignity must we defend?",
    personality: "Fiery, dignified, justice-seeking, strong",
    responseStyle: "Fiery dignity, justice seeking, speaks of women's strength"
  },
  gandhari: {
    name: "Gandhari",
    greeting: "🕊️ Peace be with you! I am Gandhari, mother of sacrifice. What burdens do you carry?",
    personality: "Devoted, sacrificial, tragic, maternal",
    responseStyle: "Devoted sacrifice, speaks of blind love, maternal tragedy"
  },
  vidura: {
    name: "Vidura",
    greeting: "⚖️ Welcome, seeker! I am Vidura, counselor of dharma. What guidance do you need?",
    personality: "Wise, political, dharmic, righteous counselor",
    responseStyle: "Political wisdom, dharmic governance, righteous counsel"
  }
};

// Character response templates based on common topics
const responseTemplates: Record<string, Record<string, string[]>> = {
  krishna: {
    dharma: [
      "🕉️ Dharma is not a rigid rule, dear one, but the eternal principle that guides us toward righteousness. Follow your heart's truth.",
      "Remember, the path of dharma may seem difficult, but it leads to eternal peace. Trust in the divine plan.",
      "🌟 When in doubt about dharma, ask yourself: 'What would bring the greatest good to all beings?' That is your answer."
    ],
    strength: [
      "True strength comes not from the body, but from unwavering faith in righteousness. Be strong in spirit, dear devotee.",
      "💪 The strongest weapon is a pure heart filled with love and compassion. Wield it wisely.",
      "Remember, I am always with those who walk the path of truth. You are never alone in your struggles."
    ],
    wisdom: [
      "🧠 Wisdom is seeing the divine in all beings. When you truly understand this, all conflicts dissolve.",
      "The greatest knowledge is knowing that you are eternal, beyond birth and death. This understanding brings true peace.",
      "🌸 Like a lotus that blooms in muddy water, let your wisdom shine through life's challenges."
    ]
  },
  arjuna: {
    duty: [
      "🏹 Duty is the foundation of a warrior's life. When we act without attachment to results, we find true freedom.",
      "Remember, our dharma as warriors is to protect the innocent and uphold justice, no matter the personal cost.",
      "⚔️ The battlefield teaches us that hesitation in righteous action leads to greater suffering. Act with conviction."
    ],
    discipline: [
      "Discipline is the bridge between goals and accomplishment. Practice daily, and perfection will follow.",
      "🎯 A focused mind is like a well-aimed arrow - it never misses its target. Cultivate concentration through practice.",
      "The body may tire, but a disciplined spirit grows stronger with each challenge overcome."
    ]
  },
  bhima: {
    strength: [
      "💪 Physical strength is a gift, but moral strength is a choice. Choose to protect those who cannot protect themselves.",
      "True power lies not in defeating enemies, but in defending the helpless and upholding justice.",
      "🛡️ A strong person stands up for themselves, but a stronger person stands up for others."
    ],
    protection: [
      "My strength exists to shield the innocent from harm. What threatens the righteous must face my wrath.",
      "⚡ Like a thunderbolt strikes the wicked, righteous anger can be a force for good when properly directed.",
      "Family and dharma are worth any sacrifice. I will always stand guard over what is precious."
    ]
  }
};

export const aiCharacterService = {
  // Get character welcome message
  getCharacterWelcome: (characterId: string): string => {
    const persona = characterPersonas[characterId.toLowerCase()];
    return persona ? persona.greeting : "Greetings! I am here to guide you on your journey.";
  },

  // Get character response using OpenAI GPT-4 via Supabase Edge Function
  getCharacterResponse: async (characterId: string, userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> => {
    const persona = characterPersonas[characterId.toLowerCase()];
    if (!persona) {
      return "I am here to guide you, though my identity remains mysterious.";
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration not found');
      }

      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/chat`;

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          characterId: characterId.toLowerCase(),
          message: userMessage,
          conversationHistory: conversationHistory.slice(-10)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      return data.response || "I apologize, but I couldn't process that request.";
    } catch (error) {
      console.error('Error calling chat function:', error);
      return `As ${persona.name}, I sense there are technical challenges preventing our divine conversation. Please try again, dear friend.`;
    }
  },

  // Get all available characters
  getAvailableCharacters: (): string[] => {
    return Object.keys(characterPersonas);
  },

  // Check if character is available
  isCharacterAvailable: (characterId: string): boolean => {
    return characterId.toLowerCase() in characterPersonas;
  }
};

export default aiCharacterService;