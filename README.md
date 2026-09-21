# Portfolio de Lucas Chavanne

Site portfolio personnel : présentation, projets, stack technique et parcours.

Technicien ES en informatique (CFPT Genève), étudiant à la HEG Genève.
Administration système, virtualisation Proxmox, IoT sur Raspberry Pi et Pico 2W,
pipelines de données InfluxDB / Telegraf / Grafana.

## Technique

- Un seul fichier `index.html` : HTML, CSS et JavaScript sans framework ni build
- Navigation en pages via le hash de l'URL (`#/projets`, `#/stack`, `#/parcours`)
- Thème clair / sombre, responsive (testé de 320 px à 1280 px), respect de `prefers-reduced-motion`
- Barre de défilement personnalisée, qui suit le thème (framboise au survol)
- Splash d'ouverture affiché une fois par session, ignorable au clic ou à une touche, absent si le mouvement réduit est demandé
- Le hero tient dans le premier écran (`100svh`) : sur grand écran le schéma s'adapte à la hauteur disponible, sur petit écran le texte remplit le premier écran et le schéma vient dessous
- Le schéma de l'accueil change de disposition (large ou verticale) selon la place disponible
- Page Stack : logos des technologies dans `assets/logos/` (voir Crédits), barre de filtres collée sous la navigation pendant tout le défilement
- Déployé sur Vercel, redéploiement automatique à chaque push sur `main`

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

puis aller sur http://localhost:8000

## Contact

lucas.chavanne.info@gmail.com

## Crédits

Les logos de la page Stack (`assets/logos/`) viennent de plusieurs sources libres. Les marques et logos appartiennent à leurs propriétaires respectifs.

- [Simple Icons](https://simpleicons.org) v16.32.0 (CC0) : la majorité des logos (Proxmox, Debian, GitLab, Grafana, Python, React…)
- [Logos de gilbarbara](https://github.com/gilbarbara/logos), via Iconify (CC0) : C# et Windows
- [Dashboard Icons](https://github.com/homarr-labs/dashboard-icons) (Apache-2.0) : Telegraf et Samba
- [Material Design Icons](https://pictogrammers.com/library/mdi/) (Apache-2.0) : pictogrammes pour les notions sans logo officiel (SSH, UFW, Fail2Ban, LVM et RAID, réseau, mises à jour OTA)
