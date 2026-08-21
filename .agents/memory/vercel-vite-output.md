---
name: Vercel Vite output
description: Deployment output conventions for this workspace's Vite artifact.
---

Vercel should build the web artifact from the workspace root and publish the artifact's Vite output directory directly; copying from a guessed public folder can fail after a successful build.

**Why:** The imported deployment configuration assumed a `public` directory at the wrong level, while Vite emitted the built files under the artifact directory.

**How to apply:** Keep Vite build output and Vercel `outputDirectory` aligned, and provide build-time defaults for environment variables that Replit workflows normally inject.