# Green Damage Report

Digitalt værktøj til indberetning af bilskader for GreenMobility. Systemet guider brugeren trin-for-trin gennem identifikation af bil, interaktiv skadesmarkering og fotodokumentation.

## 🛠 Funktionalitet

- **Bil-identifikation:** Henter renter/bruger-data automatisk (Wunderfleet integration).
- **Interaktiv skadesoversigt:** Præcis markering af skader på bil-plantegninger (f.eks. Renault Zoe, Renault Kangoo).
- **Dokumentation:** Billed-upload af skader samt indtastning af information på modpart og vidner.
- **PDF Generering:** Automatisk generering af skadesrapport i PDF-format.
- **Admin Dashboard:** Administration, sletning, søgning og eksport af indsendte rapporter.

## 💻 Teknologier

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend & Database:** Firebase (Firestore, Storage, Auth), Next.js API Routes
- **Validering:** Zod schemas
- **Integrationer:** Wunderfleet API, Mapbox/Geocoding

## 🚀 Kom i gang (Lokal udvikling)

1. **Klon repoet og installér dependencies:**
   ```bash
   npm install
   ```

2. **Opsætning af miljøvariable:**
   Opret en `.env.local` fil i roden af projektet. Den skal indeholde dine Firebase credentials, kort-API nøgler (Mapbox/Google) og Wunderfleet API nøgler.

3. **Start udviklingsserveren:**
   ```bash
   npm run dev
   ```
   Åbn [http://localhost:3000](http://localhost:3000) i din browser.

## 🏗 Projektstruktur

- `/src/pages/api`: Backend API-routes (Wunderfleet, Firebase auth, PDF-generering, e-mail afsendelse).
- `/src/pages/damagereport`: Siderne til selve indberetningsflowet (`/what`, `/where`, `/how`, osv.).
- `/src/components`: Genbrugelige UI-komponenter, formularer og kort-addons.
- `/src/components/carDrawings`: Logik og UI for interaktive bil-tegninger.
- `/src/utils/logic`: Kerne-logik for Firebase-interaktion, PDF-bygger og Wunderfleet-kald.
- `/src/utils/schemas`: schemas til validering af formularer og API-requests for at sikre dataintegritet.
