<template>
  <div class="bg-gray-50 min-h-screen font-sans antialiased">
    <header
      class="fixed top-0 w-full z-50 transition-transform duration-500 bg-white/90 backdrop-blur-sm shadow-lg h-20 flex items-center justify-between px-4 sm:px-8"
      :class="{ '-translate-y-full': !isHeaderVisible }"
    >
      <a href="#" @click.prevent="currentView = 'products'" class="text-3xl font-bold text-gray-900 font-roboto">
        ♥ WE LOVE FOOTBALL
      </a>
      <div class="flex space-x-4">
        <div class="relative">
          <button
            @click="toggleAuthView"
            class="flex items-center space-x-1 text-gray-900 hover:text-gray-600 transition-colors duration-300 p-2 rounded-full focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="hidden sm:inline" v-if="isLoggedIn">{{ userName }}</span>
            <span class="hidden sm:inline" v-else>Oturum Aç</span>
          </button>
        </div>
        <div class="relative">
          <a href="#" @click.prevent="isCartDropdownOpen = !isCartDropdownOpen" class="cart-button flex items-center space-x-1 text-gray-900 hover:text-gray-600 transition-colors duration-300 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.183 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartItems.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ cartItems.length }}</span>
            <span class="hidden sm:inline">Sepet</span>
          </a>
          <div v-if="isCartDropdownOpen" class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 p-4 max-h-80 overflow-y-auto cart-dropdown-container">
            <div v-if="cartItems.length === 0" class="p-4 text-center text-gray-500">
              Sepetiniz boş.
            </div>
            <div v-else>
              <h3 class="font-bold text-gray-900 mb-2">Sepetim ({{ cartItems.length }})</h3>
              <ul class="space-y-3">
                <li v-for="item in cartItems" :key="item.productId" class="flex items-center space-x-3">
                  <img :src="item.product?.imageUrl" alt="Product Image" class="w-12 h-12 object-cover rounded-md" />
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">{{ item.product?.name }}</p>
                    <p class="text-xs text-gray-500">{{ item.product?.brand }}</p>
                  </div>
                  <span class="text-sm font-bold text-blue-600">{{ item.product?.price }} TL</span>
                  <button @click="removeFromCart(item.productId)" class="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="relative">
          <a href="#" @click.prevent="isFavDropdownOpen = !isFavDropdownOpen" class="fav-button flex items-center space-x-1 text-gray-900 hover:text-gray-600 transition-colors duration-300 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span v-if="favItems.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{{ favItems.length }}</span>
            <span class="hidden sm:inline">Favoriler</span>
          </a>
          <div v-if="isFavDropdownOpen" class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 p-4 max-h-80 overflow-y-auto fav-dropdown-container">
            <div v-if="favItems.length === 0" class="p-4 text-center text-gray-500">
              Favori ürününüz yok.
            </div>
            <div v-else>
              <h3 class="font-bold text-gray-900 mb-2">Favorilerim ({{ favItems.length }})</h3>
              <ul class="space-y-3">
                <li v-for="item in favItems" :key="item.productId" class="flex items-center space-x-3">
                  <img :src="item.product?.imageUrl" alt="Product Image" class="w-12 h-12 object-cover rounded-md" />
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">{{ item.product?.name }}</p>
                    <p class="text-xs text-gray-500">{{ item.product?.brand }}</p>
                  </div>
                  <span class="text-sm font-bold text-blue-600">{{ item.product?.price }} TL</span>
                  <button @click="removeFromFavorites(item.productId)" class="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="w-full">
      <div v-if="currentView === 'products'">
        <section class="relative overflow-hidden h-screen flex items-center justify-center">
          <div class="absolute inset-0 z-0">
            <img
              v-for="(image, index) in heroImages"
              :key="index"
              :src="image"
              alt="Hero Image"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 hero-slide"
              :class="{ 'opacity-100': index === currentImageIndex, 'opacity-0': index !== currentImageIndex }"
            />
            <div class="absolute inset-0 bg-black/40"></div>
          </div>
          <div class="relative z-10 p-12 text-center text-white">
            <h1 class="text-5xl md:text-6xl font-extrabold leading-tight animate-fade-in-down">
              We Love Football
            </h1>
            <p class="mt-4 text-xl md:text-2xl animate-fade-in-up">
              Sahadaki performansınızı artıracak en iyi kramponları keşfedin.
            </p>
            <button @click="scrollToProducts" class="mt-8 px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
              Koleksiyonu Keşfet
            </button>
          </div>
        </section>
        <main ref="productListRef" class="w-full px-4 py-12">
          <div class="w-full max-w-2xl mx-auto mb-8 px-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ürün ara..."
              class="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div
            v-if="message.text"
            :class="message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            class="p-3 rounded-md mb-4 text-sm font-medium transition-opacity duration-500 opacity-100"
          >
            {{ message.text }}
          </div>
          <div v-if="loading" class="text-center text-gray-500 text-lg">
            <div class="animate-pulse">Ürünler Yükleniyor...</div>
          </div>
          <div v-else-if="error" class="text-center text-red-500 text-lg">
            Ürünler yüklenirken bir hata oluştu: {{ error.message }}
          </div>
          <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div
              v-for="(product, index) in filteredProducts"
              :key="product._id"
              class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 animate-fade-in"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="relative overflow-hidden">
                <img
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div class="p-6">
                <h2 class="text-xl font-bold text-gray-900">{{ product.name }}</h2>
                <p class="mt-2 text-sm text-gray-500">{{ product.brand }}</p>
                <p class="mt-3 text-3xl font-extrabold text-blue-600">{{ product.price }} TL</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="size in product.sizes"
                    :key="size"
                    class="bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {{ size }}
                  </span>
                </div>
                <div class="mt-6 flex space-x-2" v-if="isLoggedIn">
                  <button
                    @click="addToCart(product._id)"
                    class="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
                  >
                    Sepete Ekle
                  </button>
                  <button
                    @click="addToFavorites(product._id)"
                    class="flex-shrink-0 bg-red-500 text-white p-3 rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div class="mt-6 text-center text-gray-500 italic" v-else>
                  Ürün eklemek için lütfen giriş yapın.
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 text-lg py-10">
            Aradığınız kriterlere uygun ürün bulunamadı.
          </div>
        </main>
      </div>
      <Notification 
        :isVisible="showNotification"
        :message="notificationMessage"
        :type="notificationType"
      />
      <div v-if="currentView === 'auth'" class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <div
          class="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          :style="{ backgroundImage: `url('https://www.shutterstock.com/image-photo/stadium-located-among-trees-buildings-600nw-2386516389.jpg')` }"
        >
        </div>
        <div class="absolute inset-0 bg-black opacity-60"></div>
        <div class="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transform transition-all duration-300">
          <h2 class="text-4xl font-extrabold text-center text-white mb-6 drop-shadow-lg">
            {{ isLoginView ? 'Giriş Yap' : 'Kayıt Ol' }}
          </h2>
          <form @submit.prevent="isLoginView ? handleLogin() : handleRegister()">
            <div v-if="!isLoginView" class="mb-4">
              <label for="firstName" class="block text-sm font-medium text-white/90 drop-shadow-sm">Ad</label>
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                required
                class="mt-1 block w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg shadow-inner text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              />
            </div>
            <div v-if="!isLoginView" class="mb-4">
              <label for="lastName" class="block text-sm font-medium text-white/90 drop-shadow-sm">Soyad</label>
              <input
                type="text"
                id="lastName"
                v-model="formData.lastName"
                required
                class="mt-1 block w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg shadow-inner text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              />
            </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-white/90 drop-shadow-sm">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                class="mt-1 block w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg shadow-inner text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              />
            </div>
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-white/90 drop-shadow-sm">Şifre</label>
              <input
                type="password"
                id="password"
                v-model="formData.password"
                required
                class="mt-1 block w-full px-4 py-3 bg-white/50 border border-white/30 rounded-lg shadow-inner text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              />
            </div>
            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors transform hover:scale-105"
              >
                {{ isLoginView ? 'Giriş Yap' : 'Kayıt Ol' }}
              </button>
            </div>
          </form>
          <div class="mt-6 text-center">
            <button
              @click="isLoginView = !isLoginView"
              class="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
            >
              {{ isLoginView ? 'Hesabınız yok mu? Kayıt Ol' : 'Zaten bir hesabınız var mı? Giriş Yap' }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="currentView === 'dashboard'" class="pt-20">
        <div class="container mx-auto p-8">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Hoş Geldiniz, {{ userName }}!</h1>
            <p class="text-lg text-gray-600 mb-6">
              Kullanıcı paneline hoş geldiniz. Buradan profil bilgilerinizi, siparişlerinizi ve favori ürünlerinizi yönetebilirsiniz.
            </p>
            <div class="flex space-x-4">
              <button
                @click="currentView = 'products'"
                class="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Ürünlere Geri Dön
              </button>
              <button
                @click="handleLogout"
                class="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto text-center text-sm">
        <p>&copy; 2025 We Love Football by github/gorkmeg.</p>
        <p>Tüm hakları saklıdır.</p>
        <div class="mt-2 space-x-4">
          <a href="#" class="hover:underline">Gizlilik Politikası</a>
          <a href="#" class="hover:underline">Hizmet Şartları</a>
          <a href="#" class="hover:underline">İletişim</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';
import Notification from './components/Notification.vue';
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');
let notificationTimeout = null;
const currentView = ref('products');
const isLoggedIn = ref(false);
const userName = ref('');
const isLoginView = ref(true);
const formData = ref({ firstName: '', lastName: '', email: '', password: '' });
const authMessage = ref({ text: '', type: '' });
const isHeaderVisible = ref(true);
let lastScrollY = 0;
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const productListRef = ref(null);
const message = ref({ text: '', type: '' });
const currentImageIndex = ref(0);
const isCartDropdownOpen = ref(false);
const isFavDropdownOpen = ref(false);
const cartItems = ref([]);
const favItems = ref([]);
const searchQuery = ref('');
const heroImages = [
  'https://icdn.juvefc.com/wp-content/uploads/2021/06/Ronaldo-switch.jpg',
  'https://images.milledcdn.com/2025-08-22/5fl0Xw2N4aZY6oHX/SgJSrn3hpaWq.jpeg',
  'https://www.lafourmi.biz/wp-content/uploads/2019/11/Projet_project_that_s_flow_puma_football_campagne_de_marque_globale_puma_fam_bis_2-1700x949.jpg'
];
const showMessage = (text, type) => {
  message.value = { text: '', type: '' }; 
  notificationMessage.value = text;
  notificationType.value = type;
  showNotification.value = true;
  clearTimeout(notificationTimeout);
  notificationTimeout = setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};
const showAuthMessage = (text, type) => {
  authMessage.value = { text, type };
  setTimeout(() => {
    authMessage.value = { text: '', type: '' };
  }, 3000);
};
const fetchCart = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    cartItems.value = [];
    return;
  }
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${userId}/cart`);
    cartItems.value = response.data.items;
  } catch (err) {
    console.error('Sepet verisi çekilirken hata oluştu:', err);
    cartItems.value = [];
  }
};
const fetchFavorites = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    favItems.value = [];
    return;
  }
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${userId}/favorites`);
    favItems.value = response.data.items;
  } catch (err) {
    console.error('Favori verisi çekilirken hata oluştu:', err);
    favItems.value = [];
  }
};
const scrollToProducts = () => {
  if (productListRef.value) {
    const startPosition = window.scrollY;
    const targetPosition = productListRef.value.offsetTop - 80;
    const distance = targetPosition - startPosition;
    let startTime = null;
    const animateScroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const speed = 0.001;
      const newPosition = startPosition + distance * easeInOutCubic(progress * speed);
      window.scrollTo(0, newPosition);
      if (progress * speed < 1) {
        window.requestAnimationFrame(animateScroll);
      }
    };
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    window.requestAnimationFrame(animateScroll);
  }
};
const addToCart = async (productId) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showMessage('Lütfen önce giriş yapın.', 'error');
    return;
  }
  try {
    const response = await axios.post(`http://localhost:5000/api/users/${userId}/cart`, { productId });
    showMessage(response.data.message, 'success');
    await fetchCart();
  } catch (error) {
    showMessage(error.response?.data?.message || 'Sepete ekleme hatası.', 'error');
  }
};
const addToFavorites = async (productId) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showMessage('Lütfen önce giriş yapın.', 'error');
    return;
  }
  try {
    const response = await axios.post(`http://localhost:5000/api/users/${userId}/favorites`, { productId });
    showMessage(response.data.message, 'success');
    await fetchFavorites();
  } catch (error) {
    showMessage(error.response?.data?.message || 'Favorilere ekleme hatası.', 'error');
  }
};
const removeFromCart = async (productId) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showMessage('Lütfen önce giriş yapın.', 'error');
    return;
  }
  try {
    const response = await axios.delete(`http://localhost:5000/api/users/${userId}/cart/${productId}`);
    showMessage(response.data.message, 'success');
    await fetchCart();
  } catch (error) {
    showMessage(error.response?.data?.message || 'Sepetten çıkarma hatası.', 'error');
  }
};
const removeFromFavorites = async (productId) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    showMessage('Lütfen önce giriş yapın.', 'error');
    return;
  }
  try {
    const response = await axios.delete(`http://localhost:5000/api/users/${userId}/favorites/${productId}`);
    showMessage(response.data.message, 'success');
    await fetchFavorites();
  } catch (error) {
    showMessage(error.response?.data?.message || 'Favorilerden çıkarma hatası.', 'error');
  }
};
const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: formData.value.email,
      password: formData.value.password
    });
    handleAuthCompletion(response.data.user);
  } catch (error) {
    showMessage(error.response?.data?.message || 'Giriş hatası.', 'error');
  }
};
const handleRegister = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/register', {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      password: formData.value.password
    });
    handleAuthCompletion(response.data.user);
  } catch (error) {
    showMessage(error.response?.data?.message || 'Kayıt hatası.', 'error');
  }
};
const handleAuthCompletion = (user) => {
  if (user) {
    localStorage.setItem('userId', user._id);
    localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
    isLoggedIn.value = true;
    userName.value = `${user.firstName} ${user.lastName}`;
    currentView.value = 'products';
    showMessage('İşlem başarılı!', 'success');
    isLoginView.value = true;
    fetchCart();
    fetchFavorites();
  }
};
const handleLogout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  isLoggedIn.value = false;
  userName.value = '';
  currentView.value = 'products';
  cartItems.value = [];
  favItems.value = [];
  showMessage('Başarıyla çıkış yaptınız.', 'success');
};
const toggleAuthView = () => {
  if (isLoggedIn.value) {
    currentView.value = 'dashboard';
  } else {
    currentView.value = 'auth';
  }
};
onMounted(async () => {
  const userId = localStorage.getItem('userId');
  const storedUserName = localStorage.getItem('userName');
  if (userId) {
    isLoggedIn.value = true;
    if (storedUserName) {
      userName.value = storedUserName;
    }
    await fetchCart();
    await fetchFavorites();
  }
  try {
    const response = await axios.get('http://localhost:5000/api/products');
    products.value = response.data;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
  setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % heroImages.length;
  }, 5000);
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    isHeaderVisible.value = false;
  } else {
    isHeaderVisible.value = true;
  }
  lastScrollY = currentScrollY;
};
const handleOutsideClick = (event) => {
  const cartButton = document.querySelector('.cart-button');
  const favButton = document.querySelector('.fav-button');
  const cartDropdown = document.querySelector('.cart-dropdown-container');
  const favDropdown = document.querySelector('.fav-dropdown-container');
  if (cartDropdown && !cartDropdown.contains(event.target) && cartButton && !cartButton.contains(event.target)) {
    isCartDropdownOpen.value = false;
  }
  if (favDropdown && !favDropdown.contains(event.target) && favButton && !favButton.contains(event.target)) {
    isFavDropdownOpen.value = false;
  }
};
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value;
  }
  const searchString = searchQuery.value.toLowerCase();
  return products.value.filter(product => {
    return (
      product.name.toLowerCase().includes(searchString) ||
      product.brand.toLowerCase().includes(searchString)
    );
  });
});
</script>
<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards 0.2s;
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>