# Reviews System - Implementation Guide

## Overview
A fully functional, production-ready reviews system has been added to the application. Users can write, edit, and delete reviews for products, with star ratings, helpful voting, and moderation support.

## Features

### User Features
- ⭐ **Star Ratings** (1-5 stars) - Clear visual feedback with descriptive labels
- ✍️ **Review Writing** - Structured form with title and detailed content
- 📝 **Edit Reviews** - Users can update their own reviews anytime
- 🗑️ **Delete Reviews** - Users can remove their reviews
- 👍 **Helpful Voting** - Other users can mark reviews as helpful
- 🔐 **Verified Purchase Badge** - Support for marking verified purchases

### Admin Features
- 📊 **Review Moderation** - Reviews can be set to pending/approved/rejected status
- 📈 **Rating Statistics** - Automatic calculation of average ratings and distribution
- 🔍 **Sort Options** - Sort by recent, most helpful, or rating (high/low)

## Technical Architecture

### Database (Firestore)
**Collection: `Review`**

```json
{
  "productId": "string",           // Reference to product
  "userId": "string",              // User who wrote the review
  "userEmail": "string",           // User email
  "userName": "string",            // Display name
  "rating": 1-5,                   // Star rating
  "title": "string",               // Review title (5-100 chars)
  "content": "string",             // Review body (10-2000 chars)
  "verified": "boolean",           // Verified purchase flag
  "helpful": "number",             // Count of helpful votes
  "createdAt": "ISO string",       // Creation timestamp
  "updatedAt": "ISO string",       // Last update timestamp
  "status": "pending|approved|rejected" // Moderation status
}
```

### API Endpoints

All endpoints are protected where indicated. Base path: `/api/reviews`

#### Get Reviews for Product
```
GET /reviews/product/:productId?sortBy=recent&limit=100
```
- `sortBy`: recent | helpful | rating-high | rating-low (default: recent)
- `limit`: Number of reviews to return (default: 100)
- Returns: { reviews: [], stats: { totalReviews, averageRating, ratingDistribution } }

#### Get Single Review
```
GET /reviews/:reviewId
```
- Returns: Review object

#### Create Review (Protected)
```
POST /reviews
Authorization: Bearer {token}

Body: {
  "productId": "string",
  "rating": 1-5,
  "title": "string",
  "content": "string"
}
```
- Validates: User hasn't already reviewed this product
- Auto-sets: userId, userEmail, createdAt, status=approved
- Returns: Created review with ID

#### Update Review (Protected - Owner Only)
```
PUT /reviews/:reviewId
Authorization: Bearer {token}

Body: {
  "rating": 1-5,        // Optional
  "title": "string",    // Optional
  "content": "string"   // Optional
}
```
- Only the review creator can update their review
- Updates: Only provided fields + updatedAt
- Returns: Updated review

#### Delete Review (Protected - Owner Only)
```
DELETE /reviews/:reviewId
Authorization: Bearer {token}
```
- Only the review creator can delete their review
- Returns: { ok: true }

#### Mark as Helpful
```
POST /reviews/:reviewId/helpful
```
- No authentication required (anonymous helpful votes allowed)
- Increments the helpful count
- Returns: { ok: true, helpful: number }

## Frontend Components

### `ReviewForm.jsx`
**Props:**
- `onSubmit(reviewData)` - Callback when form submitted
- `isLoading` - Loading state during submission
- `onCancel()` - Cancel callback
- `editingReview` - Review object if editing

**Features:**
- Visual star rating selector
- Character count for title (5-100) and content (10-2000)
- Real-time validation with helpful error messages
- Accessible form with keyboard navigation

### `ReviewCard.jsx`
**Props:**
- `review` - Review object
- `onDelete(reviewId)` - Delete callback
- `onEdit()` - Edit button callback
- `onMarkHelpful(reviewId)` - Helpful button callback
- `isOwnReview` - Boolean if current user owns review
- `isEditMode` - Whether card is in edit mode
- `onEditStart()` - Start editing
- `onEditCancel()` - Cancel editing

**Features:**
- Star rating display
- User info and timestamp
- Edit/Delete buttons for own reviews
- Helpful counter
- Verified purchase badge
- Smooth animations with Framer Motion

### `Reviews.jsx` (Main Component)
**Props:**
- `productId` - Product ID
- `isAuthenticated` - User auth state
- `currentUserId` - Current user's ID
- `onLoginRequired()` - Callback when login needed

**Features:**
- Displays all approved reviews for a product
- Shows rating statistics and distribution
- Sort options (recent, helpful, high/low rating)
- Lazy loads reviews with "Load More" button
- Empty state messaging
- Loading and error states
- Inline editing of own reviews
- Integration with useReviews hook

