# 1C Database Name Generator

## About the Project

**1C Database Name Generator** is an educational project developed during an industrial internship at **RT-Inform LLC**.

The project automates the generation of database names according to predefined naming rules. A web application developed with **React** interacts with the **1C:Enterprise** platform through HTTP services, exchanges data in JSON format, and receives a generated database name.

---

## Project Features

- Loading reference data from 1C:Enterprise
- Selecting database configuration
- Selecting region
- Selecting business direction
- Selecting usage purpose
- Input validation for the user's surname
- Date selection
- Automatic database name generation
- Sending POST requests to 1C
- Receiving and displaying the generated database name
- Copying the generated database name

---

## Technologies

### Backend

- 1C:Enterprise 8
- HTTP Services
- JSON

### Frontend

- React
- JavaScript
- HTML
- CSS

### Tools

- Visual Studio Code
- Postman
- Git
- GitHub
- Node.js

---

## Project Structure

```
1-_Database_Name_Generator
│
├── ReactClient
│   ├── src
│   ├── public
│   ├── package.json
│   └── ...
│
├── OneC
│   ├── HTTPService_GET.bsl
│   ├── HTTPService_POST.bsl
│   ├── JSONFunctions.bsl
│   └── NameGenerator.bsl
│
├── README.md
└── .gitignore
```

---

## How It Works

1. The client application requests reference data from 1C.
2. The user selects:
   - Configuration
   - Region
   - Business direction
   - Usage purpose
3. The user enters a surname.
4. The user selects a date.
5. React sends a POST request to the 1C HTTP service.
6. 1C processes the received JSON data.
7. A database name is generated.
8. The generated name is returned to the client.

Example:

```
BUH_SPB_RMAT_AUD_Kirupina_20260625
```

---

## Validation

The application validates:

- required fields;
- English letters only in the surname;
- maximum surname length;
- mandatory selection of all drop-down lists;
- date selection before sending the request.

---

## API

### GET

```
/InfoBase1/hs/ibg/lc
```

Returns lists of available values.

### POST

```
/InfoBase1/hs/ibg/gen
```

Accepts JSON:

```json
[
  {
    "configuration": "BUH"
  },
  {
    "region": "SPB"
  },
  {
    "business": "RMAT"
  },
  {
    "goal": "AUD"
  },
  {
    "fio": "Kirupina"
  },
  {
    "date": "20260625"
  }
]
```

Returns

```json
{
  "result": "BUH_SPB_RMAT_AUD_Kirupina_20260625"
}
```

---

## Author

Sasha Kirupina

Industrial Internship

RT-Inform LLC

2026
