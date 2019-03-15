import SequelizeTrails from '../lib/index';

const db = require('../models/index.js');

// const { Sequelize } = db;
const { sequelize } = db;

let User;
let PaperTrails;

describe('PaperTrails', () => {
	it('initialize PaperTrails', done => {
		PaperTrails = SequelizeTrails.init(sequelize, {
			enableMigration: true,
		});
		PaperTrails.defineModels();
		User = sequelize.model('User');
		User.Revisions = User.hasPaperTrail();
		User.refreshAttributes();
		done();
	});

	it('model is revisionable', () => {
		expect(User.revisionable).to.equal(true);
	});

	it('revision increments', done => {
		User.findOrCreate({ where: { name: 'Dave' } })
			.spread((user, created) => {
				// console.log(user.get({plain: true}));
				expect(created).to.equal(true);
				expect(user.get('revision')).to.equal(1);
				user.update({ name: 'David' })
					.then(() => {
						user.reload()
							.then(() => {
								// console.log(user.get({plain: true}));
								expect(user.get('revision')).to.equal(2);
								done();
							})
							.catch(err => {
								done(err);
							});
					})
					.catch(err => {
						done(err);
					});
			})
			.catch(err => {
				done(err);
			});
	});
});
