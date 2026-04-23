import type { Demo, BlogPost, Skill } from '../types';

export const demos: Demo[] = [
  {
    id: 'knowledge-base',
    title: '知识库问答系统',
    titleEn: 'Knowledge Base Q&A',
    description: '基于 RAG 的生产级问答系统，支持多格式文档解析、智能召回、答案溯源。集成 llm-action 全栈知识库，覆盖 LLM 训练/推理/部署全流程。',
    tags: ['LangChain', 'ChromaDB', 'FastAPI', 'BGE Embedding', 'HyDE'],
    status: 'live',
    code: `# 核心检索逻辑
query_emb = embedding_model.encode(query)
docs = vector_store.similarity_search(query_emb, k=5)

# HyDE: 先生成假设答案再召回
hypo_doc = llm.generate(f"假设回答: {query}")
hypo_emb = embedding_model.encode(hypo_doc)
docs = vector_store.similarity_search(hypo_emb, k=10)

# Context compression + rerank
compressed = llmlingua.compress_docs(docs, query)
ranked = cohere.rerank(query, compressed, top_n=3)`
  },
  {
    id: 'agent-workflow',
    title: '多 Agent 协作平台',
    titleEn: 'Multi-Agent Orchestration',
    description: '基于 LangGraph 的多 Agent 系统，包含规划、执行、审核三个角色，通过状态图实现复杂任务的自动分解与执行。集成 MCP 协议支持外部工具调用。',
    tags: ['LangGraph', 'MCP', 'CrewAI', 'React', 'Tool-Calling'],
    status: 'live',
  },
  {
    id: 'structured-extraction',
    title: '结构化数据抽取',
    titleEn: 'Structured Data Extraction',
    description: '将非结构化文档（PDF/HTML/图片）可靠地转换为 Pydantic 模型输出，支持 JSON Schema 校验、批量异步处理、精度/召回率指标监控。',
    tags: ['Pydantic', 'FastAPI', 'asyncio', 'OpenAI', 'PDF解析'],
    status: 'live',
  },
  {
    id: 'eval-pipeline',
    title: 'LLM 评测流水线',
    titleEn: 'LLM Evaluation Pipeline',
    description: '基于 DeepEval 的自动化评测系统，覆盖 RAGAS 指标（Context Precision/Recall/Faithfulness）、G-Eval、LLM-as-Judge，支持 CI/CD 集成和历史指标追踪。',
    tags: ['DeepEval', 'RAGAS', 'G-Eval', 'GitHub Actions', 'LangSmith'],
    status: 'live',
  },
  {
    id: 'vllm-optimization',
    title: 'vLLM 推理优化',
    titleEn: 'vLLM Inference Optimization',
    description: '生产环境 vLLM 部署实战：PagedAttention、Continuous Batching、Tensor Parallelism、Speculative Decoding，延迟从 800ms 降至 120ms，吞吐量提升 5x。',
    tags: ['vLLM', 'CUDA', 'TensorRT', 'FP8 量化', 'SLoRA'],
    status: 'live',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'rag-chunking',
    title: 'RAG 召回率从 62% 到 91%：我踩过的 20 个坑',
    excerpt: 'Embedding 模型选错、Chunk Size 不合理、Lost in the Middle、Query Expansion 过度……这20个问题每个都让召回率下降5-10%。这篇文章把完整的踩坑路径和解决方案整理出来。',
    date: '2026-03-10',
    tags: ['RAG', 'Embedding', '召回优化', 'Milvus'],
    readTime: '22 min',
  },
  {
    id: 'llm-eval-matters',
    title: '为什么 LLM 评测比模型本身还难',
    excerpt: '用 RAGAS 跑了500+组实验后，我意识到：评测设计本身就是一个研究问题。Context Faithfulness 的定义在学术界都有争议。本文分享我对"什么才算好评测"的理解。',
    date: '2026-02-18',
    tags: ['评测', 'RAGAS', 'G-Eval', 'LLM-as-Judge'],
    readTime: '18 min',
  },
  {
    id: 'agent-architecture',
    title: '从 ReAct 到 LangGraph：多 Agent 系统的架构演进',
    excerpt: 'ReAct → Plan-and-Execute → Acting → Supervisor 模式……为什么我最终选择了状态机模型？每种架构的适用场景是什么？设计 Agent 系统时最难的不是技术选型，是忍住不用最复杂方案的冲动。',
    date: '2026-01-28',
    tags: ['Agent', 'LangGraph', '架构设计', 'MCP'],
    readTime: '25 min',
  },
  {
    id: 'from-sw-to-llm',
    title: '从传统工程到 LLM 应用：思维模式需要转变的三件事',
    excerpt: '确定性 → 概率性、单元测试 → 分布测试、本地运行 → 延迟与成本。这三件事是我在 LLM 应用开发中感受到的最深刻的思维转变，理解它们比学任何框架都重要。',
    date: '2025-12-15',
    tags: ['方法论', '工程思维', 'LLM应用'],
    readTime: '12 min',
  },
];

export const skills: Skill[] = [
  {
    category: '🧠 LLM 应用',
    items: ['LangChain / LangGraph', 'RAG 系统设计（召回>90%）', 'MCP 协议与工具集成', 'CrewAI / AutoGen', '向量数据库（Milvus / Chroma）'],
  },
  {
    category: '🔧 模型训练与微调',
    items: ['LLaMA-Factory / Axoltl', 'LoRA / QLoRA / SLoRA', 'DeepSpeed ZeRO-3', 'MLflow 实验追踪', '分布式训练（多机多卡）'],
  },
  {
    category: '⚡ 推理与部署',
    items: ['vLLM / TGI 生产部署', 'Flash Attention / PagedAttention', 'INT8 / FP8 / GPTQ 量化', 'Continuous Batching', 'Tensor Parallelism'],
  },
  {
    category: '📊 评测与可观测性',
    items: ['DeepEval / RAGAS 评测', 'G-Eval / LLM-as-Judge', 'LangSmith / OpenTelemetry', 'Prometheus + Grafana', 'CI/CD Quality Gates'],
  },
  {
    category: '🛠 工程基础设施',
    items: ['FastAPI + uvicorn + Docker', 'GitHub Actions CI/CD', 'Redis / PostgreSQL', 'Cloudflare AI Gateway', 'Kubernetes 基础'],
  },
];

export const timeline = [
  { period: '2024.Q1', event: '搭建首个 RAG 问答系统，开始系统性学习 LLM' },
  { period: '2024.Q2', event: '上线多 Agent 协作平台，探索 Agent 架构' },
  { period: '2024.Q3', event: '完成 Qwen-7B/14B 全量+LoRA 微调，PPL 下降 23%' },
  { period: '2024.Q4', event: '引入 RAGAS 评测体系，召回率提升至 91%，延迟降至 180ms' },
  { period: '2025.Q1', event: '生产环境部署 vLLM，吞吐量提升 5x，QPS 从 20 升至 120' },
  { period: '2025.Q2', event: '集成 MCP 协议，构建工具 Agent，支持外部 API 调用' },
];
