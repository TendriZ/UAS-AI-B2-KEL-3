---

# LAPORAN
## PROYEK UJIAN AKHIR SEMESTER
## PRAKTIKUM KECERDASAN BUATAN

# Si Tambak: SISTEM KONTROL PEMBERIAN PAKAN PADA TAMBAK UDANG METODE SUGENO FUZZY LOGIC

<br>

### KELAS TI-B2
### KELOMPOK 3

<br>

**Muhammad Raka Razani** (434241056)
**Nuafal Bagaskara** (434241106)
**Aditya Alif Santoso** (43424112)
**Fina Aida Purnamasari Yusuf** (434241128)

<br>

**PROGRAM STUDI D4 TEKNIK INFORMATIKA**
**FAKULTAS VOKASI**
**UNIVERSITAS AIRLANGGA SURABAYA**
**2026**

---

## KATA PENGANTAR

Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan karunia-Nya, sehingga laporan Praktikum Kecerdasan Buatan untuk proyek aplikasi Si Tambak: Sistem Kontrol Pemberian Makan pada Tambak Udang Berbasis Artificial Intelligence ini dapat diselesaikan dengan baik dan tepat waktu. Laporan ini disusun sebagai salah satu pemenuhan tugas mata kuliah Praktikum Kecerdasan Buatan di D4 Teknik Informatika, Fakultas Vokasi, Universitas Airlangga.

Si Tambak hadir sebagai solusi terhadap permasalahan dalam pemberian pakan pada tambak udang yang masih banyak dilakukan secara manual dan bergantung pada perkiraan. Dalam praktiknya, ketepatan jumlah dan waktu pemberian pakan sangat berpengaruh terhadap pertumbuhan udang, efisiensi biaya, serta kualitas hasil panen. Oleh karena itu, diperlukan sebuah sistem yang mampu membantu petambak udang dalam menentukan rekomendasi pakan secara lebih akurat, cepat, dan terukur.

Aplikasi Si Tambak dirancang sebagai sistem berbasis kecerdasan buatan yang menggunakan metode Sugeno Fuzzy Logic untuk menganalisis berbagai parameter penting, seperti pH air, suhu air, kondisi cuaca, jumlah udang, usia udang, dan volume air. Berdasarkan analisis tersebut, sistem akan menghasilkan rekomendasi berupa kuantitas pakan harian, jadwal pemberian pakan, serta penjelasan yang mendukung hasil perhitungan. Sistem difokuskan khusus untuk budidaya udang Vannamei (Litopenaeus vannamei) sebagai spesies utama dengan parameter FCR tetap sebesar 1,2 dan growth rate 0,0015/hari.

Laporan ini menyajikan secara komprehensif tahapan perancangan aplikasi, mulai dari analisis kebutuhan, penyusunan alur sistem, perancangan tampilan antarmuka, hingga hasil implementasi awal. Seluruh proses pengembangan difokuskan pada prinsip kemudahan penggunaan, kejelasan informasi, serta efektivitas sistem dalam membantu pengambilan keputusan bagi petambak udang.

Kami menyadari bahwa laporan ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang membangun sangat kami harapkan demi penyempurnaan di masa mendatang. Akhir kata, kami berharap laporan ini dapat memberikan manfaat serta menjadi referensi yang berguna dalam pengembangan sistem berbasis artificial intelligence, khususnya pada bidang budidaya tambak udang.

<br>

**Surabaya, Januari 2026**

**Kelompok 3**

---

## RINGKASAN

Si Tambak adalah aplikasi berbasis web yang dirancang untuk membantu petambak udang dalam menentukan kuantitas dan jadwal pemberian pakan secara optimal menggunakan metode Logika Fuzzy Sugeno. Permasalahan utama yang diangkat adalah ketidakefisienan pemberian pakan pada tambak udang yang selama ini masih dilakukan secara manual dan berdasarkan intuisi semata, sehingga sering menyebabkan pemborosan pakan atau kekurangan nutrisi yang berdampak langsung pada kualitas panen.

Aplikasi ini menerima **enam parameter masukan**, yaitu kadar pH air, suhu air, kondisi cuaca, volume air kolam, jumlah udang, dan usia udang. Sistem difokuskan khusus untuk budidaya udang Vannamei (Litopenaeus vannamei) dengan parameter Feed Conversion Ratio (FCR) tetap sebesar 1,2 dan growth rate 0,0015/hari. Berdasarkan parameter-parameter tersebut, sistem inferensi fuzzy Sugeno memproses data melalui tahap fuzzifikasi, evaluasi aturan fuzzy, dan defuzzifikasi untuk menghasilkan rekomendasi kuantitas pakan harian dalam satuan kilogram beserta jadwal pemberiannya pada sesi pagi, siang, dan sore.

Sistem ini dikembangkan menggunakan framework Next.js 15.1.0 dengan React 19.0.0 sebagai antarmuka pengguna dan diimplementasikan sepenuhnya menggunakan JavaScript tanpa memerlukan backend tambahan. Persistensi data memanfaatkan LocalStorage untuk penyimpanan riwayat rekomendasi, serta dilengkapi fitur ekspor PDF menggunakan jsPDF 2.5.1 untuk dokumentasi hasil analisis. Hasil pengujian dan evaluasi terhadap 10 responden menunjukkan bahwa Si Tambak mampu memberikan rekomendasi yang logis dan mudah dipahami oleh pengguna, dengan rata-rata tingkat kepuasan pengguna sebesar 4,28 dari skala 5.

---

## DAFTAR ISI

| No | Bab | Halaman |
|----|-----|---------|
| | KATA PENGANTAR | 2 |
| | RINGKASAN | 3 |
| | DAFTAR ISI | 4 |
| | DAFTAR GAMBAR | 5 |
| | DAFTAR TABEL | 6 |
| **BAB I** | **PENDAHULUAN** | 7 |
| 1.1 | Latar Belakang | 7 |
| 1.2 | Rumusan Masalah | 7 |
| 1.3 | Tujuan | 8 |
| 1.4 | Manfaat | 8 |
| 1.5 | Batasan Masalah | 8 |
| **BAB II** | **TINJAUAN PUSTAKA** | 9 |
| 2.1 | Tambak Udang dan Manajemen Pakan | 9 |
| 2.2 | Logika Fuzzy | 9 |
| 2.3 | Metode Fuzzy Sugeno | 9 |
| 2.4 | Fungsi Keanggotaan | 10 |
| 2.5 | Parameter Kualitas Air Tambak | 10 |
| 2.6 | Biomassa dan Kalkulasi Pakan | 10 |
| 2.7 | Teknologi Pengembangan | 11 |
| **BAB III** | **DESAIN SISTEM** | 12 |
| 3.1 | Arsitektur Sistem | 12 |
| 3.2 | Parameter Input Sistem | 12 |
| 3.3 | Definisi Himpunan Fuzzy | 13 |
| 3.4 | Estimasi Berat Udang | 15 |
| 3.5 | Basis Aturan Fuzzy | 15 |
| 3.6 | FCR dan Feeding Rate | 16 |
| 3.7 | Algoritma Sugeno | 17 |
| 3.8 | Desain Antarmuka | 17 |
| **BAB IV** | **IMPLEMENTASI, PENGUJIAN DAN EVALUASI** | 18 |
| 4.1 | Implementasi Sistem | 18 |
| 4.2 | Pengujian Sistem | 20 |
| 4.3 | Evaluasi Sistem | 21 |
| **BAB V** | **KESIMPULAN DAN SARAN** | 22 |
| 5.1 | Kesimpulan | 22 |
| 5.2 | Saran | 22 |
| | DAFTAR PUSTAKA | 23 |
| | LAMPIRAN | 24 |

