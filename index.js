const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {
	MONGO_IP,
	MONGO_PORT,
	MONGO_USER,
	MONGO_PASSWORD,
	REDIS_URL,
	REDIS_PORT,
	SESSION_SECRET,
} = require('./config/config');
const postRouter = require('./routes/postRoute');
const userRouter = require('./routes/userRoute');

const redis = require('redis');
const session = require('express-session');

let RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient({
	host: REDIS_URL,
	port: REDIS_PORT,
});

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

mongoose
	.connect(mongoURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log('successfully connected to DB'))
	.catch((err) => console.log(err));

app.enable('trust proxy');
app.use(cors());
app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: SESSION_SECRET,
		cookie: {
			secure: false,
			resave: false,
			saveUninitialized: false,
			httpOnly: true,
			maxAge: 30000,
		},
	})
);

app.use(express.json());

app.get('/api/v1', (req, res) => {
	res.send('<h2>Hi kaalu kaaluwa there!!!</h2>');
	console.log('this ran');
});

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
