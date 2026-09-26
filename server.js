import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static('dist'));

const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

const tools = [
  {
    type: 'function',
    name: 'prepare_market_record',
    description: 'Chuẩn hóa một tin thị trường thành bản ghi 8 trường của hệ thống. Không gửi webhook và không tự bịa bằng chứng.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        emailcb: { type: 'string' }, chude: { type: 'string' }, doithu: { type: 'string' }, tintuc: { type: 'string' },
        muctacdong: { type: 'string', enum: ['critical','high','medium','low'] }, tacdong: { type: 'string' },
        dexuat: { type: 'string' }, bangchung: { type: 'string' }
      },
      required: ['emailcb','chude','doithu','tintuc','muctacdong','tacdong','dexuat','bangchung'],
      additionalProperties: false
    }
  }
];

app.get('/api/agent/health', (_req,res) => res.json({ ok: true, configured: Boolean(OPENAI_API_KEY), model: OPENAI_MODEL }));

app.post('/api/agent', async (req,res) => {
  if (!OPENAI_API_KEY) return res.status(503).json({ error: 'Thiếu OPENAI_API_KEY trên máy chủ.' });
  const message = String(req.body?.message || '').trim();
  const context = req.body?.context || {};
  if (!message) return res.status(400).json({ error: 'Vui lòng nhập yêu cầu cho AI Agent.' });

  const instructions = `Bạn là AI Agent điều khiển Cổng Thông tin Thị trường Vietcombank. Bạn hỗ trợ người dùng phân tích tin, chuẩn hóa dữ liệu và điều khiển giao diện qua các hành động có cấu trúc. Chỉ sử dụng dữ liệu được cung cấp; nếu thiếu bằng chứng, ghi 'Thông tin CHỜ thu thập'. Không tự bịa URL, số liệu hay nguồn. Các trường chuẩn: emailcb, chude, doithu, tintuc, muctacdong, tacdong, dexuat, bangchung. Khi người dùng yêu cầu chuẩn hóa tin, dùng tool prepare_market_record. Khi cần thay đổi giao diện, trả lời bằng hướng dẫn ngắn gọn thay vì giả vờ đã bấm nút.\n\nNgữ cảnh giao diện hiện tại:\n${JSON.stringify(context)}`;

  try {
    let response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({ model: OPENAI_MODEL, instructions, input: message, tools })
    });
    let data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'OpenAI API error' });

    const toolCall = (data.output || []).find(x => x.type === 'function_call' && x.name === 'prepare_market_record');
    if (toolCall) {
      return res.json({ reply: 'Tôi đã chuẩn hóa tin thành bản ghi 8 trường. Bạn có thể kiểm tra trước khi cập nhật.', action: { type: 'fill_form', data: JSON.parse(toolCall.arguments) } });
    }
    const text = (data.output || []).filter(x => x.type === 'message').flatMap(x => x.content || []).filter(c => c.type === 'output_text').map(c => c.text).join('\n');
    return res.json({ reply: text || 'Tôi chưa tạo được phản hồi.' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Agent error' });
  }
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile('index.html', { root: 'dist' });
});

app.listen(PORT, () => console.log(`AI Agent server listening on ${PORT}`));
