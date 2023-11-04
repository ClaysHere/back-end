const nama = 'M. Fikri';
const nim = '221110816';
const kelas = 'IF-C Sore';

const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(url);

const dbName = 'praktek-web-rahasia';

async function konek() {
  await client.connect();
  console.log('Berhasil connect ke database...');
}

konek();

const db = client.db(dbName);
const collection = db.collection('products');

app.get('/products/tambah', (req, res) => {
  if (!req.query.nama || !req.query.kat || !req.query.harga) {
    res.send('Tidak boleh ada data yang kosong.');
    return;
  }
  async function insertData() {
    try {
      const insertResult = await collection.insertOne({
        nama: req.query.nama,
        kategori: req.query.kat,
        harga: Number(req.query.harga),
      });
      res.status(201).json(insertResult);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  insertData();
});

app.get('/products', (req, res) => {
  async function findData() {
    try {
      const findResult = await collection.find({}).toArray();
      res.status(200).json(findResult);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  findData();
});

app.get('/products/delete/:id', (req, res) => {
  const id = new ObjectId(req.params.id);

  async function deleteData() {
    try {
      const deleteResult = await collection.deleteOne({ _id: id });
      deleteResult.deletedCount > 0
        ? res.status(204).json()
        : res.status(404).json({ message: 'Data tidak ditemukan' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  deleteData();
});

app.listen(port);
