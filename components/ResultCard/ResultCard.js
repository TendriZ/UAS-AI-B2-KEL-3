'use client';

import jsPDF from 'jspdf';
import styles from './ResultCard.module.css';

export default function ResultCard({ data }) {
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Rekomendasi Pakan Si Tambak', 20, 20);

    // Date
    doc.setFontSize(12);
    doc.text(`Tanggal: ${new Date(data.created_at || Date.now()).toLocaleDateString('id-ID')}`, 20, 30);

    // Feed Quantity
    doc.setFontSize(14);
    doc.text(`Kuantitas Pakan Harian: ${data.kuantitas_pakan} kg`, 20, 45);

    // Schedule
    doc.text('Jadwal Pemberian:', 20, 55);
    let yPos = 63;
    data.jadwal_pemberian.forEach((jadwal) => {
      doc.text(
        `${jadwal.waktu} - ${jadwal.jumlah.toFixed(2)} kg (${jadwal.persen}%)`,
        25,
        yPos
      );
      yPos += 8;
    });

    // Analysis
    yPos += 5;
    doc.text('Analisis:', 20, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.text(`Biomassa: ${data.analisis.biomassa_kg} kg`, 25, yPos);
    yPos += 7;
    doc.text(`Kepadatan: ${data.analisis.kepadatan_ekor_per_m3} ekor/m³`, 25, yPos);
    yPos += 7;
    doc.text(`Feeding Rate: ${data.analisis.feeding_rate_persen}%`, 25, yPos);
    yPos += 7;
    doc.text(`FCR: ${data.analisis.fcr}`, 25, yPos);
    yPos += 7;
    doc.text(`Faktor Koreksi: ${data.analisis.faktor_koreksi}`, 25, yPos);

    // Explanation (word wrap)
    yPos += 10;
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(data.penjelasan, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 5 + 5;

    // Detail Perhitungan Fuzzy (if available)
    if (data.detail_perhitungan) {
      yPos += 5;
      doc.setFontSize(12);
      doc.text('Detail Perhitungan Fuzzy (Sugeno):', 20, yPos);
      yPos += 7;

      // Fuzzifikasi
      doc.setFontSize(10);
      doc.text('1. Fuzzifikasi - Nilai Keanggotaan:', 25, yPos);
      yPos += 5;

      const fuzz = data.detail_perhitungan.fuzzifikasi.memberships;
      doc.text(`pH - Asam: ${fuzz.ph.asam}, Normal: ${fuzz.ph.normal}, Basa: ${fuzz.ph.basa}`, 30, yPos);
      yPos += 5;
      doc.text(`Suhu - Dingin: ${fuzz.suhu.dingin}, Normal: ${fuzz.suhu.normal}, Panas: ${fuzz.suhu.panas}`, 30, yPos);
      yPos += 5;
      doc.text(`Cuaca - Cerah: ${fuzz.cuaca.cerah}, Berawan: ${fuzz.cuaca.berawan}, Hujan: ${fuzz.cuaca.hujan}, Badai: ${fuzz.cuaca.badai}`, 30, yPos);
      yPos += 5;
      doc.text(`Kepadatan - Rendah: ${fuzz.kepadatan.rendah}, Normal: ${fuzz.kepadatan.normal}, Tinggi: ${fuzz.kepadatan.tinggi}`, 30, yPos);
      yPos += 5;
      doc.text(`Usia - Benur: ${fuzz.usia.benur}, Pembesaran: ${fuzz.usia.pembesaran}, Panen: ${fuzz.usia.panen}`, 30, yPos);
      yPos += 7;

      // Rule Evaluation
      doc.text(`2. Rule Evaluation - Aturan Aktif: ${data.detail_perhitungan.rule_evaluation.active_rules.length}/${data.detail_perhitungan.rule_evaluation.total_rules}`, 25, yPos);
      yPos += 5;
      data.detail_perhitungan.rule_evaluation.active_rules.forEach((rule, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`   Rule ${idx + 1}: Strength=${rule.strength}, ${rule.reason}`, 30, yPos);
        yPos += 4;
      });
      yPos += 5;

      // Defuzzifikasi
      if (data.detail_perhitungan.defuzifikasi.calculation) {
        doc.text('3. Defuzzifikasi - Weighted Average:', 25, yPos);
        yPos += 5;
        const calc = data.detail_perhitungan.defuzifikasi.calculation;
        doc.text(`Faktor Koreksi: ${calc.adjustment.result} (Weight: ${calc.adjustment.total_weight}, Sum: ${calc.adjustment.weighted_sum})`, 30, yPos);
        yPos += 5;
        doc.text(`Feeding Rate: ${calc.feeding_rate.result} (Weight: ${calc.feeding_rate.total_weight}, Sum: ${calc.feeding_rate.weighted_sum})`, 30, yPos);
      }
    }

    doc.save(`rekomendasi-tambak-${Date.now()}.pdf`);
  };

  return (
  <div className={styles.wrapper}>
    
    <div className={styles.heroCard}>
      <div>
        <p className={styles.heroLabel}>
          Rekomendasi Pakan Harian
        </p>

        <h2 className={styles.heroValue}>
          {data.kuantitas_pakan} kg
        </h2>
      </div>

      <div className={styles.heroIcon}>
        🦐
      </div>
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        Jadwal Pemberian
      </h3>

      <div className={styles.scheduleList}>
        {data.jadwal_pemberian.map(
          (jadwal, index) => (
            <div
              key={index}
              className={styles.scheduleItem}
            >
              <div className={styles.scheduleLeft}>
                <span className={styles.emoji}>
                  {index === 0
                    ? "🌅"
                    : index === 1
                    ? "☀️"
                    : "🌆"}
                </span>

                <span>
                  {jadwal.waktu}
                </span>
              </div>

              <div>
                <strong>
                  {jadwal.jumlah.toFixed(2)} kg
                </strong>

                <span
                  className={styles.percent}
                >
                  ({jadwal.persen}%)
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>

    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        Analisis Tambak
      </h3>

      <div className={styles.analysisGrid}>
        <div className={styles.metric}>
          <span>Biomassa</span>
          <strong>
            {data.analisis.biomassa_kg}
            kg
          </strong>
        </div>

        <div className={styles.metric}>
          <span>Kepadatan</span>
          <strong>
            {
              data.analisis
                .kepadatan_ekor_per_m3
            }
          </strong>
        </div>

        <div className={styles.metric}>
          <span>Feeding Rate</span>
          <strong>
            {
              data.analisis
                .feeding_rate_persen
            }
            %
          </strong>
        </div>

        <div className={styles.metric}>
          <span>FCR</span>
          <strong>
            {data.analisis.fcr}
          </strong>
        </div>
      </div>
    </div>

    {data.detail_perhitungan && (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Detail Fuzzy Sugeno
        </h3>

        <div className={styles.fuzzyInfo}>
          <div className={styles.step}>
            <div
              className={styles.stepBadge}
            >
              1
            </div>

            <div>
              <h4>Fuzzifikasi</h4>

              <p>
                Sistem mengubah nilai
                input menjadi nilai
                keanggotaan fuzzy.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div
              className={styles.stepBadge}
            >
              2
            </div>

            <div>
              <h4>
                Rule Evaluation
              </h4>

              <p>
                {
                  data
                    .detail_perhitungan
                    .rule_evaluation
                    .active_rules.length
                }
                {" "}aturan aktif dari{" "}
                {
                  data
                    .detail_perhitungan
                    .rule_evaluation
                    .total_rules
                }
                {" "}aturan.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div
              className={styles.stepBadge}
            >
              3
            </div>

            <div>
              <h4>
                Defuzzifikasi
              </h4>

              <p>
                Menghasilkan feeding
                rate dan faktor koreksi
                akhir.
              </p>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        Penjelasan AI
      </h3>

      <div className={styles.explanation}>
        <pre>
          {data.penjelasan}
        </pre>
      </div>
    </div>

    <button
      onClick={exportToPDF}
      className={styles.exportButton}
    >
      Export PDF
    </button>
  </div>
);}
