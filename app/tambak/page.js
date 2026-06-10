'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function TambakPage() {
  const router = useRouter();
  const [tambaks, setTambaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTambak, setEditingTambak] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    volume_air: ''
  });

  useEffect(() => {
    fetchTambaks();
  }, []);

  const fetchTambaks = async () => {
    try {
      const res = await fetch('/api/tambak');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setTambaks(data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTambak
      ? `/api/tambak/${editingTambak.id}`
      : '/api/tambak';
    const method = editingTambak ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          volume_air: parseFloat(formData.volume_air)
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditingTambak(null);
        setFormData({ name: '', description: '', volume_air: '' });
        fetchTambaks();
      } else {
        alert(data.message || 'Gagal menyimpan tambak');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (tambak) => {
    setEditingTambak(tambak);
    setFormData({
      name: tambak.name,
      description: tambak.description || '',
      volume_air: tambak.volume_air.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus tambak ini?')) return;

    try {
      const res = await fetch(`/api/tambak/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTambaks(tambaks.filter((t) => t.id !== id));
      }
    } catch (error) {
      alert('Gagal menghapus tambak');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTambak(null);
    setFormData({ name: '', description: '', volume_air: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Kelola Tambak
            </h1>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Tambah Tambak
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingTambak ? 'Edit Tambak' : 'Tambah Tambak Baru'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Tambak *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume Air (m³) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.volume_air}
                    onChange={(e) => setFormData({ ...formData, volume_air: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0.1"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    {editingTambak ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tambaks.length === 0 ? (
              <div className="col-span-2 bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500 mb-4">
                  Belum ada tambak. Tambahkan tambak Anda untuk memulai.
                </p>
              </div>
            ) : (
              tambaks.map((tambak) => (
                <div
                  key={tambak.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {tambak.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ditambahkan: {new Date(tambak.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <span className="text-2xl">🦐</span>
                  </div>

                  {tambak.description && (
                    <p className="text-gray-600 mb-3">{tambak.description}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Volume: <span className="font-semibold">{tambak.volume_air} m³</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tambak)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tambak.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
