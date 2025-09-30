let users = JSON.parse(localStorage.getItem("users") || "{}");
let currentUserEmail = localStorage.getItem("currentUserEmail") || null;

const navBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".page-section");
const authSection = document.getElementById("auth");
const userInfo = document.getElementById("userInfo");
const avatar = document.getElementById("avatar");
const avatarMenu = document.getElementById("avatarMenu");
const usernameDisplay = document.getElementById("usernameDisplay");
const welcomeMessage = document.getElementById("welcomeMessage");
const authNavBtn = document.getElementById("authNavBtn");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}
function setCurrentUser(email) {
  currentUserEmail = email;
  if (email) localStorage.setItem("currentUserEmail", email);
  else localStorage.removeItem("currentUserEmail");
}

function showSection(id) {
  sections.forEach(s => {
    if (s.id === id) {
      s.classList.remove("hidden");
      s.classList.add("active");
    } else {
      s.classList.remove("active");
      s.classList.add("hidden");
    }
  });
}

function showWelcomeToast(name) {
  welcomeMessage.textContent = `Hoş geldin ${name}!`;
  welcomeMessage.classList.remove("hidden");
  setTimeout(() => {
    welcomeMessage.classList.add("hidden");
  }, 2000);
}

avatar.addEventListener("click", () => {
  avatarMenu.classList.toggle("hidden");
});

navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    showSection(target);
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Kayıt
document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const u = document.getElementById("registerUsername").value.trim();
  const em = document.getElementById("registerEmail").value.trim().toLowerCase();
  const p = document.getElementById("registerPassword").value;
  const c = document.getElementById("registerConfirmPassword").value;
  if (!u || !em || !p) { alert("Tüm alanları doldurun."); return; }
  if (p !== c) { alert("Parolalar eşleşmiyor."); return; }
  if (users[em]) { alert("Bu e-posta zaten kayıtlı."); return; }
  users[em] = { username: u, email: em, password: p, profilePic: "" };
  saveUsers();
  alert("Kayıt başarılı! Giriş yapabilirsiniz.");
  showSection("auth");
});

// Giriş
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const em = document.getElementById("loginEmail").value.trim().toLowerCase();
  const p = document.getElementById("loginPassword").value;
  if (!users[em]) { alert("Böyle bir kullanıcı yok."); return; }
  if (users[em].password !== p) { alert("Parola yanlış."); return; }
  setCurrentUser(em);
  loginUIUpdate();
  showWelcomeToast(users[em].username);
  showSection("hero");
});

// UI güncelle
function loginUIUpdate() {
  if (!currentUserEmail) return;
  const u = users[currentUserEmail];
  if (!u) { setCurrentUser(null); return; }
  avatar.classList.remove("hidden");
  usernameDisplay.textContent = u.username;
  avatar.src = u.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  authNavBtn.style.display = "none";
}

// Çıkış
document.getElementById("logoutBtn").addEventListener("click", function() {
  setCurrentUser(null);
  avatar.classList.add("hidden");
  usernameDisplay.textContent = "";
  avatarMenu.classList.add("hidden");
  authNavBtn.style.display = "inline-block";
  showSection("auth");
});

// Profil butonu
document.getElementById("openProfileBtn").addEventListener("click", () => {
  showSection("profile");
  avatarMenu.classList.add("hidden");
});

// Profil resmi kaydet
const fileInput = document.getElementById("profileFile");
const saveBtn = document.getElementById("saveProfileBtn");
const preview = document.getElementById("profilePicPreview");

saveBtn.addEventListener("click", function() {
  if (!currentUserEmail) { alert("Lütfen önce giriş yapın."); return; }
  const f = fileInput.files[0];
  if (!f) { alert("Lütfen bir dosya seçin."); return; }
  const r = new FileReader();
  r.onload = function(e) {
    users[currentUserEmail].profilePic = e.target.result;
    saveUsers();
    avatar.src = e.target.result;
    preview.src = e.target.result;
    alert("Profil fotoğrafı kaydedildi.");
  };
  r.readAsDataURL(f);
});

// Başlangıç
window.addEventListener("DOMContentLoaded", () => {
  users = JSON.parse(localStorage.getItem("users") || "{}");
  currentUserEmail = localStorage.getItem("currentUserEmail") || null;
  if (currentUserEmail && users[currentUserEmail]) {
    loginUIUpdate();
    showSection("hero");
  } else {
    showSection("auth");
  }
});
