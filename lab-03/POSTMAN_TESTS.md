# Lab 3 - Postman Test List

Base URL: `http://localhost:3000`

In Postman, select the HTTP method, enter the URL, and for POST/PUT choose **Body → raw → JSON**. Check both the status code and JSON response.

| # | Method | URL / Body | Expected |
|---|---|---|---|
| 1 | GET | `/` | 200, API running message |
| 2 | GET | `/books` | 200, list of books |
| 3 | GET | `/books?search_q=atom` | 200, title containing atom |
| 4 | GET | `/books?order_by=price&order=DESC` | 200, highest price first |
| 5 | GET | `/books?limit=2&offset=0` | 200, at most two books |
| 6 | GET | `/books?min_price=300&max_price=500` | 200, prices from 300 through 500 |
| 7 | GET | `/books?search_q=the&order_by=title&order=ASC&limit=5&offset=0&min_price=200&max_price=600` | 200, combined filters |
| 8 | GET | `/books/1` | 200, one book |
| 9 | POST | Valid body below | 201, created book |
| 10 | POST | `{ "author": "Test Author", "price": 100 }` | 400, title validation message |
| 11 | POST | `{ "title": "Test", "author": "Test Author", "price": "abc" }` | 400, price validation message |
| 12 | PUT | `/books/1` with valid body | 200, updated book |
| 13 | PUT | `/books/99999` with valid body | 404, book not found |
| 14 | DELETE | `/books/99999` | 404, book not found |
| 15 | GET | `/books/99999` | 404, book not found |
| 16 | GET | `/books?order_by=password` | 400, invalid sort column |
| 17 | GET | `/books?order=SIDEWAYS` | 400, invalid order |
| 18 | GET | `/books?limit=abc` | 400, invalid limit |
| 19 | GET | `/books?min_price=700&max_price=100` | 400, minimum greater than maximum |
| 20 | DELETE | `/books/created-id` | 200, deleted successfully |
| 21 | GET | `/unknown` | 404, endpoint not found |

## Valid POST/PUT JSON body
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "pages": 450
}
```

For test 20, replace `created-id` with the ID returned by test 9. Run DELETE only after completing the other tests that need that record.

## Suggested order
1. Run tests 1–8.
2. Run test 9 and note the created book ID.
3. Run validation tests 10–11.
4. Run update tests 12–13.
5. Run not-found and invalid-query tests 14–19.
6. Delete the created record using its actual ID, then test the unknown endpoint.

Take screenshots of representative success and failure responses. Keep the screenshots in the `screenshots/` folder and embed them in `README.md`.