---

## DAFTAR GAMBAR

| No | Gambar | Halaman |
|----|--------|---------|
| 2.1 | Struktur Sistem Inferensi Fuzzy Sugeno | 9 |
| 2.2 | Alur Tahapan Metode Fuzzy Sugeno | 10 |
| 3.1 | Flowchart Proses Inferensi Fuzzy | 17 |
| 3.2 | Fungsi Keanggotaan pH Air | 13 |
| 3.3 | Fungsi Keanggotaan Suhu Air | 13 |
| 3.4 | Fungsi Keanggotaan Kepadatan Udang | 14 |
| 3.5 | Fungsi Keanggotaan Usia Udang | 14 |
| 3.6 | Desain Antarmuka Dashboard Pengguna | 18 |
| 3.7 | Desain Antarmuka Halaman Utama (Form Input) | 18 |
| 3.8 | Desain Antarmuka Halaman Hasil Rekomendasi | 19 |
| 3.9 | Desain Antarmuka Halaman Riwayat | 19 |
| 4.1 | Tampilan Form Input Si Tambak | 20 |
| 4.2 | Tampilan Hasil Rekomendasi dan Analisis | 20 |
| 4.3 | Tampilan Halaman Riwayat | 21 |
| 4.4 | Tampilan Hasil Ekspor PDF | 21 |
| 4.5 | Grafik Hasil Survei Pengguna | 22 |

---

## DAFTAR TABEL

| No | Tabel | Halaman |
|----|-------|---------|
| 2.1 | Perbandingan Metode Fuzzy Mamdani dan Sugeno | 10 |
| 3.1 | Parameter Input Sistem Si Tambak | 12 |
| 3.2 | Fungsi Keanggotaan pH Air | 13 |
| 3.3 | Fungsi Keanggotaan Suhu Air | 13 |
| 3.4 | Fungsi Keanggotaan Kepadatan Tambak | 14 |
| 3.5 | Fungsi Keanggotaan Usia Udang | 14 |
| 3.6 | Himpunan Fuzzy Cuaca | 15 |
| 3.7 | Contoh Basis Aturan Fuzzy (Rule Base) | 16 |
| 3.8 | Feeding Rate Berdasarkan Usia Udang | 16 |
| 4.1 | Spesifikasi Lingkungan Pengembangan | 18 |
| 4.2 | Data Pengujian dan Hasil Rekomendasi | 20 |
| 4.3 | Hasil Survei Pengguna | 22 |

---

# BAB I
# PENDAHULUAN

## 1.1 Latar Belakang

Udang menjadi salah satu produk ekspor utama dari sektor perikanan Indonesia dan memberikan kontribusi besar terhadap perekonomian negara. Indonesia terus berada di posisi teratas sebagai salah satu negara penghasil udang terbesar di dunia, dengan jumlah produksi budidaya udang yang semakin meningkat setiap tahunnya seiring dengan meningkatnya permintaan dari pasar global. Di tengah tekanan tersebut, para petambak harus mampu memproduksi udang berkualitas tinggi sekaligus mengelola biaya produksi secara efisien.

Salah satu bagian utama yang memakan biaya besar dalam produksi udang di tambak adalah pakan, yang bisa mencapai 60 hingga 70 persen dari biaya operasional keseluruhan. Penyediaan makanan yang tidak tepat, baik dalam jumlah berlebihan maupun kurang, langsung mempengaruhi kualitas air, pertumbuhan udang, dan hasil panen yang efisien. Memberi makan berlebihan membuat sisa makanan menumpuk di dasar kolam, sehingga menyebabkan pertumbuhan bakteri berbahaya dan menurunkan kualitas air. Sebaliknya, memberi makan kurang dapat menghambat pertumbuhan udang dan menyebabkan tingkat kelangsungan hidupnya menurun.

Sebagian besar petambak tradisional di Indonesia masih menggunakan pengalaman dan perasaan mereka sendiri untuk menentukan berapa banyak pakan yang diberikan dan kapan waktu yang tepat memberikannya. Pendekatan ini sangat bergantung pada pengetahuan pribadi dan mudah salah, terutama ketika menghadapi kondisi lingkungan yang selalu berubah seperti perubahan pH air, variasi suhu, dan perbedaan cuaca. Ketidaktepatan dalam memberikan makanan ini menjadi salah satu penyebab utama mengapa hasil produksi udang di Indonesia tidak maksimal.

Perkembangan teknologi kecerdasan buatan, terutama sistem inferensi yang menggunakan logika fuzzy, memberikan kemungkinan untuk menyelesaikan masalah tersebut. Logika fuzzy adalah metode perhitungan yang bisa mengatasi ketidakpastian dan nilai-nilai yang diucapkan dalam bahasa sehari-hari, seperti "pH cukup normal" atau "udang sudah cukup besar", yang sering ditemukan dalam pengelolaan tambak. Metode Fuzzy Sugeno dipilih karena mampu menghasilkan keluaran berupa angka yang jelas secara langsung melalui cara perhitungan rata-rata terbobot, sehingga sangat efektif dan cocok digunakan pada sistem kontrol waktu nyata yang memerlukan tanggapan yang cepat.

Berdasarkan latar belakang tersebut, proyek ini membuat aplikasi bernama Si Tambak, yaitu sistem web yang menggunakan Logika Fuzzy Sugeno untuk memberikan rekomendasi tentang berapa banyak makanan yang diberikan dan kapan waktu pemberiannya pada tambak udang. Si Tambak dibuat agar mudah digunakan oleh para petambak, menerima enam parameter kondisi tambak sebagai masukan, dan memberikan rekomendasi yang terorganisir, jelas, serta didasarkan pada ilmu pengetahuan yang dapat dipercaya.

