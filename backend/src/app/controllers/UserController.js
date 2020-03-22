import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  // METODO CREATE
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    console.log(req.body);

    const userExists = await User.findOne({ where: { email: req.body.email } }); // Comparar se o email que esta no banco é o mesmo email que o usuario esta tentando cadastrar

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider }  = await User.create(req.body);
    
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // METODO UPDATE
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .when('oldPassword', (oldPassword, field) => 
          oldPassword ? field.required(): field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    console.log(req.userId);
    
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    console.log("EMAIL: " + email + " / " + " PASSWORD: " + oldPassword);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if(userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    }); 

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

}

export default new UserController();