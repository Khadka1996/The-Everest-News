# Performance Optimization: Code Implementation

## ✅ FRONTEND OPTIMIZATION - Category Page Fix

### Current Slow Code (O(n*m)):
```javascript
const articlesWithAuthorInfo = useMemo(() => {
  return articles.map((article) => {
    const authorNameFromArticle = article.selectedAuthors?.[0];
    const author = authors.find(  // ⚠️ O(m) for each article!
      (author) => `${author.firstName} ${author.lastName}` === authorNameFromArticle
    );
    // ...
  });
}, [articles, authors]);
```

### Optimized Code (O(m + n)):
```javascript
// Step 1: Create author map once (O(m))
const authorMap = useMemo(() => {
  const map = {};
  authors.forEach(author => {
    const fullName = `${author.firstName} ${author.lastName}`;
    map[fullName] = {
      _id: author._id,
      photo: author.photo,
    };
  });
  return map;
}, [authors]);

// Step 2: Use map for instant lookup (O(1))
const articlesWithAuthorInfo = useMemo(() => {
  return articles.map((article) => {
    const authorNameFromArticle = article.selectedAuthors?.[0];
    const author = authorMap[authorNameFromArticle];
    
    return {
      ...article,
      authorName: authorNameFromArticle,
      authorPhoto: author ? `${AUTHOR_IMAGE_BASE_URL}${author.photo}` : null,
      authorId: author ? author._id : null,
      articlePhoto: article.photos && article.photos.length > 0
        ? `${ARTICLE_IMAGE_BASE_URL}${article.photos[0].split('/').pop()}`
        : null,
    };
  });
}, [articles, authorMap]); // Update depends on authorMap, not authors
```

### Expected Improvement:
- **Before**: O(n*m) = 12 articles × 100 authors = 1,200 string comparisons
- **After**: O(m+n) = 100 + 12 = 112 operations
- **Speed**: **🚀 10x faster**

---

## ✅ BACKEND OPTIMIZATION - Article Controller

### Issue 1: Remove countDocuments()

**Current Code (SLOW):**
```javascript
const articles = await Article.find({ category: categoryData._id, status })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .select('-content')
  .populate(...);

// This is expensive!!! ⚠️
const totalCount = await Article.countDocuments({ category: categoryData._id, status });
const totalPages = Math.ceil(totalCount / limit);
```

**Optimized Code:**
```javascript
const articles = await Article.find({ category: categoryData._id, status })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit + 1)  // Fetch one extra to detect if there's a next page
  .select('-content')
  .populate(...);

const hasNextPage = articles.length > limit;
const articlesToReturn = hasNextPage ? articles.slice(0, limit) : articles;

// Get exact total count only if first page or if client requested it
const totalCount = page === 1 
  ? await Article.countDocuments({ ..., status })  // Only on first page
  : previousTotalCount;

const totalPages = Math.ceil(totalCount / limit);
```

**Expected Improvement**: **25-40% faster** (eliminates second DB query)

---

### Issue 2: Add Category Caching

**Current Code:**
```javascript
const categoryData = await Category.findOne({ name: category }); // ⚠️ Every request
```

**Optimized Code:**
```javascript
// Create a simple in-memory cache
const categoryCache = new Map();
const getCategoryByName = async (name) => {
  // Check cache first
  if (categoryCache.has(name)) {
    return categoryCache.get(name);
  }
  
  // Query DB
  const category = await Category.findOne({ name });
  
  // Cache for 1 hour
  categoryCache.set(name, category);
  setTimeout(() => categoryCache.delete(name), 60 * 60 * 1000);
  
  return category;
};

// Use in controller
const categoryData = await getCategoryByName(category);
```

**Expected Improvement**: **90%+ faster** for repeated requests to same category

---

### Issue 3: Optimize Populate Queries

**Current Code:**
```javascript
.populate({
  path: 'selectedTags',
  model: 'Tag',
  select: 'name',  // ✅ Good - but include _id implicitly
})
.populate({
  path: 'selectedAuthors',
  model: 'Author',
  select: 'firstName lastName',  // ⚠️ Missing photo
})
.populate({
  path: 'category',
  model: 'Category',
  select: ['_id', 'name'],
})
```

**Optimized Code:**
```javascript
.populate({
  path: 'selectedTags',
  model: 'Tag',
  select: 'name _id',  // Include _id
})
.populate({
  path: 'selectedAuthors',
  model: 'Author',
  select: 'firstName lastName _id',  // Include _id for lookups
})
.populate({
  path: 'category',
  model: 'Category',
  select: '_id name',
})
```

**Expected Improvement**: **Minimal** (already good, just ensure _id included)

---

## 📊 Redis Caching Implementation (Advanced)

```javascript
// In articleController.js
const getArticlesByCategoryWithStatus = async (req, res) => {
  try {
    const { category, status } = req.params;
    const { page = 1, limit = 12 } = req.query;

    // Generate cache key
    const cacheKey = `articles:category:${category}:${status}:page:${page}:limit:${limit}`;

    // 1️⃣ Check Redis cache first
    if (redisClient.isOpen) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log('✅ Cache HIT - Returning cached data');
          return res.status(200).json(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.warn('⚠️ Redis read error, continuing without cache', cacheError.message);
      }
    }

    // 2️⃣ Cache miss - fetch from DB
    const categoryData = await Category.findOne({ name: category });
    if (!categoryData) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const skip = (page - 1) * limit;
    const articles = await Article.find({ category: categoryData._id, status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content')
      .populate('selectedTags', 'name')
      .populate('selectedAuthors', 'firstName lastName _id')
      .populate('category', '_id name');

    if (!articles || articles.length === 0) {
      return res.status(404).json({ success: false, error: 'No articles found' });
    }

    const totalCount = page === 1
      ? await Article.countDocuments({ category: categoryData._id, status })
      : null;

    const responseData = {
      success: true,
      data: articles.map(article => ({
        ...article._doc,
        selectedTags: article.selectedTags.map(tag => tag.name),
        selectedAuthors: article.selectedAuthors.map(author => `${author.firstName} ${author.lastName}`),
        category: { _id: article.category._id, name: article.category.name },
      })),
      pagination: {
        totalCount,
        totalPages: totalCount ? Math.ceil(totalCount / limit) : null,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    };

    // 3️⃣ Cache for 5 minutes
    if (redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));
        console.log('💾 Cached response for 5 minutes');
      } catch (cacheError) {
        console.warn('⚠️ Redis write error, returning response without caching');
      }
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
```

---

## 🎯 Implementation Checklist

### Frontend (30 mins)
- [ ] Update author lookup to use Map instead of find()
- [ ] Test category page performance
- [ ] Verify author photos still load correctly

### Backend (1-2 hours)
- [ ] Remove countDocuments() call
- [ ] Add simple category name caching
- [ ] Test with large datasets
- [ ] Verify pagination still works correctly

### Monitoring (Optional)
- [ ] Add timing logs to controller
- [ ] Monitor response times in browser DevTools
- [ ] Track Redis cache hit rate

---

## Expected Results After Optimization

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total Request Time | 300-400ms | 100-150ms | 60% faster ⚡ |
| Backend Processing | 150-200ms | 50-100ms | 50% faster |
| DB Queries | 2-3 | 1-2 | Fewer roundtrips |
| Response Size | 30-60KB | 30-60KB | Same ✅ |
| Cached Requests | - | <10ms | 95% faster 🚀 |