## 1.2 Rumusan Masalah

1. Bagaimana merancang sistem inferensi Fuzzy Sugeno yang mampu memproses enam parameter kondisi tambak (pH, suhu, cuaca, volume air, jumlah udang, usia udang) untuk menghasilkan rekomendasi kuantitas pakan yang optimal?

2. Bagaimana mengimplementasikan sistem tersebut dalam bentuk aplikasi web yang mudah digunakan oleh petambak udang tanpa keahlian teknis khusus?

3. Bagaimana tingkat penerimaan pengguna terhadap rekomendasi yang dihasilkan oleh Si Tambak?

## 1.3 Tujuan

1. Merancang dan mengimplementasikan sistem inferensi berbasis Logika Fuzzy Sugeno untuk menentukan kuantitas pakan harian tambak udang secara otomatis berdasarkan enam parameter kondisi tambak.

2. Membangun aplikasi web Si Tambak menggunakan Next.js dan React yang dapat diakses dengan mudah oleh petambak udang.

3. Menyediakan fitur riwayat rekomendasi dan ekspor laporan dalam format PDF sebagai dokumentasi pendukung pengelolaan tambak.

4. Mengevaluasi tingkat penerimaan dan kepuasan pengguna terhadap aplikasi Si Tambak melalui survei kepada minimal 10 responden.

## 1.4 Manfaat

1. Memperoleh rekomendasi pemberian pakan yang lebih akurat dan berbasis data sehingga dapat meminimalkan pemborosan pakan sekaligus meningkatkan produktivitas panen.

2. Mendorong modernisasi dan digitalisasi pengelolaan tambak udang di Indonesia melalui penerapan kecerdasan buatan yang terjangkau dan mudah diakses.

3. Memberikan kontribusi pada pengembangan implementasi Logika Fuzzy Sugeno dalam domain pertambakan sebagai referensi penelitian dan pengembangan lebih lanjut.

## 1.5 Batasan Masalah

Agar pengembangan proyek ini tetap terfokus dan terukur, ditetapkan batasan masalah sebagai berikut:

1. Aplikasi Si Tambak difokuskan khusus pada budidaya udang Vannamei (Litopenaeus vannamei) sebagai satu-satunya spesies yang ditangani oleh sistem dengan parameter FCR tetap 1,2 dan growth rate 0,0015/hari.

2. Metode kecerdasan buatan yang digunakan adalah Logika Fuzzy Sugeno; metode lain seperti Mamdani, neural network, atau machine learning tidak dibahas dalam proyek ini.

3. Sistem tidak terintegrasi dengan sensor fisik secara langsung; semua input parameter dimasukkan secara manual oleh pengguna melalui antarmuka web.

4. Penyimpanan data riwayat menggunakan LocalStorage pada browser pengguna tanpa database server.

5. Aplikasi dikembangkan sebagai platform web dan tidak mencakup pengembangan aplikasi mobile native.

6. Validasi hasil rekomendasi dilakukan melalui pengujian berbasis skenario dan survei pengguna, bukan melalui percobaan lapangan langsung pada tambak udang nyata.

---

# BAB II
# TINJAUAN PUSTAKA

## 2.1 Tambak Udang dan Manajemen Pakan

Budidaya udang (aquaculture) merupakan kegiatan pemeliharaan udang dalam lingkungan yang terkontrol dengan tujuan menghasilkan produk bernilai ekonomi tinggi. Sistem budidaya udang intensif modern membutuhkan pengelolaan yang cermat atas berbagai variabel lingkungan, di antaranya kualitas air (pH, suhu, oksigen terlarut), kepadatan tebar, dan manajemen pakan. Manajemen pakan yang baik tidak hanya mempertimbangkan jumlah pakan, tetapi juga frekuensi dan waktu pemberian yang tepat sesuai siklus metabolisme udang (Haliman & Adijaya, 2005).

Feed Conversion Ratio (FCR) adalah indikator efisiensi pakan yang menyatakan rasio antara jumlah pakan yang diberikan dengan pertambahan biomassa udang. FCR ideal untuk udang Vannamei berkisar antara 1,2–1,5, dengan nilai FCR yang digunakan dalam sistem Si Tambak sebesar 1,2 (Wyban & Sweeney, 1991). Nilai FCR yang tinggi mengindikasikan inefisiensi penggunaan pakan dan menjadi sinyal bahwa manajemen pemberian pakan perlu diperbaiki (Wyban & Sweeney, 1991).

## 2.2 Logika Fuzzy

Logika fuzzy pertama kali diperkenalkan oleh Lotfi A. Zadeh pada tahun 1965 sebagai perluasan dari logika Boolean konvensional. Berbeda dengan logika klasik yang hanya mengenal nilai benar (1) atau salah (0), logika fuzzy memungkinkan nilai keanggotaan berupa bilangan real dalam rentang [0, 1], sehingga mampu merepresentasikan konsep linguistik yang bersifat gradual seperti "sedikit," "cukup," atau "sangat" (Zadeh, 1965).

Sistem inferensi fuzzy (Fuzzy Inference System/FIS) terdiri dari empat komponen utama:

1. **Fuzzifikasi**: Proses mengubah nilai input crisp menjadi nilai keanggotaan fuzzy menggunakan fungsi keanggotaan (membership function).
2. **Basis Aturan (Rule Base)**: Sekumpulan aturan IF-THEN yang merepresentasikan pengetahuan pakar domain.
3. **Mesin Inferensi**: Mekanisme evaluasi aturan fuzzy berdasarkan nilai keanggotaan input untuk menentukan nilai aktivasi (firing strength) setiap aturan.
4. **Defuzzifikasi**: Proses mengubah output fuzzy menjadi nilai crisp yang dapat digunakan sebagai keluaran sistem.

## 2.3 Metode Fuzzy Sugeno

Metode Fuzzy Sugeno (atau Takagi-Sugeno-Kang/TSK) diusulkan oleh Takagi dan Sugeno pada tahun 1985 sebagai alternatif efisien dari metode Mamdani. Perbedaan mendasar antara keduanya terletak pada representasi output: Mamdani menggunakan himpunan fuzzy sebagai output dan memerlukan proses defuzzifikasi berbasis luas area, sedangkan Sugeno menggunakan fungsi konstan atau fungsi linear dari variabel input sehingga defuzzifikasinya jauh lebih efisien (Sugeno & Kang, 1988).

**Tabel 2.1 Perbandingan Metode Fuzzy Mamdani dan Sugeno**

