import { useState } from 'react';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

const MODE_TABS = [
  { id: 'rag', label: '🔍 RAG 问答' },
  { id: 'agent', label: '🤖 Agent 推理' },
  { id: 'eval', label: '📊 质量评测' },
];

const agentSteps = [
  { step: '理解意图', thought: '用户问的是 LoRA 和全量微调的区别，属于模型训练范畴。', done: true },
  { step: '任务规划', thought: '需要从向量知识库检索相关内容，然后综合回答。', done: true },
  { step: '执行检索', thought: '调用 embedding 模型，从 Milvus 检索 Top-5 相关文档…', done: true },
  { step: '生成答案', thought: '结合召回上下文，生成结构化回答，覆盖效果、算力、适用场景。', done: false },
];

const evalResults: Record<string, string | number> = {
  'Context Precision': 0.91,
  'Context Recall': 0.94,
  'Faithfulness': 0.88,
  'Answer Relevance': 0.93,
  'Latency (P95)': '180ms',
};

const avatar = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=llm-agent&backgroundColor=b6e3f4';

// ── RAG View ──────────────────────────────────────────────────────────
function RAGView() {
  const [query, setQuery] = useState('LoRA 和全量微调哪个效果好？');
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: '你好！基于 RAG 系统 + llm-action 全栈知识库，我可以回答 LLM 训练、微调、RAG 系统设计、多 Agent 架构等任何技术问题。' }
  ]);
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!query.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '**LoRA vs 全量微调：各有适用场景**\n\n**全量微调**：\n- 参数量大（全部参数参与），效果上限高\n- 适合有充足算力 + 大数据集的场景\n- 需要 8×A100 等大显存\n\n**LoRA**：\n- 只训练低秩矩阵（rank=8~64），单卡 3090 可训 7B\n- 可组合多个 LoRA 权重，切换任务\n- 适合任务特定轻量微调，性价比最高\n\n**实战建议**：先用 LoRA 快速验证任务有效性，再决定是否上全量微调。QLoRA（4-bit 量化 + LoRA）是当前性价比最优方案。'
      }]);
      setLoading(false);
    }, 1200);
    setQuery('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/8 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-emerald-400/80 font-mono">RAG Mode · 91% 召回率</span>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-600">向量库: 1.2M · BGE-large-zh</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{width:'91%'}} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <img src={avatar} className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
            <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/[0.05] border border-white/8 text-gray-300'}`}>
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <img src={avatar} className="w-6 h-6 rounded-full flex-shrink-0" />
            <div className="bg-white/[0.05] border border-white/8 rounded-xl px-3.5 py-2.5">
              <div className="flex gap-1">
                {[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:`${d}ms`}} />)}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-3 border-t border-white/8">
        <div className="flex gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="问一个 LLM 技术问题..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500/40 transition-colors" />
          <button onClick={send} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors">发送</button>
        </div>
      </div>
    </div>
  );
}

// ── Agent View ────────────────────────────────────────────────────────
function AgentView() {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-3">
      <p className="text-xs text-gray-600 mb-3 font-mono">问题：LoRA 和全量微调哪个效果好？</p>
      <div className="space-y-2.5">
        {agentSteps.map((s, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 ${s.done ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-gray-600 text-gray-500'}`}>
                {s.done ? '✓' : i+1}
              </div>
              {i < agentSteps.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
            </div>
            <div className={`flex-1 pb-3 ${s.done ? '' : 'opacity-40'}`}>
              <span className={`text-xs font-mono ${s.done ? 'text-emerald-400' : 'text-gray-500'}`}>{s.step}</span>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{s.thought}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-black/40 border border-white/8 rounded-xl">
        <p className="text-xs text-gray-600 mb-1 font-mono">// 最终回答</p>
        <p className="text-xs text-gray-300 leading-relaxed">
          <span className="text-emerald-400">LoRA</span> 和全量微调各有适用场景。LoRA 适合快速验证和资源受限场景（单卡可训 7B），全量微调适合有充足算力的大数据集。推荐先用 LoRA 验证，再决定是否上全量微调。
        </p>
      </div>
    </div>
  );
}

// ── Eval View ────────────────────────────────────────────────────────
function EvalView() {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-3">
      <p className="text-xs text-gray-500 mb-4 font-mono">// RAG 系统质量评测 · RAGAS v0.22</p>
      <div className="space-y-3">
        {Object.entries(evalResults).map(([metric, value]) => (
          <div key={metric} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-mono">{metric}</span>
              <span className="text-sm font-semibold text-indigo-300">{value}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{width: typeof value === 'number' ? `${(value as number) * 100}%` : '100%'}} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
        <p className="text-xs text-amber-400/80 font-mono mb-1">// CI/CD Quality Gate</p>
        <p className="text-xs text-gray-500">所有指标 &gt; 0.85 时通过。 <span className="text-emerald-400">✅ 通过</span> · 阈值: Faithfulness ≥ 0.85</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function HeroChat() {
  const [mode, setMode] = useState('rag');

  return (
    <div className="flex flex-col h-full bg-[#0d0d1f] border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex border-b border-white/8 bg-black/20">
        {MODE_TABS.map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs text-center transition-colors ${mode === tab.id ? 'text-white bg-white/[0.05] border-b-2 border-indigo-500' : 'text-gray-600 hover:text-gray-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {mode === 'rag' && <RAGView />}
        {mode === 'agent' && <AgentView />}
        {mode === 'eval' && <EvalView />}
      </div>
    </div>
  );
}
