const express = require('express');
const cors = require('cors');
const { poolConnect } = require('./DB.js');

const testRoutes = require('./routes/testRoutes.js');
const questionsRoutes = require('./routes/questionsRoutes.js');
const resultRoutes = require('./routes/resultRoutes.js');
const testFlowRoutes = require('./routes/testFlowRoutes.js');
const imageRoutes = require('./routes/imageRoutes.js');


const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/questions', questionsRoutes);
app.use('/api/tests', testRoutes);
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/api/results', resultRoutes)
app.use('/api/testflow', testFlowRoutes);
app.use('/api/images', imageRoutes);

const PORT = 3001;
poolConnect.then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
