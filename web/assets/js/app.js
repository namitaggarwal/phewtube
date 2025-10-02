/**
 * phewTube Main Application JavaScript
 * Handles routing, UI interactions, and application state
 */

// Global application state
let currentPage = 'home';
let currentVideoId = null;
let currentChannelId = null;
let currentSearchQuery = '';
let currentSortBy = 'latest';
let videosPerPage = 12;
let currentVideoPage = 1;
let currentUser = null;
let isAuthenticated = false;

// Initialize application when DOM is loaded
$(document).ready(function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize sidebar toggle
    initializeSidebar();
    
    // Initialize authentication
    initializeAuth();
    
    // Load initial content
    showHome();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    
    // Initialize upload form
    initializeUploadForm();
    
    console.log('phewTube initialized successfully');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Sidebar toggle
    $('#sidebar-toggle').on('click', toggleSidebar);
    
    // Search functionality
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            performSearch();
        }
    });
    
    $('#mobileSearchInput').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            performMobileSearch();
        }
    });
    
    // Upload form
    $('#uploadForm').on('submit', handleUploadSubmit);
    
    // Drag and drop for upload
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('click', () => {
            document.getElementById('videoFileInput').click();
        });
    }
    
    // Video player events
    $(document).on('play', '#videoPlayer', function() {
        if (currentVideoId) {
            DataManager.addToWatchHistory(currentVideoId);
            incrementViewCount(currentVideoId);
        }
    });
}

/**
 * Initialize sidebar functionality
 */
function initializeSidebar() {
    // Close sidebar on mobile when clicking outside
    $(document).on('click', function(e) {
        if (window.innerWidth <= 1024) {
            const sidebar = $('#sidebar');
            const sidebarToggle = $('#sidebar-toggle');
            
            if (!sidebar.is(e.target) && sidebar.has(e.target).length === 0 && 
                !sidebarToggle.is(e.target) && sidebarToggle.has(e.target).length === 0) {
                sidebar.removeClass('show');
            }
        }
    });
}

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
    const sidebar = $('#sidebar');
    
    if (window.innerWidth <= 1024) {
        sidebar.toggleClass('show');
    } else {
        sidebar.toggleClass('collapsed');
    }
}

/**
 * Handle browser back/forward navigation
 */
function handlePopState(event) {
    if (event.state) {
        const { page, videoId, channelId, searchQuery } = event.state;
        
        switch (page) {
            case 'home':
                showHome(false);
                break;
            case 'watch':
                showVideo(videoId, false);
                break;
            case 'channel':
                showChannel(channelId, false);
                break;
            case 'search':
                showSearchResults(searchQuery, false);
                break;
            case 'upload':
                showUpload(false);
                break;
            case 'login':
                showLogin(false);
                break;
            case 'register':
                showRegister(false);
                break;
            case 'admin':
                showAdminDashboard(false);
                break;
        }
    }
}

/**
 * Update browser history
 */
function updateHistory(page, data = {}) {
    const state = { page, ...data };
    let url = '#';
    
    switch (page) {
        case 'home':
            url = '#';
            break;
        case 'watch':
            url = `#/watch?v=${data.videoId}`;
            break;
        case 'channel':
            url = `#/channel/${data.channelId}`;
            break;
        case 'search':
            url = `#/search?q=${encodeURIComponent(data.searchQuery)}`;
            break;
        case 'upload':
            url = '#/upload';
            break;
        case 'login':
            url = '#/login';
            break;
        case 'register':
            url = '#/register';
            break;
        case 'admin':
            url = '#/admin';
            break;
    }
    
    history.pushState(state, '', url);
}

/**
 * Show/hide pages
 */
function showPage(pageId) {
    $('.page').removeClass('active').hide();
    $(`#${pageId}`).addClass('active').show();
    
    // Update sidebar active state
    $('.sidebar .nav-link').removeClass('active');
    
    currentPage = pageId.replace('Page', '');
}

/**
 * Show home page
 */
function showHome(updateHistory = true) {
    showPage('homePage');
    
    if (updateHistory) {
        updateHistory('home');
    }
    
    // Update sidebar
    $('.sidebar .nav-link').removeClass('active');
    $('.sidebar .nav-link[onclick="showHome()"]').addClass('active');
    
    // Load videos
    loadHomeVideos();
    
    currentPage = 'home';
}

/**
 * Load videos for home page
 */
function loadHomeVideos() {
    const videos = DataManager.sortVideos(DataManager.getAllVideos(), currentSortBy);
    const videosToShow = videos.slice(0, currentVideoPage * videosPerPage);
    
    renderVideoGrid(videosToShow);
    
    // Show/hide load more button
    const loadMoreBtn = $('#loadMoreBtn');
    if (videosToShow.length >= videos.length) {
        loadMoreBtn.hide();
    } else {
        loadMoreBtn.show();
    }
}

/**
 * Load more videos
 */
function loadMoreVideos() {
    currentVideoPage++;
    loadHomeVideos();
}

/**
 * Sort videos
 */
function sortVideos(sortBy) {
    currentSortBy = sortBy;
    currentVideoPage = 1;
    
    // Update active sort button
    $('.btn-group button').removeClass('active');
    $(`.btn-group button[onclick="sortVideos('${sortBy}')"]`).addClass('active');
    
    loadHomeVideos();
}

/**
 * Render video grid
 */
function renderVideoGrid(videos) {
    const grid = $('#videoGrid');
    grid.empty();
    
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        grid.append(videoCard);
    });
}

/**
 * Create video card HTML
 */
