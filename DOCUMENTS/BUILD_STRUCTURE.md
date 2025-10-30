# local device name
<!-- mac -->
sudo bash -c 'grep -qxF "127.0.0.1 in-evan.com" /etc/hosts || echo "127.0.0.1 in-evan.com" >> /etc/hosts; grep -qxF "127.0.0.1 admin.in-evan.com" /etc/hosts || echo "127.0.0.1 admin.in-evan.com" >> /etc/hosts'

<!-- windows -->
$lines = @('127.0.0.1 in-evan.com','127.0.0.1 admin.in-evan.com'); $hosts = "$env:SystemRoot\System32\drivers\etc\hosts"; foreach($l in $lines){ if (-not (Select-String -Path $hosts -Pattern ([regex]::Escape($l)) -SimpleMatch -Quiet)) { Add-Content -Path $hosts -Value $l } }


# git config local
- git init
- git add .
- git push .
# git remote
- git remote -v
- git remote add origin https://github.com/cypher0011/in-evan
- git add .
- git commit -m "<anything here>"
- git push
# npm config
- npm -v
- npm install
- npx create-next-app@latest my-app
# docker config
- docker build -t evan .
- docker run -p 3000:3000 evan
- docker ps <!-- to see what process are working -->
- docker stop 98bcfb02b535

# AI tools
- claude mcp add gemini-cli -- npx -y gemini-mcp-tool


### used in stack
# Core Framework
- Next.js
- Netlify
# Database & ORM
- Prisma 
- Supabase & Supabase cli
- AWS S3

# APIs
- unkey

# Authentication
- NextAuth
- arcjet

# Fun add-on
- remix
- date-fns

# Ui components
- shadcn
<!-- - launchuicomponents -->

### commands for help
- npm run prisma:studio 
+ show full status of what inside the db of supabase
