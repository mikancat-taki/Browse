export function localAIResponse(input) {
  const text = input.toLowerCase();

  // シンプルなルールベース + 疑似記憶
  const responses = {
    hello: "こんにちは！私はローカルAIです🌟",
    hi: "やあ！今日はどんなことを考えてる？",
    ありがとう: "どういたしまして😊",
    天気: "うーん、たぶん晴れかな？☀️",
    名前: "私はPPPProxyのAIモジュールです。",
  };

  for (const key in responses) {
    if (text.includes(key)) return responses[key];
  }

  // 疑似的な創発（マルコフ風）
  const words = text.split(" ");
  return (
    "なるほど…「" +
    words[Math.floor(Math.random() * words.length)] +
    "」について考えてみるね🤔"
  );
}
