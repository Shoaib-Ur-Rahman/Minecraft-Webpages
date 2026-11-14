# Minecraft-Webpages

A static GitHub Pages website for browsing Minecraft downloads.

## Uploading files

Downloadable files are stored in the separate `Shoaib-Ur-Rahman/Minecraft_Files` repository, in category folders: `schematics/`, `resource-packs/`, `shaderpacks/`, `xaero-maps/`, and `modpacks/`. The public collection pages read those folders through the GitHub contents API and link to each file directly. No Releases are used.

The Settings page is `admin.html`; it is intentionally not linked from the public homepage and uses `noindex`. This only makes it less discoverable, not private. GitHub account permissions control who can upload to the files repository. Never put passwords or access tokens in this public website.
