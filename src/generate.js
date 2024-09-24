const baseTranslations = [
    {
      input: "The beautiful butterfly fluttered gracefully through the colorful garden.",
      output: "Le beau papillon voltigeait gracieusement à travers le jardin coloré.",
    },
    {
      input: "She always dreamed of traveling the world and experiencing different cultures.",
      output: "Elle a toujours rêvé de voyager dans le monde et de découvrir différentes cultures.",
    },
    // ... (include all 10 original translations here)
  ];

  const englishWords = [
    "The", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
    "Hello", "world", "How", "are", "you", "today", "Good", "morning",
    "Beautiful", "day", "isn't", "it", "I", "love", "programming",
    "React", "is", "awesome", "Learning", "new", "things", "exciting"
  ];
  
  const frenchWords = [
    "Le", "rapide", "brun", "renard", "saute", "par-dessus", "paresseux", "chien",
    "Bonjour", "monde", "Comment", "allez", "vous", "aujourd'hui", "Bon", "matin",
    "Belle", "journée", "n'est-ce", "pas", "J'aime", "la", "programmation",
    "React", "est", "génial", "Apprendre", "nouvelles", "choses", "passionnant"
  ];
  
  const generateRandomSentence = (words, length) => {
    return Array.from({ length }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
  };
  
  export const generateData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = Array.from({ length: 1000 }, () => ({
          input: generateRandomSentence(englishWords, 5 + Math.floor(Math.random() * 6)),
          output: generateRandomSentence(frenchWords, 5 + Math.floor(Math.random() * 6)),
        }));
        resolve(data);
      }, 1000);
    });
  };
   
  function generateVariations(base, count) {
    const variations = [];
  
    for (let i = 0; i < count; i++) {
      const randomBase = base[Math.floor(Math.random() * base.length)];
      const variation = {
        input: randomBase.input.replace(/\b\w+\b/g, (match) => 
          Math.random() < 0.3 ? getRandomWord() : match
        ),
        output: randomBase.output.replace(/\b\w+\b/g, (match) => 
          Math.random() < 0.3 ? getRandomFrenchWord() : match
        ),
      };
      variations.push(variation);
    }
  
    return variations;
  }
  
  function getRandomWord() {
    const words = [
      "amazing", "colorful", "delightful", "elegant", "fantastic",
      "graceful", "harmonious", "incredible", "joyful", "kind",
      "lovely", "magnificent", "noble", "outstanding", "pleasant",
      "quaint", "remarkable", "splendid", "terrific", "unique",
      // Add more words as needed
    ];
    return words[Math.floor(Math.random() * words.length)];
  }
  
  function getRandomFrenchWord() {
    const words = [
      "magnifique", "coloré", "délicieux", "élégant", "fantastique",
      "gracieux", "harmonieux", "incroyable", "joyeux", "gentil",
      "charmant", "majestueux", "noble", "remarquable", "agréable",
      "pittoresque", "étonnant", "splendide", "formidable", "unique",
      // Add more French words as needed
    ];
    return words[Math.floor(Math.random() * words.length)];
  }
  
  const translations = [...baseTranslations, ...generateVariations(baseTranslations, 990)];
  
//   export async function generateData() {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         // Randomly select 5 unique translations
//         const shuffled = translations.sort(() => 0.5 - Math.random());
//         const selected = shuffled.slice(0, 5);
//         resolve(selected);
//       }, 1000); // Simulate API delay
//     });
//   }


// const englishWords = [
//     "The", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
//     "Hello", "world", "How", "are", "you", "today", "Good", "morning",
//     "Beautiful", "day", "isn't", "it", "I", "love", "programming",
//     "React", "is", "awesome", "Learning", "new", "things", "exciting"
//   ];
  
//   const frenchWords = [
//     "Le", "rapide", "brun", "renard", "saute", "par-dessus", "paresseux", "chien",
//     "Bonjour", "monde", "Comment", "allez", "vous", "aujourd'hui", "Bon", "matin",
//     "Belle", "journée", "n'est-ce", "pas", "J'aime", "la", "programmation",
//     "React", "est", "génial", "Apprendre", "nouvelles", "choses", "passionnant"
//   ];
  
//   const generateRandomSentence = (words, length) => {
//     return Array.from({ length }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
//   };
  
//   const generateData = async () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const data = Array.from({ length: 1000 }, () => ({
//           input: generateRandomSentence(englishWords, 5 + Math.floor(Math.random() * 6)),
//           output: generateRandomSentence(frenchWords, 5 + Math.floor(Math.random() * 6)),
//         }));
//         resolve(data);
//       }, 1000);
//     });
//   };