export interface AgentAction { type: 'fill_form'; data: { emailcb:string; chude:string; doithu:string; tintuc:string; muctacdong:'critical'|'high'|'medium'|'low'; tacdong:string; dexuat:string; bangchung:string }; }
export interface AgentResponse { reply: string; action?: AgentAction; error?: string; }

export async function askAiAgent(message: string, context: Record<string, unknown> = {}): Promise<AgentResponse> {
  const response = await fetch('/api/agent', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({message, context}) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `Agent HTTP ${response.status}`);
  return data;
}
