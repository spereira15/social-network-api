const names = [
  'John',
  'Alice',
  'Michael',
  'Emily',
  'David',
  'Sarah',
];

const appDescriptions = [
  'Social Network App',
  'Thought Sharing Platform',
  'React to Friends App',
  'Friendship Connection',
  'Thoughtful Minds',
];

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomName = () =>
  `${getRandomArrItem(names)} ${getRandomArrItem(names)}`;

const getRandomAssignments = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      assignmentName: getRandomArrItem(appDescriptions),
      score: Math.floor(Math.random() * (99 - 70 + 1) + 70),
    });
  }
  return results;
};

module.exports = { getRandomName, getRandomAssignments };
