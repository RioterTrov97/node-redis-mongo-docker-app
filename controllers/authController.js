const User = require('../models/userModel');
const bycrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashpassword = await bycrypt.hash(password, 12);
		const newUser = await User.create({ username, password: hashpassword });
		req.session.user = newUser;
		res.status(200).json({
			status: 'success',
			data: {
				user: newUser,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		if (!user) {
			res.status(404).json({
				status: 'fail',
				message: 'User not found',
			});
		}

		const isCorrect = await bycrypt.compare(password, user.password);

		if (isCorrect) {
			req.session.user = user;
			res.status(200).json({
				status: 'success',
			});
		} else {
			res.status(404).json({
				status: 'fail',
				message: 'Incorrect username or password',
			});
		}
	} catch (error) {
		res.status(400).json({
			status: 'fail',
		});
	}
};
