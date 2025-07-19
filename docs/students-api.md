# 📚 Students API Documentation

## Base URL

```
/api/v1/students
```

---

## 🧾 Response Format

All API responses follow a consistent structure:

### Success (Non-paginated)
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```
- `success` (boolean): Always `true` for successful requests
- `data` (object/array): The main response data (may be omitted if not applicable)
- `message` (string, optional): A human-readable message

### Success (Paginated)
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "total_pages": 10,
    "has_more_pages": true,
    "next_page_url": "...",
    "prev_page_url": "..."
  },
  "message": "Optional message"
}
```
- `pagination` (object): Pagination details for paginated endpoints

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... } // Optional: validation or other error details
}
```
- `success` (boolean): Always `false` for errors
- `message` (string): Error message
- `errors` (object, optional): Validation or other error details

---

## 🧑 Student Management

### List Students

**GET** `/api/v1/students`

- **Query Params:**
  - `page` (integer, optional): Page number
  - `limit` (integer, optional): Items per page
  - `status` (string, optional): Filter by status (`active`, `inactive`, `suspended`)
  - `sortBy` (string, optional): Field to sort by
  - `sortOrder` (string, optional): `asc` or `desc`
- **Response:**
  ```json
  {
    "success": true,
    "data": [ ...StudentResource... ],
    "pagination": {
      "total": 1,
      "per_page": 10,
      "current_page": 1,
      "total_pages": 1,
      "has_more_pages": false,
      "next_page_url": null,
      "prev_page_url": null
    }
  }
  ```

### Get Student Details

**GET** `/api/v1/students/{id}`

- **Response:**
  ```json
  {
    "success": true,
    "data": { ...StudentResource... }
  }
  ```

### Update Student

**PUT** `/api/v1/students/{id}`

- **Request Body:**
  (See previous documentation for field explanations)
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...StudentResource... },
    "message": "Student updated successfully."
  }
  ```

---

## 📋 Plan Management

### List All Plans for a Student

**GET** `/api/v1/students/{id}/plans`

- **Response:**
  ```json
  {
    "success": true,
    "data": [ ...PlanResource... ]
  }
  ```

### Get Active Plan

**GET** `/api/v1/students/{id}/plans/active`

- **Response:**
  ```json
  {
    "success": true,
    "data": { ...PlanResource... } // or null if none
  }
  ```

### Create Plan

**POST** `/api/v1/students/{id}/plans`

- **Request Body:**
  (See previous documentation for field explanations)
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...PlanResource... },
    "message": "Plan created and student enrolled."
  }
  ```

### Update Plan

**PUT** `/api/v1/students/plans/{planId}`

- **Request Body:**
  (See previous documentation for field explanations)
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...PlanResource... },
    "message": "Plan updated."
  }
  ```

### Delete Plan

**DELETE** `/api/v1/students/plans/{planId}`

- **Response:**
  ```json
  {
    "success": true,
    "message": "Plan deleted."
  }
  ```

---

## 📈 Tracking Management

### List All Trackings for a Student

**GET** `/api/v1/students/{id}/trackings`

- **Response:**
  ```json
  {
    "success": true,
    "data": [ ...TrackingResource... ]
  }
  ```

### Create Tracking

**POST** `/api/v1/students/plans/{planId}/trackings`

- **Request Body:**
  (See previous documentation for field explanations)
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...TrackingResource... },
    "message": "Tracking created."
  }
  ```

### Update Tracking

**PUT** `/api/v1/students/trackings/{trackingId}`

- **Request Body:**
  (See previous documentation for field explanations)
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...TrackingResource... },
    "message": "Tracking updated."
  }
  ```

### Delete Tracking

**DELETE** `/api/v1/students/trackings/{trackingId}`

- **Response:**
  ```json
  {
    "success": true,
    "message": "Tracking deleted."
  }
  ```

---

## 📝 Tracking Details

### List Tracking Details

**GET** `/api/v1/students/trackings/{trackingId}/details`

- **Response:**
  ```json
  {
    "success": true,
    "data": [ ...TrackingDetailResource... ]
  }
  ```

### Add Tracking Detail

**POST** `/api/v1/students/trackings/{trackingId}/details`

- **Request Body:**
  (See previous documentation for field explanations)
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...TrackingDetailResource... },
    "message": "Tracking detail added."
  }
  ```

### Delete Tracking Detail

**DELETE** `/api/v1/students/tracking-details/{trackingDetailId}`

- **Response:**
  ```json
  {
    "success": true,
    "message": "Tracking detail deleted."
  }
  ```

---

## 📦 Request & Resource Structures

### PlanRequest

```json
{
  "name": "string",
  "description": "string (optional)",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD (optional)",
  "has_review": "boolean",
  "review_unit_id": "integer (optional)",
  "review_amount": "integer (optional)",
  "has_memorization": "boolean",
  "memorization_unit_id": "integer (optional)",
  "memorization_amount": "integer (optional)",
  "has_sard": "boolean",
  "sard_unit_id": "integer (optional)",
  "sard_amount": "integer (optional)",
  "frequency_type_id": "integer",
  "halaqah_id": "integer",
  "enrolled_at": "YYYY-MM-DD (optional)"
}
```

### TrackingRequest

```json
{
  "date": "YYYY-MM-DD",
  "note": "string (optional)",
  "behavior_note": "string (optional)"
}
```

### TrackingDetailRequest

```json
{
  "tracking_type_id": "integer",
  "from_tracking_unit_id": "integer (optional)",
  "to_tracking_unit_id": "integer (optional)",
  "actual_amount": "integer (optional)",
  "comment": "string (optional)",
  "score": "number (optional)"
}
```

---

## 🧩 Resource Output Examples

- **PlanResource**:  
  See `app/Http/Resources/PlanResource.php`
- **TrackingResource**:  
  See `app/Http/Resources/TrackingResource.php`
- **TrackingDetailResource**:  
  See `app/Http/Resources/TrackingDetailResource.php`

---

## 🔒 Authentication

All endpoints require authentication via `auth:sanctum` middleware.

---

## 📝 Notes

- All responses are wrapped in a `success` key and include `data` and/or `message` as appropriate.
- Paginated endpoints include a `pagination` object.
- Validation errors return `422 Unprocessable Entity` with error details in the `errors` key.
- Use the correct HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`). 