function createVideoCard(video) {
    const timeAgo = DataManager.formatTimeAgo(video.uploadedAt);
    const views = DataManager.formatViews(video.views);
    
    return `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="video-card" onclick="showVideo('${video.id}')">
                <div class="video-thumbnail">
                    <img src="${video.thumbnailUrl}" alt="${video.title}" loading="lazy">
                    <div class="video-duration">${video.duration}</div>
                </div>
                <div class="video-info">
                    <div class="d-flex">
                        <img src="${video.channel.avatar}" alt="${video.channel.name}" class="channel-avatar">
                        <div class="flex-grow-1">
                            <h6 class="video-title">${video.title}</h6>
                            <div class="video-channel">${video.channel.name}</div>
                            <div class="video-stats">${views} • ${timeAgo}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show video watch page
 */
function showVideo(videoId, updateHistory = true) {
    const video = DataManager.getVideoById(videoId);
    if (!video) {
        console.error('Video not found:', videoId);
        return;
    }
    
    showPage('watchPage');
    
    if (updateHistory) {
        updateHistory('watch', { videoId });
    }
    
    currentVideoId = videoId;
    
    // Load video details
    loadVideoDetails(video);
    
    // Load suggested videos
    loadSuggestedVideos(videoId);
    
    // Load comments
    loadComments(video.comments);
}

/**
 * Load video details
 */
function loadVideoDetails(video) {
    // Set video source and poster
    const videoPlayer = $('#videoPlayer');
    videoPlayer.attr('src', video.videoUrl);
    videoPlayer.attr('poster', video.thumbnailUrl);
    
    // Set video info
    $('#videoTitle').text(video.title);
    $('#videoStats').text(`${DataManager.formatViews(video.views)} • ${DataManager.formatTimeAgo(video.uploadedAt)}`);
    $('#videoDescription').text(video.description);
    
    // Set channel info
    $('#channelAvatar').attr('src', video.channel.avatar);
    $('#channelName').text(video.channel.name);
    $('#channelSubs').text(video.channel.subscribers);
    
    // Update like/dislike counts
    $('#likeCount').text(video.likes);
    
    // Update subscribe button
    updateSubscribeButton(video.channel.id);
    
    // Update like/dislike button states
    updateLikeButtons(video.id);
}

/**
 * Load suggested videos
 */
function loadSuggestedVideos(currentVideoId) {
    const suggestedVideos = DataManager.getSuggestedVideos(currentVideoId, 10);
    const container = $('#suggestedVideosList');
    container.empty();
    
    suggestedVideos.forEach(video => {
        const suggestedCard = createSuggestedVideoCard(video);
        container.append(suggestedCard);
    });
}

/**
 * Create suggested video card HTML
 */
function createSuggestedVideoCard(video) {
    const timeAgo = DataManager.formatTimeAgo(video.uploadedAt);
    const views = DataManager.formatViews(video.views);
    
    return `
        <div class="suggested-video-card" onclick="showVideo('${video.id}')">
            <div class="suggested-thumbnail">
                <img src="${video.thumbnailUrl}" alt="${video.title}" loading="lazy">
            </div>
            <div class="suggested-info">
                <div class="suggested-title">${video.title}</div>
                <div class="suggested-channel">${video.channel.name}</div>
                <div class="suggested-stats">${views} • ${timeAgo}</div>
            </div>
        </div>
    `;
}

/**
 * Load comments
 */
function loadComments(comments) {
    const container = $('#commentsList');
    const commentCount = $('#commentCount');
    
    // Calculate total comments including replies
    let totalComments = comments.length;
    comments.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
            totalComments += comment.replies.length;
        }
    });
    
    commentCount.text(totalComments);
    container.empty();
    
    if (comments.length === 0) {
        container.html(`
            <div class="text-center py-4 text-muted">
                <i class="bi bi-chat-dots fs-1 mb-3"></i>
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `);
        return;
    }
    
    comments.forEach(comment => {
        const commentHtml = createCommentHtml(comment);
        container.append(commentHtml);
    });
}

/**
 * Create comment HTML
 */
function createCommentHtml(comment) {
    const timeAgo = DataManager.formatTimeAgo(comment.timestamp);
    const isLiked = isCommentLiked(comment.id);
    const isDisliked = isCommentDisliked(comment.id);
    
    let repliesHtml = '';
    
    if (comment.replies && comment.replies.length > 0) {
        repliesHtml = '<div class="replies-container ms-4 mt-2">';
        comment.replies.forEach(reply => {
            const replyTimeAgo = DataManager.formatTimeAgo(reply.timestamp);
            const replyIsLiked = isCommentLiked(reply.id);
            const replyIsDisliked = isCommentDisliked(reply.id);
            
            repliesHtml += `
                <div class="comment reply mb-2" data-comment-id="${reply.id}">
                    <img src="${reply.avatar}" alt="${reply.author}" class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-author">${reply.author} • ${replyTimeAgo}</div>
                        <div class="comment-text">${reply.text}</div>
                        <div class="comment-actions">
                            <button class="comment-like-btn ${replyIsLiked ? 'liked' : ''}" onclick="toggleCommentLike('${reply.id}')">
                                <i class="bi bi-hand-thumbs-up me-1"></i><span class="like-count">${reply.likes || 0}</span>
                            </button>
                            <button class="comment-dislike-btn ${replyIsDisliked ? 'disliked' : ''}" onclick="toggleCommentDislike('${reply.id}')">
                                <i class="bi bi-hand-thumbs-down"></i>
                            </button>
                            <button onclick="showReplyForm('${comment.id}')">Reply</button>
                        </div>
                    </div>
                </div>
            `;
        });
        repliesHtml += '</div>';
    }
    
    return `
        <div class="comment main-comment mb-3" data-comment-id="${comment.id}">
            <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-author">${comment.author} • ${timeAgo}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="comment-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleCommentLike('${comment.id}')">
                        <i class="bi bi-hand-thumbs-up me-1"></i><span class="like-count">${comment.likes}</span>
                    </button>
                    <button class="comment-dislike-btn ${isDisliked ? 'disliked' : ''}" onclick="toggleCommentDislike('${comment.id}')">
                        <i class="bi bi-hand-thumbs-down"></i>
                    </button>
                    <button onclick="showReplyForm('${comment.id}')">Reply</button>
                    <button onclick="toggleReplies('${comment.id}')" class="toggle-replies-btn" ${comment.replies && comment.replies.length > 0 ? '' : 'style="display: none;"'}>
                        <i class="bi bi-chevron-down"></i> ${comment.replies ? comment.replies.length : 0} replies
                    </button>
                </div>
                <div class="reply-form-container" id="replyForm-${comment.id}" style="display: none;">
                    <div class="d-flex mt-3">
                        <img src="assets/img/user-avatar.svg" alt="You" class="rounded-circle me-3" width="32" height="32">
                        <div class="flex-grow-1">
                            <textarea class="form-control reply-input" rows="2" placeholder="Add a reply..." id="replyInput-${comment.id}"></textarea>
                            <div class="mt-2">
                                <button class="btn btn-primary btn-sm" onclick="addReply('${comment.id}')">Reply</button>
                                <button class="btn btn-link btn-sm" onclick="cancelReply('${comment.id}')">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                ${repliesHtml}
            </div>
        </div>
    `;
}

/**
 * Add comment
 */
function addComment() {
    const commentInput = $('#commentInput');
    const commentText = commentInput.val().trim();
    
    if (!commentText) {
        alert('Please enter a comment before posting.');
        return;
    }
    
    const video = DataManager.getVideoById(currentVideoId);
    if (!video) return;
    
    const newComment = {
        id: 'com_' + Date.now(),
        author: 'You',
        avatar: 'assets/img/user-avatar.svg',
        text: commentText,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: []
    };
    
    video.comments.unshift(newComment);
    loadComments(video.comments);
    commentInput.val('');
    
    // Show success feedback
    showCommentFeedback('Comment posted successfully!');
}

/**
 * Cancel comment
 */
function cancelComment() {
    $('#commentInput').val('');
}

/**
 * Add reply to a comment
 */
function addReply(commentId) {
    const replyInput = $(`#replyInput-${commentId}`);
    const replyText = replyInput.val().trim();
    
    if (!replyText) {
        alert('Please enter a reply before posting.');
        return;
    }
    
    const video = DataManager.getVideoById(currentVideoId);
    if (!video) return;
    
    const comment = findCommentById(video.comments, commentId);
    if (!comment) return;
    
    const newReply = {
        id: 'rep_' + Date.now(),
        author: 'You',
        avatar: 'assets/img/user-avatar.svg',
        text: replyText,
        timestamp: new Date().toISOString(),
        likes: 0
    };
    
    if (!comment.replies) {
        comment.replies = [];
    }
    
    comment.replies.push(newReply);
    loadComments(video.comments);
    
    // Show success feedback
    showCommentFeedback('Reply posted successfully!');
}

