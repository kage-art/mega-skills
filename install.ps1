# MegaSkills 1-Click PowerShell Installer
# Installs standardized Mega Master Agent Skills into Antigravity, Claude Code, Cursor, Codex, and OpenCode

param (
    [string]$Profile = "full",
    [string]$Target = "all",
    [string]$Dest = "",
    [switch]$Master = $false,
    [switch]$Link = $false,
    [switch]$Help = $false
)

if ($Master) { $Profile = "master" }

# Handle remote execution (e.g. irm ... | iex) where MyInvocation has no path
$scriptDir = ""
if ($MyInvocation.MyCommand.Path) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}

if ($Help) {
    Write-Host @"
========================================================================
   MEGA MASTER AGENT SKILLS INSTALLER (PowerShell)
========================================================================
Usage:
    .\install.ps1 [-Profile <name>] [-Target <tool>] [-Dest <path>] [-Link]
    irm https://raw.githubusercontent.com/kage-art/mega-skills/main/install.ps1 | iex

Profiles:
    full        - Master skill + all 52 specialized skills (default)
    master      - The single all-in-one Mega Master Skill only
    mobile      - Android, iOS, React Native, Flutter & Mobile Anti-Slop
    anti-slop   - Anti-slop code, UI, copywriting & craft rules
    engineering - TDD, systematic debugging, code review & QA
    creative    - GSAP, Lenis, Vanta 3D, baseline UI & motion
    security    - Strix OWASP Top 10 automated penetration testing

Targets:
    all         - Auto-detect and install to all AI coding tools on this machine
    antigravity - Google Antigravity & Gemini CLI (~/.gemini/config/skills)
    claude      - Claude Code (~/.claude/skills)
    cursor      - Cursor IDE (~/.cursor/skills or current workspace)
    agents      - AAIF Open Standard (.agents/skills)
    codex       - OpenAI Codex (~/.codex/skills)
"@
    exit 0
}

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "   Downloading & Installing Mega Master Skill Suite (Profile: $Profile)..." -ForegroundColor Yellow
Write-Host "========================================================================" -ForegroundColor Cyan

# Check if local skills exist; if not, download the latest package from GitHub
$skillsSource = Join-Path $scriptDir "skills"
if ([string]::IsNullOrEmpty($scriptDir) -or -not (Test-Path $skillsSource)) {
    Write-Host "[*] Downloading latest MegaSkills package from GitHub..." -ForegroundColor Cyan
    $tempDir = Join-Path $env:TEMP "mega-skills-install"
    $zipPath = Join-Path $tempDir "mega-skills.zip"
    
    if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

    Invoke-WebRequest -Uri "https://github.com/kage-art/mega-skills/archive/refs/heads/main.zip" -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force
    
    $extractedFolder = Get-ChildItem -Path $tempDir -Directory | Select-Object -First 1
    $scriptDir = $extractedFolder.FullName
    $skillsSource = Join-Path $scriptDir "skills"
}

# Check if node is available to run high-performance CLI
$nodeExists = Get-Command node -ErrorAction SilentlyContinue

if ($nodeExists) {
    $cliScript = Join-Path $scriptDir "bin\cli.mjs"
    $nodeArgs = @($cliScript, "install", "--profile", $Profile, "--target", $Target)
    if ($Dest -ne "") {
        $nodeArgs += @("--dest", $Dest)
    }
    & node $nodeArgs
} else {
    Write-Host "[*] Node.js not detected. Running native PowerShell fallback installer..." -ForegroundColor Yellow
    $homeDir = [Environment]::GetFolderPath("UserProfile")
    $rootSkill = Join-Path $scriptDir "SKILL.md"
    
    $targetPaths = @()
    if ($Dest -ne "") {
        $targetPaths += $Dest
    } else {
        if ($Target -eq "all" -or $Target -eq "antigravity") {
            $targetPaths += (Join-Path $homeDir ".gemini\config\skills")
            $targetPaths += (Join-Path $homeDir ".gemini\antigravity-ide\skills")
        }
        if ($Target -eq "all" -or $Target -eq "claude") {
            $targetPaths += (Join-Path $homeDir ".claude\skills")
        }
        if ($Target -eq "all" -or $Target -eq "cursor") {
            $targetPaths += (Join-Path $homeDir ".cursor\skills")
        }
        if ($Target -eq "all" -or $Target -eq "codex") {
            $targetPaths += (Join-Path $homeDir ".codex\skills")
        }
        if ($Target -eq "all" -or $Target -eq "agents") {
            $targetPaths += (Join-Path (Get-Location).Path ".agents\skills")
        }
    }

    $skillDirs = Get-ChildItem -Path $skillsSource -Recurse -Filter "SKILL.md" | ForEach-Object { $_.Directory }

    foreach ($t in $targetPaths) {
        Write-Host "-> Deploying to $t..." -ForegroundColor Green
        New-Item -ItemType Directory -Path $t -Force | Out-Null

        # Install root master skill
        $masterDir = Join-Path $t "mega-master-skill"
        New-Item -ItemType Directory -Path $masterDir -Force | Out-Null
        Copy-Item -Path $rootSkill -Destination (Join-Path $masterDir "SKILL.md") -Force

        # Install domain skills
        if ($Profile -ne "master") {
            foreach ($s in $skillDirs) {
                $destSkillPath = Join-Path $t $s.Name
                Copy-Item -Path $s.FullName -Destination $destSkillPath -Recurse -Force
            }
        }
        Write-Host "   [OK] Deployed master skill suite to $t" -ForegroundColor Green
    }

    # Deploy rules
    $rulesDir = Join-Path $scriptDir "rules"
    if (Test-Path $rulesDir) {
        Copy-Item (Join-Path $rulesDir "GEMINI.md") (Join-Path $homeDir ".gemini\config\GEMINI.md") -Force -ErrorAction SilentlyContinue
        Copy-Item (Join-Path $rulesDir "CLAUDE.md") (Join-Path $homeDir ".claude\CLAUDE.md") -Force -ErrorAction SilentlyContinue
        Copy-Item (Join-Path $rulesDir ".cursorrules") (Join-Path (Get-Location).Path ".cursorrules") -Force -ErrorAction SilentlyContinue
        Copy-Item (Join-Path $rulesDir ".windsurfrules") (Join-Path (Get-Location).Path ".windsurfrules") -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "`n[SUCCESS] Mega Master Skills installed successfully!" -ForegroundColor Green