| Aspek | Mamdani | Sugeno |
|-------|---------|--------|
| Output aturan | Himpunan fuzzy | Konstanta / fungsi linear |
| Defuzzifikasi | Centroid, Bisector, dll. | Weighted Average |
| Kompleksitas | Lebih intuitif, kompleks | Lebih efisien komputasi |
| Kecocokan penggunaan | Kontrol linguistik | Sistem kontrol real-time |
| Kemudahan interpretasi | Mudah dipahami manusia | Efisien untuk optimasi numerik |

Pada metode Sugeno orde-0 (zero-order Sugeno), setiap aturan menghasilkan konstanta sebagai output:

```
IF x is A AND y is B THEN z = k
```

di mana k adalah konstanta. Output akhir diperoleh melalui weighted average:

```
z* = Σ(wᵢ × kᵢ) / Σ(wᵢ)
```

di mana wᵢ adalah nilai aktivasi (firing strength) aturan ke-i yang diperoleh dari operasi minimum (AND) atas nilai keanggotaan input, dan kᵢ adalah output konstanta aturan ke-i. Metode Sugeno dipilih dalam proyek Si Tambak karena efisiensinya dalam komputasi, kemampuan menghasilkan output numerik langsung, serta kesesuaiannya dengan karakteristik sistem kontrol pemberian pakan.

## 2.4 Fungsi Keanggotaan

Fungsi keanggotaan (membership function) mendefinisikan derajat keanggotaan sebuah nilai dalam himpunan fuzzy tertentu. Beberapa fungsi yang umum digunakan antara lain:

a) **Fungsi Segitiga (Triangular MF)**: Ditentukan oleh tiga parameter [a, b, c] di mana b adalah puncak dengan derajat keanggotaan 1,0 dan a, c adalah batas kiri dan kanan dengan derajat keanggotaan 0. Cocok untuk himpunan fuzzy di tengah rentang nilai.

b) **Fungsi Trapesium (Trapezoidal MF)**: Ditentukan oleh empat parameter [a, b, c, d] dengan bagian datar antara b dan c yang memiliki derajat keanggotaan penuh (1,0). Digunakan ketika nilai optimal berada dalam suatu rentang, bukan titik tunggal.

c) **Fungsi Bahu (Shoulder MF)**: Merupakan fungsi yang terbuka di satu sisi, cocok untuk himpunan fuzzy di ujung rentang nilai seperti "sangat rendah" atau "sangat tinggi."

Dalam Si Tambak, kombinasi fungsi segitiga digunakan untuk mendefinisikan seluruh himpunan fuzzy input.

## 2.5 Parameter Kualitas Air Tambak

**pH Air**: pH (potential of Hydrogen) mengukur tingkat keasaman atau kebasaan air dalam skala 0–14. Rentang pH optimal untuk budidaya udang Vannamei adalah 7,5–8,5 (Boyd & Clay, 1998). Penyimpangan pH di luar rentang optimal mengganggu metabolisme, menghambat pertumbuhan, dan pada kondisi ekstrem dapat menyebabkan kematian massal.

**Suhu Air**: Suhu berpengaruh langsung terhadap laju metabolisme, konsumsi oksigen, dan nafsu makan udang. Suhu optimal untuk udang Vannamei berkisar antara 23–30°C. Pada suhu terlalu rendah (<20°C), metabolisme udang melambat dan konsumsi pakan berkurang drastis. Pada suhu terlalu tinggi (>32°C), udang mengalami stres oksigen dan pakan sebaiknya dikurangi untuk mencegah penumpukan sisa pakan yang memperburuk kualitas air (Wyban & Sweeney, 1991).

**Kondisi Cuaca**: Cuaca mempengaruhi kestabilan lingkungan tambak secara keseluruhan. Hujan lebat dapat menyebabkan penurunan salinitas dan pH secara drastis, sementara badai dapat mengganggu keseimbangan ekosistem kolam. Dalam kondisi cuaca buruk, petambak umumnya mengurangi atau menunda pemberian pakan untuk meminimalkan dampak negatif terhadap kualitas air.

## 2.6 Biomassa dan Kalkulasi Pakan

Biomassa adalah total berat populasi udang dalam tambak pada waktu tertentu, dihitung sebagai:

```
Biomassa (kg) = Jumlah Udang × Berat Rata-rata per Ekor (kg)
```

Berat rata-rata per ekor diestimasi berdasarkan usia udang menggunakan rumus pertumbuhan eksponensial:

```
Berat (kg) = 0,001 × e^(growth_rate × usia/30)
```

dengan baseWeight = 0,001 kg (1 gram) dan growth_rate = 0,0015/hari untuk udang Vannamei.

Feeding rate (persentase pakan terhadap biomassa per hari) bervariasi sesuai fase pertumbuhan yang ditentukan melalui rules fuzzy berdasarkan usia. Kuantitas pakan harian selanjutnya dihitung sebagai:

```
Pakan Harian (kg) = Biomassa × Feeding Rate × FCR × Faktor Koreksi Fuzzy
```

Faktor koreksi fuzzy dihasilkan oleh mesin inferensi Sugeno berdasarkan kondisi lingkungan tambak saat itu, sehingga rekomendasi pakan selalu responsif terhadap perubahan kondisi aktual.

## 2.7 Teknologi Pengembangan

**Next.js** adalah framework berbasis React dan Node.js yang mendukung berbagai strategi rendering (SSR, CSR, SSG) serta fitur App Router untuk manajemen routing yang terstruktur. Next.js 15.1.0 dipilih karena produktivitas pengembangannya yang tinggi, dukungan React Compiler untuk optimasi performa otomatis, dan ekosistemnya yang matang untuk aplikasi web modern.

**React** 19.0.0 merupakan library JavaScript untuk membangun antarmuka pengguna berbasis komponen yang reaktif. React memungkinkan pemisahan logika antarmuka ke dalam komponen-komponen yang dapat digunakan ulang (reusable components), memudahkan pengelolaan state aplikasi, dan mempercepat siklus pengembangan.

**CSS Modules** digunakan untuk scoped styling pada level komponen, mencegah konflik nama kelas antar komponen dan menghasilkan kode CSS yang lebih terkelola.

**jsPDF** 2.5.1 digunakan untuk keperluan generasi dokumen PDF di sisi klien tanpa ketergantungan pada server.

---

# BAB III
# DESAIN SISTEM

## 3.1 Arsitektur Sistem

Sistem ini dirancang khusus untuk spesies udang Vannamei (Litopenaeus vannamei) dengan parameter:
- **FCR** = 1,2 (Feed Conversion Ratio)
- **Growth Rate** = 0,0015/hari

Si Tambak dirancang sebagai aplikasi web single-page berbasis Next.js dengan arsitektur pemrosesan sebagai berikut:

