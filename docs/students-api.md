# 📚 Students API Documentation

## Base URL

```
/api/v1/students
```

---

## 🧑 Student Management

### List Students

**GET** `/api/v1/students`

- **Description:** List all students (paginated).
- **Query Params:** Supports filters, sorting, and pagination.
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": [ ...StudentResource... ],
    "meta": { ... }
  }
  ```

### Get Student Details

**GET** `/api/v1/students/{id}`

- **Description:** Get details for a specific student.
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": { ...StudentResource... }
  }
  ```

### Update Student

**PUT** `/api/v1/students/{id}`

- **Description:** Update a student’s information.
- **Body:**  
  See `UpdateStudentRequest`
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": { ...StudentResource... }
  }
  ```

---

## 📋 Plan Management

### List All Plans for a Student

**GET** `/api/v1/students/{id}/plans`

- **Description:** Get all plans for a student.
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": [ ...PlanResource... ]
  }
  ```

### Get Active Plan

**GET** `/api/v1/students/{id}/plans/active`

- **Description:** Get the most recent (active) plan for a student.
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": { ...PlanResource... } // or null if none
  }
  ```

### Create Plan

**POST** `/api/v1/students/{id}/plans`

- **Description:** Create a new plan and enroll the student.
- **Body:**  
  See `PlanRequest`
- **Response:**  
  `201 Created`  
  ```json
  {
    "data": { ...PlanResource... }
  }
  ```

### Update Plan

**PUT** `/api/v1/students/plans/{planId}`

- **Description:** Update an existing plan.
- **Body:**  
  See `PlanRequest`
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": { ...PlanResource... }
  }
  ```

### Delete Plan

**DELETE** `/api/v1/students/plans/{planId}`

- **Description:** Delete a plan.
- **Response:**  
  `200 OK`  
  ```json
  {
    "message": "Plan deleted."
  }
  ```

---

## 📈 Tracking Management

### List All Trackings for a Student

**GET** `/api/v1/students/{id}/trackings`

- **Description:** Get all tracking records for all of a student's plans.
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": [ ...TrackingResource... ]
  }
  ```

### Create Tracking

**POST** `/api/v1/students/plans/{planId}/trackings`

- **Description:** Create a tracking for a plan.
- **Body:**  
  See `TrackingRequest`
- **Response:**  
  `201 Created`  
  ```json
  {
    "data": { ...TrackingResource... }
  }
  ```

### Update Tracking

**PUT** `/api/v1/students/trackings/{trackingId}`

- **Description:** Update a tracking.
- **Body:**  
  See `TrackingRequest`
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": { ...TrackingResource... }
  }
  ```

### Delete Tracking

**DELETE** `/api/v1/students/trackings/{trackingId}`

- **Description:** Delete a tracking.
- **Response:**  
  `200 OK`  
  ```json
  {
    "message": "Tracking deleted."
  }
  ```

---

## 📝 Tracking Details

### List Tracking Details

**GET** `/api/v1/students/trackings/{trackingId}/details`

- **Description:** Get all tracking details for a tracking.
- **Response:**  
  `200 OK`  
  ```json
  {
    "data": [ ...TrackingDetailResource... ]
  }
  ```

### Add Tracking Detail

**POST** `/api/v1/students/trackings/{trackingId}/details`

- **Description:** Add a tracking detail to a tracking.
- **Body:**  
  See `TrackingDetailRequest`
- **Response:**  
  `201 Created`  
  ```json
  {
    "data": { ...TrackingDetailResource... }
  }
  ```

### Delete Tracking Detail

**DELETE** `/api/v1/students/tracking-details/{trackingDetailId}`

- **Description:** Delete a tracking detail.
- **Response:**  
  `200 OK`  
  ```json
  {
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

- All responses are wrapped in a `data` key.
- Validation errors return `422 Unprocessable Entity` with error details.
- Use the correct HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`). 
