# Reviews System - Quick Start Guide

## 🚀 What's New

A complete, production-ready reviews system has been added to your application! Users can now write, edit, and delete reviews for products with 1-5 star ratings.

## ✨ Features at a Glance

- **Write Reviews** - Users can submit detailed reviews with star ratings
- **Edit & Delete** - Users can update or remove their own reviews
- **Ratings & Stats** - Automatic calculation of average ratings and distribution
- **Helpful Voting** - Other users can mark reviews as helpful
- **Smart Sorting** - Sort by recent, most helpful, or rating
- **Seamless UI** - Beautiful, animated components with smooth interactions

## 📍 Where to Find It

The reviews section is integrated into the **Product Detail Page**:
1. View any product
2. Scroll to the bottom after "More Products"
3. You'll see "Customer Reviews" section

## 🎯 How Users Can Write a Review

1. **Click "Write a Review"** button
2. **Select a rating** (1-5 stars)
3. **Enter a title** (5-100 characters) - e.g., "Great quality product!"
4. **Write your review** (10-2000 characters) - Share details about your experience
5. **Click "Submit Review"**
6. ✅ Review appears immediately (if auto-approved)

## 🔄 Editing & Deleting

- Users see an **Edit** (pencil) and **Delete** (trash) icon on their own reviews
- Click Edit to update the review
- Click Delete to remove it (with confirmation)

## 👍 Helpful Feature

- Other users can click "Helpful" to vote that a review was helpful
- The helpful count displays next to each review
- This helps surface the most useful reviews

## 📊 Rating Distribution

The reviews section shows:
- **Average rating** with stars
- **Total reviews count**
- **Distribution chart** showing how many reviews for each rating

## 🔐 Security

- Users must be **logged in** to write reviews
- Users can **only edit/delete their own reviews**
- Each user can write **only one review per product**
- Reviews are **protected by authentication tokens**

## 🛠 Technical Stack

### Backend
- **Framework**: Express.js
- **Database**: Firestore (collection: `Review`)
- **Authentication**: JWT tokens
- **API Base**: `/api/reviews`

### Frontend
- **Components**: React with Framer Motion animations
- **State**: Custom `useReviews` hook
- **UI Library**: Tailwind CSS + custom components
- **Integration**: ProductDetail page

## 📝 API Endpoints (For Developers)

```
GET    /api/reviews/product/:productId          - Get reviews
POST   /api/reviews                             - Create review (auth required)
PUT    /api/reviews/:reviewId                   - Update review (auth required)
DELETE /api/reviews/:reviewId                   - Delete review (auth required)
POST   /api/reviews/:reviewId/helpful           - Mark as helpful
```

## 🧪 Testing Checklist

- [ ] Create a review (requires login)
- [ ] See your review appear in the list
- [ ] Try to create another review (should show error)
- [ ] Edit your review (click pencil icon)
- [ ] Delete your review (click trash icon)
- [ ] Mark other reviews as helpful (without login)
- [ ] Test sorting (recent, helpful, high/low rating)
- [ ] Verify rating stats update correctly

## 🎨 Customization Options

### Auto-Approval vs Moderation
To require admin approval before reviews appear:
1. Edit: `server/routes/reviews.js` (line ~91)
2. Change: `status: 'approved'` → `status: 'pending'`
3. Build admin dashboard to approve/reject reviews

### Character Limits
Edit `src/components/product/ReviewForm.jsx`:
- Title: `maxLength={100}`
- Content: `maxLength={2000}`

### Reviews Per Page
Edit `src/components/product/Reviews.jsx`:
- `const [displayCount, setDisplayCount] = useState(5);`

## 📂 Files Reference

### Created:
```
entities/Review.json                           - Database schema
server/routes/reviews.js                       - API endpoints
src/hooks/useReviews.js                        - React hook
src/components/product/ReviewForm.jsx          - Write/edit form
src/components/product/ReviewCard.jsx          - Review display
src/components/product/Reviews.jsx             - Main component
```

### Modified:
```
server/index.js                                - Added routes
src/pages/ProductDetail.jsx                    - Integrated component
```

## 🚨 Troubleshooting

**Reviews not showing?**
- Check browser DevTools Console for errors
- Verify product ID in URL
- Check Firestore has Review collection
- Ensure reviews have `status: 'approved'`

**Can't submit a review?**
- Make sure you're logged in
- Check you haven't already reviewed this product
- Verify form fields meet requirements (5+ chars title, 10+ chars content)

**Edit/Delete buttons not showing?**
- Make sure you're logged in
- Verify you're on your own review
- Check browser console for auth errors

## 📚 Full Documentation

For complete technical documentation, see: `REVIEWS_GUIDE.md`

---

**Enjoy your new reviews system! 🎉**
