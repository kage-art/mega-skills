---
name: supply-chain-security-scanner
description: Audits npm, PyPI, Cargo, and Go packages, libraries, dependencies, and lockfiles before installation. Detects malicious lifecycle scripts (preinstall/postinstall), typosquatting, dependency confusion, leaked registry tokens, and known CVE vulnerabilities.
---

# 📦 Supply Chain & Package Security Scanner

## Goal
Audit all third-party libraries, packages, manifests, and lockfiles **before `npm install`, `pip install`, or `cargo build`** to detect malicious install scripts, typosquatting attacks, hijacked maintainer credentials, unpinned dependencies, and known CVE vulnerabilities.

---

## The Supply Chain Threat Model

Modern software attacks increasingly target **install-time execution** rather than application runtime:
1. **Lifecycle Hook Exploits (`preinstall` / `postinstall`):**
   When `npm install` runs, npm automatically executes shell commands specified in `"scripts": { "postinstall": "..." }`. Attackers use this to silently execute reverse shells, exfiltrate environment variables, or install backdoors before any application code is compiled.
2. **Typosquatting & Malicious Package Clones:**
   Attackers register packages with names almost identical to popular libraries (e.g., `cross-env` vs `crossenv`, `lodash` vs `lodas`).
3. **Compromised Maintainers & Dependency Confusion:**
   Legitimate maintainer npm/PyPI accounts are hijacked via credential stuffing or token leaks, and malicious versions are published.
4. **Unpinned Wildcard Dependencies (`*`, `latest`):**
   Wildcards allow an attacker who compromises an upstream dependency to immediately push an untrusted release that is auto-pulled on the next install.

---

## Pre-Installation Security Checklist

### 1. Audit Package Manifests (`package.json`)
Before running `npm install` or importing new libraries, execute the built-in scanner:
```bash
# Scan the current project's packages and lifecycle hooks
node scripts/scan-package-security.mjs

# Or scan an external project directory
node scripts/scan-package-security.mjs "/path/to/project"

# Or using the global CLI
npx kage-art/mega-skills scan-packages
```

### 2. Guard Against Install-Time Code Execution
To install dependencies safely without letting unverified packages execute shell commands during installation:
```bash
# Run npm install with lifecycle scripts disabled
npm install --ignore-scripts
```

### 3. Automated Vulnerability Scanning (OSV & npm audit)
Scan lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `requirements.txt`) against Google's Open Source Vulnerability (OSV) database and GitHub Advisory:
```bash
# Deterministic dependency audit
npm audit

# Production-only audit (excluding local devDependencies)
npm audit --omit=dev
```

### 4. Typosquatting & Maintainer Verification
Before adding a new dependency:
1. Check package age: If a package was published in the last 72 hours with few downloads, treat with extreme suspicion.
2. Verify GitHub repository link matches the verified author organization.
3. Check for unauthenticated HTTP or git specifiers:
   - ❌ `http://registry.insecure.org/pkg.tgz`
   - ❌ `git+http://github.com/...`
   - ✔️ `https://registry.npmjs.org/...`

---

## Agent Operating Rules for Package Security

- **Rule 1:** When adding new packages to a user's project, ALWAYS check `package.json` for suspicious lifecycle hooks before installing.
- **Rule 2:** Always specify exact or caret-pinned versions (e.g. `"^4.18.2"`). Never write `"*"` or `"latest"`.
- **Rule 3:** Never hardcode npm authentication tokens (`_authToken`) or personal access tokens into `.npmrc` or `package.json`. Use environment variables (`NPM_TOKEN`).
- **Rule 4:** If a package reports `CRITICAL` or `HIGH` vulnerabilities, immediately notify the user and propose a secure patched alternative.
