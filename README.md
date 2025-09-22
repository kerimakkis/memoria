# Memoria

Memoria, yaşlı kullanıcılar için hafıza, dikkat ve hız becerilerini destekleyen 9 mini oyunu bulunan bir Expo + Supabase tam yığın örnek uygulamasıdır.

## Özellikler
- Supabase Auth ile e-posta/parola hesabı açma, giriş ve şifre sıfırlama
- Light/Dark tema, sistem temasına otomatik uyum ve erişilebilir tipografi
- Supabase üzerinde skor, başarı ve ödül yönetimi
- Dokuz adet görsel ve sayısal mini oyun için ortak oyun motoru
- React Query ile çevrimdışı cache ve veri senkronizasyonu

## Kurulum
1. Bağımlılıkları yükleyin: `npm install`
2. `.env` dosyası oluşturup Supabase URL ve public anon anahtarını girin.
3. Uygulamayı başlatın: `npm run start`

## Dizim
```
app/              # Expo Router ekranları
components/       # Tekrar kullanılabilir UI bileşenleri
hooks/            # Özel React hook'ları
tests/            # Jest + Testing Library testleri
services/         # Supabase servisleri ve oyun oturumu yöneticisi
```

## Supabase Tabloları
- `profiles`: kullanıcı bilgileri (displayName, doğum tarihi vb.)
- `games`: oyun tanımları (slug, başlık, kategori, açıklama)
- `game_sessions`: tek oyun oturumu skorları
- `achievements`: ödül/rozet tanımları
- `user_achievements`: kullanıcı ödül eşleşmeleri

SQL şeması ve güvenlik politikaları `supabase/schema.sql` dosyasında yer alır.

## Testler
- `npm test` bileşen ve servis birim testlerini çalıştırır.
- `tests/e2e` altında Detox veya Playwright senaryoları eklenebilir.