/**
 * Cancel reply
 */
function cancelReply(commentId) {
    $(`#replyForm-${commentId}`).hide();
    $(`#replyInput-${commentId}`).val('');
}

/**
 * Show reply form
 */
function showReplyForm(commentId) {
    // Hide all other reply forms
    $('.reply-form-container').hide();
    
    // Show the specific reply form
    $(`#replyForm-${commentId}`).show();
    $(`#replyInput-${commentId}`).focus();
}

/**
 * Toggle replies visibility
 */
function toggleReplies(commentId) {
    const repliesContainer = $(`.comment[data-comment-id="${commentId}"] .replies-container`);
    const toggleBtn = $(`.comment[data-comment-id="${commentId}"] .toggle-replies-btn`);
    const icon = toggleBtn.find('i');
    
    if (repliesContainer.is(':visible')) {
        repliesContainer.hide();
        icon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
    } else {
        repliesContainer.show();
        icon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
    }
}

/**
 * Toggle comment like
 */
function toggleCommentLike(commentId) {
    const video = DataManager.getVideoById(currentVideoId);
    if (!video) return;
    
    const comment = findCommentById(video.comments, commentId, true);
    if (!comment) return;
    
    const likedComments = getCommentLikes();
    const dislikedComments = getCommentDislikes();
    
    const isCurrentlyLiked = likedComments.includes(commentId);
    const isCurrentlyDisliked = dislikedComments.includes(commentId);
    
    if (isCurrentlyLiked) {
        // Remove like
        const index = likedComments.indexOf(commentId);
        likedComments.splice(index, 1);
        comment.likes = Math.max(0, comment.likes - 1);
    } else {
        // Add like
        likedComments.push(commentId);
        comment.likes = (comment.likes || 0) + 1;
        
        // Remove dislike if exists
        if (isCurrentlyDisliked) {
            const dislikeIndex = dislikedComments.indexOf(commentId);
            dislikedComments.splice(dislikeIndex, 1);
        }
    }
    
    setCommentLikes(likedComments);
    setCommentDislikes(dislikedComments);
    
    // Update UI
    updateCommentLikeUI(commentId, comment.likes);
}

/**
 * Toggle comment dislike
 */
function toggleCommentDislike(commentId) {
    const likedComments = getCommentLikes();
    const dislikedComments = getCommentDislikes();
    
    const isCurrentlyLiked = likedComments.includes(commentId);
    const isCurrentlyDisliked = dislikedComments.includes(commentId);
    
    if (isCurrentlyDisliked) {
        // Remove dislike
        const index = dislikedComments.indexOf(commentId);
        dislikedComments.splice(index, 1);
    } else {
        // Add dislike
        dislikedComments.push(commentId);
        
        // Remove like if exists
        if (isCurrentlyLiked) {
            const likeIndex = likedComments.indexOf(commentId);
            likedComments.splice(likeIndex, 1);
            
            const video = DataManager.getVideoById(currentVideoId);
            const comment = findCommentById(video.comments, commentId, true);
            if (comment) {
                comment.likes = Math.max(0, comment.likes - 1);
                updateCommentLikeUI(commentId, comment.likes);
            }
        }
    }
    
    setCommentLikes(likedComments);
    setCommentDislikes(dislikedComments);
    
    // Update UI
    updateCommentDislikeUI(commentId);
}

/**
 * Helper functions for comment management
 */
function findCommentById(comments, commentId, includeReplies = false) {
    for (let comment of comments) {
        if (comment.id === commentId) {
            return comment;
        }
        if (includeReplies && comment.replies) {
            for (let reply of comment.replies) {
                if (reply.id === commentId) {
                    return reply;
                }
            }
        }
    }
    return null;
}

function getCommentLikes() {
    return JSON.parse(localStorage.getItem('phewTube_comment_likes') || '[]');
}

function setCommentLikes(likes) {
    localStorage.setItem('phewTube_comment_likes', JSON.stringify(likes));
}

