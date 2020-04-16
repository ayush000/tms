`use strict`;
const logger = require('winston');
const moment = require('moment');

const sequelize = require('./../../models').Sequelize;
const db = require('./../../models');
const userService = require('./../services/user');

const ROLES = require('./../helpers/authenticate').ROLES;

const create = async (auth, userId, body) => {
  try {
    if (auth.role === ROLES.BASIC && auth.id !== userId) {
      throw new Error('User cannot log time for another user');
    }
    let user = await userService.getUserById(auth, userId);

    if (user.role !== ROLES.BASIC) {
      throw new Error('Cannot log time for admins and managers');
    }

    body.loggedAt = moment((body.loggedAt)).format('YYYY-MM-DD'); (body.loggedAt);

    const timelogs = await db.Timelog.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('duration')), 'totalTimeLogged'],
      ],
      where: {
        userId,
        loggedAt: body.loggedAt
      },
      // group: ['logged_at']
    });

    const totalHoursSpent = timelogs && timelogs[0] && timelogs[0].dataValues.totalTimeLogged ? parseInt(timelogs[0].dataValues.totalTimeLogged) : 0;

    if (totalHoursSpent + body.duration > 1440) {
      throw new Error('Cannot log more than 24h in 1 day');
    }

    const timelog = await db.Timelog.create({ ...body, userId });

    return timelog;

  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

const getAll = async (auth, userId, page, limit) => {
  try {
    if (auth.role === ROLES.BASIC && auth.id !== userId) {
      throw new Error('User cannot get timelogs for another user');
    }
    let user = await userService.getUserById(auth, userId);

    if (user.role !== ROLES.BASIC) {
      throw new Error('No Time logs available for admins and managers');
    }

    const offset = limit * (page - 1);
    const timelog = await db.Timelog.findAndCountAll({
      limit,
      offset,
      where: {
        userId
      },
      order: [['loggedAt', 'DESC']]
    });
    if (timelog && timelog.rows.length > 0) {
      let endDate = timelog.rows[0].dataValues.loggedAt;
      let startDate = timelog.rows[timelog.rows.length - 1].dataValues.loggedAt

      const groupedTimelog = await db.sequelize.query(
        `(SELECT logged_at as loggedAt, sum(duration) as totalTimeLogged 
      FROM TMS.Timelogs 
      where user_id = ${userId} and
      logged_at BETWEEN '${startDate}' AND '${endDate}' 
      group by logged_at)`,
        {
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      timelog.rows = timelog.rows.map(timelogEntry => {
        const matchedGroup = groupedTimelog.filter(entry => entry.loggedAt === timelogEntry.dataValues.loggedAt);
        timelogEntry.dataValues.totalTimeLogged = parseInt(matchedGroup[0].totalTimeLogged);

        return timelogEntry;
      });
    }
    return timelog;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

const update = async (auth, userId, timelogId, body) => {
  try {
    if (auth.role === ROLES.BASIC && auth.id !== userId) {
      throw new Error('User cannot update timelogs for another user');
    }

    const timelog = await db.Timelog.findOne({
      where: {
        id: timelogId
      }
    });

    if (timelog.userId !== userId) {
      throw new Error('timelog entry doesnot belong to the user');
    }

    body.loggedAt = moment((body.loggedAt)).format('YYYY-MM-DD'); (body.loggedAt);

    const timelogs = await db.Timelog.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('duration')), 'totalTimeLogged'],
      ],
      where: {
        userId,
        loggedAt: body.loggedAt

      },
      // group: ['logged_at']
    });

    const totalHoursSpent = timelogs && timelogs[0] && timelogs[0].dataValues.totalTimeLogged ? parseInt(timelogs[0].dataValues.totalTimeLogged) : 0;

    if (totalHoursSpent + body.duration - timelog.dataValues.duration > 1440) {
      throw new Error('Cannot log more than 24h in 1 day');
    }

    let updatedTimelog = await timelog.update(body);

    return updatedTimelog;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

const printTimelog = async (auth, userId, startDate, endDate) => {
  try {
    if (moment(endDate).diff(moment(startDate)) > 366) {
      throw new Error('The date range can not be greater than 1 year');
    }

    if (auth.role === ROLES.BASIC && auth.id !== userId) {
      throw new Error('User cannot print timelogs for another user');
    }
    let user = await userService.getUserById(auth, userId);

    if (user.role !== ROLES.BASIC) {
      throw new Error('No Time logs available for admins and managers');
    }

    /*const groupedTimelog = await db.Timelog.findAll({
      where: {
        loggedAt: { 
          [sequelize.Op.between]: [startDate,endDate]
        }
      },
      group:['loggedAt']
      CONCAT("[", GROUP_CONCAT(CONCAT('\"', notes, '\"') SEPARATOR ',') ,']')
    });
    */

    let groupedTimelog = await db.sequelize.query(
      `(SELECT logged_at as loggedAt, sum(duration) as totalTimeLogged ,
      GROUP_CONCAT(CONCAT(notes, '\"') SEPARATOR ',') as aggregatedNotes
      FROM TMS.Timelogs 
      where user_id = ${userId} and
      logged_at BETWEEN '${startDate}' AND '${endDate}' 
      group by logged_at order by loggedAt desc)`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );


    groupedTimelog = groupedTimelog.map(entry => {
      entry.totalTimeLogged = parseInt(entry.totalTimeLogged);
      entry.aggregatedNotes = entry.aggregatedNotes.substring(0, entry.aggregatedNotes.length - 1);
      entry.aggregatedNotes = entry.aggregatedNotes.split("\",");
      return entry;
    })
    return groupedTimelog;

  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

const deleteTimelog = async (auth, userId, timelogId) => {
  try {
    if (auth.role === ROLES.BASIC && auth.id !== userId) {
      throw new Error('User cannot update timelogs for another user');
    }

    const timelog = await db.Timelog.findOne({
      where: {
        id: timelogId
      }
    });

    if (timelog.userId !== userId) {
      throw new Error('timelog entry doesnot belong to the user');
    }

    await db.Timelog.destroy({
      where: {
        id: timelogId
      }
    });

    return { message: 'Timelog entry Deleted' };
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

module.exports = {
  create,
  getAll,
  update,
  deleteTimelog,
  printTimelog
}