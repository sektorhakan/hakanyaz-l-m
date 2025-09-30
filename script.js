// Menü toggle
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Bölüm geçişleri
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  nav.classList.remove("active"); // menü kapansın
}

// Menü toggle
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// Bölüm geçişleri
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  nav.classList.remove("active"); // menü kapansın
}

// Kullanıcı listesi
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Sayfa açıldığında kullanıcıyı kontrol et
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    showWelcome(currentUser);
  }
});

// Kayıt ol
function handleRegister(event) {
  event.preventDefault();
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
  } else {
    users.push({ email: email, username: username, password: pass });
    saveUsers(users);
    document.getElementById("login-message").innerText = "✅ Kayıt başarılı! Şimdi giriş yapabilirsiniz.";
  }
  return false;
}

// Giriş yap
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-password").value.trim();

  let users = getUsers();
  let found = users.find(u => u.email === email && u.password === pass);

  if (found) {
    localStorage.setItem("currentUser", found.username);
    showWelcome(found.username);
    document.getElementById("login-message").innerText = "✅ Giriş başarılı!";
  } else {
    document.getElementById("login-message").innerText = "❌ Hatalı e-posta veya şifre!";
  }
  return false;
}

// Hoş geldin ekranı
function showWelcome(username) {
  document.getElementById("auth-area").style.display = "none";
  document.getElementById("welcome-area").style.display = "block";
  document.getElementById("welcome-message").innerText = "Hoş geldin, " + username + " 👋";
}

// Çıkış yap
function logout() {
  localStorage.removeItem("currentUser");
  document.getElementById("auth-area").style.display = "flex";
  document.getElementById("welcome-area").style.display = "none";
  document.getElementById("login-message").innerText = "Çıkış yapıldı.";
}
