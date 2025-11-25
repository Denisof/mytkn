# DLos Token Backend

A Node.js backend API for DLos Token project.

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure your environment variables.

### Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Project Structure

```
js-be/
├─ package.json
├─ .env
├─ README.md
├─ Dockerfile
├─ docker-compose.yml
├─ public/
│  ├─ assets/
├─ logs/
├─ tests/
├─ src/
│  ├─ index.js           # app entry
│  ├─ app.js             # express app setup
│  ├─ bootstrap/
│  │  ├─ config.js       # environment config
│  │  └─ db.js           # DB init
│  ├─ routes/
│  │  └─ v1/
│  ├─ controllers/
│  ├─ models/
│  ├─ services/
│  ├─ middleware/
│  ├─ utils/
│  └─ validators/
└─ scripts/
   └─ migration/
```

## API Endpoints

### Events
- `GET /api/v1/poposals` - Get all proposals
- `GET /api/v1/poposals/:proposalId` - Get proposal by ID
- 

## Features

## License

ISC

