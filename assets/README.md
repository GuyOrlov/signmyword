# SignMyWord alphabet assets

This directory is populated by the GitHub Actions workflow at `.github/workflows/signmyword-assets.yml`.

## Production files

- `bsl/A.svg` through `bsl/Z.svg` are local copies of Wikimedia Commons files named `BSL_letter_A.svg` through `BSL_letter_Z.svg`.
- `asl/A.svg` through `asl/Z.svg` are local copies of Wikimedia Commons files named `Sign_language_A.svg` through `Sign_language_Z.svg`.
- The app loads these local copies first and falls back to Wikimedia Commons only if a local asset is unavailable.
- The workflow runs monthly and can also be run manually.

## Source and licence

### BSL

Source pattern:
`https://commons.wikimedia.org/wiki/File:BSL_letter_A.svg`

The BSL artwork is credited on Wikimedia Commons to **Coloringbuddymike** and is licensed under **Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)**.

Licence:
`https://creativecommons.org/licenses/by-sa/3.0/`

SignMyWord may resize/crop the artwork for presentation. Keep attribution, the licence link, and a note that presentation changes may be made.

### ASL

Source pattern:
`https://commons.wikimedia.org/wiki/File:Sign_language_A.svg`

The checked ASL alphabet files credit **wpclipart.com** and are released into the **public domain**.

Always retain the per-letter Wikimedia source link in the UI so file-specific source and licence information remains available.
