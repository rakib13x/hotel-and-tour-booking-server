# Query Module

This module handles query management for the Gateway Holidays application. It supports three types of queries: Hajj & Umrah, Package Tours, and Group Tickets.

## Features

- **CRUD Operations**: Create, read, update, and delete queries
- **Form Type Support**: Handles different query types with specific fields
- **Status Management**: Track query status (pending, reviewed, contacted, closed)
- **Pagination & Search**: Advanced filtering and pagination for admin panel
- **Statistics**: Comprehensive query statistics for dashboard
- **Validation**: Robust input validation using Zod schemas

## API Endpoints

### Public Endpoints

#### Create Query

```
POST /api/queries/create
```

Creates a new query. Supports all three form types with appropriate validation.

**Request Body Examples:**

**Hajj & Umrah Query:**

```json
{
  "formType": "hajj_umrah",
  "name": "John Doe",
  "email": "john@example.com",
  "contactNumber": "+1234567890",
  "startingDate": "2024-01-01",
  "returnDate": "2024-01-15",
  "airlineTicketCategory": "economy",
  "nightsStayMakkah": 5,
  "nightsStayMadinah": 3,
  "maleAdults": 2,
  "femaleAdults": 1,
  "childs": 0,
  "accommodationType": "3_star",
  "foodsIncluded": true,
  "guideRequired": false,
  "privateTransportation": false
}
```

**Package Tour Query:**

```json
{
  "formType": "package_tour",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "contactNumber": "+1234567890",
  "startingDate": "2024-02-01",
  "returnDate": "2024-02-10",
  "airlineTicketCategory": "business",
  "visitingCountry": "Turkey",
  "visitingCities": "Istanbul, Cappadocia, Antalya",
  "specialRequirements": "Vegetarian meals required"
}
```

**Group Ticket Query:**

```json
{
  "formType": "group_ticket",
  "name": "Travel Group",
  "email": "group@example.com",
  "contactNumber": "+1234567890",
  "startingDate": "2024-03-01",
  "returnDate": "2024-03-15",
  "airlineTicketCategory": "economy",
  "totalPassengers": 25,
  "specialRequirements": "Group booking for corporate event"
}
```

### Admin Endpoints (Require Authentication)

#### Get All Queries

```
GET /api/queries/all?page=1&limit=10&search=john&formType=hajj_umrah&status=pending&sortBy=createdAt&sortOrder=desc
```

#### Get Query Statistics

```
GET /api/queries/stats
```

#### Get Queries by Form Type

```
GET /api/queries/form-type/hajj_umrah?page=1&limit=10
```

#### Get Query by ID

```
GET /api/queries/:id
```

#### Update Query

```
PUT /api/queries/:id
```

```json
{
  "status": "reviewed",
  "name": "Updated Name"
}
```

#### Delete Query

```
DELETE /api/queries/:id
```

## Database Schema

The Query model includes the following fields:

### Common Fields

- `formType`: Type of query (hajj_umrah, package_tour, group_ticket)
- `name`: Customer name
- `email`: Customer email
- `contactNumber`: Customer contact number
- `startingDate`: Travel start date
- `returnDate`: Travel return date
- `airlineTicketCategory`: Ticket class (economy, business, first_class)
- `specialRequirements`: Additional requirements
- `status`: Query status (pending, reviewed, contacted, closed)

### Hajj & Umrah Specific Fields

- `nightsStayMakkah`: Number of nights in Makkah
- `nightsStayMadinah`: Number of nights in Madinah
- `maleAdults`: Number of male adults
- `femaleAdults`: Number of female adults
- `childs`: Number of children
- `accommodationType`: Hotel star rating (2_star, 3_star, 4_star, 5_star)
- `foodsIncluded`: Whether meals are included
- `guideRequired`: Whether guide is required
- `privateTransportation`: Whether private transportation is needed

### Package Tour Specific Fields

- `visitingCountry`: Country to visit
- `visitingCities`: Cities to visit

### Group Ticket Specific Fields

- `totalPassengers`: Total number of passengers

## Validation Rules

### Required Fields

- All queries require: `formType`, `name`, `email`, `contactNumber`, `startingDate`, `returnDate`, `airlineTicketCategory`
- Hajj & Umrah queries additionally require: `nightsStayMakkah`, `nightsStayMadinah`, `maleAdults`, `femaleAdults`, `childs`
- Group Ticket queries additionally require: `totalPassengers`

### Validation Rules

- Email must be valid format
- Return date must be after starting date
- Numeric fields must be non-negative integers
- String fields have length limits (name: 100 chars, email: standard, etc.)

## Testing

The module includes comprehensive tests:

### Unit Tests (`query.service.test.ts`)

- Tests all service methods
- Mocks database operations
- Tests error handling scenarios
- Validates business logic

### Integration Tests (`query.routes.test.ts`)

- Tests API endpoints
- Tests authentication and authorization
- Tests request/response handling
- Tests validation middleware

### Running Tests

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- query.service.test.ts
```

## Error Handling

The module includes comprehensive error handling:

- **Validation Errors**: Returns 400 with detailed validation messages
- **Not Found**: Returns 404 for non-existent queries
- **Authentication**: Returns 401 for unauthorized access
- **Authorization**: Returns 403 for insufficient permissions
- **Server Errors**: Returns 500 with generic error messages

## Performance Considerations

- Database indexes on frequently queried fields (`createdAt`, `status`, `formType`, `email`)
- Pagination to limit result sets
- Efficient aggregation queries for statistics
- Proper error handling to prevent information leakage

## Security Features

- Input validation and sanitization
- Authentication required for admin operations
- Authorization checks for admin-only endpoints
- SQL injection prevention through Mongoose
- XSS protection through input validation

## Future Enhancements

- Email notifications for query status changes
- File upload support for additional documents
- Advanced search with multiple criteria
- Query assignment to specific staff members
- Automated status updates based on business rules