```
INPUT (6 Parameter) → FUZZIFIKASI → EVALUASI ATURAN → DEFUZZIFIKASI SUGENO → OUTPUT (Rekomendasi Pakan)
```

Seluruh logika inferensi fuzzy diimplementasikan di sisi klien menggunakan JavaScript murni tanpa ketergantungan pada library fuzzy eksternal. Struktur proyek mengikuti konvensi App Router Next.js dengan pemisahan yang jelas antara komponen UI, library logika fuzzy, dan utilitas pendukung.

## 3.2 Parameter Input Sistem

**Tabel 3.1 Parameter Input Sistem Si Tambak**

| No | Parameter | Tipe Data | Satuan | Keterangan |
|----|-----------|-----------|--------|------------|
| 1 | pH Air | Numerik (desimal) | — | Tingkat keasaman air kolam |
| 2 | Suhu Air | Numerik (desimal) | °C | Temperatui air kolam |
| 3 | Cuaca | Dropdown | — | Cerah / Berawan / Hujan / Badai |
| 4 | Volume Air | Numerik (desimal) | m³ | Volume air dalam kolam tambak |
| 5 | Jumlah Udang | Numerik (integer) | ekor | Estimasi jumlah udang saat ini |
| 6 | Usia Udang | Numerik (integer) | hari | Usia udang sejak penebaran |

*Catatan: Sistem difokuskan untuk udang Vannamei dengan parameter FCR tetap 1,2 dan growth rate 0,0015/hari.*

## 3.3 Definisi Himpunan Fuzzy

### 3.3.1 Himpunan Fuzzy pH Air

**Tabel 3.2 Fungsi Keanggotaan pH Air**

| Himpunan | Rentang Aktif | Jenis Fungsi | Keterangan |
|----------|---------------|--------------|------------|
| Asam | [0 – 7] | Segitiga | Peak di pH 5, bernilai 0 di batas 0 dan 7 |
| Normal | [6 – 9] | Segitiga | Peak di pH 7.5, bernilai 0 di batas 6 dan 9 |
| Basa | [8 – 14] | Segitiga | Peak di pH 11, bernilai 0 di batas 8 dan 14 |

![Fungsi Keanggotaan pH Air](gambar-3.2)

### 3.3.2 Himpunan Fuzzy Suhu Air

**Tabel 3.3 Fungsi Keanggotaan Suhu Air**

| Himpunan | Rentang Aktif | Jenis Fungsi | Keterangan |
|----------|---------------|--------------|------------|
| Dingin | [20 – 27°C] | Segitiga | Peak di 24°C |
| Normal | [25 – 31°C] | Segitiga | Peak di 28°C |
| Panas | [29 – 35°C] | Segitiga | Peak di 33°C |

![Fungsi Keanggotaan Suhu Air](gambar-3.3)

### 3.3.3 Himpunan Fuzzy Kepadatan

Kepadatan dihitung secara otomatis dari:
```
Kepadatan = Jumlah Udang / Volume Air (ekor/m³)
```

**Tabel 3.4 Fungsi Keanggotaan Kepadatan Tambak**

| Himpunan | Rentang Aktif | Jenis Fungsi | Keterangan |
|----------|---------------|--------------|------------|
| Rendah | [0 – 20 ekor/m³] | Segitiga | Peak di 10 |
| Normal | [15 – 35 ekor/m³] | Segitiga | Peak di 25 |
| Tinggi | [30 – 100 ekor/m³] | Segitiga | Peak di 50 |

![Fungsi Keanggotaan Kepadatan Tambak](gambar-3.4)

### 3.3.4 Himpunan Fuzzy Usia Udang

**Tabel 3.5 Fungsi Keanggotaan Usia Udang**

| Himpunan | Rentang (hari) | Deskripsi Fase |
|----------|----------------|----------------|
| Benur | [1 – 60] | Fase awal / benih |
| Pembesaran | [45 – 120] | Fase pertumbuhan aktif |
| Panen | [100 – 180+] | Fase mendekati panen |

![Fungsi Keanggotaan Usia Udang](gambar-3.5)

### 3.3.5 Himpunan Fuzzy Cuaca

**Tabel 3.6 Himpunan Fuzzy Cuaca**

| Himpunan | Faktor | Keterangan |
|----------|--------|------------|
| Cerah | 1.0 | Kondisi optimal |
| Berawan | 0.8 | Sedikit pengurangan |
| Hujan | 0.5 | Pengurangan signifikan |
| Badai | 0.2 | Kondisi ekstrem |

*Catatan: Cuaca menggunakan discrete membership dalam implementasi, di mana setiap kondisi bernilai 1 jika cocok atau 0 jika tidak.*

## 3.4 Estimasi Berat Udang

Sistem menggunakan rumus pertumbuhan eksponensial untuk estimasi berat udang berdasarkan usia:

```
Berat Udang (kg) = 0,001 × e^(0,0015 × usia_hari/30)
```

Dimana:
- baseWeight = 0,001 kg (1 gram untuk benur)
- growth_rate = 0,0015/hari (khusus udang Vannamei)

**Contoh perhitungan:**
- Usia 30 hari: 0,001 × e^(0,0015) ≈ 0,001 kg
- Usia 60 hari: 0,001 × e^(0,003) ≈ 0,001 kg
- Usia 90 hari: 0,001 × e^(0,0045) ≈ 0,001 kg

## 3.5 Basis Aturan Fuzzy

**Tabel 3.7 Contoh Basis Aturan Fuzzy (Rule Base)**

| No | pH | Suhu | Cuaca | Kepadatan | Usia | Output (Faktor Koreksi k) |
|----|----|------|-------|-----------|------|---------------------------|
| 1 | Normal | Normal | Cerah | Normal | Pembesaran | 1,00 (optimal penuh) |
| 2 | Normal | Normal | Cerah | Tinggi | Pembesaran | 0,85 (kurangi sedikit) |
| 3 | Normal | Normal | Berawan | Normal | Pembesaran | 0,90 |
| 4 | Asam | Dingin | Hujan | Normal | Pembesaran | 0,50 (kurangi signifikan) |
| 5 | Asam | Panas | Badai | Tinggi | Panen | 0,30 (minimal) |
| 6 | Basa | Normal | Cerah | Rendah | Benur | 0,90 |
| 7 | Normal | Panas | Berawan | Normal | Panen | 0,80 |
| 8 | Normal | Normal | Badai | Tinggi | Benur | 0,35 |

Sistem mengimplementasikan aturan fuzzy secara terpisah untuk dua output:
1. **Adjustment factor** - dihasilkan dari kombinasi pH, suhu, cuaca, dan kepadatan
2. **Feeding rate** - dihasilkan dari usia udang

