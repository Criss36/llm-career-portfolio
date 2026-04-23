# 2026 中文 LLM 全景图：从底座模型到行业应用

> 深度解析 ChatGLM、Qwen、Yi、DeepSeek 等主流中文底座模型的优劣势，探讨垂直领域（医疗、法律、金融）微调的最佳实践。

---

## 一、中文 LLM 生态概览

截至 2026 年初，中文开源大语言模型生态已经非常成熟。以 [Awesome-Chinese-LLM](https://github.com/HqWu-HITCS/Awesome-Chinese-LLM) 为代表的社区整理了 100+ 开源中文 LLM，涵盖：

- **底座模型**：ChatGLM、Qwen、Yi、DeepSeek、InternLM、Baichuan、MiniMax 等
- **垂直领域**：医疗（HuatuoGPT、MedicalGPT）、法律（LawGPT、ChatLaw）、金融（FinGPT、轩辕）等
- **工具链**：LLaMA-Factory、vLLM、C-Eval、OpenCompass 等

---

## 二、主流底座模型对比

### 参数量与上下文

| 模型 | 厂商 | 参数量 | 最大上下文 | 可商用 |
|------|------|--------|------------|--------|
| ChatGLM-6B | 清华 | 6B | 2K/8K | ✅ |
| GLM-4-9B | 清华 | 9B | 128K | ✅ |
| Qwen2.5-72B | 阿里 | 72B | 128K | ✅ |
| Yi-34B | 零一万物 | 34B | 200K | ✅ |
| DeepSeek-V2 | 深度求索 | 236B | 128K | ✅ |
| InternLM2-20B | 上海 AI Lab | 20B | 200K | ✅ |
| MiniMax-Text-01 | MiniMax | 456B | 1M | ✅ |

### 各模型优势分析

**ChatGLM（清华）**
- 中文对话效果最好之一
- ChatGLM3 支持工具调用和代码执行
- GLM-4 支持 128K 超长上下文

**Qwen（阿里）**
- 生态最完善，Qwen2.5 系列覆盖 7B 到 72B
- 阿里云 ModelScope 生态丰富
- 支持视觉模型 Qwen-VL

**Yi（零一万物）**
- 200K 超长上下文能力突出
- 6B 版本即可本地部署
- 中英双语能力强

**DeepSeek（深度求索）**
- MoE 架构，训练成本低
- DeepSeek-V2 采用稀疏专家混合
- 代码能力对标 GPT-4

---

## 三、垂直领域微调模型

### 医疗领域

| 模型 | 特点 | 数据规模 |
|------|------|----------|
| HuatuoGPT | 中医、西医 | 2600万 QA |
| MedicalGPT | 医学各科 | 16GB 医学语料 |
| BianQue | 问诊对话 | 多轮问诊数据 |
| Taiyi-LLM | 中英双语 | 大连理工研发 |

### 法律领域

| 模型 | 特点 | 覆盖范围 |
|------|------|----------|
| LawGPT | 法律咨询 | 常用法律 |
| ChatLaw | 北大出品 | 法律法规 |
| DISC-LawLLM | 复旦出品 | 多元法律场景 |
| LexiLaw | 高精度 | 合同审查 |

### 金融领域

| 模型 | 厂商 | 特点 |
|------|------|------|
| 轩辕（XuanYuan） | 度小满 | 千亿级金融对话 |
| FinGPT | AI4Finance | 金融分析 |
| Tongyi-Finance | 阿里 | 通义金融 |

---

## 四、微调框架对比

### LLaMA-Factory

```python
# 一行命令启动微调
llamafactory-cli train examples/llama3/qlora.yaml
```

优势：
- 支持 100+ 开源模型
- 统一训练、推理、评测
- 内置 LoRA/QLoRA/Full-tuning

### ChatGLM-Efficient-Tuning

专门为 ChatGLM 系列设计的微调工具，支持：
- Ptuning v2
- LoRA
- Adapter

### DeepSpeed

微软的分布式训练框架：
- ZeRO 优化显存
- 支持 RLHF 训练
- DeepSpeed-Chat 一键 RLHF

---

## 五、推理框架对比

| 框架 | 吞吐量 | 延迟 | 特色 |
|------|--------|------|------|
| vLLM | 最高 | 低 | PagedAttention |
| TGI | 高 | 低 | Rust 实现 |
| LMDeploy | 高 | 低 | InternLM 自研 |
| text-generation-inference | 中 | 中 | HuggingFace 官方 |

### vLLM 配置示例

```python
from vllm import LLM, SamplingParams

llm = LLM(model="Qwen/Qwen2.5-7B-Instruct")
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)

outputs = llm.generate(["Hello, world!"], sampling_params)
```

---

## 六、评测基准

### 中文专业评测

| 基准 | 规模 | 特点 |
|------|------|------|
| C-Eval | 52 学科，13948 题 | 最权威中文评测 |
| FlagEval | 多维度 | 智源发布 |
| OpenCompass | 全方位 | 上海 AI Lab |
| SuperCLUE | 对话 | 匿名对战 |

### 评测最佳实践

```python
# 使用 OpenCompass 评测
from opencompass import run_eval

run_eval(
    datasets=['ceval', 'mmlu'],
    models=['Qwen2.5-7B'],
    partition='medium'
)
```

---

## 七、应用场景实战

### RAG 系统架构

```
用户 Query → 向量检索 → 知识图谱增强 → LLM 生成
            ↓
        BM25 召回 → 混合排序 → Context 组装
```

### 多 Agent 协作

```python
# Supervisor 模式
graph = StateGraph(AgentState)
graph.add_node("supervisor", supervisor_node)
graph.add_node("researcher", researcher_node)
graph.add_node("engineer", engineer_node)
graph.add_edge("supervisor", "researcher", condition=lambda s: "search" in s)
graph.add_edge("supervisor", "engineer", condition=lambda s: "code" in s)
```

---

## 八、总结与展望

### 当前状态
1. **底座模型**：ChatGLM、Qwen、Yi 三足鼎立，DeepSeek 后来居上
2. **垂直领域**：医疗、法律、金融已有成熟方案
3. **工具链**：LLaMA-Factory + vLLM 成为事实标准

### 未来趋势
1. **多模态**：Qwen-VL、InternVL 多模态能力持续提升
2. **长上下文**：百万级上下文成为可能
3. **端侧部署**：MiniCPM 等小模型能力持续增强

---

> 📚 参考：[Awesome-Chinese-LLM](https://github.com/HqWu-HITCS/Awesome-Chinese-LLM)、[llm-action](https://github.com/liguodongiot/llm-action)