function getCommentDislikes() {
    return JSON.parse(localStorage.getItem('phewTube_comment_dislikes') || '[]');
}

function setCommentDislikes(dislikes) {
    localStorage.setItem('phewTube_comment_dislikes', JSON.stringify(dislikes));
}

function isCommentLiked(commentId) {
    return getCommentLikes().includes(commentId);
}

function isCommentDisliked(commentId) {
    return getCommentDislikes().includes(commentId);
}

function updateCommentLikeUI(commentId, likeCount) {
    const commentElement = $(`.comment[data-comment-id="${commentId}"]`);
    const likeBtn = commentElement.find('.comment-like-btn');
    const dislikeBtn = commentElement.find('.comment-dislike-btn');
    const likeCountSpan = likeBtn.find('.like-count');
    
    // Update like button state
    if (isCommentLiked(commentId)) {
        likeBtn.addClass('liked');
    } else {
        likeBtn.removeClass('liked');
    }
    
    // Update dislike button state
    if (isCommentDisliked(commentId)) {
        dislikeBtn.addClass('disliked');
    } else {
        dislikeBtn.removeClass('disliked');
    }
    
    // Update like count
    likeCountSpan.text(likeCount);
}

function updateCommentDislikeUI(commentId) {
    const commentElement = $(`.comment[data-comment-id="${commentId}"]`);
    const likeBtn = commentElement.find('.comment-like-btn');
    const dislikeBtn = commentElement.find('.comment-dislike-btn');
    
    // Update like button state
    if (isCommentLiked(commentId)) {
        likeBtn.addClass('liked');
    } else {
        likeBtn.removeClass('liked');
    }
    
    // Update dislike button state
    if (isCommentDisliked(commentId)) {
        dislikeBtn.addClass('disliked');
    } else {
        dislikeBtn.removeClass('disliked');
    }
}

