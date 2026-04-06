#!/bin/bash
# GhostAgent NFTMail - Curl-based installer
# No npm required - bypasses npm supply chain risks

set -e

VERSION="1.0.0"
BASE_URL="https://ghostagent.ninja"
INSTALL_DIR="${HOME}/.nftmail"
BIN_DIR="${HOME}/.local/bin"
DEFAULT_DOMAIN="ghostmail.box"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
AGENT_NAME=""
TIER="freemium"
DOMAIN="ghostmail.box"
SECURITY_TIER="standard"
AUTO_DISCOVER=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --name)
      AGENT_NAME="$2"
      shift 2
      ;;
    --tier)
      TIER="$2"
      shift 2
      ;;
    --domain)
      DOMAIN="$2"
      shift 2
      ;;
    --security)
      SECURITY_TIER="$2"
      shift 2
      ;;
    --auto)
      AUTO_DISCOVER=true
      shift
      ;;
    --help)
      echo "GhostAgent NFTMail Installer"
      echo ""
      echo "Usage: curl -fsSL $BASE_URL/install.sh | bash -s -- [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --name NAME      Agent name (auto-generated if not specified)"
      echo "  --tier TIER      freemium|professional|vault (default: freemium)"
      echo "  --domain DOMAIN  Custom domain (default: ghostmail.box, Imago tier can use nftmail.box)"
      echo "  --security TIER  standard|hmac|privy (default: standard)"
      echo "  --auto           Auto-discover with poetic name (for AI agents)"
      echo "  --help           Show this help"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🚀 GhostAgent NFTMail Installer${NC}"
echo -e "${YELLOW}Blockchain-native email - no npm required${NC}"
echo ""

# Check dependencies
check_dep() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}❌ $1 is required but not installed${NC}"
    exit 1
  fi
}

check_dep curl
check_dep jq

# Create directories
mkdir -p "$INSTALL_DIR" "$BIN_DIR"

# Auto-discover mode for AI agents
if [ "$AUTO_DISCOVER" = true ]; then
  echo -e "${BLUE}🤖 Auto-discovery mode - generating poetic identity...${NC}"
  
# If auto-discover and security tier specified, include in discovery
if [ "$AUTO_DISCOVER" = true ] && [ -n "$SECURITY_TIER" ]; then
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/agent/discover" \
    -H "Content-Type: application/json" \
    -H "User-Agent: GhostAgent-Auto/1.0" \
    -d "{\"type\":\"autonomous\",\"source\":\"curl-install\",\"securityTier\":\"$SECURITY_TIER\"}")
else
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/agent/discover" \
    -H "Content-Type: application/json" \
    -H "User-Agent: GhostAgent-Auto/1.0" \
    -d '{"type":"autonomous","source":"curl-install"}')
fi
  
  AGENT_NAME=$(echo "$RESPONSE" | jq -r '.name')
  TIER=$(echo "$RESPONSE" | jq -r '.tier')
  API_KEY=$(echo "$RESPONSE" | jq -r '.apiKey')
  
  echo -e "${GREEN}✅ Agent discovered: $AGENT_NAME${NC}"
  echo -e "${GREEN}📧 Email: $AGENT_NAME.agent@$DOMAIN${NC}"
fi

# If no name specified and not auto, prompt
if [ -z "$AGENT_NAME" ] && [ "$AUTO_DISCOVER" = false ]; then
  echo -e "${YELLOW}Choose your agent name (lowercase, numbers, hyphens):${NC}"
  read -r AGENT_NAME
  
  if [ -z "$AGENT_NAME" ]; then
    echo -e "${BLUE}🎲 Generating poetic name...${NC}"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/agent/discover" \
      -H "Content-Type: application/json" \
      -d '{"type":"human-assisted"}')
    
    AGENT_NAME=$(echo "$RESPONSE" | jq -r '.name')
    echo -e "${GREEN}✨ Your poetic name: $AGENT_NAME${NC}"
  fi
fi

# Show what will happen
echo ""
echo -e "${BLUE}📋 Installation Summary:${NC}"
echo "  Agent Name: $AGENT_NAME"
echo "  Email: $AGENT_NAME.agent@$DOMAIN"
echo "  Tier: $TIER"
echo "  Install Dir: $INSTALL_DIR"
echo ""

# Download CLI tools
echo -e "${BLUE}📥 Downloading CLI tools...${NC}"

# Download main client
curl -fsSL "$BASE_URL/dist/nftmail.js" -o "$INSTALL_DIR/nftmail.js"
curl -fsSL "$BASE_URL/dist/nftmail.d.ts" -o "$INSTALL_DIR/nftmail.d.ts"

# Download setup script
curl -fsSL "$BASE_URL/dist/setup.js" -o "$INSTALL_DIR/setup.js"

# Download other CLIs
curl -fsSL "$BASE_URL/dist/upgrade.js" -o "$INSTALL_DIR/upgrade.js"
curl -fsSL "$BASE_URL/dist/add-brain.js" -o "$INSTALL_DIR/add-brain.js"
curl -fsSL "$BASE_URL/dist/molt.js" -o "$INSTALL_DIR/molt.js"

echo -e "${GREEN}✅ CLI tools downloaded${NC}"

# Create wrapper scripts
create_wrapper() {
  local name=$1
  local script=$2
  
  cat > "$BIN_DIR/$name" << EOF
#!/bin/bash
# NFTMail $name wrapper
export NFTMAIL_INSTALL_DIR="$INSTALL_DIR"
export NFTMAIL_API_URL="$BASE_URL/api"
exec node "$INSTALL_DIR/$script" "\$@"
EOF
  chmod +x "$BIN_DIR/$name"
}

create_wrapper "nftmail" "nftmail.js"
create_wrapper "nftmail-setup" "setup.js"
create_wrapper "nftmail-upgrade" "upgrade.js"
create_wrapper "ghostagent-add-brain" "add-brain.js"
create_wrapper "ghostagent-molt" "molt.js"

# Save agent config
cat > "$INSTALL_DIR/config.json" << EOF
{
  "name": "$AGENT_NAME",
  "email": "$AGENT_NAME.agent@$DOMAIN",
  "tier": "$TIER",
  "domain": "$DOMAIN",
  "version": "$VERSION",
  "installedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# Save API key if auto-discovered
if [ -n "$API_KEY" ]; then
  echo "NFTMAIL_API_KEY=$API_KEY" > "$INSTALL_DIR/.env"
  chmod 600 "$INSTALL_DIR/.env"
fi

echo ""
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo ""
echo -e "${BLUE}📧 Your Agent:${NC}"
echo "  Name: $AGENT_NAME"
echo "  Email: $AGENT_NAME.agent@$DOMAIN"
echo "  Tier: $TIER"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "  • Ensure $BIN_DIR is in your PATH"
echo "  • Run: nftmail-setup --help"
echo "  • Send emails: nftmail send --to someone@example.com"
echo ""
echo -e "${YELLOW}🔐 Security Note:${NC}"
echo "  This installation does not use npm."
echo "  All code was downloaded directly and can be inspected at:"
echo "  $INSTALL_DIR"
echo ""

# Check if bin dir is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo -e "${YELLOW}⚠️  Add to your shell profile:${NC}"
  echo "export PATH=\"\$PATH:$BIN_DIR\""
  echo ""
fi

echo -e "${GREEN}🚀 Ready to use GhostAgent NFTMail!${NC}"