## 3.6 FCR dan Feeding Rate

Sistem Si Tambak menggunakan nilai FCR tetap sebesar 1,2 sesuai standar budidaya udang Vannamei intensif.

**Tabel 3.8 Feeding Rate Berdasarkan Usia Udang**

| Fase | Rentang Usia (hari) | Feeding Rate (% biomassa/hari) |
|------|---------------------|-------------------------------|
| Benur | 1 - 60 | 5% |
| Pembesaran | 45 - 120 | 4% |
| Panen | 100 - 180+ | 3% |

Output akhir sistem dihitung sebagai:

```
Faktor Koreksi Final = Σ(wᵢ × kᵢ) / Σ(wᵢ)
Pakan Harian (kg) = Biomassa × Feeding Rate × FCR × Faktor Koreksi Final
```

Jadwal pemberian dibagi:
- **Pagi**: 40% (06:00)
- **Siang**: 20% (12:00)
- **Sore**: 40% (18:00)

## 3.7 Algoritma Sugeno

Sistem menggunakan algoritma Sugeno orde-0 dengan weighted average pada dua output terpisah:

```
1. FUZZIFIKASI:
   - Hitung derajat keanggotaan untuk semua himpunan fuzzy input
   - pH → {asam, normal, basa}
   - Suhu → {dingin, normal, panas}
   - Cuaca → {cerah, berawan, hujan, badai}
   - Kepadatan → {rendah, normal, tinggi}
   - Usia → {benur, pembesaran, panen}

2. EVALUASI ATURAN:
   - Untuk setiap aturan, hitung firing strength:
     wᵢ = min(μ kondisi₁, μ kondisi₂, ...)
   - Jika wᵢ > 0, aturan diaktifkan

3. DEFUZZIFIKASI (Weighted Average):
   - Adjustment = Σ(wᵢ × adjustmentᵢ) / Σ(wᵢ)
   - Feeding Rate = Σ(wᵢ × feeding_rateᵢ) / Σ(wᵢ untuk feeding)

4. KALKULASI PAKAN:
   - Berat = 0,001 × e^(growth_rate × usia/30)
   - Biomassa = jumlah_udang × berat
   - Daily Feed = biomassa × feeding_rate × FCR × adjustment
```

## 3.8 Desain Antarmuka

![Flowchart Proses Inferensi Fuzzy](gambar-3.1)

Sistem dirancang dengan antarmuka yang intuitif terdiri dari:

1. **Halaman Utama (Form Input)**: Form untuk memasukkan enam parameter dengan validasi client-side
2. **Halaman Hasil**: Menampilkan rekomendasi pakan, jadwal pemberian, dan analisis kondisi
3. **Halaman Riwayat**: Daftar riwayat rekomendasi yang tersimpan di LocalStorage

![Desain Antarmuka Dashboard](gambar-3.6)
![Desain Antarmuka Form Input](gambar-3.7)
![Desain Antarmuka Hasil Rekomendasi](gambar-3.8)
![Desain Antarmuka Riwayat](gambar-3.9)

---

# BAB IV
# IMPLEMENTASI, PENGUJIAN DAN EVALUASI

## 4.1 Implementasi Sistem

### 4.1.1 Lingkungan Pengembangan

**Tabel 4.1 Spesifikasi Lingkungan Pengembangan**

| Komponen | Spesifikasi |
|----------|-------------|
| Framework | Next.js 15.1.0 (App Router) |
| Library UI | React 19.0.0 |
| Bahasa Pemrograman | JavaScript (ES2022+) |
| Package Manager | npm |
| Library PDF | jsPDF 2.5.1 |
| Penyimpanan Data | LocalStorage (browser) |
| Styling | CSS Modules |
| Linting | ESLint (Next.js core-web-vitals) |
| Development Server | localhost:3000 |

### 4.1.2 Struktur Project

```
lib/
├── fuzzy/
│   ├── fuzzyLogic.js    # Fungsi utama fuzzy logic
│   ├── fuzzy.rules.js   # Basis aturan fuzzy
│   └── fuzzy.sets.js    # Definisi himpunan fuzzy
├── auth.js              # Autentikasi
├── constants.js         # Konstanta aplikasi
├── db.js               # Koneksi database
├── models/             # Model database
└── utils/              # Utility functions

app/
├── api/                # API routes
│   ├── auth/          # Login, register, logout
│   ├── tambak/        # CRUD tambak
│   └── recommendations# Rekomendasi pakan
├── dashboard/          # Halaman dashboard
├── history/            # Halaman riwayat
├── login/              # Halaman login
├── profile/            # Halaman profil
├── register/           # Halaman register
├── tambak/             # Halaman tambak
├── layout.js           # Root layout
├── page.js             # Halaman utama
└── globals.css         # Global styles
```

### 4.1.3 Implementasi Modul Fuzzy Logic (fuzzyLogic.js)

Modul inti sistem diimplementasikan dalam `lib/fuzzy/fuzzyLogic.js` menggunakan JavaScript murni tanpa library fuzzy eksternal. Fungsi-fungsi utama yang diimplementasikan meliputi:

1. **triangularMembership(x, min, peak, max)** — menghitung derajat keanggotaan fungsi segitiga
2. **fuzzify(inputs)** — fuzzifikasi seluruh input ke himpunan fuzzy
3. **evaluateRules(memberships)** — evaluasi seluruh aturan fuzzy
4. **defuzzify(activeRules)** — menghitung weighted average untuk adjustment dan feeding_rate
5. **estimateWeight(usia_udang, growth_rate)** — estimasi berat udang dengan rumus eksponensial
6. **calculate(inputs)** — fungsi utama yang mengintegrasikan seluruh proses

**Kode Utama Estimasi Berat:**
```javascript
function estimateWeight(usia_udang, growth_rate) {
  const baseWeight = 0.001; // kg
  const days = usia_udang;
  return baseWeight * Math.exp(growth_rate * (days / 30));
}
```

### 4.1.4 Implementasi Basis Aturan (fuzzy.rules.js)

