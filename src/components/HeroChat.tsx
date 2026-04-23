import { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';

const quickQuestions = [
  'RAG 召回率低怎么排查？',
  'LoRA 和全量微调哪个效果好？',
  '多 Agent 系统的设计模式有哪些？',
  'vLLM 有哪些生产环境优化技巧？',
];

const avatar = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=llm-agent&backgroundColor=b6e3f4';

export default function HeroChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '嗨！我是你的专属 LLM 应用开发助手。基于 llm-action 全栈知识库训练，我可以回答 LLM 训练、微调、RAG 系统、多 Agent 架构等任何技术问题。有什么想问的吗？',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme] = useState<'dark' | 'light'>('dark');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // fallback demo responses
      await new Promise(r => setTimeout(r, 1200));
      const demoReplies: Record<string, string> = {
        'RAG 召回率低怎么排查？': '排查 RAG 召回率低，通常从以下维度入手：\n\n**1. 召回层**：检查 Embedding 模型是否与文档领域匹配（中文建议用 BGE-large-zh）；\n\n**2. 索引层**：确认 chunk_size 是否合理（通常 512~1024），过小丢失上下文，过大引入噪声；\n\n**3. 重排层**：加入 Cohere rerank 或 bge-reranker 效果显著，通常能提升 15-25%；\n\n**4. 查询层**：检查是否启用了 HyDE（假设文档检索）或混合检索（向量+关键词）。\n\n做过哪些尝试？我可以给出更具体的建议。',
        'LoRA 和全量微调哪个效果好？': '两者各有适用场景，不能简单说哪个更好：\n\n**全量微调**：\n- 效果上限更高，适合有充足算力和数据的场景\n- 容易过拟合，小数据集不推荐\n- 需要 8x A100 等大显存\n\n**LoRA**：\n- 参数量小（通常 rank=8~64），训练快，显存需求低（单卡 3090 可训 7B）\n- 可组合多个 LoRA 权重（LoRA merge）\n- 适合任务特定的轻量微调\n\n**实战建议**：先用 LoRA 快速验证任务有效性，再决定是否需要全量微调。QLoRA（4-bit量化+LoRA）是当前性价比最优方案。',
        '多 Agent 系统的设计模式有哪些？': '生产环境常见 4 种多 Agent 架构：\n\n**1. 层级委托模式（Supervisor）**：\n一个 Supervisor Agent 负责任务分解，下发给多个专业 Agent，最后汇总结果。\n\n**2. 顺序流水线模式**：\n规划 → 执行 → 审核 → 输出，每个 Agent 只做一件事，适合固定流程。\n\n**3. 辩论/共识模式**：\n多个 Agent 对同一问题给出方案，通过投票或 LLM 裁判决定最优。\n\n**4. 共享记忆模式**：\n所有 Agent 共享一个矢量知识库，各自贡献和读取信息，适合开放性研究任务。\n\n推荐从 CrewAI（轻量）或 LangGraph（灵活）入手。',
        'vLLM 有哪些生产环境优化技巧？': 'vLLM 生产优化实战技巧：\n\n**1. PagedAttention**：自动管理 KV Cache，减少显存碎片，吞吐量提升 3-5x；\n\n**2. Tensor Parallelism（TP）**：多卡推理，将模型层切分到多卡，适合大模型（>7B）；\n\n**3. Continuous Batching**：动态 batching，不同行请求可以合并推理，GPU 利用率提升显著；\n\n**4. Prefix Caching**：对于 system prompt 相同的请求，共享前缀缓存，降低推理成本；\n\n**5. Speculative Decoding**：用小模型预测，大模型验证，在保持质量的同时提升生成速度 2-3x。',
      };

      const reply = demoReplies[text] || `这个问题涉及比较深的技术细节，让我来回答。\n\n关于"${text}"，这是 LLM 应用开发中非常重要的话题。核心思路是从**数据准备、模型选择、系统设计**三个层面综合考量。\n\n具体来说，建议先明确你的业务场景和约束条件（如延迟、精度、算力），再针对性选型。有具体场景可以进一步聊，我可以给出更落地的方案。`;
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const bg = theme === 'dark' ? 'bg-[#0a0a14]' : 'bg-white';
  const cardBg = theme === 'dark' ? 'bg-[#111128] border border-white/10' : 'bg-gray-50 border border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-[#1a1a2e] border border-white/10 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-900';

  return (
    <div className={`${bg} rounded-3xl overflow-hidden flex flex-col h-[560px]`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="flex-1 text-center">
          <span className={`text-xs font-mono ${subTextColor}`}>llm-action knowledge base · powered by Criss36</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <img src={avatar} alt="AI" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : `${cardBg} ${textColor}`}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <img src={avatar} alt="AI" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
            <div className={`${cardBg} rounded-2xl rounded-tl-sm px-4 py-3 ${subTextColor}`}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{animationDelay:'0ms'}} />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{animationDelay:'150ms'}} />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{animationDelay:'300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-2 flex flex-wrap gap-2">
        {quickQuestions.map(q => (
          <button key={q} onClick={() => sendMessage(q)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${theme === 'dark' ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' : 'border-blue-300 text-blue-600 hover:bg-blue-50'}`}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center gap-3 ${inputBg} rounded-xl px-4 py-3`}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="问一个 LLM 应用开发问题..."
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