function showCommentFeedback(message) {
    // Create and show a temporary feedback message
    const feedback = $(`
        <div class="comment-feedback alert alert-success alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('.comments-section').prepend(feedback);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        feedback.fadeOut(() => feedback.remove());
    }, 3000);
}

/**
 * Sort comments
 */
function sortComments(sortBy) {
    const video = DataManager.getVideoById(currentVideoId);
    if (!video || !video.comments) return;
    
    let sortedComments = [...video.comments];
    
    switch (sortBy) {
        case 'newest':
            sortedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case 'oldest':
            sortedComments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
        case 'popular':
            sortedComments.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
        default:
            break;
    }
    
    // Update the video's comments order temporarily for display
    const originalComments = video.comments;
    video.comments = sortedComments;
    loadComments(video.comments);
    video.comments = originalComments; // Restore original order
    
    // Update dropdown text
    const sortText = {
        'newest': 'Newest first',
        'oldest': 'Oldest first', 
        'popular': 'Most liked'
    };
    
    $('.comments-section .dropdown-toggle').html(`<i class="bi bi-sort-down me-1"></i>${sortText[sortBy]}`);
}

/**
 * Perform search
 */
function performSearch() {
    const query = $('#searchInput').val().trim();
    if (query) {
        showSearchResults(query);
    }
}

/**
 * Perform mobile search
 */
function performMobileSearch() {
    const query = $('#mobileSearchInput').val().trim();
    if (query) {
        showSearchResults(query);
        $('#mobileSearch').collapse('hide');
    }
}

/**
 * Show search results
 */
function showSearchResults(query, updateHistory = true) {
    showPage('searchPage');
    
    if (updateHistory) {
        updateHistory('search', { searchQuery: query });
    }
    
    currentSearchQuery = query;
    
    // Update search inputs
    $('#searchInput').val(query);
    $('#mobileSearchInput').val(query);
    
    // Update title
    $('#searchResultsTitle').text(`Search results for "${query}"`);
    
    // Perform search
    const results = DataManager.searchVideos(query);
    renderSearchResults(results);
}

/**
 * Render search results
 */
function renderSearchResults(results) {
    const container = $('#searchResults');
    container.empty();
    
    if (results.length === 0) {
        container.html(`
            <div class="text-center py-5">
                <i class="bi bi-search fs-1 text-muted"></i>
                <h4 class="mt-3">No results found</h4>
                <p class="text-muted">Try different keywords or check your spelling</p>
            </div>
        `);
        return;
    }
    
    results.forEach(video => {
        const resultCard = createSearchResultCard(video);
        container.append(resultCard);
    });
}

/**
 * Create search result card HTML
 */
function createSearchResultCard(video) {
    const timeAgo = DataManager.formatTimeAgo(video.uploadedAt);
    const views = DataManager.formatViews(video.views);
    
    return `
        <div class="search-result-item" onclick="showVideo('${video.id}')">
            <div class="search-result-thumbnail">
                <img src="${video.thumbnailUrl}" alt="${video.title}" loading="lazy">
            </div>
            <div class="search-result-info">
                <div class="search-result-title">${video.title}</div>
                <div class="search-result-stats">${views} • ${timeAgo}</div>
                <div class="search-result-channel">${video.channel.name}</div>
                <div class="search-result-description">${video.description}</div>
            </div>
        </div>
    `;
}

/**
 * Toggle search view (list/grid)
 */
function toggleSearchView(view) {
    // Update active button
    $('.btn-group button').removeClass('active');
    $(`.btn-group button[onclick="toggleSearchView('${view}')"]`).addClass('active');
    
    // Apply view class (could be extended for different layouts)
    const container = $('#searchResults');
    container.removeClass('grid-view list-view').addClass(`${view}-view`);
}

/**
 * Show channel page
 */
function showChannel(channelId, updateHistory = true) {
    const channel = DataManager.getChannelById(channelId);
    if (!channel) {
        console.error('Channel not found:', channelId);
        return;
    }
    
    showPage('channelPage');
    
    if (updateHistory) {
        updateHistory('channel', { channelId });
    }
    
    currentChannelId = channelId;
    
    // Load channel details
    loadChannelDetails(channel);
    
    // Load channel videos
    loadChannelVideos(channelId);
}

/**
 * Load channel details
 */
function loadChannelDetails(channel) {
    $('#channelPageAvatar').attr('src', channel.avatar);
    $('#channelPageName').text(channel.name);
    $('#channelPageSubs').text(channel.subscribers);
    $('#channelPageDescription').text(channel.description || `Welcome to ${channel.name}!`);
    
    // Update subscribe button
    updateChannelSubscribeButton(channel.id);
}

/**
 * Load channel videos
 */
function loadChannelVideos(channelId) {
    const videos = DataManager.getVideosByChannel(channelId);
    const container = $('#channelVideosList');
    container.empty();
    
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        container.append(videoCard);
    });
}

/**
 * Show upload page
 */
function showUpload(updateHistory = true) {
    showPage('uploadPage');
    
    if (updateHistory) {
        updateHistory('upload');
    }
    
    // Reset upload form
    resetUploadForm();
}

/**
 * Initialize upload form
 */
function initializeUploadForm() {
    // File input change handler
    $('#videoFileInput').on('change', function(e) {
        handleFileSelect(e);
    });
}

/**
 * Handle file selection
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
        alert('Please select a video file.');
        return;
    }
    
    // Show upload progress
    $('#uploadArea').addClass('d-none');
    $('#uploadProgress').removeClass('d-none');
    $('#uploadFileName').text(file.name);
    
    // Simulate upload progress
    simulateUpload(file);
}

/**
 * Simulate upload progress
 */
function simulateUpload(file) {
    let progress = 0;
    const progressBar = $('#uploadProgressBar');
    const statusText = $('#uploadStatus');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            progressBar.css('width', '100%');
            statusText.text('Upload complete! Please fill in the details below.');
            
            // Show video details form
            setTimeout(() => {
                $('#uploadProgress').addClass('d-none');
                $('#videoDetails').removeClass('d-none');
                
                // Pre-fill title with filename
                const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                $('#videoTitleInput').val(fileName);
            }, 1000);
        } else {
            progressBar.css('width', progress + '%');
            statusText.text(`Uploading... ${Math.round(progress)}%`);
        }
    }, 200);
}

/**
 * Handle upload form submission
 */
function handleUploadSubmit(event) {
    event.preventDefault();
    
    const title = $('#videoTitleInput').val().trim();
    const description = $('#videoDescriptionInput').val().trim();
    const category = $('#videoCategoryInput').val();
    
    if (!title) {
        alert('Please enter a video title.');
        return;
    }
    
    // Create new video entry
    const newVideo = DataManager.addVideo({
        title,
        description,
        category
    });
    
    // Show success message
    alert('Video uploaded successfully!');
    
    // Redirect to video page
    showVideo(newVideo.id);
}

/**
 * Cancel upload
 */
function cancelUpload() {
    resetUploadForm();
    showHome();
}

/**
 * Reset upload form
 */
function resetUploadForm() {
    $('#uploadForm')[0].reset();
    $('#uploadArea').removeClass('d-none');
    $('#uploadProgress').addClass('d-none');
    $('#videoDetails').addClass('d-none');
    $('#videoTitleInput').val('');
    $('#videoDescriptionInput').val('');
    $('#videoCategoryInput').val('');
}

/**
 * Handle drag and drop events
 */
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
            document.getElementById('videoFileInput').files = files;
            handleFileSelect({ target: { files: [file] } });
        } else {
            alert('Please drop a video file.');
        }
    }
}

/**
 * Toggle like/dislike
 */
function toggleLike() {
    if (!currentVideoId) return;
    
    const likedVideos = DataManager.getLikedVideos();
    const dislikedVideos = DataManager.getDislikedVideos();
    const video = DataManager.getVideoById(currentVideoId);
    
    const isLiked = likedVideos.includes(currentVideoId);
    const isDisliked = dislikedVideos.includes(currentVideoId);
    
    if (isLiked) {
        // Remove like
        const index = likedVideos.indexOf(currentVideoId);
        likedVideos.splice(index, 1);
        video.likes--;
    } else {
        // Add like
        likedVideos.push(currentVideoId);
        video.likes++;
        
        // Remove dislike if exists
        if (isDisliked) {
            const dislikeIndex = dislikedVideos.indexOf(currentVideoId);
            dislikedVideos.splice(dislikeIndex, 1);
            video.dislikes--;
        }
    }
    
    DataManager.setLikedVideos(likedVideos);
    DataManager.setDislikedVideos(dislikedVideos);
    
    updateLikeButtons(currentVideoId);
    $('#likeCount').text(video.likes);
}

function toggleDislike() {
    if (!currentVideoId) return;
    
    const likedVideos = DataManager.getLikedVideos();
    const dislikedVideos = DataManager.getDislikedVideos();
    const video = DataManager.getVideoById(currentVideoId);
    
    const isLiked = likedVideos.includes(currentVideoId);
    const isDisliked = dislikedVideos.includes(currentVideoId);
    
    if (isDisliked) {
        // Remove dislike
        const index = dislikedVideos.indexOf(currentVideoId);
        dislikedVideos.splice(index, 1);
        video.dislikes--;
    } else {
        // Add dislike
        dislikedVideos.push(currentVideoId);
        video.dislikes++;
        
        // Remove like if exists
        if (isLiked) {
            const likeIndex = likedVideos.indexOf(currentVideoId);
            likedVideos.splice(likeIndex, 1);
            video.likes--;
        }
    }
    
    DataManager.setLikedVideos(likedVideos);
    DataManager.setDislikedVideos(dislikedVideos);
    
    updateLikeButtons(currentVideoId);
    $('#likeCount').text(video.likes);
}

/**
 * Update like/dislike button states
 */
function updateLikeButtons(videoId) {
    const likedVideos = DataManager.getLikedVideos();
    const dislikedVideos = DataManager.getDislikedVideos();
    
    const likeBtn = $('#likeBtn');
    const dislikeBtn = $('#dislikeBtn');
    
    if (likedVideos.includes(videoId)) {
        likeBtn.addClass('btn-primary').removeClass('btn-outline-secondary');
    } else {
        likeBtn.addClass('btn-outline-secondary').removeClass('btn-primary');
    }
    
    if (dislikedVideos.includes(videoId)) {
        dislikeBtn.addClass('btn-primary').removeClass('btn-outline-secondary');
    } else {
        dislikeBtn.addClass('btn-outline-secondary').removeClass('btn-primary');
    }
}

/**
 * Toggle subscribe
 */
function toggleSubscribe() {
    if (!currentVideoId) return;
    
    const video = DataManager.getVideoById(currentVideoId);
    const channelId = video.channel.id;
    
    toggleChannelSubscription(channelId);
    updateSubscribeButton(channelId);
}

function toggleChannelSubscribe() {
    if (!currentChannelId) return;
    
    toggleChannelSubscription(currentChannelId);
    updateChannelSubscribeButton(currentChannelId);
}

/**
 * Toggle channel subscription
 */
function toggleChannelSubscription(channelId) {
    const subscribedChannels = DataManager.getSubscribedChannels();
    const isSubscribed = subscribedChannels.includes(channelId);
    
    if (isSubscribed) {
        const index = subscribedChannels.indexOf(channelId);
        subscribedChannels.splice(index, 1);
    } else {
        subscribedChannels.push(channelId);
    }
    
    DataManager.setSubscribedChannels(subscribedChannels);
}

/**
 * Update subscribe button
 */
function updateSubscribeButton(channelId) {
    const subscribedChannels = DataManager.getSubscribedChannels();
    const isSubscribed = subscribedChannels.includes(channelId);
    const btn = $('#subscribeBtn');
    
    if (isSubscribed) {
        btn.text('Subscribed').removeClass('btn-danger').addClass('btn-secondary');
    } else {
        btn.text('Subscribe').removeClass('btn-secondary').addClass('btn-danger');
    }
}

function updateChannelSubscribeButton(channelId) {
    const subscribedChannels = DataManager.getSubscribedChannels();
    const isSubscribed = subscribedChannels.includes(channelId);
    const btn = $('#channelPageSubscribeBtn');
    
    if (isSubscribed) {
        btn.text('Subscribed').removeClass('btn-danger').addClass('btn-secondary');
    } else {
        btn.text('Subscribe').removeClass('btn-secondary').addClass('btn-danger');
    }
}

/**
 * Increment view count
 */
function incrementViewCount(videoId) {
    const video = DataManager.getVideoById(videoId);
    if (video) {
        video.views++;
        // Update display if currently viewing this video
        if (currentVideoId === videoId) {
            $('#videoStats').text(`${DataManager.formatViews(video.views)} • ${DataManager.formatTimeAgo(video.uploadedAt)}`);
        }
    }
}

/**
 * Navigation functions for sidebar
 */
function showTrending() {
    currentSortBy = 'trending';
    showHome();
    sortVideos('trending');
}

function showSubscriptions() {
    const subscribedChannels = DataManager.getSubscribedChannels();
    if (subscribedChannels.length === 0) {
        $('#videoGrid').html(`
            <div class="col-12 text-center py-5">
                <i class="bi bi-collection-play fs-1 text-muted"></i>
                <h4 class="mt-3">No subscriptions yet</h4>
                <p class="text-muted">Subscribe to channels to see their latest videos here</p>
            </div>
        `);
        return;
    }
    
    // Get videos from subscribed channels
    const allVideos = DataManager.getAllVideos();
    const subscriptionVideos = allVideos.filter(video => 
        subscribedChannels.includes(video.channel.id)
    );
    
    const sortedVideos = DataManager.sortVideos(subscriptionVideos, 'latest');
    renderVideoGrid(sortedVideos);
    
    $('#loadMoreBtn').hide();
}

function showLibrary() {
    showHome();
}

function showHistory() {
    const history = DataManager.getWatchHistory();
    const historyVideos = history.map(videoId => DataManager.getVideoById(videoId)).filter(Boolean);
    
    if (historyVideos.length === 0) {
        $('#videoGrid').html(`
            <div class="col-12 text-center py-5">
                <i class="bi bi-clock-history fs-1 text-muted"></i>
                <h4 class="mt-3">No watch history</h4>
                <p class="text-muted">Videos you watch will appear here</p>
            </div>
        `);
        return;
    }
    
    renderVideoGrid(historyVideos);
    $('#loadMoreBtn').hide();
}

function showWatchLater() {
    const watchLater = DataManager.getWatchLater();
    const watchLaterVideos = watchLater.map(videoId => DataManager.getVideoById(videoId)).filter(Boolean);
    
    if (watchLaterVideos.length === 0) {
        $('#videoGrid').html(`
            <div class="col-12 text-center py-5">
                <i class="bi bi-clock fs-1 text-muted"></i>
                <h4 class="mt-3">No videos saved</h4>
                <p class="text-muted">Save videos to watch later</p>
            </div>
        `);
        return;
    }
    
    renderVideoGrid(watchLaterVideos);
    $('#loadMoreBtn').hide();
}

function showLikedVideos() {
    const likedVideos = DataManager.getLikedVideos();
    const likedVideoObjects = likedVideos.map(videoId => DataManager.getVideoById(videoId)).filter(Boolean);
    
    if (likedVideoObjects.length === 0) {
        $('#videoGrid').html(`
            <div class="col-12 text-center py-5">
                <i class="bi bi-hand-thumbs-up fs-1 text-muted"></i>
                <h4 class="mt-3">No liked videos</h4>
                <p class="text-muted">Videos you like will appear here</p>
            </div>
        `);
        return;
    }
    
    renderVideoGrid(likedVideoObjects);
    $('#loadMoreBtn').hide();
}

// Additional navigation functions for channel page
function showChannelVideos() {
    // Already loaded, just update active tab
    $('.nav-tabs .nav-link').removeClass('active');
    $('.nav-tabs .nav-link[onclick="showChannelVideos()"]').addClass('active');
}

function showChannelPlaylists() {
    $('.nav-tabs .nav-link').removeClass('active');
    $('.nav-tabs .nav-link[onclick="showChannelPlaylists()"]').addClass('active');
    
    $('#channelVideosList').html(`
        <div class="col-12 text-center py-5">
            <i class="bi bi-collection-play fs-1 text-muted"></i>
            <h4 class="mt-3">No playlists yet</h4>
            <p class="text-muted">This channel hasn't created any playlists</p>
        </div>
    `);
}

function showChannelAbout() {
    $('.nav-tabs .nav-link').removeClass('active');
    $('.nav-tabs .nav-link[onclick="showChannelAbout()"]').addClass('active');
    
    const channel = DataManager.getChannelById(currentChannelId);
    if (channel) {
        $('#channelVideosList').html(`
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5>About ${channel.name}</h5>
                        <p>${channel.description}</p>
                        <hr>
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Joined:</strong> ${channel.joinedDate || 'Unknown'}
                            </div>
                            <div class="col-md-6">
                                <strong>Total views:</strong> ${DataManager.formatViews(channel.totalViews)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}

// ===== AUTHENTICATION SYSTEM =====

/**
 * Initialize authentication system
 */
function initializeAuth() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('phewTube_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        updateAuthUI();
    } else {
        updateAuthUI();
    }
    
    // Set up form event listeners
    $('#loginForm').on('submit', handleLogin);
    $('#registerForm').on('submit', handleRegister);
    
    // Initialize sample users if not exists
    initializeSampleUsers();
}

/**
 * Initialize sample users for demo
 */
function initializeSampleUsers() {
    const users = AuthManager.getAllUsers();
    if (users.length === 0) {
        // Create default admin user
        const adminUser = {
            id: 'user_admin',
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin',
            email: 'admin@phewtube.com',
            password: 'admin123', // In real app, this would be hashed
            role: 'admin',
            status: 'active',
            avatar: 'assets/img/user-avatar.svg',
            joinedAt: new Date().toISOString(),
            lastLoginAt: null
        };
        
        // Create sample regular users
        const sampleUsers = [
            {
                id: 'user_001',
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user',
                status: 'active',
                avatar: 'https://via.placeholder.com/48x48/007bff/FFFFFF?text=JD',
                joinedAt: '2024-01-01T10:00:00Z',
                lastLoginAt: '2024-01-15T14:30:00Z'
            },
            {
                id: 'user_002',
                firstName: 'Jane',
                lastName: 'Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user',
                status: 'active',
                avatar: 'https://via.placeholder.com/48x48/28a745/FFFFFF?text=JS',
                joinedAt: '2024-01-05T15:20:00Z',
                lastLoginAt: '2024-01-16T09:15:00Z'
            },
            {
                id: 'user_003',
                firstName: 'Mike',
                lastName: 'Johnson',
                username: 'mikej',
                email: 'mike@example.com',
                password: 'password123',
                role: 'user',
                status: 'inactive',
                avatar: 'https://via.placeholder.com/48x48/ffc107/FFFFFF?text=MJ',
                joinedAt: '2023-12-20T11:45:00Z',
                lastLoginAt: '2024-01-10T16:22:00Z'
            }
        ];
        
        // Save users
        AuthManager.saveUser(adminUser);
        sampleUsers.forEach(user => AuthManager.saveUser(user));
    }
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val().trim();
    const rememberMe = $('#rememberMe').is(':checked');
    
    // Clear previous errors
    $('#loginError').hide();
    
    // Validate inputs
    if (!email || !password) {
        showLoginError('Please fill in all fields.');
        return;
    }
    
    // Attempt login
    const user = AuthManager.authenticateUser(email, password);
    
    if (user) {
        // Update last login time
        user.lastLoginAt = new Date().toISOString();
        AuthManager.updateUser(user);
        
        // Set current user
        currentUser = user;
        isAuthenticated = true;
        
        // Save to localStorage
        localStorage.setItem('phewTube_currentUser', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('phewTube_rememberUser', 'true');
        }
        
        // Update UI
        updateAuthUI();
        
        // Redirect based on role
        if (user.role === 'admin') {
            showAdminDashboard();
        } else {
            showHome();
        }
        
        showAuthFeedback('Login successful! Welcome back, ' + user.firstName + '!', 'success');
    } else {
        showLoginError('Invalid email/username or password.');
    }
}

/**
 * Handle registration form submission
 */
function handleRegister(event) {
    event.preventDefault();
    
    const firstName = $('#registerFirstName').val().trim();
    const lastName = $('#registerLastName').val().trim();
    const username = $('#registerUsername').val().trim();
    const email = $('#registerEmail').val().trim();
    const password = $('#registerPassword').val().trim();
    const confirmPassword = $('#confirmPassword').val().trim();
    const agreeTerms = $('#agreeTerms').is(':checked');
    
    // Clear previous messages
    $('#registerError').hide();
    $('#registerSuccess').hide();
    
    // Validate inputs
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        showRegisterError('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        showRegisterError('Passwords do not match.');
        return;
    }
    
    if (password.length < 8) {
        showRegisterError('Password must be at least 8 characters long.');
        return;
    }
    
    if (!agreeTerms) {
        showRegisterError('Please agree to the Terms of Service and Privacy Policy.');
        return;
    }
    
    // Check if username or email already exists
    if (AuthManager.getUserByUsername(username)) {
        showRegisterError('Username already exists. Please choose a different one.');
        return;
    }
    
    if (AuthManager.getUserByEmail(email)) {
        showRegisterError('Email already registered. Please use a different email or sign in.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        firstName,
        lastName,
        username,
        email,
        password, // In real app, this would be hashed
        role: 'user',
        status: 'active',
        avatar: generateUserAvatar(firstName, lastName),
        joinedAt: new Date().toISOString(),
        lastLoginAt: null
    };
    
    // Save user
    AuthManager.saveUser(newUser);
    
    // Show success message
    showRegisterSuccess('Account created successfully! You can now sign in.');
    
    // Clear form
    $('#registerForm')[0].reset();
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        showLogin();
    }, 2000);
}

