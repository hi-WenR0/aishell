#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 加载 .env 文件
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "=========================================="
echo "        API Key 验证工具"
echo "=========================================="
echo ""

# 验证 Kimi API Key
echo -e "${YELLOW}[1/2] 验证 Kimi API Key...${NC}"
if [ -z "$KIMI_API_KEY" ] || [ "$KIMI_API_KEY" = "your_kimi_api_key_here" ]; then
    echo -e "${RED}  ✗ KIMI_API_KEY 未配置${NC}"
else
    response=$(curl -s -w "\n%{http_code}" https://api.moonshot.cn/v1/models \
        -H "Authorization: Bearer $KIMI_API_KEY")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}  ✓ Kimi API Key 有效${NC}"
        echo "    可用模型:"
        echo "$body" | grep -o '"id":"[^"]*"' | head -5 | sed 's/"id":"/ - /g' | sed 's/"//g' | sed 's/^/    /'
    else
        echo -e "${RED}  ✗ Kimi API Key 无效 (HTTP $http_code)${NC}"
        echo "    错误信息: $(echo "$body" | grep -o '"message":"[^"]*"' | head -1)"
    fi
fi

echo ""

# 验证 Anthropic API Key
echo -e "${YELLOW}[2/2] 验证 Anthropic API Key...${NC}"
if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your_anthropic_api_key_here" ]; then
    echo -e "${RED}  ✗ ANTHROPIC_API_KEY 未配置${NC}"
else
    response=$(curl -s -w "\n%{http_code}" https://api.anthropic.com/v1/messages \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -H "content-type: application/json" \
        -d '{"model":"claude-3-haiku-20240307","max_tokens":1,"messages":[{"role":"user","content":"hi"}]}')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}  ✓ Anthropic API Key 有效${NC}"
    elif [ "$http_code" = "401" ]; then
        echo -e "${RED}  ✗ Anthropic API Key 无效 (HTTP 401)${NC}"
    else
        echo -e "${YELLOW}  ? 状态码: $http_code${NC}"
        echo "    响应: $(echo "$body" | head -c 200)"
    fi
fi

echo ""
echo "=========================================="
