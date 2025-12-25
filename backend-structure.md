
# IronCore Gym Backend Structure

This application is currently running with a high-fidelity **Mock API** for demonstration. 
To transition to a real production environment, use the following structure:

### 📁 Server Directory Map
```text
server/
 ├── src/
 │   ├── config/          # db.ts (Prisma/Mongoose), passport.ts
 │   ├── controllers/     # auth.controller.ts, member.controller.ts
 │   ├── middleware/      # auth.middleware.ts, role.middleware.ts
 │   ├── models/          # User.ts, Member.ts, Lead.ts
 │   ├── routes/          # api/v1/ routes
 │   └── utils/           # jwt.ts, mailer.ts
 ├── .env                 # PORT, JWT_SECRET, DB_URI
 └── server.ts            # Entry point
```

### 🔐 Sample Controller (auth.controller.ts)
```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  res.json({ user, accessToken, refreshToken });
};
```

### 🛡️ Sample Middleware (role.middleware.ts)
```typescript
export const checkRole = (roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
```

### 🚀 Merging Commands
1. Replace `import { api } from '../services/api'` with a real Axios instance.
2. In `vite.config.ts`, add a proxy:
   ```js
   proxy: { '/api': 'http://localhost:5000' }
   ```
3. Run `npm run build` to generate static assets for Express to serve.
