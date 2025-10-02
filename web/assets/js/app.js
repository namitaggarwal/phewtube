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