### `useReviews.js` Hook
**Return Object:**
```javascript
{
  reviews: [],           // Array of review objects
  stats: {},             // Stats object
  loading: boolean,      // Loading state
  error: string,         // Error message
  sortBy: string,        // Current sort
  fetchReviews(sort),    // Fetch reviews
  createReview(data),    // Create new review
  updateReview(id, data), // Update existing
  deleteReview(id),      // Delete review
  markHelpful(id),       // Mark as helpful
  setSortBy(sort)        // Change sort
}
```

## Integration in ProductDetail

The Reviews component is integrated into the ProductDetail page:

```jsx
<Reviews 
  productId={productId}
  isAuthenticated={isAuthenticated}
  currentUserId={authContext?.user?.id}
  onLoginRequired={handleLoginRequired}
/>
```

The component appears after the product info and related products section.

## Security Features

1. **Authentication** - Review creation/editing/deletion requires valid JWT token
2. **Authorization** - Users can only edit/delete their own reviews
3. **Input Validation** - Strict length and format validation
4. **Duplicate Prevention** - Users can't write multiple reviews for same product
5. **Moderation Support** - Reviews can be set to pending for manual approval

## Customization Options

### Enable Auto-Moderation
In `server/routes/reviews.js`, change line 91 from:
```javascript
status: 'approved' // Auto-approve for now
```
To:
```javascript
status: 'pending' // Requires admin approval
```

### Change Character Limits
Edit these values in `ReviewForm.jsx`:
- Title: `maxLength={100}` (currently 5-100)
- Content: `maxLength={2000}` (currently 10-2000)

### Display Limit
In `Reviews.jsx`, change:
```javascript
const [displayCount, setDisplayCount] = useState(5); // Default to 5 reviews
```

## User Workflow

### Writing a Review
1. User navigates to product detail page
2. Scrolls to Reviews section
3. Clicks "Write a Review" button
4. Logs in if not authenticated
5. Fills form: Star rating, Title, Content
6. Clicks "Submit Review"
7. Review appears (if auto-approved)

### Editing a Review
1. User finds their review in the Reviews section
2. Clicks the Edit icon (pencil)
3. Form appears with current review data
4. Makes changes
5. Clicks "Update Review"
6. Changes save immediately

### Deleting a Review
1. User finds their review
2. Clicks Delete icon (trash)
3. Confirms deletion
4. Review is removed

## Testing

### Test Cases to Verify

1. **Create Review**
   - ✅ Create first review for product
   - ✅ Cannot create second review (duplicate check)
   - ✅ Validation prevents invalid input
   - ✅ Requires authentication

2. **Read Reviews**
   - ✅ Reviews display with all data
   - ✅ Rating distribution calculates correctly
   - ✅ Sorting works (recent, helpful, rating)
   - ✅ Pagination loads more reviews

3. **Update Review**
   - ✅ User can edit own review
   - ✅ Edit form pre-populates with review data
   - ✅ Changes save correctly
   - ✅ User cannot edit others' reviews

4. **Delete Review**
   - ✅ User can delete own review
   - ✅ Review removed from list
   - ✅ Stats update after deletion
   - ✅ User cannot delete others' reviews

5. **Helpful Voting**
   - ✅ Counter increments on click
   - ✅ Works without authentication
   - ✅ Persists in database

## Troubleshooting

### Reviews Not Appearing
- Check browser console for API errors
- Verify product ID is correct
- Check Firestore for Review collection
- Ensure reviews have `status: 'approved'`

### Cannot Submit Review
- Verify user is authenticated
- Check JWT token is valid
- Verify product ID exists
- Check for duplicate review error message

### Edit/Delete Not Working
- Verify user ID matches review.userId
- Check authentication token is valid
- Verify review exists in database

## Future Enhancements

- Photo uploads with reviews
- Review moderation dashboard
- Review reply system (admin responses)
- Review filtering by rating
- Email notifications for review responses
- Review spam detection
- Helpful count sorting performance optimization

## Files Modified/Created

### Created:
- `/entities/Review.json` - Schema definition
- `/server/routes/reviews.js` - API endpoints
- `/src/hooks/useReviews.js` - React hook
- `/src/components/product/ReviewForm.jsx` - Review form component
- `/src/components/product/ReviewCard.jsx` - Review card display
- `/src/components/product/Reviews.jsx` - Main reviews section

### Modified:
- `/server/index.js` - Added reviews route
- `/src/pages/ProductDetail.jsx` - Integrated reviews component
