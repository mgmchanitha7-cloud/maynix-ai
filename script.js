alert("MAYNIX AI JavaScript Connected!");
// =================================
// MAYNIX AI - MAIN JAVASCRIPT
// =================================

const $ = (id) => document.getElementById(id);


// =================================
// 1. MOBILE NAVIGATION
// =================================

const menuBtn = $("menuBtn");
const navbar = $("navbar");

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("open");

});

navbar.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {
        navbar.classList.remove("open");
    });

});


// =================================
// 2. NOTIFICATION
// =================================

function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}


// =================================
// 3. LOGIN & SIGNUP MODAL
// =================================

const authModal = $("authModal");

function openAuth() {

    authModal.hidden = false;
    selectAuthMode("login");

}

function closeAuth() {

    authModal.hidden = true;

}

function selectAuthMode(mode) {

    const loginMode = mode === "login";

    $("loginForm").hidden = !loginMode;
    $("signupForm").hidden = loginMode;

    $("loginTab").classList.toggle(
        "active",
        loginMode
    );

    $("signupTab").classList.toggle(
        "active",
        !loginMode
    );

    $("authMessage").textContent = "";

}

$("openLogin").addEventListener("click", () => {

    if (currentUser) {
        $("dashboard").scrollIntoView({
            behavior: "smooth"
        });
    } else {
        openAuth();
    }

});

$("closeAuth").addEventListener("click", closeAuth);

authModal.addEventListener("click", event => {

    if (event.target === authModal) {
        closeAuth();
    }

});

$("loginTab").addEventListener("click", () => {
    selectAuthMode("login");
});

$("signupTab").addEventListener("click", () => {
    selectAuthMode("signup");
});


// =================================
// 4. DEMO USER DATABASE
// =================================

// This is a local demo database.
// Passwords are NOT encrypted.
// Never use real passwords here.

function getUsers() {

    try {
        return JSON.parse(
            localStorage.getItem("maynixUsers")
        ) || [];
    } catch (error) {
        return [];
    }

}

function saveUsers(users) {

    localStorage.setItem(
        "maynixUsers",
        JSON.stringify(users)
    );

}


// =================================
// 5. CURRENT USER
// =================================

let currentUser = null;

function showDashboard(user) {

    currentUser = user;

    sessionStorage.setItem(
        "maynixCurrentUser",
        JSON.stringify(user)
    );

    $("dashboard").hidden = false;

    $("welcomeName").textContent =
        "Welcome, " + user.name + "!";

    $("dashboardEmail").textContent =
        user.email;

    $("openLogin").textContent = "DASHBOARD";

}

function hideDashboard() {

    $("dashboard").hidden = true;

    currentUser = null;

    sessionStorage.removeItem(
        "maynixCurrentUser"
    );

    $("openLogin").textContent = "LOGIN";

}


// =================================
// 6. SIGNUP
// =================================

$("signupForm").addEventListener("submit", event => {

    event.preventDefault();

    const name = $("signupName").value.trim();

    const email = $("signupEmail")
        .value.trim().toLowerCase();

    const password = $("signupPassword").value;

    const users = getUsers();

    if (password.length < 6) {

        $("authMessage").textContent =
            "Password must have at least 6 characters.";

        return;

    }

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {

        $("authMessage").textContent =
            "This email is already registered. Please login.";

        return;

    }

    const newUser = {
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);

    try {
        saveUsers(users);
    } catch (error) {
        $("authMessage").textContent =
            "Could not save account in this browser.";
        return;
    }

    showDashboard(newUser);

    closeAuth();

    $("signupForm").reset();

    showToast("Account created successfully!");

    $("dashboard").scrollIntoView({
        behavior: "smooth"
    });

});


// =================================
// 7. LOGIN
// =================================

