/* ---------- Veri: users ve currentUser ---------- */
// users: obje keyed by email. currentUser: email string (or null)
let users = JSON.parse(localStorage.getItem("users") || "{}");
let currentUserEmail = localStorage.getItem("currentUserEmail") || null;

/* ---------- Elemanlar ---------- */
const navBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".page-section");
const authSection = document.getElementById("auth");
const userInfo = document.getElementById("userInfo");
const avatar = document.getElementById("avatar");
const avatarMenu = document.getElementById("avatarMenu");
const usernameDisplay = document.getElementById("usernameDisplay");
const welcomeMessage = document.getElementById("welcomeMessage");
const authNavBtn = document.getElementById("authNavBtn");
const profileSection = document.getElementById("profile");

/* ---------- Yardımcı fonksiyonlar ---------- */
function saveUsers(){ localStorage.setItem("users", JSON.stringify(users)); }
function setCurrentUser(email){
  currentUserEmail = email;
  if(email) localStorage.setItem("currentUserEmail", email);
  else localStorage.removeItem("currentUserEmail");
}

/* Bölüm gösterme: yalnızca hedef görünür, animasyon ver */
function showSection(id){
  sections.forEach(s=>{
    if(s.id === id){
      s.classList.remove("hidden");
      s.classList.add("active");
      // küçük anim: scroll top
      window.scrollTo({top:0,behavior:"smooth"});
    } else {
      s.classList.remove("active");
      s.classList.add("hidden");
    }
  });

  // auth görünürlüğü: eğer oturum yok ve hedef 'auth' ise göster; aksi halde gizle
  if(id === "auth" && !currentUserEmail){
    authSection.classList.remove("hidden");
    authSection.classList.add("active");
  } else {
    authSection.classList.remove("active");
    authSection.classList.add("hidden");
  }
}

/* Hoşgeldin toast (2 saniye) */
function showWelcomeToast(name){
  welcomeMessage.textContent = `Hoş geldin ${name}!`;
  welcomeMessage.classList.remove("hidden");
  setTimeout(()=> welcomeMessage.classList.add("hidden"), 2000);
}

/* Avatar menu toggle */
avatar && avatar.addEventListener("click", ()=> avatarMenu.classList.toggle("hidden"));

/* Nav buton click atanması */
navBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const target = btn.dataset.target;
    showSection(target);
    // active class on nav
    navBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
});

/* ---------- Auth: Kayıt ---------- */
document.getElementById("registerForm").addEventListener("submit", function(e){
  e.preventDefault();
  const u = document.getElementById("registerUsername").value.trim();
  const em = document.getElementById("registerEmail").value.trim().toLowerCase();
  const p = document.getElementById("registerPassword").value;
  const c = document.getElementById("registerConfirmPassword").value;

  if(!u || !em || !p){ alert("Tüm alanları doldurun."); return; }
  if(p !== c){ alert("Parolalar eşleşmiyor."); return; }
  if(users[em]){ alert("Bu e-posta zaten kayıtlı."); return; }

  users[em] = { username: u, email: em, password: p, profilePic: "" };
  saveUsers();
  alert("Kayıt başarılı! Giriş yapabilirsiniz.");
  // otomatik auth sayfasına yönlendir (kullanıcının tekrar giriş yapmasını isteyerek)
  showSection("auth");
});

/* ---------- Auth: Giriş ---------- */
document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const em = document.getElementById("loginEmail").value.trim().toLowerCase();
  const p = document.getElementById("loginPassword").value;
  if(!users[em]){ alert("Böyle bir kullanıcı yok."); return; }
  if(users[em].password !== p){ alert("Parola yanlış."); return; }

  // giriş başarılı: kalıcı oturum setle
  setCurrentUser(em);
  // UI güncelle
  loginUIUpdate();
  showWelcomeToast(users[em].username);
  showSection("hero");
});

/* ---------- Oturum açık mı kontrolü ---------- */
function loginUIUpdate(){
  if(!currentUserEmail) return;
  const u = users[currentUserEmail];
  if(!u) { setCurrentUser(null); return; }
  userInfo.classList.remove("hidden");
  usernameDisplay.textContent = u.username;
  avatar.src = u.profilePic || avatar.src;
  // auth gizle
  authSection.classList.add("hidden");
}

/* ---------- Çıkış ---------- */
document.getElementById("logoutBtn").addEventListener("click", function(){
  setCurrentUser(null);
  userInfo.classList.add("hidden");
  avatar.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  // auth görünür hale getir
  showSection("auth");
});

/* ---------- Profil: resim seç & kaydet ---------- */
const fileInput = document.getElementById("profileFile");
const saveBtn = document.getElementById("saveProfileBtn");
const preview = document.getElementById("profilePicPreview");

saveBtn.addEventListener("click", function(){
  if(!currentUserEmail){ alert("Lütfen önce giriş yapın."); return; }
  const f = fileInput.files[0];
  if(!f){ alert("Lütfen bir dosya seçin."); return; }

  const r = new FileReader();
  r.onload = function(e){
    users[currentUserEmail].profilePic = e.target.result;
    saveUsers();
    // persist currentUser image
    avatar.src = e.target.result;
    preview.src = e.target.result;
    alert("Profil fotoğrafı kaydedildi.");
  };
  r.readAsDataURL(f);
});

/* ---------- Başlangıç: oturum kontrol ---------- */
window.addEventListener("DOMContentLoaded", ()=>{
  // load users and current user from storage (in case changed)
  users = JSON.parse(localStorage.getItem("users") || "{}");
  currentUserEmail = localStorage.getItem("currentUserEmail") || null;

  if(currentUserEmail && users[currentUserEmail]){
    loginUIUpdate();
    showSection("hero");
  } else {
    // eğer hiç giriş yoksa auth görünür başlangıçta (isteğe bağlı)
    showSection("auth");
  }
});
