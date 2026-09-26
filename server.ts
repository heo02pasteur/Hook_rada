import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '1mb' }));

const AGENT_SYSTEM = `
You are Rada Agent, an AI controller embedded in the Hook_rada market-intelligence website.
You help the user operate the existing UI. Return ONLY a JSON object matching the supplied schema.
Allowed actions:
- navigate: open analysis, radar, or intake tab
- fill_form: populate the existing 8-field market-intelligence form
- save_draft: save the currently filled form as a draft
- submit: submit/update the currently filled form through the existing Make webhook flow
- rescan: trigger the Auto Radar rescan
- none: answer without changing the UI

Never invent evidence URLs. If the user asks to submit without enough required information, use none and explain what is missing.
Never reveal secrets, API keys, or server environment variables.
`;

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    action: { type: 'string', enum: ['navigate','fill_form','save_draft','submit','rescan','none'] },
    tab: { type: 'string', enum: ['analysis','radar','intake',''] },
    form: {
      type: 'object',
      additionalProperties: false,
      properties: {
        emailcb: { type: 'string' },
        chude: { type: 'string' },
        doithu: { type: 'string' },
        tintuc: { type: 'string' },
        muctacdong: { type: 'string', enum: ['critical','high','medium','low',''] },
        tacdong: { type: 'string' },
        dexuat: { type: 'string' },
        bangchung: { type: 'string' }
      },
      required: ['emailcb','chude','doithu','tintuc','muctacdong','tacdong','dexuat','bangchung']
    },
    message: { type: 'string' }
  },
  required: ['action','tab','form','message']
};

app.post('/api/agent', async (req, res) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(503).json({
      action: 'none',
      tab: '',
      form: { emailcb:'',chude:'',doithu:'',tintuc:'',muctacdong:'',tacdong:'',dexuat:'',bangchung:'' },
      message: 'Rada Agent chưa có OPENAI_API_KEY ở server. Hãy thêm secret OPENAI_API_KEY rồi khởi động lại ứng dụng.'
    });
  }

  try {
    const userMessage = String(req.body?.message || '').slice(0, 12000);
    const context = req.body?.context ? JSON.stringify(req.body.context).slice(0, 12000) : '{}';

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_AGENT_MODEL || 'gpt-6-astra',
        input: [
          { role: 'system', content: AGENT_SYSTEM },
          { role: 'user', content: `Current UI context: ${context}\\nUser command: ${userMessage}` }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'rada_agent_action',
            strict: true,
            schema
          }
        }
      })
    });

    if (!response.ok) {
      const body = await response.text();
      return res.status(response.status).json({ error: body.slice(0, 2000) });
    }

    const data = await response.json();
    const outputText = data.output_text || '';
    const action = JSON.parse(outputText);
    return res.json(action);
  } catch (error) {
    console.error('Rada Agent error:', error);
    return res.status(500).json({ error: 'Rada Agent failed to process the command.' });
  }
});

const port = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
  app.listen(port, '0.0.0.0', () => console.log(`Rada server listening on ${port}`));
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
  app.listen(port, '0.0.0.0', () => console.log(`Rada dev server listening on ${port}`));
}
