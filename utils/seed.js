const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');
const { getRandomName } = require('./data');

connection.on('error', (err) => console.error(err));

connection.once('open', async () => {
  console.log('Connected to database.');

  try {
    await User.deleteMany();
    await Thought.deleteMany();
    await Reaction.deleteMany();

    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({ username: getRandomName() });
    }
    const createdUsers = await User.insertMany(users);

    const thoughts = [];
    for (let i = 0; i < 20; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      thoughts.push({
        thoughtText: `Thought ${i + 1}`,
        username: randomUser.username,
      });
    }
    const createdThoughts = await Thought.insertMany(thoughts);

    for (const thought of createdThoughts) {
      for (let i = 0; i < 3; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        await Reaction.create({
          reactionBody: `Reaction ${i + 1} to thought ${thought._id}`,
          username: randomUser.username,
          thoughtId: thought._id,
        });
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    connection.close();
  }
});

