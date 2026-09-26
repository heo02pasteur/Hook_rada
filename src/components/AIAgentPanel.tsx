import React, { useMemo, useState } from 'react';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';

type AgentAction = {
  action: 'navigate' | 'fill_form' | 'save_draft' | 'submit' | 'rescan' | 'none';
  tab: 'analysis' | 'radar' | 'intake' | '';
  form: {
    emailcb: string; chude: string; doithu: string; tintuc: string;
    muctacdong: 'critical' | 'high' | 'medium' | 'low' | '';
    tacdong: string; dexuat: string; bangchung: string;
  };
  message: string;
};

const emptyForm = {
  emailcb:'', chude:'', doithu:'', tintuc:'', muctacdong:'', tacdong:'', dexuat:'', bangchung:''
};

function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

function clickButton(id: string) {
  const el = document.getElementById(id) as HTMLButtonElement | null;
  el?.click();
}

export const AIAgentPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<string[]>([
    'Xin chào, tôi là Rada Agent. Bạn có thể ra lệnh như: “Mở Nhập thông tin”, “Điền tin về Techcombank…”, hoặc “Gửi bản tin này”.'
  ]);

  const context = useMemo(() => ({
    url: window.location.href,
    activeTab:
      document.getElementById('card-tab-analysis')?.className.includes('ring-2') ? 'analysis' :
      document.getElementById('card-tab-radar')?.className.includes('ring-2') ? 'radar' : 'intake'
  }), [open]);

  const execute = (a: AgentAction) => {
    if (a.tab) clickButton(`card-tab-${a.tab}`);

    if (a.action === 'fill_form') {
      clickButton('card-tab-intake');
      const selectors: Record<string,string> = {
        emailcb: 'input[placeholder*="vcb.hoankiem"]',
        chude: 'select',
        doithu: 'input[placeholder*="Techcombank"]',
        tintuc: 'textarea[placeholder*="Mô tả cụ thể"]',
        tacdong: 'textarea[placeholder*="Đánh giá nguy cơ"]',
        dexuat: 'textarea[placeholder*="Đề xuất Khối"]',
        bangchung: 'input[placeholder*="Đường dẫn website"]'
      };
      for (const [key, selector] of Object.entries(selectors)) {
        const el = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
        const value = a.form[key as keyof typeof a.form];
        if (el && value) setNativeValue(el, value);
      }
      if (a.form.muctacdong) {
        const labels: Record<string,string> = {critical:'Khẩn cấp',high:'Cao',medium:'Trung bình',low:'Thấp'};
        const button = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() === labels[a.form.muctacdong]);
        (button as HTMLButtonElement | undefined)?.click();
      }
    }

    if (a.action === 'save_draft') {
      clickButton('card-tab-intake');
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Lưu tạm');
      (btn as HTMLButtonElement | undefined)?.click();
    }

    if (a.action === 'submit') {
      clickButton('card-tab-intake');
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Cập nhật'));
      (btn as HTMLButtonElement | undefined)?.click();
    }

    if (a.action === 'rescan') {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Quét lại'));
      (btn as HTMLButtonElement | undefined)?.click();
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setMessages(prev => [...prev, `Bạn: ${text}`]);
    setBusy(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, context })
      });
      const action: AgentAction = await res.json();
      if (!res.ok) throw new Error(action?.message || 'Agent API error');
      execute(action);
      setMessages(prev => [...prev, `Rada Agent: ${action.message}`]);
    } catch (e) {
      setMessages(prev => [...prev, `Rada Agent: ${e instanceof Error ? e.message : 'Không thể kết nối Agent.'}`]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center border-2 border-emerald-300"
        title="Mở Rada Agent"
      >
        <Bot className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[70] w-[min(420px,calc(100vw-2rem))] h-[560px] bg-slate-950 text-white rounded-2xl shadow-2xl border border-emerald-700 overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <div><div className="font-black text-sm">RADA AGENT</div><div className="text-[10px] text-emerald-200">Điều khiển website bằng ngôn ngữ tự nhiên</div></div>
            </div>
            <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
            {messages.map((m,i)=><div key={i} className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 leading-relaxed">{m}</div>)}
          </div>
          <div className="p-3 border-t border-slate-800">
            <div className="flex gap-2">
              <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ví dụ: Điền tin Techcombank..." className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 resize-none" rows={2}/>
              <button onClick={send} disabled={busy} className="w-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center">{busy?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
