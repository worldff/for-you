const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Membuat aplikasi Express
const app = express();

// Middleware
app.use(cors()); // Mengizinkan akses dari frontend
app.use(bodyParser.json()); // Untuk mengurai JSON pada request body

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/birthday_wishes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Terhubung'))
.catch(err => console.log('Error Koneksi MongoDB:', err));

// Definisikan skema dan model untuk ucapan
const wishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Wish = mongoose.model('Wish', wishSchema);

// Endpoint untuk mengambil semua ucapan
app.get('/api/wishes', (req, res) => {
    Wish.find()
        .then(wishes => res.json(wishes)) // Mengembalikan daftar ucapan dalam format JSON
        .catch(err => res.status(500).json({ message: 'Error fetching wishes', error: err }));
});

// Endpoint untuk menambahkan ucapan baru
app.post('/api/wishes', (req, res) => {
    const { name, text } = req.body;

    const newWish = new Wish({ name, text });

    newWish.save()
        .then(() => res.json({ message: 'Ucapan berhasil disimpan!' })) // Mengirim respon sukses
        .catch(err => res.status(500).json({ message: 'Error saving wish', error: err }));
});

// Endpoint untuk menghapus ucapan berdasarkan ID
app.delete('/api/wishes/:id', (req, res) => {
    const { id } = req.params;
    Wish.findByIdAndDelete(id)
        .then(() => res.json({ message: 'Ucapan berhasil dihapus!' })) // Mengirim respon sukses
        .catch(err => res.status(500).json({ message: 'Error deleting wish', error: err }));
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
});