/**
 * Show login page
 */
function showLogin(updateHistory = true) {
    showPage('loginPage');
    
    if (updateHistory) {
        updateHistory('login');
    }
    
    // Clear form
    $('#loginForm')[0].reset();
    $('#loginError').hide();
    
    currentPage = 'login';
}

/**
 * Show registration page
 */
function showRegister(updateHistory = true) {
    showPage('registerPage');
    
    if (updateHistory) {
        updateHistory('register');
    }
    
    // Clear form
    $('#registerForm')[0].reset();
    $('#registerError').hide();
    $('#registerSuccess').hide();
    
    currentPage = 'register';
}

/**
 * Show admin dashboard
 */
function showAdminDashboard(updateHistory = true) {
    if (!isAuthenticated || currentUser.role !== 'admin') {
        showLogin();
        return;
    }
    
    showPage('adminPage');
    
    if (updateHistory) {
        updateHistory('admin');
    }
    
    // Load admin data
    loadAdminStats();
    loadUserList();
    
    currentPage = 'admin';
}

/**
 * Logout user
 */
function logout() {
    currentUser = null;
    isAuthenticated = false;
    
    // Clear localStorage
    localStorage.removeItem('phewTube_currentUser');
    localStorage.removeItem('phewTube_rememberUser');
    
    // Update UI
    updateAuthUI();
    
    // Redirect to home
    showHome();
    
    showAuthFeedback('You have been logged out successfully.', 'info');
}