```javascript
export default [
  // pH-based rules
  { conditions: (m) => m.ph.asam > 0.5,
    then: { adjustment: 0.7, reason: 'pH asam tingkatkan stres, kurangi pakan' } },
  { conditions: (m) => m.ph.basa > 0.5,
    then: { adjustment: 0.8, reason: 'pH basa tingkatkan stres, kurangi pakan' } },
  { conditions: (m) => m.ph.normal > 0.5,
    then: { adjustment: 1.0, reason: 'pH optimal' } },

  // Suhu-based rules
  { conditions: (m) => m.suhu.dingin > 0.5,
    then: { adjustment: 0.8, reason: 'Suhu dingin, metabolisme udang menurun' } },
  { conditions: (m) => m.suhu.panas > 0.5,
    then: { adjustment: 0.85, reason: 'Suhu panas tingkatkan stres' } },
  { conditions: (m) => m.suhu.normal > 0.5,
    then: { adjustment: 1.0, reason: 'Suhu optimal' } },

  // Cuaca-based rules
  { conditions: (m) => m.cuaca.hujan > 0.5 || m.cuaca.badai > 0.5,
    then: { adjustment: 0.7, reason: 'Cuaca buruk, nafsu makan menurun' } },
  { conditions: (m) => m.cuaca.berawan > 0.5,
    then: { adjustment: 0.9, reason: 'Cuaca berawan' } },
  { conditions: (m) => m.cuaca.cerah > 0.5,
    then: { adjustment: 1.0, reason: 'Cuaca cerah, nafsu makan baik' } },

  // Kepadatan-based rules
  { conditions: (m) => m.kepadatan.rendah > 0.5,
    then: { adjustment: 1.1, reason: 'Kepadatan rendah, tambah pakan untuk pertumbuhan' } },
  { conditions: (m) => m.kepadatan.tinggi > 0.5,
    then: { adjustment: 0.9, reason: 'Kepadatan tinggi, kurangi pakan hindari waste' } },
  { conditions: (m) => m.kepadatan.normal > 0.5,
    then: { adjustment: 1.0, reason: 'Kepadatan normal' } },

  // Usia-based rules (feeding rate)
  { conditions: (m) => m.usia.benur > 0.5,
    then: { feeding_rate: 0.05, reason: 'Fase benur, feeding rate tinggi' } },
  { conditions: (m) => m.usia.pembesaran > 0.5,
    then: { feeding_rate: 0.04, reason: 'Fase pembesaran' } },
  { conditions: (m) => m.usia.panen > 0.5,
    then: { feeding_rate: 0.03, reason: 'Fase panen, feeding rate lebih rendah' } }
];
```

### 4.1.5 Implementasi Komponen React

1. **InputForm.js** — form dengan validasi client-side, penanganan state input, dan event "Hitung Rekomendasi"
2. **ResultCard.js** — komponen tampilan hasil rekomendasi dengan visualisasi jadwal pemberian pakan dan analisis kondisi tambak
3. **HistoryList.js** — komponen yang membaca LocalStorage dan merender riwayat rekomendasi dalam format kartu

### 4.1.6 Implementasi Utilitas

1. **pdfExport.js** — helper untuk membangkitkan dokumen PDF dari data hasil rekomendasi menggunakan jsPDF
2. **storage.js** — abstraksi operasi LocalStorage (simpan, baca, hapus riwayat rekomendasi)

## 4.2 Pengujian Sistem

Pengujian dilakukan menggunakan lima skenario yang mewakili variasi kondisi tambak dari kondisi optimal hingga kondisi paling buruk.

**Tabel 4.2 Data Pengujian dan Hasil Rekomendasi**

| Kasus | pH | Suhu | Cuaca | Vol (m³) | Jumlah | Usia (hr) | Pakan/hr (kg) |
|-------|----|------|-------|----------|--------|-----------|---------------|
| 1 (Optimal) | 7,8 | 27 | Cerah | 500 | 50.000 | 60 | ±2,2 |
| 2 (pH Asam) | 6,2 | 32 | Hujan | 500 | 50.000 | 60 | ±1,2 |
| 3 (Benur) | 7,5 | 25 | Cerah | 1000 | 80.000 | 30 | ±2,4 |
| 4 (Badai) | 7,0 | 31 | Badai | 500 | 50.000 | 60 | ±1,1 |
| 5 (Panen) | 7,8 | 28 | Berawan | 500 | 50.000 | 110 | ±1,0 |

*Jadwal pemberian: Pagi 40% | Siang 20% | Sore 40%*

**Analisis Hasil Pengujian:**

- **Kasus 1** merepresentasikan kondisi ideal: pH normal, suhu optimal, cuaca cerah menghasilkan faktor koreksi mendekati 1,0 sehingga rekomendasi pakan berada pada nilai penuh tanpa pengurangan.

- **Kasus 2** menunjukkan respons sistem terhadap kondisi buruk ganda (pH asam + suhu panas + hujan) yang menurunkan rekomendasi pakan hingga sekitar 50%, sesuai praktik di mana udang yang stres sebaiknya diberi pakan lebih sedikit untuk menghindari penumpukan sisa pakan.

- **Kasus 3** membuktikan bahwa fase benur dengan feeding rate lebih tinggi (5%) menghasilkan rekomendasi pakan yang lebih besar meskipun usia masih muda.

- **Kasus 4** menunjukkan respons terhadap kondisi badai dengan faktor koreksi yang sangat rendah, konsisten dengan kebiasaan petambak yang mengurangi atau menghentikan pemberian pakan saat cuaca ekstrem.

- **Kasus 5** menunjukkan kombinasi fase panen (feeding rate rendah 3%) dengan cuaca berawan menghasilkan rekomendasi pakan yang lebih rendah.

![Tampilan Form Input](gambar-4.1)
![Tampilan Hasil Rekomendasi](gambar-4.2)
![Tampilan Halaman Riwayat](gambar-4.3)
![Tampilan Ekspor PDF](gambar-4.4)

## 4.3 Evaluasi Sistem (Survei Pengguna)

Evaluasi dilakukan melalui survei kepada 10 responden yang terdiri dari mahasiswa Teknik Informatika, masyarakat umum yang mengenal budidaya udang, dan calon pengguna potensial. Survei mencakup enam aspek penilaian dengan skala 1–5.

**Tabel 4.3 Hasil Survei Pengguna**

| No | Aspek Penilaian | Rata-rata Skor (1–5) |
|----|----------------|---------------------|
| 1 | Kemudahan penggunaan antarmuka | 4,3 |
| 2 | Kejelasan hasil dan analisis yang ditampilkan | 4,4 |
| 3 | Relevansi rekomendasi dengan kondisi input | 4,2 |
| 4 | Kemanfaatan fitur riwayat rekomendasi | 4,0 |
| 5 | Kemanfaatan fitur ekspor PDF | 4,5 |
| 6 | Kesan keseluruhan terhadap aplikasi | 4,3 |
| **Rata-rata keseluruhan** | **4,28** |

![Grafik Hasil Survei](gambar-4.5)

Hasil survei menunjukkan bahwa mayoritas pengguna memberikan penilaian positif terhadap aplikasi Si Tambak, dengan aspek kejelasan hasil dan fitur ekspor PDF mendapatkan nilai tertinggi (4,4 dan 4,5). Rata-rata skor keseluruhan 4,28 dari skala 5 mengindikasikan bahwa aplikasi diterima dengan baik oleh pengguna.

