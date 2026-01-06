# GitHub Workflows

## Sync morphing-toc to Public Repository

The `sync-morphing-toc.yml` workflow automatically syncs the `open-source/morphing-toc/` folder to the public [antoinepirard/morphing-toc](https://github.com/antoinepirard/morphing-toc) repository whenever changes are pushed to `main`.

### Setup Instructions

#### 1. Create the Public Repository

Create a new **public** repository on GitHub: `antoinepirard/morphing-toc`

- Leave it empty (no README, .gitignore, or license)
- The subtree push will populate it

#### 2. Generate a Deploy Key

```bash
# Generate a new SSH key pair (no passphrase)
ssh-keygen -t ed25519 -C "morphing-toc-deploy" -f ~/.ssh/morphing-toc-deploy

# Copy the public key
cat ~/.ssh/morphing-toc-deploy.pub
```

Add the **public key** to the `antoinepirard/morphing-toc` repository:
- Go to Settings → Deploy keys → Add deploy key
- Title: `folio-sync`
- Key: paste the public key
- Check "Allow write access"

#### 3. Add the Secret to This Repository

Copy the **private key**:

```bash
cat ~/.ssh/morphing-toc-deploy
```

Add it to the `folio` repository:
- Go to Settings → Secrets and variables → Actions → New repository secret
- Name: `MORPHING_TOC_DEPLOY_KEY`
- Value: paste the entire private key (including `-----BEGIN/END-----` lines)

#### 4. Initial Push (One-time)

Run these commands locally to do the first sync:

```bash
# Add the public repo as a remote
git remote add morphing-toc-public git@github.com:antoinepirard/morphing-toc.git

# Split and push for the first time
git subtree push --prefix=open-source/morphing-toc morphing-toc-public main
```

This preserves the commit history for files in that folder.

### How It Works

1. When you push changes to `main` that modify files in `open-source/morphing-toc/**`
2. The workflow uses `git subtree split` to extract just that folder with its history
3. It pushes the result to the public `morphing-toc` repo's `main` branch

The public repo will contain the package at root level, ready for npm publishing.

