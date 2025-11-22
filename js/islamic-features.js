// Islamic Features untuk PrayMate
// Bismillah, Adzan Audio, Notifikasi, dan fitur Islami lainnya

(function() {
  'use strict';

  // ===== ADZAN AUDIO MANAGER =====
  const AdzanManager = {
    audio: null,
    hasPlayed: false,
    
    // Initialize audio
    init() {
      try {
        this.audio = new Audio('./assets/audio/adhan_short.mp3');
        this.audio.volume = 0.6; // Volume default 60%
        
        // Handle error jika file tidak ditemukan
        this.audio.onerror = () => {
          console.warn('File audio adzan tidak ditemukan. Letakkan file di ./assets/audio/adhan_short.mp3');
        };
      } catch (error) {
        console.error('Error initializing adzan audio:', error);
      }
    },
    
    // Play adzan jika setting enabled
    play() {
      const playAdhan = localStorage.getItem('praymate_play_adhan');
      
      // Default true jika belum di-set
      if (playAdhan === null || playAdhan === 'true') {
        if (this.audio && !this.hasPlayed) {
          this.audio.play().catch(err => {
            console.warn('Tidak bisa play audio adzan:', err.message);
          });
          this.hasPlayed = true;
        }
      }
    },
    
    // Reset flag untuk jadwal berikutnya
    reset() {
      this.hasPlayed = false;
    }
  };

  // ===== NOTIFICATION MANAGER =====
  const NotificationManager = {
    permission: 'default',
    checkInterval: null,
    lastNotified: {},
    
    // Request permission
    async requestPermission() {
      if (!('Notification' in window)) {
        console.warn('Browser tidak mendukung notifikasi');
        return false;
      }
      
      if (Notification.permission === 'granted') {
        this.permission = 'granted';
        return true;
      }
      
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        this.permission = permission;
        return permission === 'granted';
      }
      
      return false;
    },
    
    // Show notification
    show(title, body, prayerName) {
      if (this.permission !== 'granted') return;
      
      const notification = new Notification(title, {
        body: body,
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        tag: 'prayer-time-' + prayerName,
        requireInteraction: true,
        silent: false
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    },
    
    // Check prayer times
    checkPrayerTimes() {
      const prayerTimes = JSON.parse(localStorage.getItem('praymate_prayer_times') || '{}');
      if (!prayerTimes.timings) return;
      
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0];
      
      const prayers = [
        { name: 'Fajr', label: 'Subuh', time: prayerTimes.timings.Fajr },
        { name: 'Dhuhr', label: 'Dzuhur', time: prayerTimes.timings.Dhuhr },
        { name: 'Asr', label: 'Ashar', time: prayerTimes.timings.Asr },
        { name: 'Maghrib', label: 'Maghrib', time: prayerTimes.timings.Maghrib },
        { name: 'Isha', label: 'Isya', time: prayerTimes.timings.Isha }
      ];
      
      prayers.forEach(prayer => {
        const prayerTime = prayer.time.substring(0, 5); // HH:MM
        const notifKey = `${today}-${prayer.name}`;
        
        // Jika waktu cocok dan belum notif hari ini
        if (currentTime === prayerTime && !this.lastNotified[notifKey]) {
          this.lastNotified[notifKey] = true;
          
          // Show notification
          this.show(
            `🕌 Waktu ${prayer.label}`,
            `Saatnya menunaikan sholat ${prayer.label}. Waktu: ${prayerTime}`,
            prayer.name
          );
          
          // Play adzan
          AdzanManager.play();
          
          // Reset audio untuk sholat berikutnya setelah 2 menit
          setTimeout(() => AdzanManager.reset(), 120000);
        }
      });
      
      // Cleanup old notifications (hapus yang bukan hari ini)
      Object.keys(this.lastNotified).forEach(key => {
        if (!key.startsWith(today)) {
          delete this.lastNotified[key];
        }
      });
    },
    
    // Start monitoring
    start() {
      if (this.checkInterval) return;
      
      // Check setiap 30 detik (lebih efisien)
      this.checkInterval = setInterval(() => {
        this.checkPrayerTimes();
      }, 30000);
      
      // Check immediately
      this.checkPrayerTimes();
    },
    
    // Stop monitoring
    stop() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    }
  };

  // Initialize saat DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AdzanManager.init();
      initNotificationSystem();
    });
  } else {
    AdzanManager.init();
    initNotificationSystem();
  }

  // Initialize notification system
  async function initNotificationSystem() {
    // Auto-request permission jika belum
    if (Notification.permission === 'default') {
      await NotificationManager.requestPermission();
    } else {
      NotificationManager.permission = Notification.permission;
    }
    
    // Start monitoring jika permission granted
    if (NotificationManager.permission === 'granted') {
      NotificationManager.start();
    }
  }

  // Export ke global scope
  window.AdzanManager = AdzanManager;
  window.NotificationManager = NotificationManager;

  // ===== SETTINGS PAGE: ADZAN TOGGLE & NOTIFICATION =====
  function initAdzanToggle() {
    const toggle = document.getElementById('play-adhan');
    if (!toggle) return;

    // Load saved setting
    const saved = localStorage.getItem('praymate_play_adhan');
    if (saved !== null) {
      toggle.checked = saved === 'true';
    }

    // Save on change
    toggle.addEventListener('change', (e) => {
      localStorage.setItem('praymate_play_adhan', e.target.checked);
      
      // Show toast
      if (window.showToast) {
        window.showToast(
          e.target.checked 
            ? '🔊 Suara adzan diaktifkan' 
            : '🔇 Suara adzan dinonaktifkan'
        );
      }
    });
  }

  function initNotificationToggle() {
    const btn = document.getElementById('enable-notifications');
    if (!btn) return;

    // Update button state
    function updateButton() {
      if (Notification.permission === 'granted') {
        btn.textContent = '✅ Notifikasi Aktif';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      } else if (Notification.permission === 'denied') {
        btn.textContent = '❌ Notifikasi Diblokir';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      } else {
        btn.textContent = '🔔 Aktifkan Notifikasi';
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    }

    updateButton();

    // Request permission on click
    btn.addEventListener('click', async () => {
      const granted = await NotificationManager.requestPermission();
      updateButton();
      
      if (granted) {
        NotificationManager.start();
        if (window.showToast) {
          window.showToast('🔔 Notifikasi adzan diaktifkan!');
        }
      } else {
        if (window.showToast) {
          window.showToast('❌ Notifikasi ditolak. Aktifkan di pengaturan browser.');
        }
      }
    });
  }

  // Init toggle jika di halaman settings
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAdzanToggle();
      initNotificationToggle();
    });
  } else {
    initAdzanToggle();
    initNotificationToggle();
  }

})();
