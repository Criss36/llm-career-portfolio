# 大模型训练指南

本指南整合了Chinese-LLaMA-Alpaca-3和llm-action项目的训练方法、代码和硬件要求，为大模型训练提供完整的技术参考。

## 1. 训练方法汇总

### 1.1 基础训练方法

| 方法 | 描述 | 适用场景 | 显存要求 |
|------|------|----------|----------|
| **Full Fine-tuning** | 全量微调 | 小模型（<7B） | 7B: 48GB+ |
| **LoRA** | 低秩适应微调 | 中大型模型 | 7B: 16GB+, 65B: 48GB+ |
| **QLoRA** | 4-bit量化LoRA | 超大型模型 | 7B: 8GB+, 65B: 24GB+ |
| **P-Tuning v2** | 前缀微调 | 大型模型 | 7B: 12GB+ |
| **GaLore** | 梯度低秩分解 | 超大型模型 | 7B: 8GB+ |

### 1.2 分布式训练策略

| 策略 | 描述 | 适用场景 |
|------|------|----------|
| **数据并行** | 数据分片到多个GPU | 所有模型 |
| **模型并行** | 模型分片到多个GPU | 65B+模型 |
| **流水线并行** | 计算流水线化 | 大批次训练 |
| **混合并行** | 数据+模型+流水线 | 超大型模型 |

## 2. 训练代码整合

### 2.1 Chinese-LLaMA-Alpaca-3 训练

#### 2.1.1 预训练

**脚本**: `llm_projects/Chinese-LLaMA-Alpaca-3/scripts/training/run_clm_pt_with_peft.py`

**功能**:
- 支持LoRA/QLoRA预训练
- 支持DeepSpeed ZeRO优化
- 支持长上下文训练

**使用方法**:
```bash
cd llm_projects/Chinese-LLaMA-Alpaca-3/scripts/training
bash run_pt.sh
```

**配置参数**:
- `base_model`: 基础模型路径
- `data_path`: 预训练数据路径
- `output_dir`: 输出目录
- `lora_r`: LoRA秩
- `lora_alpha`: LoRA缩放因子
- `batch_size`: 批量大小

#### 2.1.2 指令精调

**脚本**: `llm_projects/Chinese-LLaMA-Alpaca-3/scripts/training/run_clm_sft_with_peft.py`

**功能**:
- 支持LoRA/QLoRA指令精调
- 支持多种指令格式
- 支持DeepSpeed优化

**使用方法**:
```bash
cd llm_projects/Chinese-LLaMA-Alpaca-3/scripts/training
bash run_sft.sh
```

### 2.2 llm-action 训练

#### 2.2.1 Alpaca-LoRA 微调

**脚本**: `llm_projects/llm-action/scripts/training/alpaca-lora/finetune.py`

**功能**:
- 基于LoRA的Alpaca模型微调
- 支持8-bit量化
- 支持wandb监控

**使用方法**:
```bash
cd llm_projects/llm-action/scripts/training/alpaca-lora
python finetune.py --base_model meta-llama/Llama-2-7b-hf --data_path tatsu-lab/alpaca --output_dir ./lora-alpaca
```

#### 2.2.2 QLoRA 微调

**脚本**: `llm_projects/llm-action/scripts/training/qlora.py`

**功能**:
- 4-bit量化LoRA微调
- 支持大型模型在消费级GPU上训练
- 支持多种数据集

**使用方法**:
```bash
cd llm_projects/llm-action/scripts/training
python qlora.py --model_name_or_path meta-llama/Llama-2-7b-hf --dataset tatsu-lab/alpaca
```

## 3. 硬件要求

### 3.1 显存要求

| 模型大小 | 训练方法 | 最低显存 | 推荐显存 |
|----------|----------|----------|----------|
| **7B** | Full Fine-tuning | 48GB | 64GB+ |
| **7B** | LoRA | 16GB | 24GB+ |
| **7B** | QLoRA | 8GB | 16GB+ |
| **13B** | LoRA | 24GB | 32GB+ |
| **13B** | QLoRA | 12GB | 24GB+ |
| **34B** | LoRA | 48GB | 64GB+ |
| **34B** | QLoRA | 24GB | 32GB+ |
| **65B** | LoRA | 80GB | 128GB+ |
| **65B** | QLoRA | 48GB | 64GB+ |

### 3.2 GPU推荐

| 级别 | GPU型号 | 显存 | 适用模型 |
|------|---------|------|----------|
| **入门级** | RTX 4090 | 24GB | 7B QLoRA |
| **中端** | A100 40GB | 40GB | 13B LoRA, 34B QLoRA |
| **高端** | A100 80GB | 80GB | 34B LoRA, 65B QLoRA |
| **专业级** | H100 80GB | 80GB | 65B LoRA |
| **集群** | 多卡A100/H100 | 128GB+ | 175B+模型 |

### 3.3 其他硬件要求

| 组件 | 要求 | 推荐配置 |
|------|------|----------|
| **CPU** | 16核+ | 32核+ |
| **内存** | 64GB+ | 128GB+ |
| **存储** | 1TB SSD+ | 2TB NVMe SSD |
| **网络** | 10Gbps+ | 25Gbps+ |