/**
 * Admin logout
 */
function adminLogout() {
    logout();
}

/**
 * Update authentication UI
 */
function updateAuthUI() {
    if (isAuthenticated && currentUser) {
        // Show user menu, hide auth buttons
        $('#userMenu').show();
        $('#authButtons').hide();
        
        // Update user info
        $('#userDisplayName').text(currentUser.firstName + ' ' + currentUser.lastName);
        $('#userAvatar').attr('src', currentUser.avatar);
        
        // Show admin link if user is admin
        if (currentUser.role === 'admin') {
            $('#adminDashboardLink').show();
        } else {
            $('#adminDashboardLink').hide();
        }
    } else {
        // Show auth buttons, hide user menu
        $('#userMenu').hide();
        $('#authButtons').show();
        $('#adminDashboardLink').hide();
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + 'Icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'bi bi-eye';
    }
}

/**
 * Generate user avatar
 */
function generateUserAvatar(firstName, lastName) {
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const colors = ['007bff', '28a745', 'dc3545', 'ffc107', '17a2b8', '6f42c1', 'fd7e14'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://via.placeholder.com/48x48/${color}/FFFFFF?text=${initials}`;
}

/**
 * Show login error
 */
function showLoginError(message) {
    $('#loginError').text(message).show();
}

/**
 * Show register error
 */
function showRegisterError(message) {
    $('#registerError').text(message).show();
}

/**
 * Show register success
 */
function showRegisterSuccess(message) {
    $('#registerSuccess').text(message).show();
}

/**
 * Show auth feedback
 */
function showAuthFeedback(message, type = 'success') {
    const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-danger' : 'alert-info';
    const feedback = $(`
        <div class="auth-feedback alert ${alertClass} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(feedback);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        feedback.fadeOut(() => feedback.remove());
    }, 5000);
}

/**
 * Load admin statistics
 */
function loadAdminStats() {
    const users = AuthManager.getAllUsers();
    const activeUsers = users.filter(user => user.status === 'active');
    const videos = DataManager.getAllVideos();
    
    let totalComments = 0;
    videos.forEach(video => {
        totalComments += video.comments.length;
        video.comments.forEach(comment => {
            if (comment.replies) {
                totalComments += comment.replies.length;
            }
        });
    });
    
    $('#totalUsers').text(users.length);
    $('#activeUsers').text(activeUsers.length);
    $('#totalVideos').text(videos.length);
    $('#totalComments').text(totalComments);
}

/**
 * Load user list for admin
 */
function loadUserList() {
    const users = AuthManager.getAllUsers();
    const tbody = $('#userTableBody');
    tbody.empty();
    
    users.forEach(user => {
        const row = createUserRow(user);
        tbody.append(row);
    });
}

/**
 * Create user table row
 */
function createUserRow(user) {
    const joinedDate = new Date(user.joinedAt).toLocaleDateString();
    const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never';
    const statusBadge = user.status === 'active' ? 
        '<span class="badge bg-success">Active</span>' : 
        '<span class="badge bg-secondary">Inactive</span>';
    const roleBadge = user.role === 'admin' ? 
        '<span class="badge bg-danger">Admin</span>' : 
        '<span class="badge bg-primary">User</span>';
    
    return `
        <tr>
            <td><img src="${user.avatar}" alt="${user.username}" class="rounded-circle" width="40" height="40"></td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>@${user.username}</td>
            <td>${user.email}</td>
            <td>${roleBadge}</td>
            <td>${statusBadge}</td>
            <td>${joinedDate}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editUser('${user.id}')" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-${user.status === 'active' ? 'warning' : 'success'}" 
                            onclick="toggleUserStatus('${user.id}')" 
                            title="${user.status === 'active' ? 'Deactivate' : 'Activate'}">
                        <i class="bi bi-${user.status === 'active' ? 'pause' : 'play'}"></i>
                    </button>
                    ${user.role !== 'admin' ? `
                    <button class="btn btn-outline-danger" onclick="deleteUser('${user.id}')" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
}

/**
 * Refresh user list
 */
function refreshUserList() {
    loadUserList();
    loadAdminStats();
}

/**
 * Toggle user status
 */
function toggleUserStatus(userId) {
    const user = AuthManager.getUserById(userId);
    if (user && user.role !== 'admin') {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        AuthManager.updateUser(user);
        loadUserList();
        loadAdminStats();
        showAuthFeedback(`User ${user.username} has been ${user.status === 'active' ? 'activated' : 'deactivated'}.`, 'success');
    }
}

/**
 * Delete user
 */
function deleteUser(userId) {
    const user = AuthManager.getUserById(userId);
    if (user && user.role !== 'admin') {
        if (confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
            AuthManager.deleteUser(userId);
            loadUserList();
            loadAdminStats();
            showAuthFeedback(`User ${user.username} has been deleted.`, 'success');
        }
    }
}

/**
 * Edit user (placeholder)
 */
function editUser(userId) {
    const user = AuthManager.getUserById(userId);
    if (user) {
        alert(`Edit user functionality would open a modal for: ${user.firstName} ${user.lastName}`);
        // In a real implementation, this would open a modal with user edit form
    }
}