$("loginForm").addEventListener("submit", event => {

    event.preventDefault();

    const email = $("loginEmail")
        .value.trim().toLowerCase();

    const password = $("loginPassword").value;

    const users = getUsers();

    const foundUser = users.find(user => {

        return user.email === email &&
               user.password === password;

    });

    if (!foundUser) {

        $("authMessage").textContent =
            "Incorrect email or password!";

        return;

    }

    showDashboard(foundUser);

    closeAuth();

    $("loginForm").reset();

    showToast("Login successful!");

    $("dashboard").scrollIntoView({
        behavior: "smooth"
    });

});


// =================================
// 8. RESTORE LOGIN SESSION
// =================================

try {

    const savedUser = sessionStorage.getItem(
        "maynixCurrentUser"
    );

    if (savedUser) {

        const user = JSON.parse(savedUser);

        showDashboard(user);

    }

} catch (error) {

    sessionStorage.removeItem(
        "maynixCurrentUser"
    );

}


// =================================
// 9. LOGOUT
// =================================

$("logoutBtn").addEventListener("click", () => {

    hideDashboard();

    showToast("Logged out successfully!");

    $("home").scrollIntoView({
        behavior: "smooth"
    });

});


// =================================
// 10. CHATBOT OPEN / CLOSE
// =================================

$("chatToggle").addEventListener("click", () => {

    $("chatPanel").hidden =
        !$("chatPanel").hidden;

});

$("closeChat").addEventListener("click", () => {

    $("chatPanel").hidden = true;

});


// =================================
// 11. CHATBOT ANSWERS
// =================================

function getBotReply(message) {

    const msg = message.toLowerCase();

    if (
        msg.includes("hello") ||
        msg.includes("hi") ||
        msg.includes("hey") ||
        msg.includes("ayubowan")
    ) {

        return "Hello! Welcome to MAYNIX AI. How can I help you?";

    }

    if (
        msg.includes("name")
    ) {

        return "My name is MAYNIX AI Assistant!";

    }

    if (
        msg.includes("service")
    ) {

        return "MAYNIX offers AI Technology, Web Design and Digital Design.";

    }

    if (
        msg.includes("about")
    ) {

        return "MAYNIX AI is a modern digital platform.";

    }

    if (
        msg.includes("help")
    ) {

        return "Sure! Ask me about MAYNIX services and technology.";

    }

    if (
        msg.includes("thank")
    ) {

        return "You're welcome! Have a wonderful day.";

    }

    if (
        msg.includes("kohomada")
    ) {

        return "Mama hondin! Oyata kohomada?";

    }

    return "Thanks for your message! I am a demo assistant. A live AI connection will be added later.";

}


// =================================
// 12. DISPLAY CHAT MESSAGES
// =================================

function addMessage(message, type) {

    const messages = $("chatMessages");

    const bubble = document.createElement("div");

    bubble.className =
        type === "user"
        ? "user-message"
        : "bot-message";

    bubble.textContent = message;

    messages.appendChild(bubble);

    messages.scrollTop = messages.scrollHeight;

}


// =================================
// 13. SEND CHAT MESSAGE
// =================================

$("chatForm").addEventListener("submit", event => {

    event.preventDefault();

    const input = $("chatInput");

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");

    input.value = "";

    setTimeout(() => {

        const reply = getBotReply(message);

        addMessage(reply, "bot");

    }, 500);

});


console.log("MAYNIX AI Website Loaded!");

/* IMAGE GALLERY PREVIEW */

// MAYNIX AI IMAGE GALLERY PREVIEW

const imagePreview = $("imagePreview");
const previewImage = $("previewImage");
const previewCaption = $("previewCaption");
const closePreview = $("closePreview");

document.querySelectorAll(".gallery-item").forEach(item => {

    item.addEventListener("click", function () {

        const img = this.querySelector("img");
        const caption = this.querySelector(".gallery-caption");

        if (!img) return;

        previewImage.src = img.src;

        previewCaption.textContent =
            caption ? caption.textContent : "";

        imagePreview.hidden = false;

    });

});

closePreview.addEventListener("click", function () {

    imagePreview.hidden = true;
    previewImage.src = "";

});

imagePreview.addEventListener("click", function (event) {

    if (event.target === imagePreview) {

        imagePreview.hidden = true;
        previewImage.src = "";

    }

});