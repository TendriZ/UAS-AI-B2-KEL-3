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
