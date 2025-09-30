// Dropdown avatar menüsü
const avatar = document.getElementById("avatar");
const dropdownMenu = document.getElementById("dropdownMenu");
const userInfo = document.getElementById("userInfo");
const usernameDisplay = document.getElementById("usernameDisplay");

avatar.addEventListener("click", () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// Kullanıcı verisi
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Hoşgeldin mesajı
function showWelcome(username) {
  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.textContent = `Hoş geldin ${username}!`;
  welcomeMessage.style.display = "block";
  setTimeout(() => {
    welcomeMessage.style.display = "none";
  }, 2000);
}

// Bölüm göster
function showSection(id) {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Kayıt ol
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirmPassword").value;

  if (password !== confirm) {
    alert("Parolalar eşleşmiyor!");
    return;
  }
  if (users[email]) {
    alert("Bu mail zaten kayıtlı!");
    return;
  }

  users[email] = { username, email, password, profilePic: "" };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
});

// Giriş yap
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!users[email]) {
    alert("Böyle bir kullanıcı yok!");
    return;
  }
  if (users[email].password !== password) {
    alert("Parola yanlış!");
    return;
  }

  currentUser = users[email];
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // UI Güncelle
  document.getElementById("authSection").classList.add("hidden");
  userInfo.classList.remove("hidden");
  usernameDisplay.textContent = currentUser.username;
  avatar.src = currentUser.profilePic || avatar.src;

  showWelcome(currentUser.username);
  showSection("hero");
});

// Çıkış yap
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  alert("Çıkış yapıldı!");
  location.reload();
}

// Profil aç
function openProfile() {
  document.getElementById("profileSection").classList.remove("hidden");
}

// Profil resmi kaydet
function saveProfilePic() {
  const file = document.getElementById("profilePicInput").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    currentUser.profilePic = reader.result;
    users[currentUser.email] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    document.getElementById("profilePicPreview").src = reader.result;
    avatar.src = reader.result;
  };
  reader.readAsDataURL(file);
}

// Sayfa açılışında giriş kontrolü
window.onload = () => {
  if (currentUser) {
    document.getElementById("authSection").classList.add("hidden");
    userInfo.classList.remove("hidden");
    usernameDisplay.textContent = currentUser.username;
    avatar.src = currentUser.profilePic || avatar.src;
    showSection("hero");
  } else {
    showSection("hero");
  }
};
