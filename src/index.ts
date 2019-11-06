import express from 'express';
import bodyparser from 'body-parser';
import { ok } from './shared/services/api.service';

const PORT = 4000;
const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/health', (_: any, res) => ok(res, "I'm a little teapot, not really!"));

app.listen(PORT, () => console.log(`Email Service API is running on PORT: ${PORT}`));
