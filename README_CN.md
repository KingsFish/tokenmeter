# TokenMeter

[English](README.md)

一个 Claude Code 插件，用于测量 Token 使用量，提供 CLI 命令行摘要和交互式 Web Dashboard。

![Dashboard 预览](dashboard-screenshot.jpg)

## 简介

TokenMeter 帮助你监控 Claude Code 的 Token 消耗并估算成本。它解析存储在 `~/.claude/projects` 的会话文件，提供以下功能：

- **CLI 摘要**：快速在终端查看使用统计
- **Web Dashboard**：交互式图表和详细会话历史
- **成本估算**：基于可配置模型价格的估算成本
- **多语言支持**：中文和英文语言切换

## 安装

### 前置要求

- **jq**：JSON 处理必需
  - macOS: `brew install jq`
  - Linux: `apt-get install jq` 或 `yum install jq`
- **Python 3**：Web Dashboard 服务需要（通常已预装）

### 快速安装

```bash
# 添加市场源
claude marketplace add KingsFish/tokenmeter

# 安装插件
claude plugin install tokenmeter
```

### 手动安装

```bash
git clone https://github.com/KingsFish/tokenmeter.git
claude plugin install /path/to/tokenmeter
```

## 命令介绍

### `/usage` - CLI 使用摘要

在终端快速查看 Claude Code Token 使用情况。

**输出内容：**
- 总会话数、Token 数和对话轮数
- 预估成本
- 按项目统计（前 5 个）
- 按模型统计
- 最近会话（最后 5 个）

### `/usage-dashboard` - Web Dashboard

启动交互式 Web Dashboard 进行详细使用分析。

```bash
/usage-dashboard [端口]  # 默认端口：8765
```

**功能特性：**
- Token 使用趋势图表
- 按项目和模型的分布统计
- 会话历史表格（支持筛选）
- 语言切换（中文/英文）

### `/usage-config-price` - 价格配置

配置模型价格用于成本估算。

```bash
/usage-config-price add <模型> <输入> <输出>  # 添加模型价格
/usage-config-price set <模型> <输入> <输出>  # 修改价格
/usage-config-price remove <模型>             # 删除价格
/usage-config-price --list                    # 显示当前配置
```

价格单位为美元/百万 Token。

## 许可证

MIT License