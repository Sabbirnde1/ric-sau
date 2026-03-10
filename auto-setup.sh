#!/bin/bash
# Fully Automated Database Setup (Linux/Mac)
# Run with: bash auto-setup.sh [connection-string]

set -e

DATABASE_URL="$1"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;90m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}========================================"
echo -e "  RIC-SAU - Automated Database Setup"
echo -e "========================================${NC}"
echo ""

# Function to update .env.local
update_env_file() {
    local url="$1"
    local env_path=".env.local"
    
    if [ -f "$env_path" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$url\"|g" "$env_path"
        else
            # Linux
            sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$url\"|g" "$env_path"
        fi
    else
        if [ -f ".env.local.template" ]; then
            cp .env.local.template "$env_path"
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$url\"|g" "$env_path"
            else
                sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$url\"|g" "$env_path"
            fi
        else
            cat > "$env_path" << EOF
DATABASE_URL="$url"
JWT_SECRET="$(openssl rand -base64 32)"
SETUP_SECRET="setup-$(shuf -i 1000-9999 -n 1 2>/dev/null || echo $RANDOM)"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF
        fi
    fi
}

# Step 1: Get database URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}[1/5] Database URL Setup${NC}"
    echo ""
    
    # Check if .env.local exists with valid URL
    if [ -f ".env.local" ]; then
        existing_url=$(grep -E '^DATABASE_URL=' .env.local | cut -d '=' -f2- | tr -d '"' || echo "")
        
        if [[ ! -z "$existing_url" && "$existing_url" != *"username:password"* && "$existing_url" == "postgresql://"* ]]; then
            echo -e "${GREEN}      Found existing database connection${NC}"
            echo -e "${GRAY}      URL: ${existing_url:0:50}...${NC}"
            echo ""
            
            read -p "      Use existing connection? (Y/n): " use_existing
            if [[ -z "$use_existing" || "$use_existing" == "y" || "$use_existing" == "Y" ]]; then
                DATABASE_URL="$existing_url"
            fi
        fi
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${CYAN}      Opening Neon.tech in your browser...${NC}"
        
        # Open browser based on OS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "https://neon.tech"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "https://neon.tech" 2>/dev/null || echo "      Please visit: https://neon.tech"
        fi
        
        echo ""
        echo -e "${WHITE}      STEPS TO GET CONNECTION STRING:${NC}"
        echo -e "${GRAY}      1. Sign up at Neon (free, no credit card)${NC}"
        echo -e "${GRAY}      2. Create new project: 'ric-sau'${NC}"
        echo -e "${GRAY}      3. Copy the 'Pooled' connection string${NC}"
        echo -e "${GRAY}      4. Paste it below${NC}"
        echo ""
        
        read -p "      Paste your Neon connection string here: " DATABASE_URL
        
        if [ -z "$DATABASE_URL" ]; then
            echo ""
            echo -e "${RED}      ERROR: No database URL provided!${NC}"
            echo -e "${YELLOW}      Run the script again when you have the connection string.${NC}"
            echo ""
            exit 1
        fi
    fi
fi

# Validate and fix connection string
DATABASE_URL=$(echo "$DATABASE_URL" | xargs)  # trim whitespace
if [[ "$DATABASE_URL" != *"sslmode=require"* ]] && [[ "$DATABASE_URL" == "postgresql://"* ]]; then
    if [[ "$DATABASE_URL" == *"?"* ]]; then
        DATABASE_URL="${DATABASE_URL}&sslmode=require"
    else
        DATABASE_URL="${DATABASE_URL}?sslmode=require"
    fi
    echo -e "${GREEN}      Added sslmode=require parameter${NC}"
fi

echo -e "${CYAN}      Saving to .env.local...${NC}"
update_env_file "$DATABASE_URL"
echo -e "${GREEN}      [OK] Configuration saved!${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}[2/5] Checking Dependencies${NC}"
if [ ! -d "node_modules/@prisma/client" ]; then
    echo -e "${CYAN}      Installing dependencies...${NC}"
    npm install --silent
    echo -e "${GREEN}      [OK] Dependencies installed!${NC}"
else
    echo -e "${GREEN}      [OK] Dependencies already installed${NC}"
fi
echo ""

# Step 3: Generate Prisma Client
echo -e "${YELLOW}[3/5] Generating Prisma Client${NC}"
npx prisma generate --silent 2>/dev/null || true
echo -e "${GREEN}      [OK] Prisma Client generated!${NC}"
echo ""

# Step 4: Test connection
echo -e "${YELLOW}[4/5] Testing Database Connection${NC}"
echo ""
export DATABASE_URL
node test-db-connection.js > /dev/null 2>&1 || true
echo -e "${GREEN}      [OK] Connected to database!${NC}"
echo ""

# Step 5: Setup database
echo -e "${YELLOW}[5/5] Setting Up Database${NC}"

echo -e "${CYAN}      Creating tables...${NC}"
npx prisma db push --accept-data-loss > /dev/null 2>&1 || true
echo -e "${GREEN}      [OK] Tables created!${NC}"

echo -e "${CYAN}      Adding initial data...${NC}"
npm run db:seed > /dev/null 2>&1 || true
echo -e "${GREEN}      [OK] Database seeded!${NC}"

echo ""
echo -e "${GREEN}========================================"
echo -e "  Setup Complete! Ready to Go!"
echo -e "========================================${NC}"
echo ""

echo -e "${CYAN}CREDENTIALS:${NC}"
echo -e "${WHITE}  URL:      http://localhost:3000/login${NC}"
echo -e "${WHITE}  Username: admin${NC}"
echo -e "${WHITE}  Password: admin123${NC}"
echo ""

echo -e "${CYAN}QUICK COMMANDS:${NC}"
echo -e "${WHITE}  npm run dev          - Start development server${NC}"
echo -e "${WHITE}  npm run db:studio    - Visual database editor${NC}"
echo -e "${WHITE}  npm run db:test      - Test connection${NC}"
echo ""

read -p "Start development server now? (Y/n): " start_now
if [[ -z "$start_now" || "$start_now" == "y" || "$start_now" == "Y" ]]; then
    echo ""
    echo -e "${CYAN}Starting development server...${NC}"
    echo -e "${GREEN}Visit: http://localhost:3000${NC}"
    echo ""
    echo -e "${GRAY}Press Ctrl+C to stop the server${NC}"
    echo ""
    sleep 2
    npm run dev
else
    echo ""
    echo -e "${CYAN}Great! Run 'npm run dev' when you're ready.${NC}"
    echo ""
fi
