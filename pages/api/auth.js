import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import { setSession } from '../../lib/session';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body || {};
  if (!action) return res.status(400).json({ error: 'Missing action' });

  await dbConnect();

  if (action === 'login') {
    const { identifier = '', password = '' } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const trimmedId = identifier.trim().toLowerCase();
    const predefinedAdmins = ['ashish_sony', 'anurag_sony'];
    let user;

    const isPredefined = predefinedAdmins.includes(trimmedId) && password === 'vriksha2026';
    
    if (isPredefined) {
      // Check for user with this name (predefined admins use username as primary)
      user = await User.findOne({ name: trimmedId });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await User.create({
          name: trimmedId,
          email: `${trimmedId}@kalavriksha.com`, // Unique email for admin
          password: hashedPassword,
          role: 'admin'
        });
      } else if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    } else {
      // Normal login: check name or email
      user = await User.findOne({ 
        $or: [
          { name: trimmedId }, 
          { email: trimmedId }
        ] 
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials. The sanctuary remains closed to you.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials. The sanctuary remains closed to you.' });
      }
    }

    const session = {
      id: user._id.toString(),
      fullname: user.name,
      role: user.role,
      email: user.email,
    };
    setSession(res, session);
    return res.status(200).json({ role: session.role, fullname: session.fullname });
  }

  if (action === 'register') {
    const { fullname = '', email = '', password = '' } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'This gateway (email) is already linked to another seeker.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: fullname.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: 'user',
    });

    const session = {
      id: newUser._id.toString(),
      fullname: newUser.name,
      role: newUser.role,
      email: newUser.email,
    };
    setSession(res, session);
    return res.status(200).json({ role: 'user', fullname: newUser.name });
  }

  if (action === 'forgot_password') {
    const { email = '', new_password = '' } = req.body;
    if (!email || !new_password) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }
    
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(400).json({ error: 'No seeker found with these sacred details.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    await user.save();
    
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Invalid action.' });
}
