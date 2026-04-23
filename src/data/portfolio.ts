import type { Demo, BlogPost, Skill } from '../types';

export const demos: Demo[] = [
  {
    id: 'rag-chatbot',
    title: 'RAG 智能问答系统',
    titleEn: 'RAG Knowledge Q&A',
    description: '基于检索增强生成的 LLM 问答系统，支持多文档解析、智能召回、答案生成全流程。集成了 llm-action 知识库，覆盖 LLM 训练、推理、部署等全栈知识。',
    tags: ['RAG', 'LangChain', 'Milvus', 'FastAPI', 'Vue'],
    status: 'live',
    code: `// 核心 RAG 检索逻辑
const retrieved = await vectorStore.similaritySearch(query, k=5);
const context = retrieved.map(d => d.pageContent).join('\\n');

const prompt = \`基于以下上下文回答问题：\\n
问题：\${query}\\n
上下文：\${context}\\n\\n
请给出准确、详细的回答。\`;

const response = await llm.invoke(prompt);`
  },
  {
    id: 'agent-workflow',
    title: '多 Agent 协作系统',
    titleEn: 'Multi-Agent Orchestration',
    description: '基于 CrewAI 架构的多 Agent 协作系统，包含规划Agent、执行Agent、审核Agent，通过结构化通信协议实现复杂任务的自动分解与执行。',
    tags: ['CrewAI', 'LangGraph', 'Agent', 'Python'],
    status: 'live',
  },
  {
    id: 'fine-tuning',
    title: 'LLM 微调训练平台',
    titleEn: 'LLM Fine-tuning Platform',
    description: '一站式模型微调平台，支持 LoRA / QLoRA / Full-tuning 三种模式，提供分布式训练、梯度监控、模型评估全流程 UI。',
    tags: ['LLaMA-Factory', 'DeepSpeed', 'LoRA', 'MLflow'],
    status: 'coming',
  },
  {
    id: 'eval-dashboard',
    title: 'LLM 评测仪表盘',
    titleEn: 'LLM Evaluation Dashboard',
    description: '支持 RAGAS / G-Eval / LLM-as-Judge 多种评测方案，可视化模型在准确率、忠诚度、相关性等维度上的表现，自动生成评测报告。',
    tags: ['RAGAS', 'LangSmith', 'Grafana', 'Python'],
    status: 'concept',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'rag-deep-dive',
    title: '从 0 到 1 构建生产级 RAG 系统',
    excerpt: 'RAG 看起来简单，但想把召回率做到 90%+、延迟压到 200ms 以内、还要支持千万级文档库，这里面至少有 20 个坑要踩。这篇复盘把整个过程讲透。',
    date: '2026-03-15',
    tags: ['RAG', 'FastAPI', 'Milvus', 'LangChain'],
    readTime: '18 min',
  },
  {
    id: 'multi-agent',
    title: '多 Agent 系统设计：任务分解与通信协议',
    excerpt: '当一个 Agent 处理不了复杂任务时，如何设计多 Agent 的协作框架？本文从任务树分解、共享记忆、结果汇总三个维度给出工程级方案。',
    date: '2026-02-28',
    tags: ['Agent', 'CrewAI', 'LangGraph', '架构设计'],
    readTime: '22 min',
  },
  {
    id: 'llm-eval',
    title: 'LLM 评测完全指南：RAGAS 在生产环境中的实战经验',
    excerpt: '评测是 LLM 应用闭环的关键。用 RAGAS 跑完 500+ 组实验后，我总结出了评测设计、指标选择、结果分析的完整方法论。',
    date: '2026-01-20',
    tags: ['评测', 'RAGAS', 'G-Eval', 'LangSmith'],
    readTime: '15 min',
  },
];

export const skills: Skill[] = [
  {
    category: '🧠 LLM 应用开发',
    items: ['LangChain / LangGraph', 'RAG 系统设计', 'CrewAI / AutoGen', '向量数据库 (Milvus/Pinecone)', 'LLM API (OpenAI / Claude / Qwen)'],
  },
  {
    category: '🔧 模型训练与微调',
    items: ['LLaMA-Factory', 'LoRA / QLoRA / Ptuning', 'DeepSpeed ZeRO', '分布式训练', 'MLflow 实验管理'],
  },
  {
    category: '⚡ LLM 推理优化',
    items: ['vLLM / TGI 部署', 'Flash Attention', 'INT8 / FP8 量化', 'Batching / Prefill-Decode 分离', 'CUDA 优化基础'],
  },
  {
    category: '📊 评测与可观测性',
    items: ['RAGAS 评测', 'G-Eval / LLM-as-Judge', 'LangSmith', 'Prometheus + Grafana', 'OpenTelemetry 链路追踪'],
  },
  {
    category: '🛠️ 工程基础设施',
    items: ['FastAPI / Gradio', 'Docker / K8s', 'Redis / PostgreSQL', 'GitHub Actions CI/CD', 'Cloudflare AI Gateway'],
  },
];

export const timeline = [
  { period: '2024.Q1', event: '从零构建首个 RAG 问答机器人' },
  { period: '2024.Q2', event: '上线多 Agent 协作平台，服务 500+ 用户' },
  { period: '2024.Q3', event: '完成 Qwen-7B/14B 全量微调，PPL 下降 23%' },
  { period: '2024.Q4', event: '生产环境引入 RAGAS 评测系统，召回率提升至 91%' },
  { period: '2025.Q1', event: '基于 llm-action 构建个人 LLM 知识库 Agent' },
  { period: '2025.Q2', event: '开源贡献：优化 LangChain RAG 模板性能 40%' },
];
