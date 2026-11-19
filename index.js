const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 


app.post('/api/mahasiswa', async (req, res) => {
    const { nim, nama, prodi } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO mahasiswa (nim, nama, prodi) VALUES (?, ?, ?)',
            [nim, nama, prodi]
        );
        res.status(201).json({
            message: 'Data berhasil ditambahkan',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/mahasiswa', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM mahasiswa');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/mahasiswa/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM mahasiswa WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/mahasiswa/:id', async (req, res) => {
    const { nim, nama, prodi } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ? WHERE id = ?',
            [nim, nama, prodi, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json({ message: 'Data berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/mahasiswa/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM mahasiswa WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json({ message: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});