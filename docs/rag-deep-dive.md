# 从 0 到 1 构建生产级 RAG 系统

> 日期: 2026-03-15 | 标签: RAG, FastAPI, Milvus, LangChain | 阅读时间: 18 分钟

## 背景

为什么要自己搭 RAG？因为市面上的 RAG 演示都太简单了——几个 PDF、100 条文档，跑个 demo 没问题。但生产环境是另一个世界：

- 文档规模: 10万+ 文档
- 查询延迟要求: < 200ms
- 召回率要求: > 85%
- 需要多语言、表格、代码理解

## 架构设计

```
用户查询 → 预处理(Query Expansion) → 向量召回(N=20)
  → 重排(Rerank, Cohere) → 上下文压缩 → LLM 生成 → 答案
```

## 踩过的坑

### 坑 1: Embedding 模型选错

最初用了 `text2vec-base-chinese`，在中文法律文档上召回率只有 62%。换了 `BAAI/bge-large-zh-v1.5` 后，召回率提升到 81%。

### 坑 2: Chunk Size 不合理

| Chunk Size | 召回率 | 答案完整性 |
|-----------|--------|-----------|
| 128 | 71% | 低 |
| 512 | 83% | 中 |
| 1024 | 81% | 高 |
| 动态(100-512) | 87% | 高 |

结论: 用动态 chunk，以句子为单位，保留 100~512 token 范围。

### 坑 3: Lost in the Middle

长上下文容易被 LLM 忽略。解决方案: 用 `LLMLingua` 压缩 prompt，或将关键信息放在开头/结尾。

## 核心代码

```python
# Milvus 召回 + Cohere 重排
retrieved = milvus_collection.search(
    query_vector=embedding_model.encode(query),
    top_k=20,
    anns_field="embedding"
)

# Rerank
reranked = cohere.rerank(
    query=query,
    documents=[doc.text for doc in retrieved],
    top_n=5
)
```

## 最终效果

- 召回率: **87%** (RAGAS 评测)
- 延迟: **180ms** (P95)
- 用户满意度: **4.6/5** (生产反馈)

## 总结

RAG 的上限取决于三个因素: Embedding 质量、Chunk 策略、检索排序。把这三个做好，召回率上 90% 不难。
