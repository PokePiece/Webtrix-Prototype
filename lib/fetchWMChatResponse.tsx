export async function fetchWMChatResponse(prompt: string, user_tag: string): Promise<string> {
  const payload = JSON.stringify({
    messages: [
      { role: "user", content: prompt }
    ],
    tag: user_tag, 
  });

  try {
    const res = await fetch("http://localhost:3001/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    const json = await res.json();
    const reply = json.choices?.[0]?.message?.content;
    return reply || "No valid response.";
  } catch (err) {
    console.warn("WM chat fetch error:", err);
    return "Error: Unable to reach the Webtrix assistant.";
  }
}
