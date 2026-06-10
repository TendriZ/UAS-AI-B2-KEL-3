'use client';

import jsPDF from 'jspdf';

export default function ResultCard({ data }) {
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Rekomendasi Pakan TambakAI', 20, 20);

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
    <div className="space-y-6">
      {/* Feed Quantity */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Kuantitas Pakan Harian</h3>
        <p className="text-4xl font-bold">{data.kuantitas_pakan} kg</p>
      </div>

      {/* Feeding Schedule */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Jadwal Pemberian</h3>
        <div className="space-y-2">
          {data.jadwal_pemberian.map((jadwal, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {index === 0 ? '🌅' : index === 1 ? '☀️' : '🌆'}
                </span>
                <span className="font-medium text-gray-700">{jadwal.waktu}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-blue-600">{jadwal.jumlah.toFixed(2)} kg</span>
                <span className="text-gray-500 text-sm ml-2">({jadwal.persen}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Analisis Detail</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Biomassa</p>
            <p className="font-semibold text-gray-800">{data.analisis.biomassa_kg} kg</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Kepadatan</p>
            <p className="font-semibold text-gray-800">{data.analisis.kepadatan_ekor_per_m3} ekor/m³</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Feeding Rate</p>
            <p className="font-semibold text-gray-800">{data.analisis.feeding_rate_persen}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">FCR</p>
            <p className="font-semibold text-gray-800">{data.analisis.fcr}</p>
          </div>
        </div>
      </div>

      {/* Detail Perhitungan Fuzzy */}
      {data.detail_perhitungan && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Detail Perhitungan Fuzzy (Sugeno)</h3>

          {/* Step 1: Fuzzifikasi */}
          <div className="mb-6">
            <h4 className="font-semibold text-blue-700 mb-3">1. Fuzzifikasi (Konversi input ke nilai keanggotaan)</h4>
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              {data.detail_perhitungan.fuzzifikasi && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Input:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-white rounded p-3">
                      <div><span className="text-gray-600">pH Air:</span> <span className="font-semibold">{data.detail_perhitungan.fuzzifikasi.input.ph_air}</span></div>
                      <div><span className="text-gray-600">Suhu Air:</span> <span className="font-semibold">{data.detail_perhitungan.fuzzifikasi.input.suhu_air}°C</span></div>
                      <div><span className="text-gray-600">Cuaca:</span> <span className="font-semibold">{data.detail_perhitungan.fuzzifikasi.input.cuaca}</span></div>
                      <div><span className="text-gray-600">Volume Air:</span> <span className="font-semibold">{data.detail_perhitungan.fuzzifikasi.input.volume_air} m³</span></div>
                      <div><span className="text-gray-600">Jumlah Udang:</span> <span className="font-semibold">{data.detail_perhitungan.fuzzifikasi.input.jumlah_udang} ekor</span></div>
                      <div><span className="text-gray-600">Usia Udang:</span> <span className="font-semibold">{data.detail_perhitungan.fuzzifikasi.input.usia_udang} hari</span></div>
                      <div className="col-span-2"><span className="text-gray-600">Kepadatan:</span> <span className="font-semibold">{data.detail_perhitungan.fuzzifikasi.input.kepadatan} ekor/m³</span></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Nilai Keanggotaan (Membership Values):</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* pH */}
                      <div className="bg-white rounded p-3">
                        <p className="font-medium text-gray-800 mb-2">pH</p>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between"><span className="text-gray-600">Asam:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.ph.asam}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Normal:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.ph.normal}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Basa:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.ph.basa}</span></div>
                        </div>
                      </div>

                      {/* Suhu */}
                      <div className="bg-white rounded p-3">
                        <p className="font-medium text-gray-800 mb-2">Suhu</p>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between"><span className="text-gray-600">Dingin:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.suhu.dingin}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Normal:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.suhu.normal}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Panas:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.suhu.panas}</span></div>
                        </div>
                      </div>

                      {/* Cuaca */}
                      <div className="bg-white rounded p-3">
                        <p className="font-medium text-gray-800 mb-2">Cuaca</p>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between"><span className="text-gray-600">Cerah:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.cuaca.cerah}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Berawan:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.cuaca.berawan}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Hujan:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.cuaca.hujan}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Badai:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.cuaca.badai}</span></div>
                        </div>
                      </div>

                      {/* Kepadatan */}
                      <div className="bg-white rounded p-3">
                        <p className="font-medium text-gray-800 mb-2">Kepadatan</p>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between"><span className="text-gray-600">Rendah:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.kepadatan.rendah}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Normal:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.kepadatan.normal}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Tinggi:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.kepadatan.tinggi}</span></div>
                        </div>
                      </div>

                      {/* Usia */}
                      <div className="bg-white rounded p-3">
                        <p className="font-medium text-gray-800 mb-2">Usia</p>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between"><span className="text-gray-600">Benur:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.usia.benur}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Pembesaran:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.usia.pembesaran}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600">Panen:</span> <span className="font-mono font-semibold">{data.detail_perhitungan.fuzzifikasi.memberships.usia.panen}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Step 2: Rule Evaluation */}
          <div className="mb-6">
            <h4 className="font-semibold text-green-700 mb-3">2. Rule Evaluation (Evaluasi Aturan Fuzzy)</h4>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">Total aturan: {data.detail_perhitungan.rule_evaluation.total_rules} | Aturan aktif (fired): {data.detail_perhitungan.rule_evaluation.active_rules.length}</p>
              <div className="space-y-2">
                {data.detail_perhitungan.rule_evaluation.active_rules.map((rule, idx) => (
                  <div key={idx} className="bg-white rounded p-3 border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-sm font-semibold text-green-700">Rule strength: {rule.strength}</span>
                      <div className="text-right text-xs">
                        <span className="text-gray-600">Adj: </span>
                        <span className="font-mono">{rule.adjustment}</span>
                        {rule.feeding_rate !== '-' && (
                          <>
                            <span className="text-gray-600 ml-2">FR: </span>
                            <span className="font-mono">{rule.feeding_rate}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{rule.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Defuzzifikasi */}
          <div>
            <h4 className="font-semibold text-purple-700 mb-3">3. Defuzzifikasi (Sugeno - Weighted Average)</h4>
            <div className="bg-purple-50 rounded-lg p-4">
              {data.detail_perhitungan.defuzifikasi.calculation ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 italic">{data.detail_perhitungan.defuzifikasi.method}</p>

                  {/* Adjustment Calculation */}
                  <div className="bg-white rounded p-4">
                    <p className="font-medium text-gray-800 mb-3">Faktor Koreksi (Adjustment):</p>
                    <div className="text-sm space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Weight (Σ strength):</span>
                        <span className="font-semibold">{data.detail_perhitungan.defuzifikasi.calculation.adjustment.total_weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weighted Sum (Σ adj × strength):</span>
                        <span className="font-semibold">{data.detail_perhitungan.defuzifikasi.calculation.adjustment.weighted_sum}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-600">Result (Weighted Sum / Total Weight):</span>
                        <span className="font-bold text-purple-700">{data.detail_perhitungan.defuzifikasi.calculation.adjustment.result}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feeding Rate Calculation */}
                  <div className="bg-white rounded p-4">
                    <p className="font-medium text-gray-800 mb-3">Feeding Rate:</p>
                    <div className="text-sm space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Weight (Σ strength):</span>
                        <span className="font-semibold">{data.detail_perhitungan.defuzifikasi.calculation.feeding_rate.total_weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weighted Sum (Σ FR × strength):</span>
                        <span className="font-semibold">{data.detail_perhitungan.defuzifikasi.calculation.feeding_rate.weighted_sum}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-600">Result (Weighted Sum / Total Weight):</span>
                        <span className="font-bold text-purple-700">{data.detail_perhitungan.defuzifikasi.calculation.feeding_rate.result}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">Tidak ada aturan yang aktif</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Penjelasan</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
            {data.penjelasan}
          </pre>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={exportToPDF}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export PDF
      </button>
    </div>
  );
}