## 4. 训练优化技巧

### 4.1 显存优化

1. **使用混合精度**:
   - `fp16` 或 `bf16` 训练
   - 启用 `gradient_checkpointing`

2. **DeepSpeed 配置**:
   - ZeRO-2 优化
   - 启用 `offload_optimizer`
   - 启用 `offload_param`

3. **批处理优化**:
   - 梯度累积 (`gradient_accumulation_steps`)
   - 动态批处理大小

### 4.2 训练加速

1. **分布式训练**:
   - DDP (Data Distributed Parallel)
   - FSDP (Fully Sharded Data Parallel)

2. **计算优化**:
   - Flash Attention 2
   - Xformers 内存优化
   - 启用 `torch.compile`

3. **数据处理**:
   - 并行数据加载
   - 数据缓存
   - 动态填充

### 4.3 模型质量优化

1. **学习率调度**:
   - 线性预热
   - 余弦退火
   - 适应学习率

2. **正则化**:
   - Dropout
   - Weight Decay
   - Gradient Clipping

3. **数据质量**:
   - 数据清洗
   - 数据去重
   - 数据增强

## 5. 训练流程

### 5.1 准备阶段

1. **环境配置**:
   ```bash
   pip install -r llm_projects/Chinese-LLaMA-Alpaca-3/requirements.txt
   pip install peft bitsandbytes transformers deepspeed
   ```

2. **数据准备**:
   - 预训练数据：100GB+ 文本数据
   - 指令数据：10万+ 指令-响应对

3. **模型准备**:
   - 下载基础模型
   - 配置模型参数

### 5.2 训练阶段

1. **预训练** (可选):
   - 数据：大规模无标注文本
   - 目标：增强模型语言能力
   - 时间：数天到数周

2. **指令精调**:
   - 数据：高质量指令数据集
   - 目标：提升指令理解能力
   - 时间：数小时到数天

3. **对齐训练** (可选):
   - DPO (Direct Preference Optimization)
   - PPO (Proximal Policy Optimization)
   - 时间：数天

### 5.3 评估阶段

1. **基准测试**:
   - C-Eval (中文能力)
   - MMLU (英文能力)
   - GSM8K (数学能力)

2. **人工评估**:
   - 对话质量
   - 指令遵循
   - 安全性

3. **性能测试**:
   - 推理速度
   - 内存占用
   - 稳定性

## 6. 常见问题

### 6.1 显存不足

- **解决方案**:
  - 使用 QLoRA
  - 启用 DeepSpeed ZeRO
  - 减小批量大小
  - 使用梯度累积

### 6.2 训练不稳定

- **解决方案**:
  - 调整学习率
  - 增加 warmup 步数
  - 启用梯度裁剪
  - 检查数据质量

### 6.3 模型质量差

- **解决方案**:
  - 增加训练数据量
  - 提高数据质量
  - 调整训练超参数
  - 增加训练轮数

## 7. 训练示例

### 7.1 7B 模型 QLoRA 微调

**硬件**:
- GPU: RTX 4090 (24GB)
- CPU: 16核
- 内存: 64GB
- 存储: 500GB SSD

**命令**:
```bash
cd llm_projects/llm-action/scripts/training
python qlora.py \
    --model_name_or_path meta-llama/Llama-2-7b-hf \
    --dataset tatsu-lab/alpaca \
    --output_dir ./qlora-alpaca \
    --batch_size 4 \
    --gradient_accumulation_steps 4 \
    --learning_rate 2e-4 \
    --num_train_epochs 3 \
    --lora_r 8 \
    --lora_alpha 16 \
    --lora_dropout 0.05
```

### 7.2 13B 模型 LoRA 微调

**硬件**:
- GPU: A100 40GB
- CPU: 32核
- 内存: 128GB
- 存储: 1TB SSD

**命令**:
```bash
cd llm_projects/Chinese-LLaMA-Alpaca-3/scripts/training
bash run_sft.sh
```

## 8. 参考资源

- **Chinese-LLaMA-Alpaca-3**: https://github.com/ymcui/Chinese-LLaMA-Alpaca-3
- **llm-action**: https://github.com/liguodongiot/llm-action
- **PEFT**: https://github.com/huggingface/peft
- **DeepSpeed**: https://github.com/microsoft/DeepSpeed
- **vLLM**: https://github.com/vllm-project/vllm

## 9. 最佳实践

1. **从QLoRA开始**:
   - 快速验证训练效果
   - 适合消费级硬件
   - 迭代速度快

2. **逐步扩大规模**:
   - 从小模型到大模型
   - 从少数据到多数据
   - 从低并发到高并发

3. **监控与调优**:
   - 使用wandb监控训练
   - 定期评估模型性能
   - 根据评估结果调整策略

4. **安全与伦理**:
   - 数据安全处理
   - 模型输出审查
   - 避免有害内容

---

**总结**:
本指南提供了从硬件选择到训练优化的完整流程，帮助您高效训练大模型。根据您的硬件条件和目标，可以选择合适的训练方法和配置，逐步提升模型性能。
