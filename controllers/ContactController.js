import Contact from '../models/Contact.js';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/badRequest.js';
import UnauthorizedError from '../errors/unauthorized.js';

export const createContact = async (req, res) => {
  req.body.user = req.user.userId;
  const contact = await Cooking.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: contact });
};

export const getAllContact = async (req, res) => {
  let { user, date, status, email, subject, name } = req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Contact.find(queryObject);

  if (user) {
    result = Contact.find(queryObject, { user: { $eq: user } });
  }

  if (status) {
    result = Contact.find(queryObject, {
      status: { $eq: status },
    });
  }
  if (name) {
    result = Contact.find(queryObject, {
      name: { $eq: name },
    });
  }
  if (email) {
    result = Contact.find(queryObject, {
      email: { $eq: email },
    });
  }
  if (subject) {
    result = Contact.find(queryObject, {
      subject: { $eq: subject },
    });
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('cargoName');
  }
  if (sort === 'z-a') {
    result = result.sort('-cargoName');
  }

  if (date) {
    result = Contact.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const contact = await result;

  const totalContact = await Contact.countDocuments();
  const numOfPage = Math.ceil(totalContact / limit);

  res.status(StatusCodes.OK).json({
    contact: contact,
    meta: {
      pagination: {
        page: page,
        total: totalContact,
        pageCount: numOfPage,
      },
    },
  });
};

export const getContact = async (req, res) => {
  let { user, date, status, subject, name, email } = req.query;

  let result = Contact.find({});

  if (user) {
    result = Contact.find({ user: { $eq: user } });
  }

  if (status) {
    result = Contact.find({
      status: { $eq: status },
    });
  }
  if (name) {
    result = Contact.find({
      name: { $eq: name },
    });
  }
  if (email) {
    result = Contact.find({
      email: { $eq: email },
    });
  }
  if (subject) {
    result = Contact.find({
      subject: { $eq: subject },
    });
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('cargoName');
  }
  if (sort === 'z-a') {
    result = result.sort('-cargoName');
  }

  if (date) {
    result = Contact.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const contact = await result;

  const totalContact = await Contact.countDocuments();
  const numOfPage = Math.ceil(totalContact / limit);

  res.status(StatusCodes.OK).json({
    contact: contact,
    meta: {
      pagination: {
        page: page,
        total: totalContact,
        pageCount: numOfPage,
      },
    },
  });
};

export const getSingleContact = async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId });
  if (!contact) {
    throw new BadRequestError(`Contact with id ${contactId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ contact: contact });
};

export const editSingleContact = async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!contact) {
    throw new BadRequestError(`Contact with id ${contactId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ contact: contact });
};

export const editUserContact = async (req, res) => {
  const { id: userId } = req.params;
  const contact = await Contact.updateMany({ user: userId }, req.body);

  res.status(StatusCodes.OK).json({ contact: contact });
};

export const deleteSingleContact = async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findByIdAndDelete({
    _id: contactId,
  });
  if (!contact) {
    throw new BadRequestError(`Contact with id ${contactId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Contact Deleted' });
};

export const deleteAllContact = async (req, res) => {
  const contact = await Contact.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Contact Deleted' });
};

export const deleteUserContact = async (req, res) => {
  const { id: userId } = req.params;
  const contact = await Contact.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Contact successfully deleted' });
};
