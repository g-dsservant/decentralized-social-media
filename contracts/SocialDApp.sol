// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title SocialDApp - Minimal decentralized social media
/// @notice Stores profiles, posts (IPFS CID pointers), follows, likes, and comments
contract SocialDApp {
    struct User {
        string username;
        string bio;
        string avatarCid; // IPFS CID for avatar
        bool registered;
    }

    struct Post {
        uint256 id;
        address author;
        string contentCid; // IPFS CID pointing to post content (text/media JSON)
        uint256 timestamp;
        uint256 likes;
    }

    // New: Comment struct for on-chain comments
    struct Comment {
        address author;
        string text;
        uint256 timestamp;
    }

    // user address => User
    mapping(address => User) public users;

    // postId => Post
    mapping(uint256 => Post) public posts;
    uint256 public postCount;

    // follower relationships: follower => followee => bool
    mapping(address => mapping(address => bool)) public follows;

    // Prevent double likes: postId => liker => bool
    mapping(uint256 => mapping(address => bool)) public liked;

    // author => array of postIds
    mapping(address => uint256[]) private postsByUser;

    // New: postId => array of comments
    mapping(uint256 => Comment[]) public postComments;

    // events
    event UserRegistered(address indexed user, string username, string avatarCid);
    event ProfileUpdated(address indexed user, string username, string avatarCid);
    event PostCreated(uint256 indexed postId, address indexed author, string contentCid, uint256 timestamp);
    event Followed(address indexed follower, address indexed followee);
    event Unfollowed(address indexed follower, address indexed followee);
    event PostLiked(uint256 indexed postId, address indexed liker);

    // New: comment event
    event CommentAdded(uint256 indexed postId, address indexed author, string text);

    modifier onlyRegistered() {
        require(users[msg.sender].registered, "Not registered");
        _;
    }

    /// @notice Register or overwrite profile
    function register(string calldata username, string calldata bio, string calldata avatarCid) external {
        users[msg.sender] = User({
            username: username,
            bio: bio,
            avatarCid: avatarCid,
            registered: true
        });
        emit UserRegistered(msg.sender, username, avatarCid);
    }

    /// @notice Update profile
    function updateProfile(string calldata username, string calldata bio, string calldata avatarCid) external onlyRegistered {
        users[msg.sender].username = username;
        users[msg.sender].bio = bio;
        users[msg.sender].avatarCid = avatarCid;
        emit ProfileUpdated(msg.sender, username, avatarCid);
    }

    /// @notice Create a post, contentCid is IPFS CID of the post JSON (text, media)
    function createPost(string calldata contentCid) external onlyRegistered {
        postCount++;
        posts[postCount] = Post({
            id: postCount,
            author: msg.sender,
            contentCid: contentCid,
            timestamp: block.timestamp,
            likes: 0
        });
        postsByUser[msg.sender].push(postCount);
        emit PostCreated(postCount, msg.sender, contentCid, block.timestamp);
    }

    /// @notice Follow a user
    function follow(address userToFollow) external onlyRegistered {
        require(userToFollow != msg.sender, "Cannot follow self");
        require(users[userToFollow].registered, "Target not registered");
        require(!follows[msg.sender][userToFollow], "Already following");
        follows[msg.sender][userToFollow] = true;
        emit Followed(msg.sender, userToFollow);
    }

    /// @notice Unfollow
    function unfollow(address userToUnfollow) external onlyRegistered {
        require(follows[msg.sender][userToUnfollow], "Not following");
        follows[msg.sender][userToUnfollow] = false;
        emit Unfollowed(msg.sender, userToUnfollow);
    }

    /// @notice Like a post (prevents double-like)
    function likePost(uint256 postId) external onlyRegistered {
        require(postId > 0 && postId <= postCount, "Invalid postId");
        require(!liked[postId][msg.sender], "Already liked");
        liked[postId][msg.sender] = true;
        posts[postId].likes++;
        emit PostLiked(postId, msg.sender);
    }

    /// @notice Add a comment to a post (on-chain)
    function addComment(uint256 postId, string calldata text) external onlyRegistered {
        require(postId > 0 && postId <= postCount, "Invalid postId");
        require(bytes(text).length > 0, "Empty comment");
        postComments[postId].push(Comment({
            author: msg.sender,
            text: text,
            timestamp: block.timestamp
        }));
        emit CommentAdded(postId, msg.sender, text);
    }

    /// @notice Get post IDs for a given user
    function getPostsByUser(address user) external view returns (uint256[] memory) {
        return postsByUser[user];
    }

    /// @notice Get user profile
    function getUser(address user) external view returns (string memory username, string memory bio, string memory avatarCid, bool registered) {
        User storage u = users[user];
        return (u.username, u.bio, u.avatarCid, u.registered);
    }

    // --- Convenience views added for frontend use ---

    /// @notice Return number of comments for a post
    function commentCount(uint256 postId) external view returns (uint256) {
        require(postId > 0 && postId <= postCount, "Invalid postId");
        return postComments[postId].length;
    }

    /// @notice Return a specific comment for a post
    function getComment(uint256 postId, uint256 index) external view returns (address author, string memory text, uint256 timestamp) {
        require(postId > 0 && postId <= postCount, "Invalid postId");
        require(index < postComments[postId].length, "Comment not found");
        Comment storage c = postComments[postId][index];
        return (c.author, c.text, c.timestamp);
    }

    /// @notice Returns whether `user` has liked post `postId`
    function hasLiked(uint256 postId, address user) external view returns (bool) {
        if (postId == 0 || postId > postCount) return false;
        return liked[postId][user];
    }

    /// @notice Returns whether `follower` follows `followee`
    function isFollowing(address follower, address followee) external view returns (bool) {
        return follows[follower][followee];
    }
}
