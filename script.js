// Menü toggle
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("active"));

// Bölüm geçiş
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  nav.classList.remove("active");
}

// Kullanıcılar
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Giriş yapmış kullanıcıyı yükle
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    loginSuccess(currentUser);
  }
});

// Kayıt ol
function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById("reg-email").value.trim();
  const username = document.getElementById("reg-username").value.trim();
  const pass = document.getElementById("reg-password").value.trim();
  const pass2 = document.getElementById("reg-password2").value.trim();

  if (pass !== pass2) {
    document.getElementById("login-message").innerText = "⚠️ Şifreler uyuşmuyor!";
    return false;
  }

  let users = getUsers();
  if (users.find(u => u.email === email)) {
    document.getElementById("login-message").innerText = "⚠️ Bu e-posta zaten kayıtlı!";
    return false;
  }

  users.push({ email, username, password: pass, profilePic: "" });
  saveUsers(users);
  document.getElementById("login-message").innerText = "✅ Kayıt başarılı! Şimdi giriş yapabilirsiniz.";
  showSection("giris"); // Girişe yönlendir
  return false;
}

// Giriş yap
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value.trim();

  let users = getUsers();
  let found = users.find(u => u.email === email && u.password === pass);

  if (found) {
    localStorage.setItem("currentUser", found.email);
    loginSuccess(found.email);
    showSection("hero"); // Ana sayfaya at
    document.getElementById("login-message").innerText = "";
  } else {
    document.getElementById("login-message").innerText = "❌ Hatalı e-posta veya şifre!";
  }
  return false;
}

// Giriş başarılı
function loginSuccess(email) {
  let users = getUsers();
  let user = users.find(u => u.email === email);

  document.getElementById("user-nav").classList.add("active");
  document.getElementById("welcome-text").innerText = `👋 Hoş geldin, ${user.username}`;
  if (user.profilePic) {
    document.getElementById("profil-resim").src = user.profilePic;
  }
}

// Çıkış
function logout() {
  localStorage.removeItem("currentUser");
  document.getElementById("user-nav").classList.remove("active");
  showSection("hero");
}

// Profil resmi yükle
function uploadProfile() {
  const file = document.getElementById("profil-input").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageUrl = e.target.result;
    document.getElementById("profil-resim").src = imageUrl;

    let users = getUsers();
    const currentUser = localStorage.getItem("currentUser");
    let user = users.find(u => u.email === currentUser);
    if (user) {
      user.profilePic = imageUrl;
      saveUsers(users);
    }
  };
  reader.readAsDataURL(file);
}
