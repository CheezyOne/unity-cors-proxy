import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем запросы из любого источника
app.use(cors());

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        // Используем нативный fetch Node.js (доступен с версии 18+)
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            return res.status(response.status).send(`Upstream error: ${response.statusText}`);
        }

        // Получаем данные как ArrayBuffer
        const buffer = await response.arrayBuffer();
        
        // Устанавливаем заголовки от оригинального ответа
        res.set('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
        res.set('Content-Length', buffer.byteLength);
        
        // Отправляем данные
        res.send(Buffer.from(buffer));
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

app.listen(PORT, () => {
    console.log(`CORS proxy server running on port ${PORT}`);
});