# Minecraft-Webpages

A static GitHub Pages website for browsing Minecraft downloads.

## Publishing downloads

The public collection pages read files attached to public GitHub Releases. Create a release, attach assets such as `.litematic`, `.schem`, resource pack, shaderpack, or modpack files, and publish it. Put a category name such as `Schematics`, `Resource Packs`, `Shaderpacks`, `Xaero Maps`, or `Modpacks` in the release title/tag so files can be categorized.

## Settings and security

The Settings link opens `admin.html`, which explains how to publish releases. GitHub Pages is static hosting; it cannot securely authenticate an admin or upload files on its own. A real private upload dashboard requires a backend/authentication service. Never put GitHub tokens, credentials, or real passwords in frontend code.
