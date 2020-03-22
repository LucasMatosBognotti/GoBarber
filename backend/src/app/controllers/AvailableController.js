import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter} from 'date-fns';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(401).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const valeu = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);
      
      return {
        time,
        valeu: format(valeu, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: isAfter(valeu, new Date()) && !appointment.find(appoint => format(appoint.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();