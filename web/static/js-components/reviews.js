const { useState, useEffect } = React;

const ReviewsList = () => {
    const [reviews, setReviews] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const starCount = Array(5).fill().map((_, i) => i);
    // Fetch function to get reviews from the server
    const fetchReviews = async (pageNumber) => {
        setLoading(true);
        try {
        const response = await fetch(`get_review?page=${pageNumber}`);
        const data = await response.json();

        setReviews((prevReviews) => [...prevReviews, ...data.reviews]);
        setHasMore(data.hasMore);
        } catch (error) {
        console.error('Error fetching reviews:', error);
        } finally {
        setLoading(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchReviews(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handler for "See More" button
    const handleSeeMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage);
    };


    return (
        <div>
        {reviews.map((review, index) => (
            <div key={index} className="review">
                <div className="sec_1">
                    <span>{review.author.username}</span>
                    <span>•</span> 
                    <span>{review.created_at}</span> 
                </div>
                <div className="sec_1">
                    <div className="rating">
                        {starCount.map((star_val, index) => <div key={index} className={`star ${(star_val <= review.rate) ? "full" : "empty"}`}></div>)}
                    </div>
                    <h4>{review.headline}</h4>
                </div>
                    <p>{review.review} </p>
            </div>
        ))}

        {/* See More Button */}
        {hasMore && !loading && (
            <button style={{color: 'blue'}} onClick={handleSeeMore}>See More</button>
        )}

        {/* Loading Indicator */}
        {loading && <p>Loading more reviews...</p>}
        </div>
    );
};

export default ReviewsList;