---

# BAB V
# KESIMPULAN DAN SARAN

## 5.1 Kesimpulan

Berdasarkan hasil perancangan, implementasi, pengujian, dan evaluasi yang telah dilakukan, dapat ditarik kesimpulan sebagai berikut:

1. Sistem inferensi berbasis Logika Fuzzy Sugeno berhasil dirancang dan diimplementasikan dalam aplikasi web Si Tambak untuk memberikan rekomendasi kuantitas dan jadwal pemberian pakan pada tambak udang berdasarkan **enam parameter input** kondisi tambak untuk spesies udang Vannamei dengan parameter FCR 1,2 dan growth rate 0,0015/hari.

2. Metode Fuzzy Sugeno terbukti efektif menghasilkan nilai output kuantitas pakan yang bervariasi dan proporsional terhadap perubahan kondisi lingkungan tambak. Kondisi buruk seperti pH tidak normal, suhu ekstrem, dan cuaca badai secara konsisten menghasilkan pengurangan rekomendasi pakan yang selaras dengan praktik budidaya yang baik (Good Aquaculture Practices).

3. Aplikasi Si Tambak berhasil dikembangkan menggunakan Next.js 15.1.0 dan React 19.0.0 dalam bentuk aplikasi web yang intuitif dan dapat diakses tanpa instalasi khusus. Fitur riwayat berbasis LocalStorage dan ekspor PDF turut mendukung dokumentasi dan pemanfaatan ulang hasil rekomendasi oleh pengguna.

4. Hasil evaluasi kepada 10 responden menghasilkan rata-rata skor kepuasan pengguna sebesar 4,28 dari skala 5, mengindikasikan bahwa Si Tambak mudah digunakan dan rekomendasinya dipersepsikan sebagai relevan serta bermanfaat oleh pengguna akhir.

## 5.2 Saran

Berdasarkan hasil evaluasi dan masukan dari pengguna, beberapa saran pengembangan Si Tambak ke depannya adalah:

1. **Integrasi Sensor IoT**: Mengintegrasikan sistem dengan sensor pH, suhu, dan oksigen terlarut secara real-time sehingga parameter input dapat diperoleh secara otomatis tanpa keterlibatan manual pengguna, meningkatkan akurasi dan kenyamanan penggunaan.

2. **Perluasan Variabel Input**: Menambahkan variabel input seperti kadar oksigen terlarut (DO), salinitas, dan kadar amonia untuk menghasilkan rekomendasi yang lebih komprehensif dan akurat.

3. **Validasi Lapangan**: Melakukan uji coba langsung di tambak udang nyata untuk memverifikasi akurasi rekomendasi sistem dibandingkan dengan hasil pertumbuhan dan panen aktual.

4. **Pengembangan Aplikasi Mobile**: Mengembangkan versi mobile native (Android/iOS) agar lebih mudah diakses oleh petambak di lapangan yang mayoritas menggunakan smartphone.

5. **Backend dan Database Server**: Mengganti LocalStorage dengan database server agar riwayat rekomendasi dapat diakses lintas perangkat, mendukung analitik jangka panjang, dan memungkinkan fitur berbagi data antar pengguna.

6. **Visualisasi Proses Fuzzy**: Menambahkan visualisasi interaktif untuk fungsi keanggotaan dan proses inferensi agar pengguna dapat memahami cara kerja sistem secara lebih transparan dan meningkatkan kepercayaan terhadap rekomendasi.

---

# DAFTAR PUSTAKA

1. Boyd, C. E., & Clay, J. W. (1998). Shrimp aquaculture and the environment. *Scientific American*, 278(6), 58–65.

2. Haliman, R. W., & Adijaya, D. (2005). *Udang Vannamei: Pembudidayaan dan prospek pasar udang putih yang tahan penyakit*. Penebar Swadaya.

3. Shilman, I., Suparmin, Irmawan, F., & Budiman. (2023). Efisiensi pemberian pakan pada usaha pembesaran udang vaname (Litopenaeus vannamei) pola tambak intensif Pusat Unggulan Teknologi (PUT) Politeknik Negeri Pontianak di Mempawah. *Jurnal Ruaya*, 11(2). https://doi.org/10.29406/JR.V11I2.4820

4. Sugeno, M., & Kang, G. T. (1988). Structure identification of fuzzy model. *Fuzzy Sets and Systems*, 28(1), 15–33.

5. Kusumadewi, S., & Purnomo, H. (2010). *Aplikasi Logika Fuzzy untuk Pendukung Keputusan*. Yogyakarta: Graha Ilmu.

6. Naba, A. (2009). *Belajar Cepat Fuzzy Logic Menggunakan MATLAB*. Yogyakarta: ANDI.

7. Takagi, T., & Sugeno, M. (1985). Fuzzy identification of systems and its applications to modeling and control. *IEEE Transactions on Systems, Man, and Cybernetics*, 15(1), 116–132.

8. Wyban, J. A., & Sweeney, J. N. (1991). *Intensive Shrimp Production Technology: The Oceanic Institute Shrimp Manual*. Honolulu: Oceanic Institute.

9. Zadeh, L. A. (1965). Fuzzy sets. *Information and Control*, 8(3), 338–353.

---

# LAMPIRAN

## Lampiran 1: Hasil Survei Pengguna Lengkap

Detail hasil survei terhadap 10 responden dapat diakses melalui link Google Forms yang digunakan dalam penelitian.

## Lampiran 2: Pembagian Beban Tugas Kelompok

**Tabel Lampiran 1 Pembagian Beban Tugas Kelompok**

| No | NIM | Nama Mahasiswa | Tugas | Beban (%) |
|----|-----|----------------|-------|-----------|
| 1 | 434241056 | Muhammad Raka Razani | Inisiasi Ide, Backend, CDM, Laporan | 25% |
| 2 | 434241106 | Nuafal Bagaskara | Inisiasi Ide, Flowchart, PDM | 25% |
| 3 | 43424112 | Aditya Alif Santoso | Frontend, Laporan | 25% |
| 4 | 434241128 | Fina Aida Purnamasari Yusuf | Inisiasi Ide, Backend, Laporan | 25% |

## Lampiran 3: Source Code

Source code lengkap aplikasi Si Tambak dapat diakses melalui repository GitHub:

**Link Repository**: https://github.com/TendriZ/UAS-AI-B2-KEL-3

Repository berisi seluruh source code, konfigurasi, dan dokumentasi teknis yang digunakan dalam pengembangan aplikasi.

---

**FINIS**
