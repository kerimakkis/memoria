

*********************************** English ************************************************

Memoria is a full-stack sample application built with Expo + Supabase, designed to support memory, attention, and reaction speed skills for elderly users.
The app includes 9 mini games powered by a shared and reusable game engine.

Features

User sign-up, login, and password reset via Supabase Auth (email/password)

Light/Dark theme with automatic system theme detection

Accessibility-friendly typography

Score, achievement, and reward management using Supabase

Shared game engine for nine visual and numerical mini games

Offline caching and data synchronization using React Query

Installation

Install dependencies:

npm install


Create a .env file and provide your Supabase URL and public anon key.

Start the application:

npm run start

Project Structure
app/              # Expo Router screens
components/       # Reusable UI components
hooks/            # Custom React hooks
tests/            # Jest + Testing Library tests
services/         # Supabase services and game session manager

Supabase Tables

profiles – user information (display name, date of birth, etc.)

games – game definitions (slug, title, category, description)

game_sessions – individual game session scores

achievements – achievement / badge definitions

user_achievements – user-achievement mappings

The SQL schema and security policies are located in:
supabase/schema.sql

Tests

npm test runs unit tests for components and services

End-to-end scenarios using Detox or Playwright can be added under tests/e2e

****************************** Deutsch *************************************

Memoria ist eine Full-Stack-Beispielanwendung auf Basis von Expo + Supabase, die entwickelt wurde, um Gedächtnis-, Aufmerksamkeits- und Reaktionsfähigkeiten älterer Nutzer:innen zu fördern.
Die App enthält 9 Mini-Spiele, die auf einer gemeinsamen Spiel-Engine basieren.

Funktionen

Registrierung, Login und Passwort-Reset mit Supabase Auth (E-Mail/Passwort)

Light/Dark-Theme mit automatischer Anpassung an das Systemdesign

Barrierefreie Typografie (Accessibility-optimiert)

Verwaltung von Punkten, Erfolgen und Belohnungen über Supabase

Gemeinsame Spiel-Engine für neun visuelle und numerische Mini-Spiele

Offline-Cache und Datensynchronisation mit React Query

Installation

Abhängigkeiten installieren:

npm install


Eine .env-Datei erstellen und Supabase URL sowie public anon key eintragen.

Anwendung starten:

npm run start

Projektstruktur
app/              # Expo Router Screens
components/       # Wiederverwendbare UI-Komponenten
hooks/            # Eigene React Hooks
tests/            # Jest + Testing Library Tests
services/         # Supabase Services & Game-Session-Manager

Supabase Tabellen

profiles – Benutzerinformationen (z. B. Anzeigename, Geburtsdatum)

games – Spieldefinitionen (Slug, Titel, Kategorie, Beschreibung)

game_sessions – Einzelne Spielsessions und Scores

achievements – Definitionen von Erfolgen / Abzeichen

user_achievements – Zuordnung von Erfolgen zu Benutzern

SQL-Schema und Security Policies befinden sich unter:
supabase/schema.sql

Tests

npm test führt Unit-Tests für Komponenten und Services aus

Unter tests/e2e können Detox- oder Playwright-Szenarien ergänzt werden

************************ Turkisch ****************************************

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
