const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Используем CommonJS-совместимую версию

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем запросы из любого источника (для теста)
app.use(cors());

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Параметр URL отсутствует');
    }
    try {
        const response = await fetch(targetUrl);
        const buffer = await response.buffer(); // Получаем бинарные данные
        res.set('Content-Type', response.headers.get('content-type'));
        res.send(buffer);
    } catch (error) {
        console.error('Ошибка прокси:', error);
        res.status(500).send('Ошибка при загрузке изображения');
    }
});

app.listen(PORT, () => console.log(`Прокси-сервер запущен на порту ${PORT}`));
