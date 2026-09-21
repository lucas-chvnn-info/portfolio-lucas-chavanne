# Portfolio de Lucas Chavanne

Site portfolio personnel : présentation, projets, stack technique et parcours.

Technicien ES en informatique (CFPT Genève), étudiant à la HEG Genève.
Administration système, virtualisation Proxmox, IoT sur Raspberry Pi et Pico 2W,
pipelines de données InfluxDB / Telegraf / Grafana.

## Technique

- Un seul fichier `index.html` : HTML, CSS et JavaScript sans framework ni build
- Navigation en pages via le hash de l'URL (`#/projets`, `#/stack`, `#/parcours`)
- Thème clair / sombre, responsive, respect de `prefers-reduced-motion`
- Déployé sur Vercel, redéploiement automatique à chaque push sur `main`

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

puis aller sur http://localhost:8000

## Contact

lucas.chavanne.info@gmail.com
