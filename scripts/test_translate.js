async function translateToEnglish(text, sourceLang = "autodetect") {
  try {
    const langPair = sourceLang && sourceLang !== "en" && sourceLang !== "autodetect" ? `${sourceLang}|en` : `autodetect|en`;
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`);
    if (res.ok) {
      const data = await res.json();
      if (data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch (err) {
    console.error("Translation err:", err);
  }
  return text;
}

async function run() {
  const tests = [
    { lang: "te", text: "అవి ప్రభుత్వం ఆస్తులపై అతికించిన పోస్టర్లు దయచేసి దీన్ని పరిష్కరించండి" },
    { lang: "kn", text: "ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದೆ ದಯವಿಟ್ಟು ಸರಿಪಡಿಸಿ" },
    { lang: "hi", text: "सड़क पर कचरा फैला हुआ है और बहुत बदबू आ रही है" },
    { lang: "ta", text: "தெரு விளக்கு எரியவில்லை இரவில் இருட்டாக இருக்கிறது" }
  ];

  for (const t of tests) {
    const en = await translateToEnglish(t.text, t.lang);
    console.log(`[${t.lang.toUpperCase()}] -> [EN]:`, en);
  }
}

run();
