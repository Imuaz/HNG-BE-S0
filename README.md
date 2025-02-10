# HNG12 Backend

## Stage 1

### Description

***Number Classification API*** takes a number and returns interesting mathematical properties about it, along with a fun fact.

### Setup Instructions
1. Clone the repository and `cd` into it:
    ```
    git clone https://github.com/Imuaz/hngbackend.git
    
    cd hngbackend
    ```
2. Create and activate a virtual environment:
    ```
     python3 -m venv .venv # on Windows: python -m venv .venv

    source .venv/bin/activate #on Windows: .\.venv\Scripts\activate
    ```
3. Install the project dependencies
   ```
   pip3 install -r requirements.txt # use 'pip ..' on Windows
   ```

4. Start the development server:
   ```
   python3 manage.py runserver # 'python' on Windows
   ```

### API Do

### API Documentation
**Endpoint**
    - **GET /api/classify-number?number=371**

**Request**
- Query parameter: `number` (integer)

**Response** (200 OK)
```json
{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["armstrong", "odd"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

**Response (400 Bad Request)**
```json
{
  "number": "alphabet",
  "error": true
}
```
