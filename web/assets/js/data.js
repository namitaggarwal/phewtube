/**
 * phewTube Sample Data
 * Contains sample video data, channels, and comments for the application
 */

// Sample video data - using public domain/creative commons videos and placeholder images
const SAMPLE_VIDEOS = [
    {
        id: 'vid_001',
        title: 'Amazing Nature Documentary - Wildlife in 4K',
        description: 'Explore the breathtaking beauty of nature in this stunning 4K wildlife documentary. From majestic lions to colorful tropical birds, witness the incredible diversity of our planet\'s wildlife.',
        channel: {
            id: 'ch_001',
            name: 'Nature Explorer',
            avatar: 'https://via.placeholder.com/48x48/4CAF50/FFFFFF?text=NE',
            subscribers: '2.4M subscribers',
            subscribed: false
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/2E7D32/FFFFFF?text=Nature+Doc',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        views: 1234567,
        uploadedAt: '2024-01-15T10:30:00Z',
        duration: '12:34',
        category: 'education',
        likes: 45672,
        dislikes: 1234,
        comments: [
            {
                id: 'com_001',
                author: 'WildlifeEnthusiast',
                avatar: 'https://via.placeholder.com/40x40/FF9800/FFFFFF?text=WE',
                text: 'Absolutely stunning footage! The cinematography is incredible.',
                timestamp: '2024-01-16T14:22:00Z',
                likes: 234,
                replies: []
            },
            {
                id: 'com_002',
                author: 'NatureLover123',
                avatar: 'https://via.placeholder.com/40x40/9C27B0/FFFFFF?text=NL',
                text: 'This makes me want to travel and see these animals in person!',
                timestamp: '2024-01-16T16:45:00Z',
                likes: 89,
                replies: [
                    {
                        id: 'rep_001',
                        author: 'TravelBug',
                        avatar: 'https://via.placeholder.com/32x32/F44336/FFFFFF?text=TB',
                        text: 'Same here! Already planning my next safari trip.',
                        timestamp: '2024-01-16T17:12:00Z',
                        likes: 12
                    }
                ]
            }
        ]
    },
    {
        id: 'vid_002',
        title: 'Learn JavaScript in 30 Minutes - Complete Beginner Tutorial',
        description: 'Master the fundamentals of JavaScript programming in just 30 minutes. Perfect for beginners who want to start their coding journey.',
        channel: {
            id: 'ch_002',
            name: 'CodeMaster Pro',
            avatar: 'https://via.placeholder.com/48x48/2196F3/FFFFFF?text=CM',
            subscribers: '890K subscribers',
            subscribed: true
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/1976D2/FFFFFF?text=JS+Tutorial',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        views: 567890,
        uploadedAt: '2024-01-10T09:15:00Z',
        duration: '29:45',
        category: 'education',
        likes: 23456,
        dislikes: 567,
        comments: [
            {
                id: 'com_003',
                author: 'BeginnerCoder',
                avatar: 'https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=BC',
                text: 'This tutorial helped me understand JavaScript concepts so much better!',
                timestamp: '2024-01-11T11:30:00Z',
                likes: 156,
                replies: []
            }
        ]
    },
    {
        id: 'vid_003',
        title: 'Epic Gaming Moments - Best Plays Compilation',
        description: 'Watch the most incredible gaming moments and epic plays from various popular games. These clips will blow your mind!',
        channel: {
            id: 'ch_003',
            name: 'GameHighlights',
            avatar: 'https://via.placeholder.com/48x48/FF5722/FFFFFF?text=GH',
            subscribers: '1.2M subscribers',
            subscribed: false
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/FF3D00/FFFFFF?text=Gaming+Compilation',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        views: 2345678,
        uploadedAt: '2024-01-12T20:45:00Z',
        duration: '15:23',
        category: 'gaming',
        likes: 78901,
        dislikes: 2345,
        comments: [
            {
                id: 'com_004',
                author: 'ProGamer2024',
                avatar: 'https://via.placeholder.com/40x40/E91E63/FFFFFF?text=PG',
                text: 'That headshot at 8:45 was insane! 🔥',
                timestamp: '2024-01-13T08:20:00Z',
                likes: 445,
                replies: []
            }
        ]
    },
    {
        id: 'vid_004',
        title: 'Relaxing Piano Music for Study and Work',
        description: 'Beautiful piano melodies to help you focus while studying or working. Perfect background music for productivity.',
        channel: {
            id: 'ch_004',
            name: 'Peaceful Sounds',
            avatar: 'https://via.placeholder.com/48x48/9E9E9E/FFFFFF?text=PS',
            subscribers: '3.1M subscribers',
            subscribed: true
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/607D8B/FFFFFF?text=Piano+Music',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        views: 5678901,
        uploadedAt: '2024-01-08T12:00:00Z',
        duration: '1:23:45',
        category: 'music',
        likes: 123456,
        dislikes: 890,
        comments: [
            {
                id: 'com_005',
                author: 'StudyBuddy',
                avatar: 'https://via.placeholder.com/40x40/795548/FFFFFF?text=SB',
                text: 'This music helps me concentrate so much better. Thank you!',
                timestamp: '2024-01-09T14:15:00Z',
                likes: 678,
                replies: []
            }
        ]
    },
    {
        id: 'vid_005',
        title: 'Street Food Around the World - Delicious Adventures',
        description: 'Join us on a culinary journey exploring the most delicious street food from different countries. Your taste buds will thank you!',
        channel: {
            id: 'ch_005',
            name: 'Foodie Adventures',
            avatar: 'https://via.placeholder.com/48x48/FF9800/FFFFFF?text=FA',
            subscribers: '1.8M subscribers',
            subscribed: false
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/F57C00/FFFFFF?text=Street+Food',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        views: 3456789,
        uploadedAt: '2024-01-14T18:30:00Z',
        duration: '18:56',
        category: 'entertainment',
        likes: 89012,
        dislikes: 1567,
        comments: [
            {
                id: 'com_006',
                author: 'FoodLover88',
                avatar: 'https://via.placeholder.com/40x40/8BC34A/FFFFFF?text=FL',
                text: 'Now I\'m craving tacos! Great video as always.',
                timestamp: '2024-01-15T09:45:00Z',
                likes: 234,
                replies: []
            }
        ]
    },
    {
        id: 'vid_006',
        title: 'Morning Yoga Routine - 20 Minutes for Beginners',
        description: 'Start your day right with this gentle 20-minute yoga routine designed specifically for beginners. No equipment needed!',
        channel: {
            id: 'ch_006',
            name: 'Zen Fitness',
            avatar: 'https://via.placeholder.com/48x48/00BCD4/FFFFFF?text=ZF',
            subscribers: '756K subscribers',
            subscribed: true
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/0097A7/FFFFFF?text=Yoga+Routine',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        views: 987654,
        uploadedAt: '2024-01-11T06:00:00Z',
        duration: '20:12',
        category: 'sports',
        likes: 34567,
        dislikes: 456,
        comments: [
            {
                id: 'com_007',
                author: 'YogaNewbie',
                avatar: 'https://via.placeholder.com/40x40/CDDC39/FFFFFF?text=YN',
                text: 'Perfect for beginners like me! Following along every morning now.',
                timestamp: '2024-01-12T07:30:00Z',
                likes: 123,
                replies: []
            }
        ]
    },
    {
        id: 'vid_007',
        title: 'DIY Home Decor Ideas - Transform Your Space on a Budget',
        description: 'Discover amazing DIY home decor ideas that won\'t break the bank. Transform your living space with these creative and affordable projects.',
        channel: {
            id: 'ch_007',
            name: 'Creative Home',
            avatar: 'https://via.placeholder.com/48x48/E91E63/FFFFFF?text=CH',
            subscribers: '1.3M subscribers',
            subscribed: false
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/C2185B/FFFFFF?text=DIY+Decor',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        views: 1876543,
        uploadedAt: '2024-01-13T15:20:00Z',
        duration: '14:33',
        category: 'entertainment',
        likes: 56789,
        dislikes: 1234,
        comments: [
            {
                id: 'com_008',
                author: 'DIYEnthusiast',
                avatar: 'https://via.placeholder.com/40x40/673AB7/FFFFFF?text=DE',
                text: 'Already tried 3 of these projects and they look amazing!',
                timestamp: '2024-01-14T10:15:00Z',
                likes: 289,
                replies: []
            }
        ]
    },
    {
        id: 'vid_008',
        title: 'Space Exploration Documentary - Journey to Mars',
        description: 'Explore humanity\'s greatest adventure as we journey toward Mars. Learn about the challenges and breakthroughs in space exploration.',
        channel: {
            id: 'ch_008',
            name: 'Space Science',
            avatar: 'https://via.placeholder.com/48x48/3F51B5/FFFFFF?text=SS',
            subscribers: '2.9M subscribers',
            subscribed: true
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/303F9F/FFFFFF?text=Mars+Journey',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        views: 4567890,
        uploadedAt: '2024-01-09T14:45:00Z',
        duration: '45:12',
        category: 'education',
        likes: 167890,
        dislikes: 3456,
        comments: [
            {
                id: 'com_009',
                author: 'SpaceExplorer',
                avatar: 'https://via.placeholder.com/40x40/009688/FFFFFF?text=SE',
                text: 'Fascinating documentary! Can\'t wait for humans to actually reach Mars.',
                timestamp: '2024-01-10T16:30:00Z',
                likes: 567,
                replies: []
            }
        ]
    },
    {
        id: 'vid_009',
        title: 'Quick and Healthy Breakfast Recipes',
        description: 'Start your day with these quick, healthy, and delicious breakfast recipes. Perfect for busy mornings!',
        channel: {
            id: 'ch_009',
            name: 'Healthy Kitchen',
            avatar: 'https://via.placeholder.com/48x48/4CAF50/FFFFFF?text=HK',
            subscribers: '1.1M subscribers',
            subscribed: false
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/388E3C/FFFFFF?text=Healthy+Breakfast',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        views: 876543,
        uploadedAt: '2024-01-16T08:00:00Z',
        duration: '11:28',
        category: 'entertainment',
        likes: 23456,
        dislikes: 345,
        comments: [
            {
                id: 'com_010',
                author: 'HealthyEater',
                avatar: 'https://via.placeholder.com/40x40/FFC107/FFFFFF?text=HE',
                text: 'These recipes are perfect for my morning routine. Thank you!',
                timestamp: '2024-01-16T12:45:00Z',
                likes: 145,
                replies: []
            }
        ]
    },
    {
        id: 'vid_010',
        title: 'Photography Tips for Beginners - Master Your Camera',
        description: 'Learn essential photography techniques and tips that will take your photos from amateur to professional level.',
        channel: {
            id: 'ch_010',
            name: 'Photo Pro Tips',
            avatar: 'https://via.placeholder.com/48x48/795548/FFFFFF?text=PP',
            subscribers: '645K subscribers',
            subscribed: true
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/5D4037/FFFFFF?text=Photography+Tips',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        views: 1345678,
        uploadedAt: '2024-01-07T16:30:00Z',
        duration: '22:17',
        category: 'education',
        likes: 45678,
        dislikes: 789,
        comments: [
            {
                id: 'com_011',
                author: 'AspiringPhotographer',
                avatar: 'https://via.placeholder.com/40x40/607D8B/FFFFFF?text=AP',
                text: 'The composition tips really helped improve my photos!',
                timestamp: '2024-01-08T14:20:00Z',
                likes: 234,
                replies: []
            }
        ]
    },
    {
        id: 'vid_011',
        title: 'Top 10 Travel Destinations for 2024',
        description: 'Discover the most amazing travel destinations you should visit in 2024. From hidden gems to popular hotspots!',
        channel: {
            id: 'ch_011',
            name: 'Wanderlust Travel',
            avatar: 'https://via.placeholder.com/48x48/FF5722/FFFFFF?text=WT',
            subscribers: '2.2M subscribers',
            subscribed: false
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/E64A19/FFFFFF?text=Travel+2024',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        views: 3789012,
        uploadedAt: '2024-01-05T11:15:00Z',
        duration: '16:42',
        category: 'entertainment',
        likes: 134567,
        dislikes: 2890,
        comments: [
            {
                id: 'com_012',
                author: 'TravelAddict',
                avatar: 'https://via.placeholder.com/40x40/FF9800/FFFFFF?text=TA',
                text: 'Already booked my trip to Bali after watching this!',
                timestamp: '2024-01-06T09:30:00Z',
                likes: 456,
                replies: []
            }
        ]
    },
    {
        id: 'vid_012',
        title: 'Meditation for Stress Relief - 15 Minute Guided Session',
        description: 'Relax and reduce stress with this 15-minute guided meditation session. Perfect for beginners and experienced meditators alike.',
        channel: {
            id: 'ch_012',
            name: 'Mindful Moments',
            avatar: 'https://via.placeholder.com/48x48/9C27B0/FFFFFF?text=MM',
            subscribers: '987K subscribers',
            subscribed: true
        },
        thumbnailUrl: 'https://via.placeholder.com/320x180/7B1FA2/FFFFFF?text=Meditation',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        views: 2567890,
        uploadedAt: '2024-01-06T19:00:00Z',
        duration: '15:00',
        category: 'sports',
        likes: 89012,
        dislikes: 567,
        comments: [
            {
                id: 'com_013',
                author: 'StressedStudent',
                avatar: 'https://via.placeholder.com/40x40/00BCD4/FFFFFF?text=SS',
                text: 'This meditation session helps me so much during exam season!',
                timestamp: '2024-01-07T20:15:00Z',
                likes: 345,
                replies: []
            }
        ]
    }
];

// Channels data
const CHANNELS = {};
SAMPLE_VIDEOS.forEach(video => {
    if (!CHANNELS[video.channel.id]) {
        CHANNELS[video.channel.id] = {
            ...video.channel,
            videos: [],
            description: `Welcome to ${video.channel.name}! We create amazing content for our viewers.`,
            joinedDate: '2020-03-15',
            totalViews: 0
        };
    }
    CHANNELS[video.channel.id].videos.push(video.id);
    CHANNELS[video.channel.id].totalViews += video.views;
});

// User data (localStorage keys)
const USER_DATA_KEYS = {
    LIKED_VIDEOS: 'phewTube_liked_videos',
    DISLIKED_VIDEOS: 'phewTube_disliked_videos',
    SUBSCRIBED_CHANNELS: 'phewTube_subscribed_channels',
    WATCH_HISTORY: 'phewTube_watch_history',
    WATCH_LATER: 'phewTube_watch_later'
};

// Utility functions for data management
const DataManager = {
    // Get all videos
    getAllVideos() {
        return [...SAMPLE_VIDEOS];
    },

    // Get video by ID
    getVideoById(id) {
        return SAMPLE_VIDEOS.find(video => video.id === id);
    },

    // Get videos by channel ID
    getVideosByChannel(channelId) {
        return SAMPLE_VIDEOS.filter(video => video.channel.id === channelId);
    },

    // Get channel by ID
    getChannelById(id) {
        return CHANNELS[id];
    },

    // Search videos
    searchVideos(query) {
        const searchTerm = query.toLowerCase();
        return SAMPLE_VIDEOS.filter(video => 
            video.title.toLowerCase().includes(searchTerm) ||
            video.description.toLowerCase().includes(searchTerm) ||
            video.channel.name.toLowerCase().includes(searchTerm) ||
            video.category.toLowerCase().includes(searchTerm)
        );
    },

    // Sort videos
    sortVideos(videos, sortBy) {
        const videosCopy = [...videos];
        switch (sortBy) {
            case 'latest':
                return videosCopy.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
            case 'popular':
                return videosCopy.sort((a, b) => b.views - a.views);
            case 'trending':
                // Simple trending algorithm: views per day since upload
                return videosCopy.sort((a, b) => {
                    const aDaysOld = (Date.now() - new Date(a.uploadedAt)) / (1000 * 60 * 60 * 24);
                    const bDaysOld = (Date.now() - new Date(b.uploadedAt)) / (1000 * 60 * 60 * 24);
                    const aTrending = a.views / Math.max(aDaysOld, 1);
                    const bTrending = b.views / Math.max(bDaysOld, 1);
                    return bTrending - aTrending;
                });
            default:
                return videosCopy;
        }
    },

    // Get suggested videos (exclude current video)
    getSuggestedVideos(currentVideoId, limit = 10) {
        const otherVideos = SAMPLE_VIDEOS.filter(video => video.id !== currentVideoId);
        // Simple recommendation: sort by views and return top N
        return this.sortVideos(otherVideos, 'popular').slice(0, limit);
    },

    // LocalStorage helpers
    getLikedVideos() {
        return JSON.parse(localStorage.getItem(USER_DATA_KEYS.LIKED_VIDEOS) || '[]');
    },

    setLikedVideos(likedVideos) {
        localStorage.setItem(USER_DATA_KEYS.LIKED_VIDEOS, JSON.stringify(likedVideos));
    },

    getDislikedVideos() {
        return JSON.parse(localStorage.getItem(USER_DATA_KEYS.DISLIKED_VIDEOS) || '[]');
    },

    setDislikedVideos(dislikedVideos) {
        localStorage.setItem(USER_DATA_KEYS.DISLIKED_VIDEOS, JSON.stringify(dislikedVideos));
    },

    getSubscribedChannels() {
        return JSON.parse(localStorage.getItem(USER_DATA_KEYS.SUBSCRIBED_CHANNELS) || '[]');
    },

    setSubscribedChannels(subscribedChannels) {
        localStorage.setItem(USER_DATA_KEYS.SUBSCRIBED_CHANNELS, JSON.stringify(subscribedChannels));
    },

    getWatchHistory() {
        return JSON.parse(localStorage.getItem(USER_DATA_KEYS.WATCH_HISTORY) || '[]');
    },

    addToWatchHistory(videoId) {
        const history = this.getWatchHistory();
        // Remove if exists and add to beginning
        const filteredHistory = history.filter(id => id !== videoId);
        filteredHistory.unshift(videoId);
        // Keep only last 100 videos
        const limitedHistory = filteredHistory.slice(0, 100);
        localStorage.setItem(USER_DATA_KEYS.WATCH_HISTORY, JSON.stringify(limitedHistory));
    },

    getWatchLater() {
        return JSON.parse(localStorage.getItem(USER_DATA_KEYS.WATCH_LATER) || '[]');
    },

    setWatchLater(watchLater) {
        localStorage.setItem(USER_DATA_KEYS.WATCH_LATER, JSON.stringify(watchLater));
    },

    // Format helpers
    formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M views';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K views';
        }
        return views + ' views';
    },

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    },

    formatDuration(duration) {
        // Duration is already in MM:SS or HH:MM:SS format
        return duration;
    },

    // Add new video (for upload simulation)
    addVideo(videoData) {
        const newVideo = {
            id: 'vid_' + Date.now(),
            title: videoData.title,
            description: videoData.description,
            channel: {
                id: 'ch_user',
                name: 'Your Channel',
                avatar: 'assets/img/user-avatar.svg',
                subscribers: '1 subscriber',
                subscribed: false
            },
            thumbnailUrl: videoData.thumbnailUrl || 'https://via.placeholder.com/320x180/666666/FFFFFF?text=Your+Video',
            videoUrl: videoData.videoUrl || '#',
            views: 0,
            uploadedAt: new Date().toISOString(),
            duration: '0:00',
            category: videoData.category || 'entertainment',
            likes: 0,
            dislikes: 0,
            comments: []
        };

        SAMPLE_VIDEOS.unshift(newVideo);
        return newVideo;
    }
};

// Export for use in other scripts
window.DataManager = DataManager;
window.SAMPLE_VIDEOS = SAMPLE_VIDEOS;
window.CHANNELS = CHANNELS;
