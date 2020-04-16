'use strict';
const logger = require('winston');
const moment = require('moment');

const timelogService = require('./../services/timelog');

const createTimelog = async (request, response) => {
  logger.info('Received request to create a new timelog');

  try {
    await timelogService.create(
      request.auth,
      request.swagger.params.userId.value,
      request.body
    );

    return response.send({ message: 'Time Logged Successfully' });
  } catch (error) {

    logger.error(`Error while logging time.`);
    return response.status(500).send(error.message);
  }
}

const getAllTimelogs = async (request, response) => {
  logger.info('Received request to get timelogs');


  const page = request.swagger.params.page.value ? request.swagger.params.page.value : 1;
  const limit = request.swagger.params.limit.value ? request.swagger.params.limit.value : 5;

  try {
    const timelogEntries = await timelogService.getAll(
      request.auth,
      request.swagger.params.userId.value,
      page,
      limit
    );

    return response.send(timelogEntries);
  } catch (error) {

    logger.error(`Error while fetching timelog`);
    return response.status(500).send(error.message);
  }
}

const updateTimelog = async (request, response) => {
  logger.info('Received request to update timelog');

  try {

    const updatedTimelog = await timelogService.update(
      request.auth,
      request.swagger.params.userId.value,
      request.swagger.params.timelogId.value,
      request.body
    );

    return response.send(updatedTimelog);
  } catch (error) {

    logger.error(`Error while updating time log.`);
    return response.status(500).send(error.message);
  }
}

const deleteTimelog = async (request, response) => {
  logger.info('Received request to update timelog');

  try {

    const deletedTimelog = await timelogService.deleteTimelog(
      request.auth,
      request.swagger.params.userId.value,
      request.swagger.params.timelogId.value,
    );

    return response.send(deletedTimelog);
  } catch (error) {

    logger.error(`Error while updating time log.`);
    return response.status(500).send(error.message);
  }
}

const printTimelog = async (request, response) => {
  logger.info('Received request to print timelog');


  let startDate = moment();
  startDate = startDate.subtract(1, 'year').format('YYYY-MM-DD');
  
  if(request.swagger.params.startDate){
    startDate = request.swagger.params.startDate.value
  }

  let endDate = moment()
  endDate = endDate.format('YYYY-MM-DD');
  
  if(request.swagger.params.endDate){
    startDate = request.swagger.params.endDate.value;
  }
  
  try {
    const timelogEntries = await timelogService.printTimelog(
      request.auth,
      request.swagger.params.userId.value,
      startDate,
      endDate
    );

    return response.send(timelogEntries);
  } catch (error) {

    logger.error(`Error while fetching timelog`);
    return response.status(500).send(error.message);
  }
}

module.exports = {
  createTimelog,
  getAllTimelogs,
  updateTimelog,
  deleteTimelog, 
  printTimelog
}