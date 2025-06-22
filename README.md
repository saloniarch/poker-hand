# Poker Hand Game App

En fullstack-applikasjon for å simulere utdeling av pokerhender, analysere dem og finne vinneren. Brukeren kan få tildelt poker-hender, se analyse , sammenligne og vise historikk.

## Teknologier brukt

- **Frontend**: React + Vite
- **Backend**: Express.js (Node.js)
- **Database**: SQLite
- **Styling**: CSS

---

## Kjøring med Docker

### 1. Start hele applikasjonen med Docker Compose

```bash
docker-compose up --build --no-cache
docker compose up
```

Kjører på http://localhost:3001

### 2. Stoppe containerne

```bash
docker-compose down
```

## Kjøring uten Docker

### 1. Klon prosjektet

```bash
git clone https://github.com/saloniarch/poker-hand.git
cd poker-hand
```

### 2. Installer avhengigheter

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Start applikasjonen

I to terminaler:

#### Backend

```bash
cd server
npm start
```

#### Frontend

```bash
cd client
npm run dev
```

Applikasjonen kjører vanligvis på:  
Frontend → http://localhost:5173  
Backend → http://localhost:3001

---

## Funksjoner

- Dele ny hånd fra kortstokken
- Analysere hånden (f.eks. "Flush", "Straight"...)
- Sammenligne hender og finne vinneren
- Se de 10 siste hendene
- Nullstill spillet (tilbakestill kortstokken og historikken)
- Se antall gjenværende kort i kortstokken

---

## API-endepunkter

### `GET /api/hand/new`

Deler ut en ny hånd og analyserer den.  
**Respons:**

```json
{ "hand": ["AS", "KH", ...], "analysis": { "label": "Pair", "rank": 2 }, "id": 1 }
```

---

### `GET /api/history`

Henter de 10 siste hendene.  
**Respons:**

```json
[
  {
    "id": 1,
    "hand": ["AS", "KH", ...],
    "analysis": { "label": "Pair", "rank": 2 },
    "timestamp": "2025-06-21T12:34:56Z"
  }
]
```

---

### `POST /api/compare`

Tar inn et sett med hender og returnerer vinner.  
**Body:**

```json
{
  "hands": [
    { "hand": ["AS", "KH", ...], "rank": 2, "analysis": "Pair" },
    { "hand": ["2C", "3D", ...], "rank": 5, "analysis": "Straight" }
  ]
}
```

**Respons:**

```json
{
  "winner": { "hand": [...], "rank": 2, "analysis": "Pair" },
  "winners": [...],
  "isTie": false
}
```

---

### `POST /deck/reset`

Nullstiller kortstokken og sletter historikken.  
**Respons:**

```json
{ "message": "Game reset", "cards": [...] }
```

---

### `GET /deck`

Returnerer kortene som fortsatt er i kortstokken.  
**Respons:**

```json
[
  { "id": 1, "card": "AS" },
  { "id": 2, "card": "2H" },
  ...
]
```

---

## Videre forbedringer

- Bedre logikk for stokke kort
- Utforske multiplayer
- Få kortene til å ligne mer på kort i virkeligheten
- Mindre komponenter
- Bruk av context

---
