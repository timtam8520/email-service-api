import express from 'express';
import bodyparser from 'body-parser';
import { ok } from './shared/services/api.service';
import trySendEmail from './shared/services/email.service';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/health', (_: any, res) => ok(res, "I'm a little teapot, not really!"));
app.post('/sendEmail', (req, res) => trySendEmail(req, res));

app.listen(PORT, () => console.log(`Email Service API is running on PORT: ${PORT}`));
