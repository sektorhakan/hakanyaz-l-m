let users = JSON.parse(localStorage.getItem("users") || "{}");
let currentUserEmail = localStorage.getItem("currentUserEmail") || null;

const userInfo = document.getElementById("userInfo");
const usernameDisplay = document.getElementById("usernameDisplay");
const userAvatar = document.getElementById("userAvatar");
const dropdown = document.getElementById("dropdown");
const welcomeMessage = document.getElementById("welcomeMessage");

const authSection = document.getElementById("auth");
const sections = document.querySelectorAll("section");

/* Bölüm gösterme */
function showSection(id) {
  sections.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* Kullanıcı giriş yaptı */
function loginUIUpdate() {
  authSection.classList.remove("active");
  userInfo.classList.remove("hidden");
  usernameDisplay.textContent = users[currentUserEmail].username;
  if (users[currentUserEmail].avatar) {
    userAvatar.src = users[currentUserEmail].avatar;
  } else {
    userAvatar.src = "https://via.placeholder.com/40";
  }
}

/* Hoşgeldin animasyonu */
function showWelcomeToast(name) {
  welcomeMessage.textContent = `Hoş geldin ${name}!`;
  welcomeMessage.classList.add("show");
  welcomeMessage.classList.remove("hidden");
  setTimeout(() => {
    welcomeMessage.classList.remove("show");
    setTimeout(() => welcomeMessage.classList.add("hidden"), 600);
  }, 2000);
}

/* Kayıt ol */
document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value;
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirm").value;

  if (password !== confirm) {
    alert("Parolalar uyuşmuyor!");
    return;
  }
  if (users[email]) {
    alert("Bu e-posta zaten kayıtlı!");
    return;
  }

  users[email] = { username, password, avatar: "" };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Kayıt başarılı! Giriş yapabilirsiniz.");
});

/* Giriş yap */
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (users[email] && users[email].password === password) {
    currentUserEmail = email;
    localStorage.setItem("currentUserEmail", currentUserEmail);
    loginUIUpdate();
    showSection("hero");
    showWelcomeToast(users[email].username);
  } else {
    alert("Hatalı giriş bilgileri!");
  }
});

/* Çıkış yap */
document.getElementById("logoutBtn").addEventListener("click", () => {
  currentUserEmail = null;
  localStorage.removeItem("currentUserEmail");
  userInfo.classList.add("hidden");
  showSection("auth");
});

/* Profil butonu */
document.getElementById("profileBtn").addEventListener("click", () => {
  showSection("profileSection");
});

/* Avatar dropdown */
userAvatar.addEventListener("click", () => {
  dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
});

/* Profil fotoğrafı kaydetme */
document.getElementById("saveProfileBtn").addEventListener("click", () => {
  const file = document.getElementById("profilePic").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      users[currentUserEmail].avatar = e.target.result;
      localStorage.setItem("users", JSON.stringify(users));
      userAvatar.src = e.target.result;
      alert("Profil fotoğrafı güncellendi!");
    };
    reader.readAsDataURL(file);
  }
});

/* Sayfa yüklenince */
window.addEventListener("DOMContentLoaded", () => {
  if (currentUserEmail && users[currentUserEmail]) {
    loginUIUpdate();
    showSection("hero");
  } else {
    userInfo.classList.add("hidden"); // avatar gizli
    showSection("auth");
  }
});
