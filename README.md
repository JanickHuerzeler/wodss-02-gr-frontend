# WODSS Gruppe 02 Frontend

Frontend für den Workshop in der Vertiefung "Distributed Software Systems" (WODSS).

---

## Prerequisites

TODO

- Node 14

## Setup

```ZSH/CMD
cd corona-navigator
npm install
```

## Dev-Environment starten

```ZSH/CMD
cd corona-navigator
npm start
```

---

## Tests

TODO

---

## Swagger Client für Backend

Da das [Backend](https://github.com/JanickHuerzeler/wodss-02-gr-backend) mit Swagger dokumentiert ist, kann der dazugehörige Client einfach generiert werden.

Mit folgendem Befehl werden die Model-Klassen und API-Aufrufe bei gestartetem Backend (localhost) automatisch generiert:

```CMD/ZSH
cd corona-navigator
npm run openapigen
```

---

## Common Pitfalls

Apple's neuer M1 ARM-Prozessor wird von einigen hier verwendeten Komponenten noch nicht vollständig unterstützt (z.B. Node nur v16+, node-sass noch gar nicht, etc.). Dies kann zu einem speziellen Verhalten beim Installieren oder Builden führen.

Mit der folgenden Konfiguration konnte die Applikation schlussendlich auf einem Apple Macbook Pro M1 erfolgreich gestartet werden:

- Node: v14.16.1
- Terminal: Terminal mit Rosetta 2 (siehe [dev.to post](https://dev.to/courier/tips-and-tricks-to-setup-your-apple-m1-for-development-547g))
- Angepasster `npm start` Befehl:

```ZSH
env FAST_REFRESH=false npm start
```

---

## Live Environment

Server wird gemäss Kantonsservice-[README.md](https://github.com/JanickHuerzeler/wodss-02-gr-canton-service#readme) bereits zur Verfügung gestellt.

---

Folgende Übersicht zeigt die wichtigsten URL und Pfade auf dem Live-Server

#### **URLs** `corona-navigator.ch`

#### **HTTP root** `/var/www/html/corona-navigator/`

---

### Step 1 - Setup Nginx

Die Ports 80 und 443 müssen auf der VM offen sein. SWITCHEngine: https://bit.ly/3fN5UD0
Danach einen vhost in nginx mit folgender Konfiguration erstellen:

```ZSH / CMD
export DOMAIN=corona-navigator.ch

sudo tee /etc/nginx/sites-available/$DOMAIN <<EOF
server {
  listen 80;
  listen [::]:80;
  server_name localhost $DOMAIN www.$DOMAIN;

  root /var/www/html;
  index index.html index.htm;

  location / {
    try_files $uri $uri/ =404;
  }
}
EOF

sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
sudo systemctl enable nginx
```

### Step 2 - Setup SSL

```ZSH / CMD
# Ensure that the version of snapd is up to date
sudo snap install core; sudo snap refresh core

# Install Certbot
sudo snap install --classic certbot

# Prepare the Certbot command
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Confirm plugin containment level
sudo snap set certbot trust-plugin-with-root=ok

# Create Certificate
sudo certbot run -a manual -i nginx -d corona-navigator.ch -d www.corona-navigator.ch
```

### Step 3 - Continuous Integration

Das automatisierte Build und Deployment ist für das Frontend-Projekt mit Hilfe von 'Github Actions' realisiert. Github Actions sind mit CI/CD Pipelines wie sie Jenkins bieten zu vergleichen.

Im Ordner `.github/workflows/` im Git Repo ist die Konfiguration der Actions in der Datei `deploy_to_server.yml`.
Die Actions wird ausfeführt sobald ein Push oder Pull Request auf dem `master` Branch des Repos verarbeitet wird.
In der Pipeline wird die React-App gebuildet und danach per SSH auf den Live Server verschoben.

```yaml
name: Deploy to switch engine

# Controls when the action will run.
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [master]
  pull_request:
    branches: [master]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build_and_deploy:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./corona-navigator

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "14"

      - name: Install NPM Packages
        run: npm install

      - name: build react app
        run: npm run build
        env:
          CI: "" # ignore warnings

      - name: ssh deploy
        uses: easingthemes/ssh-deploy@v2
        with:
          # Private Key
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          # Remote host
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          # Remote user
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          # Remote port
          # REMOTE_PORT: # optional, default is 22
          # Source directory
          SOURCE: "corona-navigator/build/"
          # Target directory
          TARGET: "/var/www/html/corona-navigator/" # optional, default is /home/REMOTE_USER/
          # Arguments to pass to rsync
          # ARGS: # optional, default is -rltgoDzvO
          # An array of folder to exclude
          EXCLUDE: "/dist/, /node_modules/" # optional, default is
      - name: Success Message
        run: |
          echo "=========Success========="
          echo "Build and deployment run successfuly"
          echo "========Tschüssli========"
```
