import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref as dbRef, push, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { firebaseConfig } from '../script/firebasecr.js';
import { onAuthChange } from '../script/auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

const createPostSection = document.getElementById('createPostSection');
const createPostForm = document.getElementById('createPostForm');
const blogPostsContainer = document.getElementById('blogPostsContainer');

// Show/Hide create post form based on auth state and set default tab
onAuthChange(user => {
    const createPostTabButton = document.querySelector('.tab-button[onclick*="createPostTab"]');
    const messagesTabButton = document.querySelector('.tab-button[onclick*="messagesTab"]');
    const createPostTabContent = document.getElementById('createPostTab');
    const messagesTabContent = document.getElementById('messagesTab');

    if (user) {
        // User is logged in, show create post section and make its tab active
        if (createPostTabContent) createPostTabContent.style.display = 'block';
        if (messagesTabContent) messagesTabContent.style.display = 'none';
        if (createPostTabButton) createPostTabButton.classList.add('active');
        if (messagesTabButton) messagesTabButton.classList.remove('active');
        // The createPostSection div itself is inside createPostTab, so its display is handled by the tab
    } else {
        // User is not logged in, hide create post section and make messages tab active
        if (createPostTabContent) createPostTabContent.style.display = 'none';
        if (messagesTabContent) messagesTabContent.style.display = 'block'; // Show messages tab
        if (createPostTabButton) createPostTabButton.classList.remove('active');
        if (messagesTabButton) messagesTabButton.classList.add('active');
    }
});

// Handle Post Creation
if (createPostForm) {
    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in to create a post.');
            return;
        }

        const title = createPostForm.postTitle.value;
        const category = createPostForm.postCategory.value;
        const content = createPostForm.postContent.value;
        const imageFile = createPostForm.postImage.files[0];
        let imageUrl = '';

        if (imageFile) {
            const imageStorageRef = storageRef(storage, `blogImages/${user.uid}/${Date.now()}_${imageFile.name}`);
            try {
                const snapshot = await uploadBytes(imageStorageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error('Error uploading image: ', error);
                alert('Error uploading image. Please try again.');
                return;
            }
        }

        try {
            await push(dbRef(database, 'blogPosts'), {
                title,
                category,
                content,
                imageUrl,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                authorPhotoURL: user.photoURL || '', // Store author's photo URL
                createdAt: serverTimestamp()
            });
            alert('Blog post created successfully!');
            createPostForm.reset();
        } catch (error) {
            console.error('Error creating post: ', error);
            alert('Error creating post. Please try again.');
        }
    });
}

// Fetch and Display Posts
function displayPosts() {
    const postsRef = dbRef(database, 'blogPosts');
    onValue(postsRef, (snapshot) => {
        blogPostsContainer.innerHTML = ''; // Clear existing posts
        if (snapshot.exists()) {
            const posts = [];
            snapshot.forEach((childSnapshot) => {
                posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            // Sort posts by creation date, newest first
            posts.sort((a, b) => b.createdAt - a.createdAt);

            posts.forEach(post => {
                const postElement = document.createElement('li');
                postElement.innerHTML = `
                    <article class="blog-post">
                        <h1 class="blog-post-title">${escapeHTML(post.title)}</h1>
                        <div class="blog-post-meta">
                            <span>Published on: <time datetime="${new Date(post.createdAt).toISOString()}">${new Date(post.createdAt).toLocaleDateString()}</time></span> | 
                            <span>By: ${escapeHTML(post.authorName)}</span> | 
                            <span>Category: <a href="#">${escapeHTML(post.category)}</a></span>
                        </div>
                        ${post.imageUrl ? `<div class="featured-image"><img src="${escapeHTML(post.imageUrl)}" alt="${escapeHTML(post.title)}"></div>` : ''}
                        <p>${escapeHTML(post.content).replace(/\n/g, '<br>')}</p>
                    </article>
                `;
                blogPostsContainer.appendChild(postElement);
            });
        } else {
            blogPostsContainer.innerHTML = '<li><p>No blog posts yet. Be the first to create one!</p></li>';
        }
    }, (error) => {
        console.error("Error fetching posts: ", error);
        blogPostsContainer.innerHTML = '<li><p>Error loading posts. Please try again later.</p></li>';
    });
}

// Helper to escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Load posts when the script runs
if (blogPostsContainer) {
    displayPosts();
}